"use client";

import {useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent, type RefObject} from "react";
import {createPortal} from "react-dom";
import {CopyPlus, RotateCw, Undo2, X} from "lucide-react";
import {useEditorStore, type ScreenshotSettings} from "@/store/useEditorStore";

interface Props {
  target: RefObject<HTMLElement | null>;
  settings: ScreenshotSettings;
  style: CSSProperties;
  selected: boolean;
  onSelect: (selected: boolean) => void;
  onChange?: (patch: Partial<ScreenshotSettings>) => void;
  onRemove?: () => void;
  onDuplicate?: () => void;
  coordinateSpace?: RefObject<HTMLElement | null>;
  maxScale?: number;
}

// A separate overlay keeps editor controls out of both export renderers.
export default function ScreenshotTransformControls({target, settings, style, selected, onSelect, onChange, onRemove, onDuplicate, coordinateSpace, maxScale = 150}: Props) {
  const imageCount = useEditorStore((state) => state.canvasImages.length);
  const duplicate = () => {
    if (onDuplicate) { onDuplicate(); return; }
    const element = target.current;
    const canvas = element?.closest<HTMLElement>("[data-screenshot-canvas]");
    const store = useEditorStore.getState();
    if (!element || !canvas || !store.uploadedImage || store.canvasImages.length >= 8) return;
    const rect = element.getBoundingClientRect();
    const bounds = canvas.getBoundingClientRect();
    const id = crypto.randomUUID();
    store.setCanvasImages([...store.canvasImages, {
      id, src: store.uploadedImage, name: "Screenshot copy",
      x: Math.min(90, (rect.left + rect.width / 2 - bounds.left) / bounds.width * 100 + 3),
      y: Math.min(90, (rect.top + rect.height / 2 - bounds.top) / bounds.height * 100 + 3),
      width: element.offsetWidth / bounds.width * 100,
      rotation: settings.rotation, radius: settings.cornerRadius, shadow: settings.shadowStyle !== "none",
      settings: {...settings, offsetX: 0, offsetY: 0},
    }]);
    store.selectCanvasImage(id);
  };
  const [size, setSize] = useState({width: 0, height: 0});
  const overlay = useRef<HTMLDivElement>(null);
  const [toolbarHost, setToolbarHost] = useState<HTMLElement | null>(null);
  const gesture = useRef<{
    id: number; mode: "move" | "resize" | "rotate";
    x: number; y: number; cx: number; cy: number;
    width: number; height: number; initial: ScreenshotSettings;
  } | null>(null);

  useLayoutEffect(() => {
    const element = target.current;
    if (!element) return;
    const measure = () => setSize({width: element.offsetWidth, height: element.offsetHeight});
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [target, settings.browserStyle]);

  useLayoutEffect(() => {
    const canvas = target.current?.closest<HTMLElement>("[data-screenshot-canvas]");
    const bounds = overlay.current?.getBoundingClientRect();
    if (!canvas || !bounds) return;
    const canvasBounds = canvas.getBoundingClientRect();
    // Keep actions reachable when the image is rotated or moved beyond the canvas.
    const needsPinnedToolbar = canvasBounds.width < 600 || bounds.top - canvasBounds.top < 40;
    setToolbarHost(needsPinnedToolbar ? canvas : null);
  }, [target, settings, size]);

  const update = (patch: Partial<ScreenshotSettings>) => {
    if (onChange) { onChange(patch); return; }
    const store = useEditorStore.getState();
    store.setScreenshotSettings({...store.screenshotSettings, ...patch});
  };
  const reset = () => update({offsetX: 0, offsetY: 0, rotation: 0, imageScale: 100});
  const remove = () => {
    if (onRemove) { onRemove(); return; }
    reset();
    useEditorStore.getState().setUploadedImage("");
  };
  const start = (event: PointerEvent<HTMLElement>, mode: "move" | "resize" | "rotate") => {
    if (!event.isPrimary || event.button !== 0 || gesture.current) return;
    event.preventDefault();
    event.stopPropagation();
    onSelect(true);
    const box = overlay.current!;
    const bounds = box.getBoundingClientRect();
    const parent = coordinateSpace?.current ?? box.parentElement!;
    gesture.current = {
      id: event.pointerId, mode, x: event.clientX, y: event.clientY,
      cx: bounds.left + bounds.width / 2, cy: bounds.top + bounds.height / 2,
      width: parent.clientWidth, height: parent.clientHeight,
      initial: {...settings},
    };
    box.setPointerCapture(event.pointerId);
    box.focus({preventScroll: true});
  };

  const actions = (
        <div
          data-export-ignore="true"
          className={`absolute left-1/2 z-30 flex -translate-x-1/2 gap-1 ${toolbarHost ? "top-2" : "-top-9"}`}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <button type="button" title="Drag to rotate; hold Shift to snap" aria-label="Rotate screenshot"
            onPointerDown={(event) => start(event, "rotate")}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault(); event.stopPropagation();
                update({rotation: settings.rotation + (event.key === "ArrowLeft" ? -1 : 1) * (event.shiftKey ? 15 : 1)});
              }
            }}
            className="flex h-6 w-6 touch-none items-center justify-center rounded-full border border-blue-500 bg-white text-blue-600"><RotateCw size={13} /></button>
          <button type="button" title="Reset position, size and rotation" aria-label="Reset screenshot transform" onClick={reset}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-400 bg-white text-gray-700"><Undo2 size={13} /></button>
          <button type="button" title={imageCount >= 8 ? "Maximum 8 additional images" : "Duplicate image"} aria-label="Duplicate image" onClick={duplicate} disabled={imageCount >= 8}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-400 bg-white text-gray-700 disabled:opacity-40"><CopyPlus size={13} /></button>
          <button type="button" title="Remove screenshot" aria-label="Remove screenshot" onClick={remove}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-red-500 bg-white text-red-600"><X size={13} /></button>
        </div>
  );

  return (
    <div
      ref={overlay}
      data-export-ignore="true"
      role="group"
      aria-label="Screenshot transform controls. Drag to move. Arrow keys move; Shift moves faster. Escape deselects."
      tabIndex={0}
      onFocus={() => onSelect(true)}
      onPointerDown={(event) => start(event, "move")}
      onPointerMove={(event) => {
        const g = gesture.current;
        if (!g || g.id !== event.pointerId) return;
        if (g.mode === "move") {
          const x = g.initial.offsetX + (event.clientX - g.x) / Math.max(1, g.width) * 100;
          const y = g.initial.offsetY + (event.clientY - g.y) / Math.max(1, g.height) * 100;
          update({offsetX: Math.abs(x) < 0.7 ? 0 : x, offsetY: Math.abs(y) < 0.7 ? 0 : y});
        } else if (g.mode === "resize") {
          const vx = g.x - g.cx, vy = g.y - g.cy;
          const ratio = ((event.clientX - g.cx) * vx + (event.clientY - g.cy) * vy) / Math.max(1, vx * vx + vy * vy);
          update({imageScale: Math.max(1, Math.min(maxScale, g.initial.imageScale * ratio))});
        } else {
          const angle = Math.atan2(event.clientY - g.cy, event.clientX - g.cx) - Math.atan2(g.y - g.cy, g.x - g.cx);
          const degrees = g.initial.rotation + angle * 180 / Math.PI;
          update({rotation: event.shiftKey ? Math.round(degrees / 15) * 15 : degrees});
        }
      }}
      onPointerUp={(event) => {
        if (gesture.current?.id !== event.pointerId) return;
        gesture.current = null;
        event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => {
        if (gesture.current) update(gesture.current.initial);
        gesture.current = null;
      }}
      onLostPointerCapture={() => {gesture.current = null;}}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        const step = event.shiftKey ? 5 : 1;
        const moves: Record<string, Partial<ScreenshotSettings>> = {
          ArrowLeft: {offsetX: settings.offsetX - step},
          ArrowRight: {offsetX: settings.offsetX + step},
          ArrowUp: {offsetY: settings.offsetY - step},
          ArrowDown: {offsetY: settings.offsetY + step},
        };
        if (moves[event.key]) {event.preventDefault(); update(moves[event.key]);}
        if (event.key === "Escape") {onSelect(false); event.currentTarget.blur();}
        if (event.key === "Delete" || event.key === "Backspace") {event.preventDefault(); remove();}
      }}
      className="pointer-events-auto absolute z-20 touch-none select-none focus:outline-none"
      style={{
        width: size.width, height: size.height, cursor: "move",
        outline: selected ? "1px solid #3b82f6" : "none",
        ...style,
      }}
    >
      {selected && <>
        {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map((corner) => (
          <button
            key={corner}
            type="button"
            aria-label={`Resize screenshot ${corner}. Arrow keys adjust size.`}
            onPointerDown={(event) => start(event, "resize")}
            onKeyDown={(event) => {
              if (!["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(event.key)) return;
              event.preventDefault(); event.stopPropagation();
              const direction = event.key === "ArrowUp" || event.key === "ArrowRight" ? 1 : -1;
              update({imageScale: Math.max(1, Math.min(maxScale, settings.imageScale + direction * (event.shiftKey ? 10 : 1)))});
            }}
            className="absolute flex h-6 w-6 touch-none items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
            style={{
              top: corner.startsWith("top") ? -12 : undefined,
              bottom: corner.startsWith("bottom") ? -12 : undefined,
              left: corner.endsWith("left") ? -12 : undefined,
              right: corner.endsWith("right") ? -12 : undefined,
              cursor: corner === "top-left" || corner === "bottom-right" ? "nwse-resize" : "nesw-resize",
            }}
          ><span className="h-2.5 w-2.5 rounded-sm border border-blue-500 bg-white" /></button>
        ))}
        {toolbarHost ? createPortal(actions, toolbarHost) : actions}
      </>}
    </div>
  );
}
