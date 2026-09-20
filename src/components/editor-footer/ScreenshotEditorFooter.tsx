"use client";

import {useEffect, useRef, useState, type CSSProperties} from "react";
import {Button} from "../ui/button";
import {Label} from "../ui/label";
import {ChevronDown} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {useEditorStore} from "@/store/useEditorStore";
import {LAYOUT_PRESET_CATEGORIES} from "@/constants/layoutPresets";
import BackgroundSelect from "./BackgroundSelect";
import type {
  ScreenshotAspectRatio,
  ScreenshotBrowserStyle,
  ScreenshotLayoutPreset,
  ScreenshotSettings,
} from "@/store/useEditorStore";

interface ScreenshotEditorFooterProps {
  settings: ScreenshotSettings;
  onSettingsChange: (nextSettings: ScreenshotSettings) => void;
}

type ScreenshotFrameStyle = ScreenshotSettings["frameStyle"];

const BROWSER_OPTIONS: Array<{
  value: ScreenshotBrowserStyle;
  label: string;
  variant: "none" | "light" | "dark";
}> = [
  {value: "none", label: "None", variant: "none"},
  {value: "safari", label: "Safari", variant: "light"},
  {value: "safari-dark", label: "Safari Dark", variant: "dark"},
  {value: "chrome", label: "Chrome", variant: "light"},
  {value: "chrome-dark", label: "Chrome Dark", variant: "dark"},
];

const SCREENSHOT_ASPECT_OPTIONS: Array<{
  value: ScreenshotAspectRatio;
  label: string;
}> = [
  {value: "16:9", label: "16:9"},
  {value: "3:2", label: "3:2"},
  {value: "4:3", label: "4:3"},
  {value: "5:4", label: "5:4"},
  {value: "1:1", label: "1:1"},
  {value: "4:5", label: "4:5"},
  {value: "3:4", label: "3:4"},
  {value: "2:3", label: "2:3"},
  {value: "9:16", label: "9:16"},
];

const clampCornerRadius = (value: number) => {
  return Number.isFinite(value) ? Math.max(0, Math.min(64, value)) : 16;
};

const CORNER_PRESETS: Array<{
  label: string;
  value: "sharp" | "curved" | "round";
  radius: number;
}> = [
  {label: "Sharp", value: "sharp", radius: 0},
  {label: "Curved", value: "curved", radius: 16},
  {label: "Round", value: "round", radius: 28},
];

const FRAME_OPTIONS: Array<{
  value: ScreenshotFrameStyle;
  label: string;
}> = [
  {value: "default", label: "None"},
  {value: "glass", label: "Glass"},
  {value: "border", label: "Border"},
  {value: "dotted", label: "Dotted"},
  {value: "dashed", label: "Dashed"},
];

const clampBorderWidth = (value: number) => {
  return Number.isFinite(value) ? Math.max(0, Math.min(24, value)) : 0;
};

const getFrameLabel = (value: ScreenshotFrameStyle) => {
  return (
    FRAME_OPTIONS.find((option) => option.value === value)?.label ?? "None"
  );
};

function BrowserPreview({variant}: {variant: "none" | "light" | "dark"}) {
  if (variant === "none") {
    return (
      <span className="h-4 w-7 rounded-[3px] border border-dashed border-gray-400 dark:border-gray-500" />
    );
  }

  const isDark = variant === "dark";

  return (
    <span
      className={`h-4 w-7 overflow-hidden rounded-[3px] border ${
        isDark
          ? "border-white/20 bg-[#121212]"
          : "border-black/15 bg-white"
      }`}
    >
      <span
        className={`flex h-1.5 items-center gap-0.5 px-1 ${
          isDark ? "bg-[#303033]" : "bg-gray-100"
        }`}
      >
        <span className="h-0.5 w-0.5 rounded-full bg-[#ff5f57]" />
        <span className="h-0.5 w-0.5 rounded-full bg-[#ffbd2e]" />
        <span className="h-0.5 w-0.5 rounded-full bg-[#28c840]" />
      </span>
    </span>
  );
}

export default function ScreenshotEditorFooter({
  settings,
  onSettingsChange,
}: ScreenshotEditorFooterProps) {
  const gradient = useEditorStore((state) => state.screenshotGradient);
  const setGradient = useEditorStore((state) => state.setScreenshotGradient);

  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState(false);
  const [isFrameOpen, setIsFrameOpen] = useState(false);
  const [isFixedFrameDropdown, setIsFixedFrameDropdown] = useState(false);
  const [frameDropdownStyle, setFrameDropdownStyle] = useState<CSSProperties>(
    {},
  );
  const frameTriggerRef = useRef<HTMLButtonElement | null>(null);
  const frameDropdownRef = useRef<HTMLDivElement | null>(null);
  const hasVisibleFrame = settings.frameStyle !== "default";
  const safeCornerRadius = clampCornerRadius(settings.cornerRadius);
  const safeBorderWidth = clampBorderWidth(settings.borderWidth);
  const safeBorderColor = /^#[0-9a-fA-F]{6}$/.test(settings.borderColor ?? "")
    ? settings.borderColor
    : "#ffffff";

  useEffect(() => {
    if (!isFrameOpen) {
      return;
    }

    const updateFrameDropdownPosition = () => {
      const shouldUseFixedDropdown = window.innerWidth < 1024;
      setIsFixedFrameDropdown(shouldUseFixedDropdown);

      if (!shouldUseFixedDropdown) {
        setFrameDropdownStyle({});
        return;
      }

      const triggerRect = frameTriggerRef.current?.getBoundingClientRect();

      if (!triggerRect) {
        return;
      }

      const menuWidth = 288;
      const viewportPadding = 8;
      const left = Math.min(
        Math.max(triggerRect.left, viewportPadding),
        window.innerWidth - menuWidth - viewportPadding,
      );

      setFrameDropdownStyle({
        bottom: window.innerHeight - triggerRect.top + 8,
        left,
        width: menuWidth,
      });
    };

    updateFrameDropdownPosition();
    window.addEventListener("resize", updateFrameDropdownPosition);
    window.addEventListener("scroll", updateFrameDropdownPosition, true);

    return () => {
      window.removeEventListener("resize", updateFrameDropdownPosition);
      window.removeEventListener("scroll", updateFrameDropdownPosition, true);
    };
  }, [isFrameOpen]);

  useEffect(() => {
    if (!isFrameOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (
        !frameTriggerRef.current?.contains(target) &&
        !frameDropdownRef.current?.contains(target)
      ) {
        setIsFrameOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isFrameOpen]);

  return (
    <section className="fixed inset-x-0 bottom-0 z-10 flex w-full justify-center">
      <div className="mx-auto flex w-full max-w-7xl justify-center px-2 sm:px-0">
        <div className="flex w-full flex-col items-center rounded-t-2xl border border-black/10 bg-white/30 px-2 py-2 text-black backdrop-blur-2xl dark:border-white/10 dark:bg-[#111010]/85 dark:text-gray-100 sm:min-h-20 sm:px-6 sm:py-4">
          <div className="scrollbar-hide flex w-full items-end justify-start gap-3 overflow-x-auto pb-1 lg:justify-between lg:overflow-visible">
            <div className="w-20 shrink-0 space-y-1">
              <Label
                htmlFor="screenshot-gradient"
                className="text-xs text-gray-800 dark:text-gray-200/90"
              >
                Background
              </Label>
              <BackgroundSelect
                id="screenshot-gradient"
                value={gradient}
                onChange={setGradient}
                blurValue={settings.backgroundBlur}
                onBlurChange={(backgroundBlur) =>
                  onSettingsChange({...settings, backgroundBlur})
                }
              />
            </div>

            <div className="w-36 shrink-0 space-y-1">
              <Label
                htmlFor="screenshot-frame"
                className="text-xs text-gray-800 dark:text-gray-200/90"
              >
                Frame
              </Label>
              <div className="relative">
                <button
                  ref={frameTriggerRef}
                  id="screenshot-frame"
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={isFrameOpen}
                  onClick={() => setIsFrameOpen((open) => !open)}
                  className="flex h-7 w-full items-center justify-between rounded-md border border-black/30 bg-white/80 px-3 text-xs font-medium text-gray-900 dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <span>{getFrameLabel(settings.frameStyle)}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-gray-500 transition-transform dark:text-gray-300 ${
                      isFrameOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isFrameOpen ? (
                  <div
                    ref={frameDropdownRef}
                    className={`z-50 rounded-lg border border-black/10 bg-white p-3 shadow-2xl shadow-black/20 dark:border-white/10 dark:bg-[#111010] dark:shadow-black/60 ${
                      isFixedFrameDropdown
                        ? "fixed"
                        : "absolute bottom-full left-0 mb-2 w-72"
                    }`}
                    style={isFixedFrameDropdown ? frameDropdownStyle : undefined}
                    onPointerDown={(event) => event.stopPropagation()}
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {FRAME_OPTIONS.map((option) => {
                        const isActive = settings.frameStyle === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => {
                              onSettingsChange({
                                ...settings,
                                frameStyle: option.value,
                              });
                            }}
                            className={`flex h-16 flex-col items-center justify-center gap-1 rounded-md border text-[11px] transition ${
                              isActive
                                ? "border-orange-500 bg-orange-500/10 text-gray-950 dark:text-white"
                                : "border-black/10 text-gray-700 hover:bg-gray-100 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
                            }`}
                          >
                            <span className="flex h-7 w-9 items-center justify-center rounded bg-gray-200 dark:bg-[#1d2028]">
                              <span className="h-5 w-6 rounded-[3px] bg-white dark:bg-gray-100" style={{border: option.value === "default" ? "none" : `2px ${option.value === "dashed" || option.value === "dotted" ? option.value : "solid"} ${option.value === "glass" ? `${safeBorderColor}99` : safeBorderColor}`}} />
                            </span>
                            <span>{option.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {hasVisibleFrame ? (
                      <div className="mt-4 space-y-2 border-t border-black/10 pt-3 dark:border-white/10">
                        <label className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-200">
                          <span>Color</span>
                          <span className="flex items-center gap-2">
                            <span className="font-mono text-gray-500 dark:text-gray-400">{safeBorderColor.toUpperCase()}</span>
                            <input type="color" value={safeBorderColor} aria-label="Border color" onChange={(event) => onSettingsChange({...settings, borderColor: event.target.value})} className="h-7 w-8 cursor-pointer rounded border border-black/20 bg-transparent p-0.5 dark:border-white/20" />
                          </span>
                        </label>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                            Border Size
                          </span>
                          <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400">
                            {safeBorderWidth}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={24}
                          step={1}
                          value={safeBorderWidth}
                          aria-label="Border size"
                          onChange={(event) =>
                            onSettingsChange({
                              ...settings,
                              borderWidth: clampBorderWidth(
                                Number(event.target.value),
                              ),
                            })
                          }
                          className="h-1.5 w-full accent-gray-950 dark:accent-gray-100"
                        />
                      </div>
                    ) : null}

                    <div className="mt-4 border-t border-black/10 pt-3 dark:border-white/10">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                          Radius
                        </span>
                        <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400">
                          {safeCornerRadius}px
                        </span>
                      </div>
                      <div className="mb-3 grid grid-cols-3 gap-2">
                        {CORNER_PRESETS.map((preset) => {
                          const isActive = safeCornerRadius === preset.radius;

                          return (
                            <button
                              key={preset.value}
                              type="button"
                              aria-pressed={isActive}
                              onClick={() => {
                                onSettingsChange({
                                  ...settings,
                                  borderStyle: preset.value,
                                  cornerRadius: preset.radius,
                                });
                              }}
                              className={`rounded-md px-2 py-1.5 text-center text-[11px] transition ${
                                isActive
                                  ? "bg-gray-950 text-white ring-1 ring-gray-950 dark:bg-white dark:text-black dark:ring-white"
                                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
                              }`}
                            >
                              {preset.label}
                            </button>
                          );
                        })}
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={64}
                        step={1}
                        value={safeCornerRadius}
                        aria-label="Radius"
                        onChange={(event) => {
                          const nextRadius = clampCornerRadius(
                            Number(event.target.value),
                          );
                          const matchingPreset = CORNER_PRESETS.find(
                            (preset) => preset.radius === nextRadius,
                          );

                          onSettingsChange({
                            ...settings,
                            borderStyle:
                              matchingPreset?.value ?? settings.borderStyle,
                            cornerRadius: nextRadius,
                          });
                        }}
                        className="h-1.5 w-full accent-gray-950 dark:accent-gray-100"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="w-32 shrink-0 space-y-1">
              <Label
                htmlFor="screenshot-layout"
                className="text-xs text-gray-800 dark:text-gray-200/90"
              >
                Layout
              </Label>
              <Select
                value={settings.layoutPreset}
                onValueChange={(value: ScreenshotLayoutPreset) =>
                  onSettingsChange({...settings, layoutPreset: value})
                }
              >
                <SelectTrigger
                  id="screenshot-layout"
                  className="h-7 w-full border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  {LAYOUT_PRESET_CATEGORIES.map((category, categoryIndex) => (
                    <SelectGroup key={category.id}>
                      <SelectLabel className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                        {category.name}
                      </SelectLabel>
                      {category.presets.map((preset) => (
                        <SelectItem
                          key={preset.id}
                          value={preset.id as ScreenshotLayoutPreset}
                        >
                          {preset.name}
                        </SelectItem>
                      ))}
                      {categoryIndex < LAYOUT_PRESET_CATEGORIES.length - 1 ? (
                        <SelectSeparator className="mx-2 my-1 bg-black/10 dark:bg-white/10" />
                      ) : null}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-28 shrink-0 space-y-1">
              <Label
                htmlFor="screenshot-shadow"
                className="text-xs text-gray-800 dark:text-gray-200/90"
              >
                Shadow
              </Label>
              <Select
                value={settings.shadowStyle}
                onValueChange={(value: "none" | "hug" | "soft" | "strong") =>
                  onSettingsChange({...settings, shadowStyle: value})
                }
              >
                <SelectTrigger
                  id="screenshot-shadow"
                  className="h-7 w-full border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="hug">Hug</SelectItem>
                  <SelectItem value="soft">Soft</SelectItem>
                  <SelectItem value="strong">Strong</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-32 shrink-0 space-y-1">
              <Label
                htmlFor="screenshot-browser"
                className="text-xs text-gray-800 dark:text-gray-200/90"
              >
                Browser
              </Label>
              <Select
                value={settings.browserStyle}
                onValueChange={(value: ScreenshotBrowserStyle) =>
                  onSettingsChange({...settings, browserStyle: value})
                }
              >
                <SelectTrigger
                  id="screenshot-browser"
                  className="h-7 w-full border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {BROWSER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        <BrowserPreview variant={option.variant} />
                        <span>{option.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-24 shrink-0 flex-col space-y-1">
              <Label className="text-xs text-gray-800 dark:text-gray-200/90">
                Size
              </Label>
              <Dialog
                open={isSizeDialogOpen}
                onOpenChange={setIsSizeDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    aria-label="Open screenshot size options"
                    className="h-7 w-full border-black/30 bg-white/80 px-2 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                  >
                    {settings.aspectRatio}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[520px] border-white/10 bg-[#15171c] p-4 text-gray-100">
                  <DialogHeader>
                    <DialogTitle>Size</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-300">
                      Standard aspect ratios based on common device screen
                      sizes.
                    </p>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {SCREENSHOT_ASPECT_OPTIONS.map((option) => {
                        const isActive = settings.aspectRatio === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            aria-pressed={isActive}
                            aria-label={`Set aspect ratio ${option.label}`}
                            onClick={() => {
                              onSettingsChange({
                                ...settings,
                                aspectRatio: option.value,
                              });
                              setIsSizeDialogOpen(false);
                            }}
                            className={`rounded-lg border p-2 text-center transition-colors ${
                              isActive
                                ? "border-emerald-400 bg-emerald-500/10"
                                : "border-white/15 bg-white/5 hover:border-white/30"
                            }`}
                          >
                            <span className="flex h-14 items-center justify-center">
                              <span
                                className={`inline-block max-h-full max-w-full rounded-[6px] border ${
                                  isActive
                                    ? "border-emerald-300"
                                    : "border-white/30"
                                }`}
                                style={{
                                  aspectRatio: option.value.replace(":", " / "),
                                  width:
                                    option.value === "9:16" ? "24px" : "38px",
                                  height:
                                    option.value === "16:9" ? "22px" : "34px",
                                }}
                              />
                            </span>
                            <span className="mt-1 block text-xs text-gray-200">
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
