import Image from "next/image";
import Link from "next/link";
import {ArrowRight} from "lucide-react";
import ExampleButton from "./ExampleButton";
import launchPreview from "../../../public/examples/launch.png";

export default function Hero() {
  return <section id="hero" className="relative isolate overflow-hidden bg-[#111010] text-white">
    <div className="relative z-10 mx-auto max-w-5xl px-5 pt-8 text-center">
      <p className="mb-5 text-xs font-medium uppercase tracking-normal text-white/60">A little polish. A lot more you.</p>
      <h1 className="text-4xl font-semibold leading-[1.1] tracking-normal sm:text-6xl">Screenshot &amp; code<br />image studio.</h1>
      <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-white/60">Turn what you&apos;re building into something worth sharing.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/editor" className="inline-flex h-11 items-center gap-3 rounded-md bg-white px-5 text-sm font-semibold text-black hover:bg-neutral-200">Open editor <ArrowRight size={17} /></Link>
        <ExampleButton example="launch" className="h-11 rounded-md border border-white/20 px-5 text-sm text-white hover:bg-white/10">Try an example</ExampleButton>
      </div>
      <p className="mt-4 text-xs text-white/40">Free to create. Yours to share.</p>
    </div>
    <div className="relative mx-auto mt-8 aspect-video w-[calc(100%-40px)] max-w-[900px] overflow-hidden rounded-lg">
      <Image src={launchPreview} alt="A single dashboard screenshot centered on a Mac wallpaper in Shotzly" fill sizes="(max-width: 940px) calc(100vw - 40px), 900px" priority className="object-contain" />
    </div>
  </section>;
}
