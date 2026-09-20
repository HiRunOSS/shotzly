import type {GraphicLayer} from "@/store/useEditorStore";

export const DEFAULT_GRAPHIC_LAYER: GraphicLayer = {
  kind: "rect",
  color: "#ffffff",
  opacity: 100,
  strokeWidth: 6,
  filled: false,
  emoji: "😊",
};

export function renderGraphicLayer(layer: GraphicLayer) {
  const scale = 2;
  const isRectangle = layer.kind === "rect" || layer.kind === "roundedRect" || layer.kind === "dashedRect";
  const logicalWidth = layer.kind === "arrow" ? 300 : isRectangle ? 240 : 180;
  const logicalHeight = isRectangle ? 160 : layer.kind === "arrow" ? 120 : 180;
  const canvas = document.createElement("canvas");
  canvas.width = logicalWidth * scale;
  canvas.height = logicalHeight * scale;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not render this layer.");
  context.scale(scale, scale);
  context.globalAlpha = Math.max(0, Math.min(100, layer.opacity)) / 100;
  context.strokeStyle = layer.color;
  context.fillStyle = layer.color;
  context.lineWidth = Math.max(1, Math.min(24, layer.strokeWidth));
  context.lineCap = "round";
  context.lineJoin = "round";
  if (isRectangle) {
    const inset = context.lineWidth / 2 + 8;
    const x = inset, y = inset, w = logicalWidth - inset * 2, h = logicalHeight - inset * 2;
    const radius = layer.kind === "roundedRect" ? 24 : 0;
    if (layer.kind === "dashedRect") context.setLineDash([14, 10]);
    context.beginPath();
    if (radius) context.roundRect(x, y, w, h, radius);
    else context.rect(x, y, w, h);
    if (layer.filled) context.fill();
    else context.stroke();
  } else if (layer.kind === "circle") {
    context.beginPath();
    context.arc(logicalWidth / 2, logicalHeight / 2, logicalWidth / 2 - context.lineWidth / 2 - 8, 0, Math.PI * 2);
    if (layer.filled) context.fill();
    else context.stroke();
  } else if (layer.kind === "arrow") {
    const center = logicalHeight / 2;
    context.beginPath();
    context.moveTo(18, center);
    context.lineTo(logicalWidth - 28, center);
    context.moveTo(logicalWidth - 72, center - 40);
    context.lineTo(logicalWidth - 28, center);
    context.lineTo(logicalWidth - 72, center + 40);
    context.stroke();
  } else {
    context.font = '132px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(layer.emoji, logicalWidth / 2, logicalHeight / 2 + 8);
  }
  return {src: canvas.toDataURL("image/webp", 0.94), width: logicalWidth};
}
