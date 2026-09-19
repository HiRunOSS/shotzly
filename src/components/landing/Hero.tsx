"use client";

import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import { ArrowRight } from "lucide-react";
import ExampleButton from "./ExampleButton";
import screenshotPreview from "../../../public/sample-img/editor1.png";
import codePreview from "../../../public/sample-img/editor2.png";

export default function Hero() {
  const [previewMode, setPreviewMode] = useState<"screenshot" | "code">("screenshot");

  return <section id="hero" className="relative isolate overflow-hidden bg-[#111010] text-white">
    <div className="relative z-10 mx-auto max-w-5xl px-5 pt-8 text-center">
      <p className="mb-5 text-xs font-medium uppercase tracking-normal text-white/60">A little polish. A lot more you.</p>
      <h1 className="text-4xl font-semibold leading-[1.1] tracking-normal sm:text-6xl">Screenshot &amp; code<br />image studio.</h1>
      <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-white/60">Turn what you&apos;re building into something worth sharing.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href={`/editor?mode=${previewMode}`} className="inline-flex h-11 items-center gap-3 rounded-md bg-white px-5 text-sm font-semibold text-black hover:bg-neutral-200">Open editor <ArrowRight size={17} /></Link>
        <ExampleButton example="launch" className="h-11 rounded-md border border-white/20 px-5 text-sm text-white hover:bg-white/10">Try an example</ExampleButton>
      </div>
      <p className="mt-4 text-xs text-white/40">Free to create. Yours to share.</p>
    </div>
    <div role="group" aria-label="Editor preview mode" className="mx-auto mt-8 flex w-fit items-center rounded-md border border-white/15 bg-white/5 p-1">
      {(["screenshot", "code"] as const).map((mode) => (
        <button
          key={mode}
          type="button"
          aria-pressed={previewMode === mode}
          onClick={() => setPreviewMode(mode)}
          className={`h-9 min-w-28 rounded px-4 text-sm font-medium transition-colors ${previewMode === mode ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
        >
          {mode === "screenshot" ? "Screenshot" : "Code"}
        </button>
      ))}
    </div>
    <div className="relative mx-auto mt-4 aspect-[1920/990] w-[calc(100%-40px)] max-w-6xl overflow-hidden rounded-lg border border-black/70">
      <Image src={previewMode === "screenshot" ? screenshotPreview : codePreview} alt={previewMode === "screenshot" ? "Shotzly screenshot editor preview" : "Shotzly code image editor preview"} fill sizes="(max-width: 1200px) calc(100vw - 40px), 1152px" priority className="object-contain" />
    </div>
  </section>;
}
