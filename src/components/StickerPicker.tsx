"use client";

import {useState} from "react";
import {ChevronDown} from "lucide-react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {useEditorStore} from "@/store/useEditorStore";

const stickers = {
  Reactions: [
    ["Laughing", "\u{1F602}"], ["Love", "\u{1F60D}"], ["Cool", "\u{1F60E}"],
    ["Thinking", "\u{1F914}"], ["Mind blown", "\u{1F92F}"], ["Crying", "\u{1F62D}"],
    ["Fire", "\u{1F525}"], ["Heart", "\u{2764}\u{FE0F}"], ["Sparkles", "\u{2728}"],
    ["Clapping", "\u{1F44F}"], ["Party", "\u{1F389}"], ["Eyes", "\u{1F440}"],
  ],
  Girls: [
    ["Girl", "\u{1F467}"], ["Woman", "\u{1F469}"], ["Girl developer", "\u{1F469}\u{200D}\u{1F4BB}"],
    ["Girl artist", "\u{1F469}\u{200D}\u{1F3A8}"], ["Girl astronaut", "\u{1F469}\u{200D}\u{1F680}"],
    ["Dancer", "\u{1F483}"], ["Princess", "\u{1F478}"], ["Girl superhero", "\u{1F9B8}\u{200D}\u{2640}\u{FE0F}"],
  ],
  Boys: [
    ["Boy", "\u{1F466}"], ["Man", "\u{1F468}"], ["Boy developer", "\u{1F468}\u{200D}\u{1F4BB}"],
    ["Boy artist", "\u{1F468}\u{200D}\u{1F3A8}"], ["Boy astronaut", "\u{1F468}\u{200D}\u{1F680}"],
    ["Dancing man", "\u{1F57A}"], ["Prince", "\u{1F934}"], ["Boy superhero", "\u{1F9B8}\u{200D}\u{2642}\u{FE0F}"],
  ],
  Memes: [
    ["It works on my machine", "IT WORKS\nON MY MACHINE"], ["Plot twist", "PLOT TWIST"],
    ["Wait what", "WAIT... WHAT?"], ["Big brain", "BIG BRAIN\nENERGY"],
    ["Ship it", "SHIP IT!"], ["One more fix", "JUST ONE\nMORE FIX"],
    ["Mood", "MOOD."], ["No thoughts", "NO THOUGHTS\nJUST VIBES"],
  ],
} as const;
type Category = keyof typeof stickers;

export default function StickerPicker() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<Category>("Reactions");
  const [error, setError] = useState("");
  const count = useEditorStore((state) => state.canvasImages.length);

  function addSticker(name: string, content: string) {
    const store = useEditorStore.getState();
    if (store.canvasImages.length >= 8) { setError("Maximum 8 added images or stickers. Remove one to add another."); return; }
    try {
      const canvas = document.createElement("canvas");
      const meme = category === "Memes";
      canvas.width = meme ? 900 : 512;
      canvas.height = meme ? 360 : 512;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas unavailable");
      context.textAlign = "center";
      context.textBaseline = "middle";
      if (meme) {
        context.font = "900 76px Arial, sans-serif";
        context.lineJoin = "round";
        context.lineWidth = 14;
        context.strokeStyle = "#111111";
        context.fillStyle = "#ffffff";
        const lines = content.split("\n");
        lines.forEach((line, index) => {
          const y = canvas.height / 2 + (index - (lines.length - 1) / 2) * 94;
          context.strokeText(line, canvas.width / 2, y, 850);
          context.fillText(line, canvas.width / 2, y, 850);
        });
      } else {
        context.font = '380px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
        context.fillText(content, 256, 274);
      }
      const id = crypto.randomUUID();
      store.setCanvasImages([...store.canvasImages, {
        id, name, src: canvas.toDataURL("image/png"), x: 50, y: 50, width: meme ? 35 : 18,
        rotation: 0, radius: 0, shadow: false,
        settings: {...store.screenshotSettings, imageScale: 100, rotation: 0, offsetX: 0, offsetY: 0, cornerRadius: 0, borderWidth: 0, frameStyle: "default", browserStyle: "none", shadowStyle: "none", layoutPreset: "default"},
      }]);
      store.selectCanvasImage(id);
      setOpen(false);
      setError("");
    } catch { setError("Could not create this sticker. Please try another."); }
  }

  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild><button id="sticker-picker" type="button" aria-label="Add sticker" className="flex h-7 w-full items-center justify-between gap-2 rounded-md border border-black/30 bg-white/80 px-2 text-xs dark:border-white/15 dark:bg-[#111010]/80"><span>Select sticker</span><ChevronDown size={14} className="shrink-0 opacity-60" /></button></DialogTrigger>
    <DialogContent aria-describedby={undefined} className="scrollbar-hide max-h-[85dvh] w-[calc(100%-24px)] max-w-lg overflow-y-auto rounded-lg bg-white p-4 text-gray-900 dark:bg-[#181818] dark:text-white">
      <DialogHeader><DialogTitle className="tracking-normal">Stickers</DialogTitle></DialogHeader>
      <div role="tablist" aria-label="Sticker categories" className="flex border-b border-gray-300 dark:border-white/20">
        {(Object.keys(stickers) as Category[]).map((name) => <button key={name} id={`sticker-tab-${name}`} type="button" role="tab" aria-selected={category === name} aria-controls="sticker-grid" onClick={() => setCategory(name)} className={`min-w-0 flex-1 border-b-2 px-1 py-2 text-sm ${category === name ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : "border-transparent"}`}>{name}</button>)}
      </div>
      <div id="sticker-grid" role="tabpanel" aria-labelledby={`sticker-tab-${category}`} className={`grid gap-2 ${category === "Memes" ? "grid-cols-2" : "grid-cols-4"}`}>
        {stickers[category].map(([name, content]) => <button type="button" key={name} title={name} aria-label={`Add ${name} sticker`} disabled={count >= 8} onClick={() => addSticker(name, content)} className={`flex aspect-square min-w-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-2 hover:border-emerald-500 disabled:opacity-40 dark:border-white/15 dark:bg-white/5 ${category === "Memes" ? "whitespace-pre-line text-center text-sm font-black" : "text-4xl"}`}><span aria-hidden="true">{content}</span></button>)}
      </div>
      {count >= 8 && <p role="status" className="text-sm">Maximum 8 added images or stickers.</p>}
      {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
    </DialogContent>
  </Dialog>;
}
