export type MarkupTool = "arrow" | "rectangle" | "highlight" | "step" | "text" | "redact" | "crop";
export type Point = {x: number; y: number};
export type Mark = {
  tool: MarkupTool;
  start: Point;
  end: Point;
  color: string;
  width: number;
  text: string;
};

export function drawMark(context: CanvasRenderingContext2D, mark: Mark) {
  if (mark.tool === "crop") return;
  const {start, end, color, width, tool} = mark;
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const w = Math.abs(end.x - start.x);
  const h = Math.abs(end.y - start.y);
  context.save();
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = width;
  context.lineCap = "round";
  context.lineJoin = "round";
  if (tool === "redact") {
    context.fillStyle = "#000000";
    context.fillRect(Math.floor(x), Math.floor(y), Math.ceil(w) + 1, Math.ceil(h) + 1);
  } else if (tool === "highlight") {
    context.globalAlpha = 0.3;
    context.fillRect(x, y, w, h);
  } else if (tool === "rectangle") {
    context.strokeRect(x, y, w, h);
  } else if (tool === "arrow") {
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const head = width * 5;
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.moveTo(end.x - head * Math.cos(angle - Math.PI / 6), end.y - head * Math.sin(angle - Math.PI / 6));
    context.lineTo(end.x, end.y);
    context.lineTo(end.x - head * Math.cos(angle + Math.PI / 6), end.y - head * Math.sin(angle + Math.PI / 6));
    context.stroke();
  } else {
    const fontSize = width * 7;
    context.font = `bold ${fontSize}px sans-serif`;
    context.textBaseline = "middle";
    if (tool === "step") {
      context.beginPath();
      context.arc(start.x, start.y, fontSize * 0.85, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#ffffff";
      context.textAlign = "center";
    }
    context.fillText(mark.text, start.x, start.y);
  }
  context.restore();
}

export function cropBounds(mark: Mark) {
  const x = Math.floor(Math.min(mark.start.x, mark.end.x));
  const y = Math.floor(Math.min(mark.start.y, mark.end.y));
  return {x, y, width: Math.ceil(Math.max(mark.start.x, mark.end.x)) - x, height: Math.ceil(Math.max(mark.start.y, mark.end.y)) - y};
}

export function renderMarkup(canvas: HTMLCanvasElement, image: HTMLImageElement, marks: Mark[], previewCrop = false) {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not open the image editor.");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  marks.forEach((mark) => drawMark(context, mark));
  const crop = marks.find((mark) => mark.tool === "crop");
  if (previewCrop && crop) {
    const {x, y, width, height} = cropBounds(crop);
    context.save();
    context.fillStyle = "rgba(0,0,0,0.55)";
    context.fillRect(0, 0, canvas.width, y);
    context.fillRect(0, y + height, canvas.width, canvas.height - y - height);
    context.fillRect(0, y, x, height);
    context.fillRect(x + width, y, canvas.width - x - width, height);
    context.strokeStyle = "#ffffff";
    context.lineWidth = Math.max(1, canvas.width / 500);
    context.strokeRect(x, y, width, height);
    context.restore();
  }
}
