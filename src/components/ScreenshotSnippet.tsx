"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  ArrowLeft, ArrowRight, Camera, Globe2, Loader2, MoreVertical,
  Plus, RotateCw, SlidersHorizontal, Star, UploadCloud, X,
} from "lucide-react";
import { useDropzone, type FileRejection } from "react-dropzone";
import ScreenshotTransformControls from "./ScreenshotTransformControls";
import {
  useEditorStore,
  type ScreenshotBrowserStyle,
  type ScreenshotAspectRatio,
  type ScreenshotSettings,
} from "@/store/useEditorStore";
import {
  DEFAULT_LAYOUT_PRESET,
  getLayoutTransform,
} from "@/constants/layoutPresets";

interface ScreenshotSnippetProps {
  settings: ScreenshotSettings;
}

const ASPECT_RATIO_VALUE_MAP: Record<ScreenshotAspectRatio, string> = {
  "16:9": "16 / 9",
  "3:2": "3 / 2",
  "4:3": "4 / 3",
  "5:4": "5 / 4",
  "1:1": "1 / 1",
  "4:5": "4 / 5",
  "3:4": "3 / 4",
  "2:3": "2 / 3",
  "9:16": "9 / 16",
};

const ASPECT_RATIO_NUMBER_MAP: Record<ScreenshotAspectRatio, number> = {
  "16:9": 16 / 9,
  "3:2": 3 / 2,
  "4:3": 4 / 3,
  "5:4": 5 / 4,
  "1:1": 1,
  "4:5": 4 / 5,
  "3:4": 3 / 4,
  "2:3": 2 / 3,
  "9:16": 9 / 16,
};

const BACKGROUND_PADDING = "clamp(16px, 4.5vw, 64px)";
const MAX_PREVIEW_WIDTH_PX = 1200;
const MAX_IMAGE_SIZE_BYTES = 12 * 1024 * 1024;
const BROWSER_FRAME_STYLES: Record<
  Exclude<ScreenshotBrowserStyle, "none">,
  {
    shell: string;
    topBar: string;
    address: string;
    addressText: string;
    border: string;
    icon: string;
    separator: string;
  }
> = {
  safari: {
    shell: "transparent",
    topBar: "linear-gradient(180deg, rgb(246, 247, 249), rgb(214, 218, 225))",
    address: "rgba(255, 255, 255, 0.9)",
    addressText: "rgba(48, 54, 64, 0.62)",
    border: "1px solid rgba(15, 23, 42, 0.1)",
    icon: "rgba(75, 85, 99, 0.58)",
    separator: "rgba(15, 23, 42, 0.08)",
  },
  "safari-dark": {
    shell: "rgb(17, 17, 18)",
    topBar: "rgb(50, 50, 52)",
    address: "rgba(255, 255, 255, 0.08)",
    addressText: "rgba(255, 255, 255, 0.56)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    icon: "rgba(255, 255, 255, 0.48)",
    separator: "rgba(255, 255, 255, 0.09)",
  },
  chrome: {
    shell: "transparent",
    topBar: "linear-gradient(180deg, rgb(246, 247, 249), rgb(221, 224, 230))",
    address: "rgba(241, 243, 244, 0.95)",
    addressText: "rgba(60, 64, 67, 0.64)",
    border: "1px solid rgba(15, 23, 42, 0.1)",
    icon: "rgba(75, 85, 99, 0.62)",
    separator: "rgba(15, 23, 42, 0.08)",
  },
  "chrome-dark": {
    shell: "rgb(16, 16, 17)",
    topBar: "rgb(51, 51, 53)",
    address: "rgba(255, 255, 255, 0.07)",
    addressText: "rgba(255, 255, 255, 0.55)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    icon: "rgba(255, 255, 255, 0.5)",
    separator: "rgba(255, 255, 255, 0.1)",
  },
};

export default function ScreenshotSnippet({ settings }: ScreenshotSnippetProps) {
  const gradient = useEditorStore((state) => state.screenshotGradient);
  const setPreviewRef = useEditorStore((state) => state.setPreviewRef);
  const uploadedImage = useEditorStore((state) => state.uploadedImage);
  const setUploadedImage = useEditorStore((state) => state.setUploadedImage);
  const setScreenshotSettings = useEditorStore(
    (state) => state.setScreenshotSettings,
  );
  const previewViewportRef = useRef<HTMLElement | null>(null);
  const transformTargetRef = useRef<HTMLElement | null>(null);
  const [imageSelected, setImageSelected] = useState(true);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteCaptureError, setWebsiteCaptureError] = useState("");
  const [isCapturingWebsite, setIsCapturingWebsite] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(MAX_PREVIEW_WIDTH_PX);
  const imageSrc = uploadedImage;
  const safeImageScale = Math.max(50, Math.min(settings.imageScale, 150));
  const safeBackgroundBlur = Math.max(
    0,
    Math.min(settings.backgroundBlur, 24),
  );
  const aspectRatioValue =
    ASPECT_RATIO_VALUE_MAP[settings.aspectRatio] ??
    ASPECT_RATIO_VALUE_MAP["16:9"];
  const aspectRatioNumber =
    ASPECT_RATIO_NUMBER_MAP[settings.aspectRatio] ??
    ASPECT_RATIO_NUMBER_MAP["16:9"];

  const borderRadius = Math.max(0, Math.min(64, settings.cornerRadius));
  const isSolidBorderFrame =
    settings.frameStyle === "border" || settings.frameStyle === "border-dark";
  const browserFrameStyle =
    settings.browserStyle !== "none"
      ? BROWSER_FRAME_STYLES[settings.browserStyle]
      : null;
  const hasBrowserFrame = Boolean(browserFrameStyle);
  const isChromeFrame =
    settings.browserStyle === "chrome" || settings.browserStyle === "chrome-dark";
  const chromeToolbarColor =
    settings.browserStyle === "chrome-dark" ? "#292a2d" : "#ffffff";
  const hasVisibleFrame =
    settings.frameStyle !== "default" && !hasBrowserFrame;
  const safeBorderWidthPx = Math.max(0, Math.min(settings.borderWidth, 24));
  const solidBorderWidthPx = isSolidBorderFrame ? safeBorderWidthPx : 0;
  const frameInsetWidthPx = hasVisibleFrame ? safeBorderWidthPx : 0;
  const frameRadius = hasBrowserFrame
    ? 0
    : hasVisibleFrame
      ? borderRadius + frameInsetWidthPx
      : borderRadius;

  const getFrameStyles = () => {
    return {
      borderRadius: `${frameRadius}px`,
      backgroundImage: "none",
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  };

  const getScreenshotWrapperStyles = (): React.CSSProperties => {
    switch (settings.frameStyle) {
      case "glass-light":
        return {
          padding: "0px",
          border: `${safeBorderWidthPx}px solid rgba(255, 255, 255, 0.62)`,
          backgroundColor: "transparent",
        };
      case "glass-dark":
        return {
          padding: "0px",
          border: `${safeBorderWidthPx}px solid rgba(255, 255, 255, 0.26)`,
          backgroundColor: "transparent",
        };
      case "border":
        return {
          padding: `${solidBorderWidthPx}px`,
          border: "none",
          backgroundColor: "rgb(255, 255, 255)",
        };
      case "border-dark":
        return {
          padding: `${solidBorderWidthPx}px`,
          border: "none",
          backgroundColor: "rgb(26, 26, 26)",
        };
      case "dashed":
        return {
          padding: "0px",
          border: `${safeBorderWidthPx}px dashed rgba(255, 255, 255, 0.46)`,
          backgroundColor: "transparent",
        };
      case "dotted":
        return {
          padding: "0px",
          border: `${safeBorderWidthPx}px dotted rgba(255, 255, 255, 0.58)`,
          backgroundColor: "transparent",
        };
      case "default":
      default:
        return {
          backgroundColor: "transparent",
        };
    }
  };

  const getScreenshotShadowStyles = (): React.CSSProperties => {
    switch (settings.shadowStyle) {
      case "hug":
        return {
          filter: "drop-shadow(0 8px 14px rgba(15, 23, 42, 0.26))",
          boxShadow:
            "0 1px 3px rgba(15, 23, 42, 0.14), 0 6px 14px rgba(15, 23, 42, 0.2)",
        };
      case "soft":
        return {
          filter:
            "drop-shadow(0 14px 28px rgba(15, 23, 42, 0.28)) drop-shadow(0 4px 10px rgba(15, 23, 42, 0.16))",
          boxShadow:
            "0 4px 12px rgba(15, 23, 42, 0.16), 0 14px 30px -6px rgba(15, 23, 42, 0.3)",
        };
      case "strong":
        return {
          filter:
            "drop-shadow(0 24px 48px rgba(15, 23, 42, 0.38)) drop-shadow(0 8px 18px rgba(15, 23, 42, 0.24))",
          boxShadow:
            "0 8px 20px rgba(15, 23, 42, 0.2), 0 24px 54px -10px rgba(15, 23, 42, 0.36)",
        };
      case "none":
      default:
        return {
          filter: "none",
          boxShadow: "none",
        };
    }
  };

  const getFrameBorderWidthPx = () => {
    switch (settings.frameStyle) {
      case "glass-light":
      case "glass-dark":
      case "dashed":
      case "dotted":
        return safeBorderWidthPx;
      case "border":
      case "border-dark":
        return solidBorderWidthPx;
      case "default":
      default:
        return 0;
    }
  };

  const getLayoutPresetStyles = (): React.CSSProperties => {
    if (
      settings.layoutPreset === DEFAULT_LAYOUT_PRESET &&
      safeImageScale === 100
    ) {
      return {
        transform: "none",
      };
    }

    return {
      transform: `${getLayoutTransform(settings.layoutPreset)} scale(${safeImageScale / 100
        })`,
      transformOrigin: "center",
    };
  };

  const frameBorderWidthPx = getFrameBorderWidthPx();
  const innerImageRadiusPx =
    hasVisibleFrame
      ? borderRadius
      : Math.max(borderRadius - frameBorderWidthPx, 0);
  const browserShellRadius = hasBrowserFrame ? borderRadius : 0;
  const browserToolbarHeight = "clamp(18px, 3.1vw, 28px)";

  const processUploadedFile = useCallback(
    (file: File | null | undefined) => {
      if (!file) {
        return;
      }

      if (!file.type.startsWith("image/")) {
        window.alert("Please upload an image file.");
        return;
      }

      // Keep persisted payloads within practical localStorage bounds.
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        window.alert(
          "Please upload an image under 12MB for reliable persistence.",
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const store = useEditorStore.getState();
        store.setScreenshotSettings({ ...store.screenshotSettings, offsetX: 0, offsetY: 0, rotation: 0 });
        setImageSelected(true);
        setUploadedImage(base64);
      };
      reader.readAsDataURL(file);
    },
    [setUploadedImage],
  );

  const importImageBlob = useCallback(
    (blob: Blob) => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          setUploadedImage(reader.result as string);
          resolve();
        };
        reader.onerror = () => {
          reject(new Error("Unable to read captured screenshot."));
        };
        reader.readAsDataURL(blob);
      });
    },
    [setUploadedImage],
  );

  const normalizeWebsiteUrl = (rawUrl: string) => {
    const trimmedUrl = rawUrl.trim();
    if (!trimmedUrl) {
      return "";
    }

    return /^https?:\/\//i.test(trimmedUrl)
      ? trimmedUrl
      : `https://${trimmedUrl}`;
  };

  const handleWebsiteCapture = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const normalizedUrl = normalizeWebsiteUrl(websiteUrl);
    if (!normalizedUrl) {
      setWebsiteCaptureError("Enter a website URL.");
      return;
    }

    setIsCapturingWebsite(true);
    setWebsiteCaptureError("");

    try {
      const response = await fetch(
        `/api/website-screenshot?url=${encodeURIComponent(normalizedUrl)}`,
      );
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error ?? "Could not capture this website.");
      }

      const blob = await response.blob();
      await importImageBlob(blob);
      setImageSelected(true);
      setScreenshotSettings({
        ...settings,
        aspectRatio: "16:9",
        imageScale: 100,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        layoutPreset: DEFAULT_LAYOUT_PRESET,
      });
      setWebsiteUrl("");
    } catch (error) {
      setWebsiteCaptureError(
        error instanceof Error
          ? error.message
          : "Could not capture this website.",
      );
    } finally {
      setIsCapturingWebsite(false);
    }
  };

  const handleDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      processUploadedFile(acceptedFiles[0]);
    },
    [processUploadedFile],
  );

  const handleDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const firstErrorCode = fileRejections[0]?.errors[0]?.code;

    if (firstErrorCode === "file-too-large") {
      window.alert(
        "Please upload an image under 12MB for reliable persistence.",
      );
      return;
    }

    if (firstErrorCode === "file-invalid-type") {
      window.alert("Please upload an image file.");
      return;
    }

    window.alert("Unable to upload this file. Please try a different image.");
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    multiple: false,
    maxSize: MAX_IMAGE_SIZE_BYTES,
    noClick: true,
    noKeyboard: true,
    onDropAccepted: handleDropAccepted,
    onDropRejected: handleDropRejected,
  });

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const pastedFile = event.clipboardData?.files?.[0];
      if (!pastedFile) {
        return;
      }

      event.preventDefault();
      processUploadedFile(pastedFile);
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [processUploadedFile]);

  useEffect(() => {
    const viewport = previewViewportRef.current;
    if (!viewport) {
      return;
    }

    const updatePreviewWidth = () => {
      const { height, width } = viewport.getBoundingClientRect();
      const nextWidth = Math.max(
        240,
        Math.min(MAX_PREVIEW_WIDTH_PX, width, height * aspectRatioNumber),
      );
      setPreviewWidth(Math.round(nextWidth));
    };

    updatePreviewWidth();

    const resizeObserver = new ResizeObserver(updatePreviewWidth);
    resizeObserver.observe(viewport);
    window.addEventListener("resize", updatePreviewWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePreviewWidth);
    };
  }, [aspectRatioNumber]);

  return (
    <section
      ref={previewViewportRef}
      className="flex h-full min-h-[300px] w-full flex-col items-center justify-center gap-5 px-1 sm:gap-6"
    >
      <div
        ref={setPreviewRef}
        data-export-sharp-border="true"
        data-screenshot-canvas="true"
        className="relative mx-auto box-border overflow-hidden rounded-lg"
        onPointerDown={() => setImageSelected(false)}
        style={{
          aspectRatio: aspectRatioValue,
          backgroundColor: "#111010",
          padding: BACKGROUND_PADDING,
          width: `${previewWidth}px`,
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: gradient,
          }}
        />
        {safeBackgroundBlur > 0 ? (
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: gradient,
              filter: `blur(${safeBackgroundBlur}px)`,
            }}
          />
        ) : null}

        <div
          {...getRootProps({
            "data-export-sharp-border": "true",
            className: "relative z-10 h-full w-full",
          })}
          style={{
            ...getFrameStyles(),
            overflow: imageSrc ? "visible" : "hidden",
          }}
        >
          <input {...getInputProps({ "aria-label": "Upload screenshot" })} />

          <div
            className="absolute flex items-center justify-center"
            style={{
              inset: 0,
              borderRadius: `${frameRadius}px`,
              overflow: imageSrc ? "visible" : "hidden",
              transform: imageSrc
                ? `translate(${settings.offsetX}%, ${settings.offsetY}%) rotate(${settings.rotation}deg)`
                : undefined,
            }}
          >
            {imageSrc && hasBrowserFrame && browserFrameStyle ? (
              <div
                ref={(element) => { transformTargetRef.current = element; }}
                className="flex max-h-full max-w-full flex-col overflow-hidden"
                data-layout-effect="true"
                data-layout-preset={settings.layoutPreset}
                data-image-scale={safeImageScale}
                data-shadow-style={settings.shadowStyle}
                data-frame-style={settings.browserStyle}
                style={{
                  backgroundColor: browserFrameStyle.shell,
                  border: browserFrameStyle.border,
                  borderRadius: `${browserShellRadius}px`,
                  boxSizing: "border-box",
                  ...getLayoutPresetStyles(),
                  ...getScreenshotShadowStyles(),
                }}
              >
                {isChromeFrame ? (
                  <div
                    aria-hidden="true"
                    className="shrink-0"
                    style={{ color: browserFrameStyle.icon }}
                  >
                    <div
                      className="flex h-8 items-end gap-2 px-2"
                      style={{ background: browserFrameStyle.topBar }}
                    >
                      <div className="flex h-full shrink-0 items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                        <span className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
                        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
                      </div>
                      <div
                        className="flex h-6 min-w-0 max-w-[160px] flex-1 items-center gap-2 rounded-t-lg px-2 text-[9px]"
                        style={{ backgroundColor: chromeToolbarColor }}
                      >
                        <Globe2 size={10} className="shrink-0" />
                        <span className="min-w-0 flex-1 truncate">Screenshot</span>
                        <X size={10} className="shrink-0" />
                      </div>
                      <Plus size={12} className="mb-1.5 shrink-0" />
                    </div>
                    <div
                      className="flex h-8 items-center gap-2 px-2"
                      style={{
                        backgroundColor: chromeToolbarColor,
                        borderBottom: `1px solid ${browserFrameStyle.separator}`,
                      }}
                    >
                      <ArrowLeft size={11} className="shrink-0" />
                      <ArrowRight size={11} className="shrink-0 opacity-50" />
                      <RotateCw size={11} className="shrink-0" />
                      <div
                        className="flex h-5 min-w-0 flex-1 items-center justify-between rounded-full px-2"
                        style={{ backgroundColor: browserFrameStyle.address }}
                      >
                        <SlidersHorizontal size={10} />
                        <Star size={10} />
                      </div>
                      <MoreVertical size={12} className="shrink-0" />
                    </div>
                  </div>
                ) : (
                  <div
                    aria-hidden="true"
                    className="relative shrink-0"
                    style={{
                      background: browserFrameStyle.topBar,
                      borderBottom: `1px solid ${browserFrameStyle.separator}`,
                      height: browserToolbarHeight,
                    }}
                  >
                    <div className="absolute left-2.5 top-1/2 flex -translate-y-1/2 gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                      <span className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
                      <span className="h-2 w-2 rounded-full bg-[#28c840]" />
                    </div>

                    <div className="absolute left-14 top-1/2 flex -translate-y-1/2 items-center gap-2">
                      <span
                        className="h-2.5 w-px"
                        style={{ backgroundColor: browserFrameStyle.separator }}
                      />
                      <span
                        className="h-2 w-2 rounded-[2px] border"
                        style={{ borderColor: browserFrameStyle.icon }}
                      />
                      <span
                        className="text-[8px] leading-none"
                        style={{ color: browserFrameStyle.icon }}
                      >
                        {"<"}
                      </span>
                      <span
                        className="text-[8px] leading-none"
                        style={{ color: browserFrameStyle.icon }}
                      >
                        {">"}
                      </span>
                    </div>

                    <div
                      className="absolute left-[30%] top-1/2 z-10 -translate-y-1/2 rounded-full"
                      style={{
                        backgroundColor: browserFrameStyle.address,
                        border: `1px solid ${browserFrameStyle.separator}`,
                        height: "clamp(10px, 1.7vw, 16px)",
                        width: "42%",
                      }}
                    >
                      <span
                        className="absolute left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
                        style={{ backgroundColor: browserFrameStyle.addressText }}
                      />
                    </div>

                    <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-sm border"
                        style={{ borderColor: browserFrameStyle.icon }}
                      />
                      <span
                        className="h-2 w-2 rounded-sm border"
                        style={{ borderColor: browserFrameStyle.icon }}
                      />
                      <span
                        className="h-2 w-2 rounded-full border"
                        style={{ borderColor: browserFrameStyle.icon }}
                      />
                    </div>
                  </div>
                )}

                <div
                  className="min-h-0 overflow-hidden"
                  style={{
                    backgroundColor: "transparent",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt="Screenshot preview"
                    className="block"
                    style={{
                      borderRadius: "0px",
                      boxSizing: "border-box",
                      height: "auto",
                      imageRendering: "auto",
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                      objectPosition: "center",
                      width: "auto",
                    }}
                  />
                </div>
              </div>
            ) : imageSrc ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={(element) => { transformTargetRef.current = element; }}
                  draggable={false}
                  src={imageSrc}
                  alt="Screenshot preview"
                  className="block"
                  data-layout-effect="true"
                  data-layout-preset={settings.layoutPreset}
                  data-image-scale={safeImageScale}
                  data-shadow-style={settings.shadowStyle}
                  data-frame-style={settings.frameStyle}
                  style={{
                    borderRadius: `${innerImageRadiusPx}px`,
                    boxSizing: "border-box",
                    height: "auto",
                    imageRendering: "auto",
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                    objectPosition: "center",
                    width: "auto",
                    ...getLayoutPresetStyles(),
                    ...getScreenshotShadowStyles(),
                    ...getScreenshotWrapperStyles(),
                  }}
                />
              </>
            ) : (
              <div
                className="relative flex h-full w-full items-center justify-center overflow-hidden"
                style={{
                  borderRadius: `${borderRadius}px`,
                }}
              >
                <div
                  data-export-ignore="true"
                  className={`relative z-10 flex w-[88%] max-w-[430px] flex-col items-center text-center text-white transition-all duration-200 sm:w-[86%] ${isDragActive ? "scale-[1.01]" : ""
                    }`}
                >
                  <button
                    type="button"
                    onClick={open}
                    aria-label="Choose screenshot file"
                    className="relative flex h-8 w-8 items-center justify-center rounded-lg text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.72)] transition hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 sm:h-11 sm:w-11 sm:rounded-xl"
                  >
                    <UploadCloud className="h-6 w-6 stroke-[1.8] sm:h-8 sm:w-8" />
                  </button>

                  <button
                    type="button"
                    onClick={open}
                    className="relative mt-1 rounded text-[11px] font-bold leading-4 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:mt-2 sm:text-base sm:leading-6"
                    style={{ textShadow: "0 2px 8px rgba(0,0,0,0.78)" }}
                  >

                  </button>
                  <p className="mt-1 text-[10px] text-white/90 sm:text-xs">
                    Drop an image here or click to choose one.
                  </p>

                  <div className="relative mt-1.5 flex items-center gap-1.5 rounded-md bg-white/8 px-2 py-1 text-[10px] font-medium text-white/70 backdrop-blur-md sm:mt-2.5 sm:px-2.5 sm:py-1.5 sm:text-[11px]">
                    <span className="rounded bg-white/10 px-1.5 py-0.5 font-semibold leading-none text-white/90">
                      ⌘ / Ctrl + V
                    </span>

                  </div>

                  <div className="relative my-2 flex w-full max-w-[130px] items-center gap-2 text-[10px] font-medium text-white sm:my-4 sm:max-w-[180px] sm:gap-3 sm:text-[11px]">
                    <span className="h-px flex-1 bg-white/34" />
                    <span className="whitespace-nowrap">or capture a website</span>
                    <span className="h-px flex-1 bg-white/34" />
                  </div>

                  <form
                    className="relative flex w-full max-w-[320px] items-center gap-2 sm:max-w-[390px] sm:gap-2.5"
                    onSubmit={handleWebsiteCapture}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="flex h-8 min-w-0 flex-1 items-center rounded-lg border border-foreground/20 bg-background/45 px-2.5 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_14px_34px_rgba(0,0,0,0.28)] backdrop-blur-xl transition focus-within:border-foreground/40 focus-within:bg-background/58 focus-within:ring-1 focus-within:ring-foreground/20 sm:h-10 sm:rounded-xl sm:px-3">
                      <Globe2 className="mr-1.5 h-3.5 w-3.5 shrink-0 text-foreground/55 sm:mr-2 sm:h-4 sm:w-4" />
                      <input
                        type="text"
                        inputMode="url"
                        value={websiteUrl}
                        onChange={(event) => {
                          setWebsiteUrl(event.target.value);
                          setWebsiteCaptureError("");
                        }}
                        placeholder="Paste a website link"
                        aria-label="Website URL"
                        className="min-w-0 flex-1 bg-transparent text-xs font-medium text-foreground/90 outline-none placeholder:text-foreground/42 sm:text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isCapturingWebsite}
                      aria-label="Capture website screenshot"
                      className="flex h-8 w-9 shrink-0 items-center justify-center rounded-lg border border-foreground/20 bg-background/45 text-foreground/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_14px_34px_rgba(0,0,0,0.28)] backdrop-blur-xl transition hover:border-foreground/35 hover:bg-background/58 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60 sm:h-10 sm:w-11 sm:rounded-xl"
                    >
                      {isCapturingWebsite ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
                      ) : (
                        <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      )}
                    </button>
                  </form>

                  {websiteCaptureError ? (
                    <p className="mt-4 rounded-md border border-red-500/40 bg-black/45 px-3 py-2 text-sm font-medium text-red-300 shadow-[0_12px_34px_rgba(0,0,0,0.24)] backdrop-blur-xl">
                      {websiteCaptureError}
                    </p>
                  ) : null}
                </div>
              </div>
            )}
            {imageSrc && (
              <ScreenshotTransformControls
                key={`${imageSrc.slice(-32)}-${settings.browserStyle}`}
                target={transformTargetRef}
                settings={settings}
                style={getLayoutPresetStyles()}
                selected={imageSelected}
                onSelect={setImageSelected}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
