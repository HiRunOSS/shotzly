"use client";

import {useEffect, useRef, useState, type PointerEvent} from "react";
import {ArrowUpRight, Check, Crop, Highlighter, ListOrdered, Pencil, Redo2, Shield, Square, Trash2, Type, Undo2} from "lucide-react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {useEditorStore} from "@/store/useEditorStore";
import {cropBounds, renderMarkup, type Mark, type MarkupTool} from "@/utils/markup";

const tools = [
  {id: "crop", label: "Crop", icon: Crop},
  {id: "arrow", label: "Arrow", icon: ArrowUpRight},
  {id: "rectangle", label: "Rectangle", icon: Square},
  {id: "highlight", label: "Highlight", icon: Highlighter},
  {id: "step", label: "Numbered step", icon: ListOrdered},
  {id: "text", label: "Text", icon: Type},
  {id: "redact", label: "Redact", icon: Shield},
] as const;
const iconClass = "flex h-9 w-9 shrink-0 items-center justify-center rounded-md hover:bg-gray-200 disabled:opacity-35 dark:hover:bg-white/15";

export default function ScreenshotMarkup() {
  const selectedImage = useEditorStore((state) => state.canvasImages.find((image) => image.id === state.selectedCanvasImageId));
  const primaryImage = useEditorStore((state) => state.uploadedImage);
  const source = selectedImage?.src ?? primaryImage;
  const setImage = (src: string) => {
    const store = useEditorStore.getState();
    if (selectedImage) store.setCanvasImages(store.canvasImages.map((image) => image.id === selectedImage.id ? {...image, src} : image));
    else store.setUploadedImage(src);
  };
  const [open, setOpen] = useState(false);
  const [tool, setTool] = useState<MarkupTool>("arrow");
  const [color, setColor] = useState("#ef4444");
  const [size, setSize] = useState(4);
  const [text, setText] = useState("");
  const [marks, setMarks] = useState<Mark[]>([]);
  const [redo, setRedo] = useState<Mark[][]>([]);
  const [past, setPast] = useState<Mark[][]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [dimensions, setDimensions] = useState({width: 1, height: 1});
  const canvas = useRef<HTMLCanvasElement>(null);
  const image = useRef<HTMLImageElement | null>(null);
  const draft = useRef<Mark | null>(null);

  useEffect(() => {
    if (!open) return;
    setReady(false);
    setError("");
    setMarks([]);
    setPast([]);
    setRedo([]);
    draft.current = null;
    const next = new Image();
    next.onload = () => {
      image.current = next;
      setDimensions({width: next.naturalWidth, height: next.naturalHeight});
      setReady(true);
    };
    next.onerror = () => setError("Could not load this image.");
    next.src = source;
    return () => { next.onload = null; next.onerror = null; };
  }, [open, source]);

  useEffect(() => {
    if (ready && canvas.current && image.current) renderMarkup(canvas.current, image.current, marks, true);
  }, [marks, ready, dimensions]);

  function commit(next: Mark[]) {
    setPast((history) => [...history.slice(-39), marks]);
    setMarks(next);
    setRedo([]);
  }
  function undoMark() {
    if (!past.length) return;
    setRedo((history) => [...history, marks]);
    setMarks(past[past.length - 1]);
    setPast(past.slice(0, -1));
  }
  function redoMark() {
    if (!redo.length) return;
    setPast((history) => [...history, marks]);
    setMarks(redo[redo.length - 1]);
    setRedo(redo.slice(0, -1));
  }
  function point(event: PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(dimensions.width, (event.clientX - rect.left) / rect.width * dimensions.width)),
      y: Math.max(0, Math.min(dimensions.height, (event.clientY - rect.top) / rect.height * dimensions.height)),
    };
  }
  function paint(next: Mark | null) {
    const base = next?.tool === "crop" ? marks.filter((mark) => mark.tool !== "crop") : marks;
    if (canvas.current && image.current) renderMarkup(canvas.current, image.current, next ? [...base, next] : base, true);
  }
  function apply() {
    if (!canvas.current || !image.current) return;
    try {
      // Flatten into pixels so exported redactions contain no underlying source layer.
      renderMarkup(canvas.current, image.current, marks);
      const crop = marks.find((mark) => mark.tool === "crop");
      let output = canvas.current;
      if (crop) {
        const bounds = cropBounds(crop);
        output = document.createElement("canvas");
        output.width = bounds.width;
        output.height = bounds.height;
        const context = output.getContext("2d");
        if (!context) throw new Error("Could not crop this image.");
        context.drawImage(canvas.current, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height);
      }
      setImage(output.toDataURL("image/png"));
      setOpen(false);
    } catch {
      setError("Could not apply the edits. Try a smaller image.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className={iconClass} disabled={!source} title="Annotate and redact" aria-label="Annotate and redact"><Pencil size={16} /></button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="flex max-h-[90dvh] w-[calc(100%-24px)] max-w-5xl flex-col gap-3 overflow-y-auto rounded-lg bg-white p-4 text-gray-900 dark:bg-[#181818] dark:text-white"
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && ["z", "y"].includes(event.key.toLowerCase()) && !(event.target instanceof HTMLInputElement)) {
            event.preventDefault(); event.stopPropagation();
            if (event.shiftKey || event.key.toLowerCase() === "y") redoMark(); else undoMark();
          }
        }}>
        <DialogHeader><DialogTitle className="tracking-normal">Crop, annotate &amp; redact</DialogTitle></DialogHeader>
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 pb-3 dark:border-white/15" role="toolbar" aria-label="Markup tools">
          {tools.map(({id, label, icon: Icon}) => (
            <button key={id} type="button" title={label} aria-label={label} aria-pressed={tool === id} onClick={() => setTool(id)} className={`${iconClass} ${tool === id ? "bg-gray-200 dark:bg-white/20" : ""}`}><Icon size={18} /></button>
          ))}
          <input type="color" aria-label="Annotation color" title="Annotation color" disabled={tool === "redact" || tool === "crop"} value={color} onChange={(event) => setColor(event.target.value)} className="mx-2 h-8 w-8 cursor-pointer bg-transparent disabled:opacity-35" />
          <input type="range" aria-label="Stroke size" title="Stroke size" disabled={tool === "crop"} min={2} max={10} value={size} onChange={(event) => setSize(Number(event.target.value))} className="w-20 accent-red-500 disabled:opacity-35" />
          <div className="ml-auto flex">
            <button type="button" title="Undo annotation" aria-label="Undo annotation" disabled={!past.length} onClick={undoMark} className={iconClass}><Undo2 size={18} /></button>
            <button type="button" title="Redo annotation" aria-label="Redo annotation" disabled={!redo.length} onClick={redoMark} className={iconClass}><Redo2 size={18} /></button>
            <button type="button" title="Clear annotations" aria-label="Clear annotations" disabled={!marks.length} onClick={() => commit([])} className={iconClass}><Trash2 size={18} /></button>
          </div>
        </div>
        {tool === "text" && <input aria-label="Annotation text" placeholder="Text" maxLength={120} value={text} onChange={(event) => setText(event.target.value)} className="rounded-md border border-gray-300 bg-transparent p-2 dark:border-white/20" />}
        <div className="flex min-h-0 justify-center overflow-auto bg-gray-100 dark:bg-black/30">
          {!ready && !error && <span role="status" className="p-8">Loading image...</span>}
          <canvas ref={canvas} width={dimensions.width} height={dimensions.height} aria-label="Screenshot markup canvas"
            className="block touch-none" style={{display: ready ? "block" : "none", maxWidth: "100%", maxHeight: "56dvh", width: "auto", height: "auto", cursor: "crosshair", aspectRatio: `${dimensions.width} / ${dimensions.height}`}}
            onPointerDown={(event) => {
              if (!ready || event.button !== 0 || draft.current || (tool === "text" && !text.trim())) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              const start = point(event);
              draft.current = {tool, start, end: start, color, width: size * Math.max(dimensions.width, dimensions.height) / 1000, text: tool === "step" ? String(marks.filter((mark) => mark.tool === "step").length + 1) : text};
              paint(draft.current);
            }}
            onPointerMove={(event) => {
              if (!draft.current) return;
              draft.current = {...draft.current, end: point(event)};
              paint(draft.current);
            }}
            onPointerUp={(event) => {
              const mark = draft.current;
              if (!mark) return;
              draft.current = null;
              event.currentTarget.releasePointerCapture(event.pointerId);
              const next = {...mark, end: point(event)};
              if (mark.tool === "crop") {
                const bounds = cropBounds(next);
                if (bounds.width >= 2 && bounds.height >= 2) commit([...marks.filter((item) => item.tool !== "crop"), next]);
                else paint(null);
                return;
              }
              if (mark.tool === "step" || mark.tool === "text" || Math.hypot(next.end.x - mark.start.x, next.end.y - mark.start.y) > 2) commit([...marks, next]);
              else paint(null);
            }}
            onPointerCancel={() => { draft.current = null; paint(null); }}
          />
        </div>
        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setOpen(false)} className="rounded-md px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10">Cancel</button>
          <button type="button" onClick={apply} disabled={!ready || !marks.length} className="flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"><Check size={16} />Apply</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
