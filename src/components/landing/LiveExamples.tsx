"use client";

import Image from "next/image";
import {useEffect, useState} from "react";

const SWITCH_INTERVAL = 4200;

const editorShots = [
  {
    src: "/sample-img/editor1.png",
    alt: "Shotzly code editor mode with a styled code export preview",
    label: "Code editor preview",
  },
  {
    src: "/sample-img/editor2.png",
    alt: "Shotzly screenshot editor mode with an image upload preview",
    label: "Screenshot editor preview",
  },
];

function EditorPreviewSwitcher() {
  const [activeShot, setActiveShot] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveShot((current) => (current + 1) % editorShots.length);
    }, SWITCH_INTERVAL);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="group overflow-hidden rounded-lg border border-black/10 bg-[#101010] p-2 shadow-[0_26px_80px_rgba(0,0,0,0.16)] dark:border-white/10 dark:shadow-[0_30px_90px_rgba(0,0,0,0.48)] sm:p-3">
      <div className="relative aspect-[64/33] overflow-hidden rounded-md bg-black">
        {editorShots.map((shot, index) => {
          const isActive = activeShot === index;

          return (
            <Image
              key={shot.src}
              src={shot.src}
              alt={shot.alt}
              fill
              sizes="(min-width: 1024px) 1100px, 100vw"
              className={`object-cover object-center transition-[opacity,transform,filter] duration-1000 ease-in-out will-change-[opacity,transform] ${
                isActive
                  ? "scale-100 opacity-100 blur-0"
                  : "scale-[1.015] opacity-0 blur-[1px]"
              }`}
              priority={index === 0}
              quality={100}
              unoptimized
            />
          );
        })}
      </div>

      <div className="flex h-9 items-center justify-center gap-2">
        {editorShots.map((shot, index) => (
          <button
            key={shot.label}
            type="button"
            aria-label={shot.label}
            aria-pressed={activeShot === index}
            onClick={() => setActiveShot(index)}
            className={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${
              activeShot === index
                ? "w-7 bg-white"
                : "w-2.5 bg-white/35 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function LiveExamples() {

  return (
    <section
      className="overflow-hidden bg-white py-14 dark:bg-[#111010] sm:py-20"
      id="examples"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <EditorPreviewSwitcher />
      </div>
    </section>
  );
}
