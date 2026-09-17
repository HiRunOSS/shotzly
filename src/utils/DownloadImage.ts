import {
  DEFAULT_LAYOUT_PRESET,
  getExportSafeLayoutTransform,
  isLayoutPresetId,
  shouldUseExportSafeLayoutTransform,
} from "@/constants/layoutPresets";

export type ImageExportFormat = "png" | "jpg" | "webp";
export type ImageExportResolution = "auto" | "2k" | "4k" | "6k";

interface ExportImageOptions {
  format?: ImageExportFormat;
  filename?: string;
  resolution?: ImageExportResolution;
}

function getMimeType(format: ImageExportFormat) {
  if (format === "jpg") {
    return "image/jpeg";
  }
  if (format === "webp") {
    return "image/webp";
  }
  return "image/png";
}

function getFormatQuality(format: ImageExportFormat) {
  if (format === "jpg") {
    return 0.98;
  }
  if (format === "webp") {
    return 0.96;
  }
  return 1;
}

const EXPORT_PIXEL_RATIO = 3;

const EXPORT_RESOLUTION_WIDTHS: Record<
  Exclude<ImageExportResolution, "auto">,
  number
> = {
  "2k": 2048,
  "4k": 4096,
  "6k": 6144,
};

function getExportScale(width: number, resolution?: ImageExportResolution) {
  if (resolution && resolution !== "auto") {
    return Math.max(1, EXPORT_RESOLUTION_WIDTHS[resolution] / width);
  }

  return Math.max(EXPORT_PIXEL_RATIO, window.devicePixelRatio || 1);
}

function triggerBrowserDownload(url: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }
        reject(new Error("Failed to convert canvas to blob."));
      },
      mimeType,
      quality,
    );
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  triggerBrowserDownload(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function shouldUseLayoutFallback(node: HTMLElement) {
  const layoutEl = node.querySelector<HTMLElement>(
    "[data-layout-effect='true']",
  );
  const preset = layoutEl?.dataset.layoutPreset;
  if (
    !preset ||
    !isLayoutPresetId(preset) ||
    preset === DEFAULT_LAYOUT_PRESET
  ) {
    return false;
  }

  return shouldUseExportSafeLayoutTransform(preset);
}

function applyExportLayoutFallback(root: HTMLElement) {
  root
    .querySelectorAll<HTMLElement>("[data-layout-effect='true']")
    .forEach((el) => {
      const preset = el.dataset.layoutPreset;
      const safePreset = isLayoutPresetId(preset)
        ? preset
        : DEFAULT_LAYOUT_PRESET;
      const rawImageScale = Number(el.dataset.imageScale);
      const imageScale = Number.isFinite(rawImageScale)
        ? Math.max(1, Math.min(150, rawImageScale)) / 100
        : 1;
      el.style.transform = `${getExportSafeLayoutTransform(
        safePreset,
      )} scale(${imageScale})`;
      el.style.transformOrigin = "center";
    });
}

function applyExportVisualFixes(root: HTMLElement) {
  root
    .querySelectorAll<HTMLElement>("[data-layout-effect='true']")
    .forEach((el) => {
      // Prevent export renderers from creating hard-corner artifacts near tilted edges.
      el.style.overflow = "hidden";
      el.style.backgroundClip = "padding-box";

      const frameStyle = el.dataset.frameStyle;
      if (frameStyle === "border-dark") {
        // Fill the inner box with the border color to avoid thin transparent seams.
        el.style.backgroundColor = "rgba(12, 15, 23, 1)";
      } else if (frameStyle === "border") {
        el.style.backgroundColor = "rgba(255, 255, 255, 0.96)";
      }

      if (el.dataset.shadowStyle === "none") {
        el.style.filter = "none";
        el.style.boxShadow = "none";
      }
    });
}

function applySharpBorderExportFix(root: HTMLElement) {
  const targets = [
    ...(root.matches("[data-export-sharp-border='true']") ? [root] : []),
    ...root.querySelectorAll<HTMLElement>("[data-export-sharp-border='true']"),
  ];

  targets.forEach((el) => {
    el.style.borderRadius = "0px";
    el.style.borderTopLeftRadius = "0px";
    el.style.borderTopRightRadius = "0px";
    el.style.borderBottomLeftRadius = "0px";
    el.style.borderBottomRightRadius = "0px";
  });
}

function createSanitizedClone(node: HTMLElement, applyLayoutFallback = false) {
  const rect = node.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));

  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.left = "-100000px";
  wrapper.style.top = "0";
  wrapper.style.width = `${width}px`;
  wrapper.style.height = `${height}px`;
  wrapper.style.pointerEvents = "none";

  const clone = node.cloneNode(true) as HTMLElement;
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;
  clone.style.margin = "0";
  clone.style.transform = "none";

  clone.querySelectorAll("[data-export-ignore='true']").forEach((el) => {
    el.remove();
  });

  clone.querySelectorAll<HTMLElement>("*").forEach((el) => {
    el.style.backdropFilter = "none";
    el.style.transition = "none";
    el.style.animation = "none";
  });

  if (applyLayoutFallback) {
    applyExportLayoutFallback(clone);
  }

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  return {
    clone,
    width,
    height,
    dispose: () => {
      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    },
  };
}

async function captureCanvas(
  node: HTMLElement,
  resolution?: ImageExportResolution,
) {
  const html2canvas = (await import("html2canvas")).default;
  const rect = node.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const scale = getExportScale(width, resolution);

  return await html2canvas(node, {
    backgroundColor: null,
    width,
    height,
    useCORS: true,
    allowTaint: true,
    scale,
    logging: false,
    removeContainer: true,
    ignoreElements: (el) =>
      el instanceof HTMLElement && el.dataset.exportIgnore === "true",
  });
}

async function captureCanvasWithHtmlToImage(
  node: HTMLElement,
  resolution?: ImageExportResolution,
) {
  const {toCanvas} = await import("html-to-image");
  const rect = node.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const scale = getExportScale(width, resolution);

  return await toCanvas(node, {
    cacheBust: true,
    width,
    height,
    pixelRatio: scale,
    skipFonts: true,
    filter: (domNode) => {
      if (domNode instanceof HTMLElement) {
        return domNode.dataset.exportIgnore !== "true";
      }
      return true;
    },
    style: {
      margin: "0",
      left: "0",
      top: "0",
    },
  });
}

async function captureCloneAsCanvas(
  node: HTMLElement,
  applyLayoutFallback: boolean,
  resolution?: ImageExportResolution,
) {
  const {clone, dispose} = createSanitizedClone(node, applyLayoutFallback);

  try {
    applySharpBorderExportFix(clone);
    applyExportVisualFixes(clone);
    return await captureCanvasWithHtmlToImage(clone, resolution);
  } finally {
    dispose();
  }
}

export async function screenshotToBlob(node: HTMLElement, resolution: ImageExportResolution = "auto") {
  const canvas = await captureCloneAsCanvas(node, false, resolution);
  return canvasToBlob(canvas, "image/png");
}

export default async function exportAsImage(
  node: HTMLElement,
  options?: ExportImageOptions,
  onStart?: () => void,
  onSuccess?: () => void,
  onError?: (error: Error) => void,
) {
  if (!node) {
    return;
  }

  try {
    onStart?.();
    const format = options?.format ?? "png";
    const mimeType = getMimeType(format);
    const quality = getFormatQuality(format);
    const resolution = options?.resolution ?? "auto";
    const filename = options?.filename ?? `snippet.${format}`;
    try {
      const canvas = await captureCloneAsCanvas(node, false, resolution);
      const blob = await canvasToBlob(
        canvas,
        mimeType,
        format === "png" ? undefined : quality,
      );
      downloadBlob(blob, filename);
      onSuccess?.();
      return;
    } catch {
      const useLayoutFallback = shouldUseLayoutFallback(node);
      if (useLayoutFallback) {
        try {
          const canvas = await captureCloneAsCanvas(node, true, resolution);
          const blob = await canvasToBlob(
            canvas,
            mimeType,
            format === "png" ? undefined : quality,
          );
          downloadBlob(blob, filename);
          onSuccess?.();
          return;
        } catch {
          const canvas = await captureCanvas(node, resolution);
          const blob = await canvasToBlob(
            canvas,
            mimeType,
            format === "png" ? undefined : quality,
          );
          downloadBlob(blob, filename);
          onSuccess?.();
          return;
        }
      }

      const canvas = await captureCanvas(node, resolution);
      const blob = await canvasToBlob(
        canvas,
        mimeType,
        format === "png" ? undefined : quality,
      );
      downloadBlob(blob, filename);
      onSuccess?.();
      return;
    }
  } catch (err) {
    console.error("Could not export as image", err);
    onError?.(err as Error);
  }
}
