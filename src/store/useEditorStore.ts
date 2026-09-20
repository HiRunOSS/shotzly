import {create} from "zustand";
import {
  DEFAULT_LAYOUT_PRESET,
  LEGACY_LAYOUT_PRESET_MAP,
  isLayoutPresetId,
  type LayoutPresetId,
} from "@/constants/layoutPresets";

export type ScreenshotAspectRatio =
  | "16:9"
  | "3:2"
  | "4:3"
  | "5:4"
  | "1:1"
  | "4:5"
  | "3:4"
  | "2:3"
  | "9:16";

export type ScreenshotLayoutPreset = LayoutPresetId;
export type EditorMode = "code" | "screenshot";
export type TextLayer = {content: string; fontSize: number; color: string; opacity: number; fontFamily: "Inter" | "Arial" | "Georgia" | "monospace"; align: "left" | "center" | "right"};
export type GraphicLayer = {kind: "rect" | "circle" | "arrow" | "emoji"; color: string; opacity: number; strokeWidth: number; filled: boolean; emoji: string};
export type CanvasImage = {id: string; src: string; name: string; x: number; y: number; width: number; rotation: number; radius: number; shadow: boolean; settings?: ScreenshotSettings; textLayer?: TextLayer; graphicLayer?: GraphicLayer};
export type CodeWindowStyle = "plain" | "macos" | "windows";
export type ScreenshotBrowserStyle =
  | "none"
  | "safari"
  | "safari-dark"
  | "chrome"
  | "chrome-dark";

export interface ScreenshotSettings {
  borderStyle: "sharp" | "curved" | "round";
  cornerRadius: number;
  borderWidth: number;
  borderColor: string;
  imageScale: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  backgroundBlur: number;
  shadowStyle: "none" | "hug" | "soft" | "strong";
  layoutPreset: ScreenshotLayoutPreset;
  aspectRatio: ScreenshotAspectRatio;
  frameStyle:
    | "default"
    | "glass"
    | "border"
    | "dashed"
    | "dotted";
  browserStyle: ScreenshotBrowserStyle;
}

type ScreenshotFrameStyle = ScreenshotSettings["frameStyle"];

interface EditorStore {
  selectedCanvasImageId: string | null;
  selectCanvasImage: (id: string | null) => void;
  canvasImages: CanvasImage[];
  setCanvasImages: (images: CanvasImage[]) => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  // Active editor
  editorMode: EditorMode;
  setEditorMode: (editorMode: EditorMode) => void;

  // Code
  code: string;
  setCode: (code: string) => void;

  // Font Size
  fontSize: number;
  setFontSize: (fontSize: number) => void;

  // Code snippet padding
  codePadding: number;
  setCodePadding: (codePadding: number) => void;

  // Code window frame
  codeWindowStyle: CodeWindowStyle;
  setCodeWindowStyle: (codeWindowStyle: CodeWindowStyle) => void;

  // Code window title
  codeWindowTitle: string;
  setCodeWindowTitle: (codeWindowTitle: string) => void;

  // Code gradient
  codeGradient: string;
  setCodeGradient: (gradient: string) => void;

  // Screenshot gradient
  screenshotGradient: string;
  setScreenshotGradient: (gradient: string) => void;

  // Background
  isBackgroundHidden: boolean;
  setIsBackgroundHidden: (isBackgroundHidden: boolean) => void;

  // Line Numbers
  showLineNumbers: boolean;
  setShowLineNumbers: (showLineNumbers: boolean) => void;

  // Code theme preset
  codeThemePreset: string;
  setCodeThemePreset: (codeThemePreset: string) => void;

  // Code language
  codeLanguage: string;
  setCodeLanguage: (codeLanguage: string) => void;

  // Uploaded image (screenshot)
  uploadedImage: string;
  setUploadedImage: (image: string) => void;

  // Screenshot settings
  screenshotSettings: ScreenshotSettings;
  setScreenshotSettings: (settings: ScreenshotSettings) => void;

  // Export Loading
  isExporting: boolean;
  setIsExporting: (isExporting: boolean) => void;

  // Preview Ref
  previewRef: HTMLDivElement | null;
  setPreviewRef: (ref: HTMLDivElement | null) => void;

  // Client hydration
  hydrateFromStorage: () => void;
}

type PersistedEditorState = {
  canvasImages: CanvasImage[];
  editorMode: EditorMode;
  code: string;
  fontSize: number;
  codePadding: number;
  codeWindowStyle: CodeWindowStyle;
  codeWindowTitle: string;
  codeGradient: string;
  screenshotGradient: string;
  isBackgroundHidden: boolean;
  showLineNumbers: boolean;
  codeThemePreset: string;
  codeLanguage: string;
  uploadedImage: string;
  screenshotSettings: ScreenshotSettings;
};

const DEFAULT_CODE =
  'function greetUser(name) {\n  const cleanName = name.trim();\n  if (!cleanName) return "Hello, guest!";\n  return `Hello, ${cleanName}!`;\n}\n\ngreetUser("Arun");';
const PREVIOUS_PREMIUM_DEFAULT_CODE =
  "function leftPad(str: string, len: number, ch: string = ' ') {\n  let pad = ''\n\n  if (typeof len !== 'number') throw new TypeError('Expected a number')\n\n  while (pad.length + str.length < len) {\n    pad += ch\n  }\n\n  return pad + str\n}";
const DEFAULT_GRADIENT =
  "radial-gradient( circle farthest-corner at 10% 20%,  rgba(56,207,191,1) 0%, rgba(10,70,147,1) 90.2% )";
const PREVIOUS_MACOS_DEFAULT_GRADIENT =
  "center / cover no-repeat url('/backgrounds/macos/macos-gold.svg')";
const PREVIOUS_PREMIUM_DEFAULT_GRADIENT =
  "radial-gradient(circle at 18% 12%, rgba(98, 224, 213, 0.92) 0%, rgba(42, 149, 151, 0.96) 38%, rgba(34, 40, 68, 1) 100%)";
const PREVIOUS_SCREENSHOT_DEFAULT_GRADIENT =
  "center / cover no-repeat url('/backgrounds/macos/mac-bg-2.jpg')";
const DEFAULT_SCREENSHOT_GRADIENT =
  "center / cover no-repeat url('/backgrounds/macos/mac-bg-7.webp')";
const upgradeMacBackground = (background: string) =>
  background.replace(
    /\/backgrounds\/macos\/(mac-bg-\d+)\.(?:png|jpe?g)(?=['"]\))/g,
    "/backgrounds/macos/$1.webp",
  );
const STORAGE_KEY = "shotzly-editor-state";
const PERSIST_DEBOUNCE_MS = 250;
const MAX_PERSISTED_IMAGE_SIZE_BYTES = 12 * 1024 * 1024;

const DEFAULT_SCREENSHOT_SETTINGS: ScreenshotSettings = {
  borderStyle: "curved",
  cornerRadius: 16,
  borderWidth: 4,
  borderColor: "#ffffff",
  imageScale: 100,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
  backgroundBlur: 0,
  shadowStyle: "none",
  layoutPreset: DEFAULT_LAYOUT_PRESET,
  aspectRatio: "16:9",
  frameStyle: "glass",
  browserStyle: "none",
};

const isValidLayoutPreset = (
  value: unknown,
): value is ScreenshotLayoutPreset => {
  return isLayoutPresetId(value);
};

const normalizeFrameStyle = (value: unknown): ScreenshotFrameStyle => {
  if (value === "glass-light" || value === "glass-dark") return "glass";
  if (value === "border-dark") return "border";
  if (value === "outline") {
    return "border";
  }

  if (value === "pink-sticker") {
    return "dashed";
  }

  if (
    value === "default" ||
    value === "glass" ||
    value === "border" ||
    value === "dashed" ||
    value === "dotted"
  ) {
    return value;
  }

  return DEFAULT_SCREENSHOT_SETTINGS.frameStyle;
};

const normalizeBrowserStyle = (value: unknown): ScreenshotBrowserStyle => {
  if (
    value === "none" ||
    value === "safari" ||
    value === "safari-dark" ||
    value === "chrome" ||
    value === "chrome-dark"
  ) {
    return value;
  }

  return DEFAULT_SCREENSHOT_SETTINGS.browserStyle;
};

const normalizeScreenshotSettings = (
  settings?: Partial<ScreenshotSettings>,
): ScreenshotSettings => {
  const rawBorderWidth = Number(settings?.borderWidth);
  const rawCornerRadius = Number(settings?.cornerRadius);
  const rawImageScale = Number(settings?.imageScale);
  const rawBackgroundBlur = Number(settings?.backgroundBlur);
  const imageScale =
    Number.isFinite(rawImageScale) && rawImageScale >= 1 && rawImageScale <= 150
      ? Math.round(rawImageScale)
      : DEFAULT_SCREENSHOT_SETTINGS.imageScale;

  return {
    ...DEFAULT_SCREENSHOT_SETTINGS,
    ...(settings ?? {}),
    borderWidth: Number.isFinite(rawBorderWidth)
      ? Math.max(0, Math.min(24, rawBorderWidth))
      : DEFAULT_SCREENSHOT_SETTINGS.borderWidth,
    borderColor: typeof settings?.borderColor === "string" && /^#[0-9a-fA-F]{6}$/.test(settings.borderColor)
      ? settings.borderColor
      : DEFAULT_SCREENSHOT_SETTINGS.borderColor,
    cornerRadius: Number.isFinite(rawCornerRadius)
      ? Math.max(0, Math.min(64, rawCornerRadius))
      : (() => {
          switch (settings?.borderStyle) {
            case "sharp":
              return 0;
            case "round":
              return 28;
            case "curved":
            default:
              return DEFAULT_SCREENSHOT_SETTINGS.cornerRadius;
          }
        })(),
    imageScale,
    offsetX: Number.isFinite(settings?.offsetX) ? Math.max(-45, Math.min(45, settings!.offsetX!)) : 0,
    offsetY: Number.isFinite(settings?.offsetY) ? Math.max(-45, Math.min(45, settings!.offsetY!)) : 0,
    rotation: Number.isFinite(settings?.rotation) ? ((settings!.rotation! % 360) + 360) % 360 : 0,
    backgroundBlur: Number.isFinite(rawBackgroundBlur)
      ? Math.max(0, Math.min(24, rawBackgroundBlur))
      : DEFAULT_SCREENSHOT_SETTINGS.backgroundBlur,
    frameStyle: normalizeFrameStyle(settings?.frameStyle),
    browserStyle: normalizeBrowserStyle(
      settings?.browserStyle ?? settings?.frameStyle,
    ),
    layoutPreset: (() => {
      const rawLayout = settings?.layoutPreset;
      if (isValidLayoutPreset(rawLayout)) {
        return rawLayout;
      }
      if (
        typeof rawLayout === "string" &&
        LEGACY_LAYOUT_PRESET_MAP[rawLayout]
      ) {
        return LEGACY_LAYOUT_PRESET_MAP[rawLayout];
      }
      return DEFAULT_SCREENSHOT_SETTINGS.layoutPreset;
    })(),
  };
};

const getStoredState = (): Partial<PersistedEditorState> | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to load state from localStorage:", error);
    return null;
  }
};

const normalizeEditorMode = (value: unknown): EditorMode => {
  return value === "screenshot" || value === "code" ? value : "screenshot";
};

const normalizeCodeWindowStyle = (value: unknown): CodeWindowStyle => {
  return value === "macos" || value === "windows" || value === "plain"
    ? value
    : "macos";
};

export const useEditorStore = create<EditorStore>((rawSet, get) => {
  const past: PersistedEditorState[] = [];
  const future: PersistedEditorState[] = [];
  let lastEditKey = "";
  let lastEditAt = 0;
  const snapshot = (): PersistedEditorState => {
    const state = get();
    return Object.fromEntries(
      Object.keys(getDefaultPersistedState()).map((key) => [key, state[key as keyof PersistedEditorState]]),
    ) as PersistedEditorState;
  };
  const set: typeof rawSet = (patch) => {
    // Hydration and transient UI updates must not enter document history.
    if (typeof patch === "function") {
      rawSet(patch);
      return;
    }
    const current = snapshot();
    const keys = Object.keys(patch).filter((key) => key in current && key !== "editorMode");
    if (keys.some((key) => JSON.stringify(current[key as keyof PersistedEditorState]) !== JSON.stringify(patch[key as keyof EditorStore]))) {
      const editKey = keys.sort().join(",");
      const now = Date.now();
      // Coalesce continuous slider/typing updates into one undo step.
      if (editKey !== lastEditKey || now - lastEditAt > 500 || editKey === "uploadedImage") {
        past.push(current);
        if (past.length > 40) past.shift();
      }
      lastEditKey = editKey;
      lastEditAt = now;
      future.length = 0;
      rawSet({...patch, canUndo: past.length > 0, canRedo: false});
    } else {
      rawSet(patch);
    }
  };
  let persistedCache: PersistedEditorState | null = null;
  let persistTimeout: ReturnType<typeof setTimeout> | null = null;
  let pendingPersistPatch: Partial<PersistedEditorState> = {};

  const getDefaultPersistedState = (): PersistedEditorState => ({
    canvasImages: [],
    editorMode: "screenshot",
    code: DEFAULT_CODE,
    fontSize: 14,
    codePadding: 64,
    codeWindowStyle: "macos",
    codeWindowTitle: "",
    codeGradient: DEFAULT_GRADIENT,
    screenshotGradient: DEFAULT_SCREENSHOT_GRADIENT,
    isBackgroundHidden: false,
    showLineNumbers: false,
    codeThemePreset: "shotzly-midnight",
    codeLanguage: "javascript",
    uploadedImage: "",
    screenshotSettings: DEFAULT_SCREENSHOT_SETTINGS,
  });

  const ensurePersistedCache = (): PersistedEditorState => {
    if (persistedCache) {
      return persistedCache;
    }

    const stored = getStoredState();
    const defaults = getDefaultPersistedState();
    persistedCache = {
      ...defaults,
      ...stored,
      screenshotSettings: normalizeScreenshotSettings(
        stored?.screenshotSettings,
      ),
    };
    return persistedCache;
  };

  const writePersistedState = (nextState: PersistedEditorState) => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch (error) {
      console.error("Failed to save state to localStorage:", error);
    }
  };

  const saveToLocalStorage = (
    patch: Partial<PersistedEditorState>,
    options: {debounce?: boolean} = {},
  ) => {
    const normalizedScreenshotSettings = patch.screenshotSettings
      ? normalizeScreenshotSettings({
          ...ensurePersistedCache().screenshotSettings,
          ...patch.screenshotSettings,
        })
      : undefined;
    const nextState: PersistedEditorState = {
      ...ensurePersistedCache(),
      ...patch,
      screenshotSettings:
        normalizedScreenshotSettings ?? ensurePersistedCache().screenshotSettings,
    };
    persistedCache = nextState;

    if (!options.debounce) {
      writePersistedState(nextState);
      return;
    }

    pendingPersistPatch = {...pendingPersistPatch, ...patch};
    if (persistTimeout) {
      clearTimeout(persistTimeout);
    }
    persistTimeout = setTimeout(() => {
      const mergedState: PersistedEditorState = {
        ...ensurePersistedCache(),
        ...pendingPersistPatch,
        screenshotSettings: pendingPersistPatch.screenshotSettings
          ? normalizeScreenshotSettings({
              ...ensurePersistedCache().screenshotSettings,
              ...pendingPersistPatch.screenshotSettings,
            })
          : ensurePersistedCache().screenshotSettings,
      };
      persistedCache = mergedState;
      writePersistedState(mergedState);
      pendingPersistPatch = {};
      persistTimeout = null;
    }, PERSIST_DEBOUNCE_MS);
  };

  return {
    canvasImages: [],
    selectedCanvasImageId: null,
    selectCanvasImage: (selectedCanvasImageId) => {
      const images = get().canvasImages;
      const image = images.find((item) => item.id === selectedCanvasImageId);
      if (image && images[images.length - 1]?.id !== image.id) {
        const canvasImages = [...images.filter((item) => item.id !== image.id), image];
        saveToLocalStorage({canvasImages});
        set({canvasImages});
      }
      rawSet({selectedCanvasImageId});
    },
    setCanvasImages: (canvasImages) => {
      const patch = {canvasImages};
      const selected = get().selectedCanvasImageId;
      const selectedCanvasImageId = selected && !canvasImages.some((image) => image.id === selected)
        ? (canvasImages[canvasImages.length - 1]?.id ?? null)
        : selected;
      saveToLocalStorage(patch);
      set({...patch, selectedCanvasImageId});
      lastEditKey = "";
    },
    canUndo: false,
    canRedo: false,
    undo: () => {
      const previous = past.pop();
      if (!previous) return;
      future.push(snapshot());
      if (persistTimeout) clearTimeout(persistTimeout);
      pendingPersistPatch = {};
      lastEditKey = "";
      persistedCache = previous;
      writePersistedState(previous);
      rawSet({...previous, selectedCanvasImageId: previous.canvasImages.some((image) => image.id === get().selectedCanvasImageId) ? get().selectedCanvasImageId : (previous.canvasImages[previous.canvasImages.length - 1]?.id ?? null), canUndo: past.length > 0, canRedo: true});
    },
    redo: () => {
      const next = future.pop();
      if (!next) return;
      past.push(snapshot());
      if (persistTimeout) clearTimeout(persistTimeout);
      pendingPersistPatch = {};
      lastEditKey = "";
      persistedCache = next;
      writePersistedState(next);
      rawSet({...next, selectedCanvasImageId: next.canvasImages.some((image) => image.id === get().selectedCanvasImageId) ? get().selectedCanvasImageId : (next.canvasImages[next.canvasImages.length - 1]?.id ?? null), canUndo: true, canRedo: future.length > 0});
    },
    // Active editor state
    editorMode: "screenshot",
    setEditorMode: (editorMode) => {
      const newState = {editorMode};
      saveToLocalStorage(newState);
      set(newState);
    },

    // Code state
    code: DEFAULT_CODE,
    setCode: (code) => {
      const newState = {code};
      saveToLocalStorage(newState, {debounce: true});
      set(newState);
    },

    // Font size state
    fontSize: 14,
    setFontSize: (fontSize) => {
      const newState = {fontSize};
      saveToLocalStorage(newState);
      set(newState);
    },

    // Code snippet padding state
    codePadding: 64,
    setCodePadding: (codePadding) => {
      const newState = {codePadding};
      saveToLocalStorage(newState);
      set(newState);
    },

    // Code window frame state
    codeWindowStyle: "macos",
    setCodeWindowStyle: (codeWindowStyle) => {
      const newState = {codeWindowStyle};
      saveToLocalStorage(newState);
      set(newState);
    },

    // Code window title state
    codeWindowTitle: "",
    setCodeWindowTitle: (codeWindowTitle) => {
      const newState = {codeWindowTitle};
      saveToLocalStorage(newState);
      set(newState);
    },

    // Code gradient state
    codeGradient: DEFAULT_GRADIENT,
    setCodeGradient: (gradient) => {
      const newState = {codeGradient: gradient};
      saveToLocalStorage(newState, {debounce: true});
      set(newState);
    },

    // Screenshot gradient state
    screenshotGradient: DEFAULT_SCREENSHOT_GRADIENT,
    setScreenshotGradient: (gradient) => {
      const newState = {screenshotGradient: gradient};
      saveToLocalStorage(newState, {debounce: true});
      set(newState);
    },

    // Background state
    isBackgroundHidden: false,
    setIsBackgroundHidden: (isBackgroundHidden) => {
      const newState = {isBackgroundHidden};
      saveToLocalStorage(newState);
      set(newState);
    },

    // Line numbers state
    showLineNumbers: false,
    setShowLineNumbers: (showLineNumbers) => {
      const newState = {showLineNumbers};
      saveToLocalStorage(newState);
      set(newState);
    },

    // Code theme preset state
    codeThemePreset: "shotzly-midnight",
    setCodeThemePreset: (codeThemePreset) => {
      const newState = {codeThemePreset};
      saveToLocalStorage(newState);
      set(newState);
    },

    // Code language state
    codeLanguage: "javascript",
    setCodeLanguage: (codeLanguage) => {
      const newState = {codeLanguage};
      saveToLocalStorage(newState);
      set(newState);
    },

    // Uploaded image state
    uploadedImage: "",
    setUploadedImage: (uploadedImage) => {
      if (uploadedImage.length > MAX_PERSISTED_IMAGE_SIZE_BYTES * 1.37) {
        console.warn(
          "Uploaded image is too large to persist safely; ignoring save.",
        );
        set({uploadedImage});
        return;
      }
      const newState = {uploadedImage};
      saveToLocalStorage(newState);
      set(newState);
    },

    screenshotSettings: DEFAULT_SCREENSHOT_SETTINGS,
    setScreenshotSettings: (screenshotSettings) => {
      const newState = {
        screenshotSettings: normalizeScreenshotSettings(screenshotSettings),
      };
      saveToLocalStorage(newState);
      set(newState);
    },

    // Export loading state
    isExporting: false,
    setIsExporting: (isExporting) => set({isExporting}),

    // Preview ref state
    previewRef: null,
    setPreviewRef: (previewRef) => set({previewRef}),

    hydrateFromStorage: () => {
      const storedState = getStoredState();
      if (!storedState) return;
      const normalizedScreenshotSettings = storedState.screenshotSettings
        ? normalizeScreenshotSettings({
            ...DEFAULT_SCREENSHOT_SETTINGS,
            ...storedState.screenshotSettings,
          })
        : DEFAULT_SCREENSHOT_SETTINGS;
      const normalizedPersistedState: PersistedEditorState = {
        ...getDefaultPersistedState(),
        ...storedState,
        editorMode: normalizeEditorMode(storedState.editorMode),
        code:
          storedState.code === PREVIOUS_PREMIUM_DEFAULT_CODE
            ? DEFAULT_CODE
            : (storedState.code ?? DEFAULT_CODE),
        codeGradient: upgradeMacBackground(
          storedState.codeGradient === PREVIOUS_PREMIUM_DEFAULT_GRADIENT ||
          storedState.codeGradient === PREVIOUS_MACOS_DEFAULT_GRADIENT
            ? DEFAULT_GRADIENT
            : (storedState.codeGradient ?? DEFAULT_GRADIENT),
        ),
        showLineNumbers:
          storedState.code === PREVIOUS_PREMIUM_DEFAULT_CODE &&
          storedState.showLineNumbers === true
            ? false
            : (storedState.showLineNumbers ?? false),
        codeLanguage:
          storedState.code === PREVIOUS_PREMIUM_DEFAULT_CODE &&
          storedState.codeLanguage === "typescript"
            ? "javascript"
            : (storedState.codeLanguage ?? "javascript"),
        codeWindowStyle: normalizeCodeWindowStyle(
          storedState.codeWindowStyle,
        ),
        codeWindowTitle: storedState.codeWindowTitle ?? "",
        screenshotSettings: normalizedScreenshotSettings,
      };

      set((state) => ({
        ...state,
        canvasImages: Array.isArray(storedState.canvasImages) ? storedState.canvasImages.filter((image) => image && typeof image.src === "string" && image.src.startsWith("data:image/") && typeof image.id === "string" && [image.x, image.y, image.width, image.rotation, image.radius].every(Number.isFinite)).slice(0, 8) : [],
        editorMode: normalizedPersistedState.editorMode,
        code: normalizedPersistedState.code,
        fontSize: storedState.fontSize ?? state.fontSize,
        codePadding: storedState.codePadding ?? state.codePadding,
        codeWindowStyle: normalizedPersistedState.codeWindowStyle,
        codeWindowTitle: normalizedPersistedState.codeWindowTitle,
        codeGradient: normalizedPersistedState.codeGradient,
        screenshotGradient: upgradeMacBackground(
          storedState.screenshotGradient === PREVIOUS_SCREENSHOT_DEFAULT_GRADIENT
            ? DEFAULT_SCREENSHOT_GRADIENT
            : (storedState.screenshotGradient ?? state.screenshotGradient),
        ),
        isBackgroundHidden:
          storedState.isBackgroundHidden ?? state.isBackgroundHidden,
        showLineNumbers: normalizedPersistedState.showLineNumbers,
        codeThemePreset: storedState.codeThemePreset ?? state.codeThemePreset,
        codeLanguage: normalizedPersistedState.codeLanguage,
        uploadedImage: storedState.uploadedImage ?? state.uploadedImage,
        screenshotSettings: normalizedScreenshotSettings,
      }));

      persistedCache = normalizedPersistedState;
      writePersistedState(normalizedPersistedState);
    },
  };
});
