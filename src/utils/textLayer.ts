import type {TextLayer} from "@/store/useEditorStore";

export const DEFAULT_TEXT_LAYER: TextLayer = {
  content: "New Text",
  fontSize: 32,
  color: "#ffffff",
  opacity: 100,
  fontFamily: "Inter",
  align: "center",
};

export function renderTextLayer(layer: TextLayer) {
  const scale = 2;
  const size = Math.max(12, Math.min(120, layer.fontSize));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not render text.");
  const family = layer.fontFamily === "Inter" ? "Inter, Arial, sans-serif" : layer.fontFamily;
  context.font = `600 ${size * scale}px ${family}`;
  const lines = layer.content.split("\n").slice(0, 5).map((line) => line || " ");
  const padding = 8 * scale;
  const lineHeight = size * scale * 1.25;
  canvas.width = Math.max(40, Math.ceil(Math.max(...lines.map((line) => context.measureText(line).width)) + padding * 2));
  canvas.height = Math.ceil(lines.length * lineHeight + padding * 2);
  context.font = `600 ${size * scale}px ${family}`;
  context.textBaseline = "middle";
  context.textAlign = layer.align;
  context.fillStyle = layer.color;
  context.globalAlpha = Math.max(0, Math.min(100, layer.opacity)) / 100;
  const x = layer.align === "left" ? padding : layer.align === "right" ? canvas.width - padding : canvas.width / 2;
  lines.forEach((line, index) => context.fillText(line, x, padding + lineHeight * (index + 0.5)));
  return {src: canvas.toDataURL("image/webp", 0.94), width: canvas.width / scale};
}
