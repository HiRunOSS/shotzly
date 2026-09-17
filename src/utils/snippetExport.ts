const getNodeSize = (node: HTMLElement) => {
  const rect = node.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  return {width, height};
};

const EXPORT_PIXEL_RATIO = 3;

const getBaseOptions = (node: HTMLElement) => {
  const {width, height} = getNodeSize(node);

  return {
    cacheBust: true,
    width,
    height,
    skipFonts: true,
    style: {
      margin: "0",
      transform: "none",
      left: "0",
      top: "0",
    },
    // Avoid cssRules SecurityError from cross-origin stylesheets.
    fontEmbedCSS: "",
  };
};

const applySharpBorderExportFix = (root: HTMLElement) => {
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
};

const createExportClone = (node: HTMLElement) => {
  const {width, height} = getNodeSize(node);
  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.left = "-100000px";
  wrapper.style.top = "0";
  wrapper.style.width = `${width}px`;
  wrapper.style.height = `${height}px`;
  wrapper.style.pointerEvents = "none";

  const clone = node.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("[data-export-ignore='true']").forEach((element) => element.remove());
  applySharpBorderExportFix(clone);
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;
  clone.style.margin = "0";
  clone.style.transform = "none";

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  return {
    clone,
    width,
    height,
    dispose: () => {
      wrapper.remove();
    },
  };
};

const downloadDataUrl = (dataUrl: string, filename: string) => {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
};

export async function saveNodeAsPng(node: HTMLElement, filename = "code.png") {
  const {toBlob, toPng} = await import("html-to-image");
  const {clone, width, height, dispose} = createExportClone(node);

  try {
    const baseOptions = {
      ...getBaseOptions(clone),
      quality: 1,
      pixelRatio: EXPORT_PIXEL_RATIO,
      canvasWidth: width,
      canvasHeight: height,
    };

    const blob = await toBlob(clone, baseOptions);
    if (blob) {
      downloadBlob(blob, filename);
      return;
    }

    const dataUrl = await toPng(clone, baseOptions);
    downloadDataUrl(dataUrl, filename);
  } finally {
    dispose();
  }
}

export async function saveNodeAsSvg(node: HTMLElement, filename = "code.svg") {
  const {toSvg} = await import("html-to-image");
  const {clone, dispose} = createExportClone(node);

  try {
    const dataUrl = await toSvg(clone, getBaseOptions(clone));
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    downloadBlob(blob, filename);
  } finally {
    dispose();
  }
}

export async function copyNodeAsImage(node: HTMLElement) {
  return writeImageToClipboard(async () => {
    const {toBlob} = await import("html-to-image");
    const {clone, dispose} = createExportClone(node);
    try {
      const blob = await toBlob(clone, {
        ...getBaseOptions(clone), quality: 1, pixelRatio: EXPORT_PIXEL_RATIO,
      });
      if (!blob) throw new Error("Could not create the image.");
      return blob;
    } finally {
      dispose();
    }
  });
}

export async function writeImageToClipboard(render: () => Promise<Blob>) {
  if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
    throw new Error("Image copying is unavailable. Download the image instead.");
  }
  // Pass a promise immediately to preserve the click's user activation in Safari.
  await navigator.clipboard.write([new ClipboardItem({"image/png": render()})]);
}
