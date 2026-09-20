"use client";

import Image from "next/image";
import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {ChevronDown, ImagePlus} from "lucide-react";
import {ScreenshotSnippetBgCategories} from "@/constants/gradient";

interface BackgroundSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  blurValue?: number;
  onBlurChange?: (value: number) => void;
}

const CATEGORY_DISPLAY_ORDER = [
  "macos",
  "raycast",
  "mesh",
  "radiant",
  "magic",
  "windows",
  "linux",
  "gradient",
  "abstract",
];
const MAX_CUSTOM_BACKGROUND_SIZE_BYTES = 3 * 1024 * 1024;

function getBackgroundImagePath(background: string) {
  return background.match(/url\(['"]?(\/backgrounds\/[^'")]+)['"]?\)/)?.[1] ?? null;
}

function sortBackgroundCategories() {
  return [...ScreenshotSnippetBgCategories].sort((first, second) => {
    const firstIndex = CATEGORY_DISPLAY_ORDER.indexOf(first.id);
    const secondIndex = CATEGORY_DISPLAY_ORDER.indexOf(second.id);

    if (firstIndex === -1 && secondIndex === -1) {
      return first.label.localeCompare(second.label);
    }
    if (firstIndex === -1) {
      return 1;
    }
    if (secondIndex === -1) {
      return -1;
    }

    return firstIndex - secondIndex;
  });
}

export default function BackgroundSelect({
  id,
  value,
  onChange,
  blurValue,
  onBlurChange,
}: BackgroundSelectProps) {
  const sortedCategories = useMemo(sortBackgroundCategories, []);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isFixedDropdown, setIsFixedDropdown] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({});
  const [uploadError, setUploadError] = useState("");
  const hasBlurControl = typeof blurValue === "number" && Boolean(onBlurChange);
  const safeBlurValue = Math.max(0, Math.min(24, blurValue ?? 0));

  useEffect(() => {
    if (!isOpen || !containerRef.current) {
      return;
    }

    const updateDropdownPosition = () => {
      const shouldUseFixedDropdown = window.innerWidth < 1024;
      setIsFixedDropdown(shouldUseFixedDropdown);

      if (!shouldUseFixedDropdown) {
        setDropdownStyle({});
        return;
      }

      const triggerRect = containerRef.current?.getBoundingClientRect();

      if (!triggerRect) {
        return;
      }

      const menuWidth = 252;
      const viewportPadding = 8;
      const left = Math.min(
        Math.max(triggerRect.left, viewportPadding),
        window.innerWidth - menuWidth - viewportPadding,
      );

      setDropdownStyle({
        bottom: window.innerHeight - triggerRect.top + 8,
        left,
        width: menuWidth,
      });
    };

    updateDropdownPosition();
    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true);

    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (
        !containerRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  const handleCustomBackgroundUpload = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Choose an image file.");
      return;
    }

    if (file.size > MAX_CUSTOM_BACKGROUND_SIZE_BYTES) {
      setUploadError("Use an image under 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result;
      if (typeof imageUrl !== "string") {
        setUploadError("Could not read this image.");
        return;
      }

      setUploadError("");
      onChange(`center / cover no-repeat url("${imageUrl}")`);
      setIsOpen(false);
    };
    reader.onerror = () => {
      setUploadError("Could not read this image.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => {
          setUploadError("");
          setIsOpen((open) => !open);
        }}
        className="flex h-7 w-full items-center justify-center gap-1.5 rounded-md border border-black/30 bg-white/80 px-2 text-gray-900 dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
      >
        <span className="h-4 w-4 rounded-full" style={{background: value}} />
        <ChevronDown
          className={`h-3 w-3 text-gray-500 transition-transform dark:text-gray-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div
          ref={dropdownRef}
          className={`z-50 overflow-hidden rounded-md border border-black/20 bg-white text-black shadow-2xl shadow-black/20 dark:border-white/10 dark:bg-[#111010] dark:text-gray-100 dark:shadow-black/60 ${
            isFixedDropdown
              ? "fixed"
              : "absolute bottom-full left-0 mb-2 w-[252px]"
          }`}
          style={isFixedDropdown ? dropdownStyle : undefined}
        >
          <div className="scrollbar-hide max-h-80 overflow-y-auto overscroll-contain px-2 py-2">
            <div className="pb-3">
              <div className="pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                Custom
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCustomBackgroundUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-dashed border-black/25 bg-black/[0.03] text-xs font-medium text-gray-700 transition hover:bg-black/[0.06] dark:border-white/20 dark:bg-white/[0.04] dark:text-gray-200 dark:hover:bg-white/[0.08]"
              >
                <ImagePlus className="h-4 w-4" />
                Upload background
              </button>
              {uploadError ? (
                <p className="mt-1 text-[11px] font-medium text-red-500 dark:text-red-300">
                  {uploadError}
                </p>
              ) : null}
            </div>

            {hasBlurControl ? (
              <div className="border-t border-black/10 pb-3 pt-3 dark:border-white/10">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                    BG Blur
                  </div>
                  <div className="text-[11px] tabular-nums text-gray-500 dark:text-gray-400">
                    {safeBlurValue}px
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={24}
                  step={1}
                  value={safeBlurValue}
                  aria-label="Background blur"
                  onChange={(event) => {
                    onBlurChange?.(
                      Math.max(0, Math.min(24, Number(event.target.value) || 0)),
                    );
                  }}
                  className="h-1.5 w-full accent-gray-950 dark:accent-gray-100"
                />
              </div>
            ) : null}

            {sortedCategories.map((category) => (
              <div key={category.id} className="pb-3 last:pb-0">
                <div className="pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                  {category.label}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {category.options.map((item) => {
                    const imagePath = getBackgroundImagePath(item.gradient);
                    const previewPath = category.id === "macos" && imagePath
                      ? imagePath.replace("/backgrounds/macos/", "/backgrounds/macos/thumbs/")
                      : imagePath;

                    return <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        onChange(item.gradient);
                        setIsOpen(false);
                      }}
                      className="rounded-md p-0 outline-none focus:ring-2 focus:ring-blue-400/70"
                      aria-label={item.name}
                      title={item.name}
                    >
                      <span
                        className={`relative block h-10 w-10 overflow-hidden rounded-md border ${
                          value === item.gradient
                            ? "border-blue-500 ring-2 ring-blue-400/70"
                            : "border-black/15 dark:border-white/15"
                        }`}
                        style={imagePath ? undefined : {background: item.gradient}}
                      >
                        {previewPath ? <Image src={previewPath} alt="" fill sizes="40px" quality={55} loading="lazy" unoptimized={category.id === "macos"} className="object-cover" /> : null}
                      </span>
                    </button>;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
