"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Circle, ImageIcon, Pencil, Smile, Square, Trash2, Type, X, CopyPlus } from "lucide-react";
import { useEditorStore, type GraphicLayer, type TextLayer } from "@/store/useEditorStore";
import { DEFAULT_TEXT_LAYER, renderTextLayer } from "@/utils/textLayer";
import { DEFAULT_GRAPHIC_LAYER, renderGraphicLayer } from "@/utils/graphicLayer";

const iconClass = "flex h-9 w-9 shrink-0 items-center justify-center rounded-md hover:bg-gray-200 disabled:opacity-35 dark:hover:bg-white/15";
const BUILT_IN_STICKERS = [
  ["Spark", "✨"],
  ["Fire", "🔥"],
  ["Rocket", "🚀"],
  ["Crown", "👑"],
  ["Party", "🎉"],
  ["Love", "💖"],
  ["Star eyes", "🤩"],
  ["Cool", "😎"],
  ["Mind blown", "🤯"],
  ["Thinking", "🤔"],
  ["Nailed it", "💯"],
  ["Clap", "👏"],
  ["Warning", "⚠️"],
  ["Idea", "💡"],
  ["Check", "✅"],
  ["Mic drop", "🎤"],
  ["Lightning", "⚡"],
  ["Diamond", "💎"],
] as const;

export default function ScreenshotMarkup({ sidebarOpen, onSidebarOpenChange }: { sidebarOpen: boolean; onSidebarOpenChange: (open: boolean) => void }) {
  const canvasImages = useEditorStore((state) => state.canvasImages);
  const setCanvasImages = useEditorStore((state) => state.setCanvasImages);
  const selectCanvasImage = useEditorStore((state) => state.selectCanvasImage);
  const previewRef = useEditorStore((state) => state.previewRef);
  const screenshotSettings = useEditorStore((state) => state.screenshotSettings);
  const selectedImage = useEditorStore((state) => state.canvasImages.find((image) => image.id === state.selectedCanvasImageId));
  const selectedText = selectedImage?.textLayer ? selectedImage : null;
  const selectedGraphic = selectedImage?.graphicLayer ? selectedImage : null;
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [shapePickerOpen, setShapePickerOpen] = useState(false);
  const [replaceEmoji, setReplaceEmoji] = useState(false);
  const [error, setError] = useState("");

  function addText() {
    if (canvasImages.length >= 8) { setError("Maximum 8 added images or text layers."); return; }
    try {
      const layer = { ...DEFAULT_TEXT_LAYER };
      const rendered = renderTextLayer(layer);
      const id = crypto.randomUUID();
      const width = Math.min(70, rendered.width / Math.max(1, previewRef?.clientWidth ?? 800) * 100);
      setCanvasImages([...canvasImages, {
        id, name: layer.content, src: rendered.src, x: 50, y: 50, width,
        rotation: 0, radius: 0, shadow: false, textLayer: layer,
        settings: { ...screenshotSettings, imageScale: 100, rotation: 0, offsetX: 0, offsetY: 0, cornerRadius: 0, borderWidth: 0, frameStyle: "default", browserStyle: "none", shadowStyle: "none", layoutPreset: "default" },
      }]);
      selectCanvasImage(id);
      setError("");
    } catch { setError("Could not add text."); }
  }

  function updateText(patch: Partial<TextLayer>) {
    if (!selectedText?.textLayer) return;
    try {
      const next = { ...selectedText.textLayer, ...patch };
      const rendered = renderTextLayer(next);
      const width = Math.min(70, rendered.width / Math.max(1, previewRef?.clientWidth ?? 800) * 100);
      setCanvasImages(useEditorStore.getState().canvasImages.map((image) => image.id === selectedText.id ? { ...image, src: rendered.src, name: next.content || "Text", textLayer: next, width } : image));
      setError("");
    } catch { setError("Could not update text."); }
  }

  function deleteText(id: string) {
    setCanvasImages(useEditorStore.getState().canvasImages.filter((image) => image.id !== id));
  }

  function addGraphic(kind: GraphicLayer["kind"], emoji?: string) {
    if (canvasImages.length >= 8) { setError("Maximum 8 added images or layers."); return; }
    try {
      const layer = { ...DEFAULT_GRAPHIC_LAYER, kind, emoji: emoji ?? DEFAULT_GRAPHIC_LAYER.emoji };
      const rendered = renderGraphicLayer(layer);
      const id = crypto.randomUUID();
      const width = Math.min(70, rendered.width / Math.max(1, previewRef?.clientWidth ?? 800) * 100);
      const name = kind === "emoji" ? layer.emoji : kind === "rect" ? "Rectangle" : kind === "roundedRect" ? "Rounded rectangle" : kind === "dashedRect" ? "Dashed rectangle" : kind === "circle" ? "Circle" : "Arrow";
      setCanvasImages([...useEditorStore.getState().canvasImages, {
        id, name, src: rendered.src, x: Math.min(80, 50 + canvasImages.length * 3),
        y: Math.min(80, 50 + canvasImages.length * 3), width,
        rotation: 0, radius: 0, shadow: false, graphicLayer: layer,
        settings: { ...screenshotSettings, imageScale: 100, rotation: 0, offsetX: 0, offsetY: 0, cornerRadius: 0, borderWidth: 0, frameStyle: "default", browserStyle: "none", shadowStyle: "none", layoutPreset: "default" },
      }]);
      selectCanvasImage(id);
      setEmojiPickerOpen(false);
      setShapePickerOpen(false);
      setError("");
    } catch { setError("Could not add this object."); }
  }

  function updateGraphic(patch: Partial<GraphicLayer>) {
    if (!selectedGraphic?.graphicLayer) return;
    try {
      const next = { ...selectedGraphic.graphicLayer, ...patch };
      const rendered = renderGraphicLayer(next);
      setCanvasImages(useEditorStore.getState().canvasImages.map((image) => image.id === selectedGraphic.id ? { ...image, src: rendered.src, graphicLayer: next } : image));
      setError("");
    } catch { setError("Could not update this object."); }
  }

  return (
    <>
      <button type="button" className={iconClass} title="Edit screenshot" aria-label="Edit screenshot" aria-expanded={sidebarOpen} onClick={() => onSidebarOpenChange(!sidebarOpen)}><Pencil size={16} /></button>
      {sidebarOpen && typeof document !== "undefined" && createPortal(<aside aria-label="Screenshot editor" className="fixed bottom-24 right-2 top-[72px] z-40 flex w-[min(320px,calc(100vw-16px))] flex-col overflow-hidden rounded-lg border border-black/10 bg-white/95 text-gray-900 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#171717]/95 dark:text-gray-100 sm:right-4 sm:top-20 sm:bottom-28">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-black/10 px-4 dark:border-white/10">
          <h2 className="text-sm font-semibold">Edit screenshot</h2>
          <button type="button" aria-label="Close editor sidebar" title="Close" onClick={() => onSidebarOpenChange(false)} className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/10"><X size={16} /></button>
        </div>
        <div className="scrollbar-hide min-h-0 flex-1 space-y-5 overflow-x-hidden overflow-y-auto px-4 py-4">
          <section>
            <h3 className="mb-2 text-[11px] font-semibold uppercase text-gray-500 dark:text-gray-400">Add</h3>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={addText} disabled={canvasImages.length >= 8} className="flex h-9 items-center gap-1.5 rounded-md border border-black/15 px-2 text-left text-xs font-medium hover:bg-black/5 disabled:opacity-40 dark:border-white/15 dark:hover:bg-white/10"><Type size={14} /> Text</button>
              <div className="relative">
                <button type="button" onClick={() => { setShapePickerOpen((value) => !value); setEmojiPickerOpen(false); }} disabled={canvasImages.length >= 8} aria-expanded={shapePickerOpen} className="flex h-9 w-full items-center gap-1.5 rounded-md border border-black/15 px-2 text-left text-xs hover:bg-black/5 disabled:opacity-40 dark:border-white/15 dark:hover:bg-white/10"><Square size={14} /> Shape</button>
                {shapePickerOpen && <div className="absolute left-0 top-full z-10 mt-1 w-52 rounded-md border border-black/10 bg-white p-1 shadow-lg dark:border-white/15 dark:bg-[#242424]">
                  {([["rect", "Rectangle", Square], ["roundedRect", "Rounded rectangle", Square], ["dashedRect", "Dashed rectangle", Square], ["circle", "Circle", Circle], ["arrow", "Arrow", ArrowUpRight]] as const).map(([kind, label, Icon]) => <button key={kind} type="button" onClick={() => addGraphic(kind)} className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-xs hover:bg-black/5 dark:hover:bg-white/10"><Icon size={14} />{label}</button>)}
                </div>}
              </div>
              <button type="button" onClick={() => { setReplaceEmoji(false); setEmojiPickerOpen((value) => !value); setShapePickerOpen(false); }} disabled={canvasImages.length >= 8} aria-expanded={emojiPickerOpen} className="flex h-9 items-center gap-1.5 rounded-md border border-black/15 px-2 text-left text-xs hover:bg-black/5 disabled:opacity-40 dark:border-white/15 dark:hover:bg-white/10"><Smile size={14} /> Sticker</button>
            </div>
            {emojiPickerOpen && <div className="mt-2 rounded-md border border-black/10 p-2 dark:border-white/15">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Built-in stickers</p>
              <div className="grid grid-cols-6 gap-1">
                {BUILT_IN_STICKERS.map(([name, emoji]) => <button key={name} type="button" title={name} aria-label={`Use ${name} sticker`} onClick={() => {
                  if (replaceEmoji && selectedGraphic?.graphicLayer?.kind === "emoji") { updateGraphic({ emoji }); setEmojiPickerOpen(false); }
                  else addGraphic("emoji", emoji);
                }} className="flex aspect-square items-center justify-center rounded-md text-2xl hover:bg-black/5 dark:hover:bg-white/10">{emoji}</button>)}
              </div>
            </div>}
          </section>
          <section>
            <h3 className="mb-2 text-[11px] font-semibold uppercase text-gray-500 dark:text-gray-400">Layers</h3>
            <div className="space-y-1">
              {canvasImages.map((image) => <div key={image.id} className={`flex items-center gap-1 rounded-md border ${selectedImage?.id === image.id ? "border-emerald-500 bg-emerald-500/5" : "border-black/10 dark:border-white/10"}`}>
                <button type="button" onClick={() => selectCanvasImage(image.id)} className="flex min-w-0 flex-1 items-center gap-2 px-2 py-2 text-left text-xs">{image.textLayer ? <Type size={14} className="shrink-0" /> : image.graphicLayer?.kind === "rect" || image.graphicLayer?.kind === "roundedRect" || image.graphicLayer?.kind === "dashedRect" ? <Square size={14} className="shrink-0" /> : image.graphicLayer?.kind === "circle" ? <Circle size={14} className="shrink-0" /> : image.graphicLayer?.kind === "arrow" ? <ArrowUpRight size={14} className="shrink-0" /> : image.graphicLayer?.kind === "emoji" ? <Smile size={14} className="shrink-0" /> : <ImageIcon size={14} className="shrink-0" />}<span className="truncate">{image.name}</span></button>
                <button type="button" title="Duplicate layer" aria-label={`Duplicate ${image.name}`} disabled={canvasImages.length >= 8} onClick={() => { const id = crypto.randomUUID(); setCanvasImages([...useEditorStore.getState().canvasImages, { ...image, id, x: Math.min(90, image.x + 3), y: Math.min(90, image.y + 3) }]); selectCanvasImage(id); }} className="flex h-8 w-8 items-center justify-center disabled:opacity-40"><CopyPlus size={13} /></button>
                <button type="button" title="Delete layer" aria-label={`Delete ${image.name}`} onClick={() => deleteText(image.id)} className="flex h-8 w-8 items-center justify-center text-red-500"><Trash2 size={13} /></button>
              </div>)}
              {!canvasImages.length && <p className="py-2 text-xs text-gray-500">No layers</p>}
            </div>
          </section>
          {selectedText?.textLayer && <section className="space-y-3 border-t border-black/10 pt-4 dark:border-white/10">
            <h3 className="text-[11px] font-semibold uppercase text-gray-500 dark:text-gray-400">Selected text</h3>
            <textarea aria-label="Text content" value={selectedText.textLayer.content} maxLength={120} rows={3} onChange={(event) => updateText({ content: event.target.value })} className="w-full resize-y rounded-md border border-black/15 bg-transparent p-2 text-sm outline-none focus:border-emerald-500 dark:border-white/15" />
            <label className="block space-y-1 text-xs"><span>Font</span><select aria-label="Text font" value={selectedText.textLayer.fontFamily} onChange={(event) => updateText({ fontFamily: event.target.value as TextLayer["fontFamily"] })} className="h-9 w-full rounded-md border border-black/15 bg-white px-2 dark:border-white/15 dark:bg-[#171717]"><option value="Inter">Inter</option><option value="Arial">Arial</option><option value="Georgia">Georgia</option><option value="monospace">Monospace</option></select></label>
            <div className="flex items-center justify-between text-xs"><label htmlFor="text-color">Color</label><input id="text-color" type="color" value={selectedText.textLayer.color} onChange={(event) => updateText({ color: event.target.value })} className="h-8 w-9 cursor-pointer rounded border border-black/15 bg-transparent p-0.5 dark:border-white/15" /></div>
            <label className="block space-y-1 text-xs"><span className="flex justify-between"><span>Size</span><span>{selectedText.textLayer.fontSize}px</span></span><input type="range" min={12} max={120} value={selectedText.textLayer.fontSize} onChange={(event) => updateText({ fontSize: Number(event.target.value) })} className="w-full accent-white" /></label>
            <label className="block space-y-1 text-xs"><span className="flex justify-between"><span>Opacity</span><span>{selectedText.textLayer.opacity}%</span></span><input type="range" min={0} max={100} value={selectedText.textLayer.opacity} onChange={(event) => updateText({ opacity: Number(event.target.value) })} className="w-full accent-white" /></label>
            <div role="group" aria-label="Text alignment" className="grid grid-cols-3 gap-1 rounded-md bg-black/5 p-1 dark:bg-white/5">{(["left", "center", "right"] as const).map((align) => <button key={align} type="button" aria-pressed={selectedText.textLayer?.align === align} onClick={() => updateText({ align })} className={`rounded px-2 py-1.5 text-xs capitalize ${selectedText.textLayer?.align === align ? "bg-white shadow-sm dark:bg-[#303030]" : ""}`}>{align}</button>)}</div>
          </section>}
          {selectedGraphic?.graphicLayer && <section className="space-y-3 border-t border-black/10 pt-4 dark:border-white/10">
            <h3 className="text-[11px] font-semibold uppercase text-gray-500 dark:text-gray-400">Selected {selectedGraphic.graphicLayer.kind === "rect" || selectedGraphic.graphicLayer.kind === "roundedRect" || selectedGraphic.graphicLayer.kind === "dashedRect" ? "rectangle" : selectedGraphic.graphicLayer.kind}</h3>
            {selectedGraphic.graphicLayer.kind === "emoji" ? <button type="button" onClick={() => { setReplaceEmoji(true); setEmojiPickerOpen(true); }} className="flex h-9 w-full items-center gap-2 rounded-md border border-black/15 px-3 text-xs dark:border-white/15"><Smile size={15} /> Change sticker</button> : <>
              <div className="flex items-center justify-between text-xs"><label htmlFor="graphic-color">Color</label><input id="graphic-color" type="color" value={selectedGraphic.graphicLayer.color} onChange={(event) => updateGraphic({ color: event.target.value })} className="h-8 w-9 cursor-pointer rounded border border-black/15 bg-transparent p-0.5 dark:border-white/15" /></div>
              {selectedGraphic.graphicLayer.kind !== "arrow" && <div role="group" aria-label="Shape style" className="grid grid-cols-2 gap-1 rounded-md bg-black/5 p-1 dark:bg-white/5">{([false, true] as const).map((filled) => <button key={String(filled)} type="button" aria-pressed={selectedGraphic.graphicLayer?.filled === filled} onClick={() => updateGraphic({ filled })} className={`rounded px-2 py-1.5 text-xs ${selectedGraphic.graphicLayer?.filled === filled ? "bg-white shadow-sm dark:bg-[#303030]" : ""}`}>{filled ? "Filled" : "Outline"}</button>)}</div>}
              {(!selectedGraphic.graphicLayer.filled || selectedGraphic.graphicLayer.kind === "arrow") && <label className="block space-y-1 text-xs"><span className="flex justify-between"><span>Thickness</span><span>{selectedGraphic.graphicLayer.strokeWidth}px</span></span><input type="range" min={1} max={24} value={selectedGraphic.graphicLayer.strokeWidth} onChange={(event) => updateGraphic({ strokeWidth: Number(event.target.value) })} className="w-full accent-white" /></label>}
            </>}
            <label className="block space-y-1 text-xs"><span className="flex justify-between"><span>Opacity</span><span>{selectedGraphic.graphicLayer.opacity}%</span></span><input type="range" min={0} max={100} value={selectedGraphic.graphicLayer.opacity} onChange={(event) => updateGraphic({ opacity: Number(event.target.value) })} className="w-full accent-white" /></label>
          </section>}
          {error && <p role="alert" className="text-xs text-red-500">{error}</p>}
        </div>
      </aside>, document.body)}
    </>
  );
}
