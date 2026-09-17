"use client";

import {useRef, useState, type RefObject} from "react";
import {Loader2} from "lucide-react";
import {useDropzone} from "react-dropzone";
import {createPortal} from "react-dom";
import {useEditorStore, type CanvasImage, type ScreenshotSettings} from "@/store/useEditorStore";
import {getLayoutTransform} from "@/constants/layoutPresets";
import ScreenshotTransformControls from "./ScreenshotTransformControls";

async function readImage(file: File) {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not read this image.");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return {src: canvas.toDataURL("image/webp", 0.94), aspect: bitmap.width / bitmap.height};
  } finally { bitmap.close(); }
}

function ImageLayer({image, stage, fallback}: {image: CanvasImage; stage: RefObject<HTMLDivElement | null>; fallback: ScreenshotSettings}) {
  const target = useRef<HTMLDivElement>(null);
  const selected = useEditorStore((state) => state.selectedCanvasImageId === image.id);
  const select = useEditorStore((state) => state.selectCanvasImage);
  const style = image.settings ?? fallback;
  const transformSettings = {...style, rotation: image.rotation, offsetX: image.x - 50, offsetY: image.y - 50};
  const browser = style.browserStyle !== "none";
  const dark = style.browserStyle.endsWith("dark");
  const frame = style.frameStyle;
  const border = frame === "default" || browser ? "none" : `${style.borderWidth}px ${frame === "dashed" || frame === "dotted" ? frame : "solid"} ${frame.includes("dark") ? "#222" : "rgba(255,255,255,0.75)"}`;
  const update = (patch: Partial<ScreenshotSettings>) => {
    const store = useEditorStore.getState();
    store.setCanvasImages(store.canvasImages.map((item) => item.id === image.id ? {
      ...item,
      x: patch.offsetX === undefined ? item.x : patch.offsetX + 50,
      y: patch.offsetY === undefined ? item.y : patch.offsetY + 50,
      rotation: patch.rotation ?? item.rotation,
      settings: {...(item.settings ?? fallback), ...patch},
    } : item));
  };
  return (
    <div className="pointer-events-auto absolute" data-image-layer={image.id} style={{
      left: `${image.x}%`, top: `${image.y}%`, width: `${image.width * style.imageScale / 100}%`,
      transform: `translate(-50%, -50%) rotate(${image.rotation}deg) ${getLayoutTransform(style.layoutPreset)}`,
    }}>
      <div ref={target} style={{borderRadius: style.cornerRadius, border, overflow: "hidden", boxShadow: style.shadowStyle === "none" ? "none" : style.shadowStyle === "strong" ? "0 20px 40px rgba(0,0,0,0.5)" : "0 8px 20px rgba(0,0,0,0.3)"}}>
        {browser && <div aria-hidden="true" className="flex h-7 items-center gap-1 px-2" style={{background: dark ? "#333" : "#e5e7eb"}}><span className="h-2 w-2 rounded-full bg-red-400" /><span className="h-2 w-2 rounded-full bg-yellow-400" /><span className="h-2 w-2 rounded-full bg-green-400" /><span className="ml-2 h-3 flex-1 rounded" style={{background: dark ? "#555" : "white"}} /></div>}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.src} alt={image.name} draggable={false} className="block h-auto w-full" />
      </div>
      <ScreenshotTransformControls target={target} settings={transformSettings} coordinateSpace={stage}
        style={{left: 0, top: 0}} selected={selected} onSelect={(value) => select(value ? image.id : null)}
        onChange={update} onDuplicate={() => {
          const store = useEditorStore.getState();
          if (store.canvasImages.length >= 8) return;
          const id = crypto.randomUUID();
          store.setCanvasImages([...store.canvasImages, {...image, id, name: `${image.name} copy`, x: Math.min(90, image.x + 3), y: Math.min(90, image.y + 3), settings: {...style}}]);
          select(id);
        }} onRemove={() => {
          const store = useEditorStore.getState();
          store.setCanvasImages(store.canvasImages.filter((item) => item.id !== image.id));
        }} />
    </div>
  );
}

export default function MultiScreenshotCanvas() {
  const images = useEditorStore((state) => state.canvasImages);
  const setImages = useEditorStore((state) => state.setCanvasImages);
  const settings = useEditorStore((state) => state.screenshotSettings);
  const preview = useEditorStore((state) => state.previewRef);
  const select = useEditorStore((state) => state.selectCanvasImage);
  const stage = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const uploading = useRef(false);
  const [a, b] = settings.aspectRatio.split(":").map(Number);
  const {getRootProps, getInputProps} = useDropzone({
    accept: {"image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"], "image/webp": [".webp"]},
    maxSize: 12 * 1024 * 1024, noClick: true, noKeyboard: true,
    onDropRejected: () => setError("Choose PNG, JPEG, or WebP files under 12 MB each."),
    onDropAccepted: async (files) => {
      if (uploading.current) return;
      uploading.current = true;
      setBusy(true);
      setError("");
      try {
        const existing = useEditorStore.getState().canvasImages;
        if (existing.length + files.length > 8) throw new Error("A canvas can contain up to 8 screenshots.");
        const added = await Promise.all(files.map(async (file, index): Promise<CanvasImage> => {
          const decoded = await readImage(file);
          return {
            id: crypto.randomUUID(), src: decoded.src, name: file.name,
            x: 35 + ((existing.length + index) % 3) * 15,
            y: 40 + ((existing.length + index) % 3) * 10,
            width: Math.min(40, 60 * decoded.aspect / (a / b)), rotation: 0, radius: 8, shadow: true,
            settings: {...settings, imageScale: 100, rotation: 0, offsetX: 0, offsetY: 0},
          };
        }));
        const latest = useEditorStore.getState().canvasImages;
        if ([...latest, ...added].reduce((sum, image) => sum + image.src.length, 0) > 3500000) throw new Error("These images are too large to save together. Try smaller screenshots.");
        setImages([...latest, ...added]);
        select(added[added.length - 1]?.id ?? null);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Could not load these images.");
      } finally {
        uploading.current = false;
        setBusy(false);
      }
    },
  });
  return <>
    {busy && <span role="status" className="absolute top-0 z-20"><Loader2 className="animate-spin" aria-label="Loading screenshots" /></span>}
    {error && <p role="alert" className="absolute top-10 z-20 rounded bg-red-950 px-2 text-xs text-white">{error}</p>}
    {preview && createPortal(<div {...getRootProps()} ref={stage} data-multi-canvas="true" className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <input {...getInputProps({id: "additional-screenshot-files", "aria-label": "Screenshot files", "data-export-ignore": "true"})} />
      {images.map((image) => <ImageLayer key={image.id} image={image} stage={stage} fallback={settings} />)}
    </div>, preview)}
  </>;
}
