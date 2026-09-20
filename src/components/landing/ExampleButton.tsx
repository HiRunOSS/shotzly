"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {ArrowUpRight, Loader2} from "lucide-react";
import {useEditorStore} from "@/store/useEditorStore";

export type ExampleId = "launch" | "code" | "comparison";
async function loadImage(path: string) {
  const response = await fetch(path);
  if (!response.ok) throw new Error("Image unavailable");
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function ExampleButton({example, children = "Use this template", className = "", showArrow = true}: {example: ExampleId; children?: React.ReactNode; className?: string; showArrow?: boolean}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  async function load() {
    setBusy(true); setError(false);
    try {
      const sources = example === "code" ? [] : await Promise.all((example === "comparison" ? ["/examples/product.png", "/examples/before.png"] : ["/examples/product.png"]).map(loadImage));
      const store = useEditorStore.getState();
      store.hydrateFromStorage();
      const settings = {...useEditorStore.getState().screenshotSettings, aspectRatio: "16:9" as const, frameStyle: "default" as const, borderWidth: 0, cornerRadius: 12, shadowStyle: "soft" as const, browserStyle: "none" as const, layoutPreset: "default" as const, imageScale: 100, rotation: 0, offsetX: 0, offsetY: 0, backgroundBlur: 0};
      store.setEditorMode(example === "code" ? "code" : "screenshot");
      if (example === "code") {
        store.setCode('const createSomething = async (idea) => {\n  const draft = await build(idea);\n\n  return {\n    ...draft,\n    readyToShare: true,\n  };\n};\n\ncreateSomething("your next big thing");');
        store.setCodeLanguage("javascript");store.setCodeThemePreset("shotzly-emerald-night");store.setCodeWindowStyle("macos");store.setCodeWindowTitle("create.ts");store.setFontSize(20);store.setCodePadding(48);store.setCodeGradient("#b5dbbe");store.setIsBackgroundHidden(false);
      } else {
        store.setScreenshotSettings(settings);
        store.setScreenshotGradient(example === "comparison" ? "center / cover no-repeat url('/backgrounds/macos/mac-bg-1.webp')" : "center / cover no-repeat url('/backgrounds/macos/mac-bg-2.webp')");
        store.setUploadedImage("");
        store.setCanvasImages(sources.map((src, index) => ({id: crypto.randomUUID(), src, name: index ? "Before" : "After", x: example === "comparison" ? (index ? 26 : 76) : 50, y: example === "comparison" ? (index ? 68 : 34) : 50, width: example === "comparison" ? 44 : 76, rotation: 0, radius: 12, shadow: true, settings})));
        store.selectCanvasImage(null);
      }
      router.push("/editor");
    } catch { setError(true); setBusy(false); }
  }
  return <button type="button" disabled={busy} onClick={load} className={`inline-flex items-center justify-center gap-2 disabled:opacity-60 ${className}`} aria-label={`Open ${example} example`}>{busy ? <Loader2 size={16} className="animate-spin" /> : null}{error ? "Try again" : children}{!busy && showArrow && <ArrowUpRight size={17} />}</button>;
}
