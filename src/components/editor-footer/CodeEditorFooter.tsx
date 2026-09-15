"use client";

import {type ChangeEvent} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../ui/select";
import {Input} from "../ui/input";
import {Label} from "../ui/label";
import {useEditorStore} from "@/store/useEditorStore";
import BackgroundSelect from "./BackgroundSelect";

const CODE_PADDING_OPTIONS = [4, 8, 16, 32, 64, 128];
const CODE_THEME_PRESETS = [
  {value: "shotzly-midnight", label: "Midnight"},
  {value: "shotzly-sand", label: "Sand"},
  {value: "shotzly-emerald-night", label: "Forest"},
  {value: "shotzly-carbon", label: "Mono"},
  {value: "shotzly-github-dark", label: "Breeze"},
  {value: "shotzly-candy", label: "Candy"},
  {value: "shotzly-crimson", label: "Crimson"},
  {value: "shotzly-falcon", label: "Falcon"},
  {value: "shotzly-meadow", label: "Meadow"},
  {value: "shotzly-raindrop", label: "Raindrop"},
  {value: "shotzly-sunset", label: "Sunset"},
  {value: "shotzly-bitmap", label: "Bitmap"},
  {value: "shotzly-ice", label: "Ice"},
  {value: "shotzly-noir", label: "Noir"},
  {value: "shotzly-porcelain", label: "Porcelain (Light)"},
];

const CODE_LANGUAGES = [
  {value: "javascript", label: "JavaScript"},
  {value: "typescript", label: "TypeScript"},
  {value: "python", label: "Python"},
  {value: "java", label: "Java"},
  {value: "go", label: "Go"},
  {value: "rust", label: "Rust"},
  {value: "cpp", label: "C++"},
  {value: "csharp", label: "C#"},
  {value: "php", label: "PHP"},
  {value: "ruby", label: "Ruby"},
  {value: "sql", label: "SQL"},
  {value: "bash", label: "Bash"},
  {value: "html", label: "HTML"},
  {value: "css", label: "CSS"},
  {value: "json", label: "JSON"},
  {value: "yaml", label: "YAML"},
  {value: "xml", label: "XML"},
];

const getOptionLabel = (
  options: {value: string; label: string}[],
  value: string,
  fallback: string,
) => {
  return options.find((option) => option.value === value)?.label ?? fallback;
};

export default function CodeEditorFooter() {
  const gradient = useEditorStore((state) => state.codeGradient);
  const setGradient = useEditorStore((state) => state.setCodeGradient);

  const fontSize = useEditorStore((state) => state.fontSize);
  const setFontSize = useEditorStore((state) => state.setFontSize);
  const codePadding = useEditorStore((state) => state.codePadding);
  const setCodePadding = useEditorStore((state) => state.setCodePadding);
  const codeWindowStyle = useEditorStore((state) => state.codeWindowStyle);
  const setCodeWindowStyle = useEditorStore(
    (state) => state.setCodeWindowStyle,
  );
  const isBackgroundHidden = useEditorStore(
    (state) => state.isBackgroundHidden,
  );
  const setIsBackgroundHidden = useEditorStore(
    (state) => state.setIsBackgroundHidden,
  );
  const showLineNumbers = useEditorStore((state) => state.showLineNumbers);
  const setShowLineNumbers = useEditorStore(
    (state) => state.setShowLineNumbers,
  );
  const codeThemePreset = useEditorStore((state) => state.codeThemePreset);
  const setCodeThemePreset = useEditorStore(
    (state) => state.setCodeThemePreset,
  );
  const codeLanguage = useEditorStore((state) => state.codeLanguage);
  const setCodeLanguage = useEditorStore((state) => state.setCodeLanguage);
  return (
    <section className="fixed inset-x-0 bottom-0 z-10 flex w-full justify-center">
      <div className="mx-auto flex w-full max-w-7xl justify-center px-2 sm:px-0">
        <div className="flex w-full flex-col items-center rounded-t-2xl border border-black/10 bg-white/30 px-2 py-2 text-black backdrop-blur-2xl dark:border-white/10 dark:bg-[#111010]/85 dark:text-gray-100 sm:min-h-20 sm:px-6 sm:py-4">
          <div className="scrollbar-hide flex w-full items-end justify-start gap-3 overflow-x-auto pb-1 lg:justify-between lg:overflow-visible">
            <div className="w-20 shrink-0 space-y-1">
              <Label
                className="text-xs text-gray-800 dark:text-gray-200/90"
                htmlFor="gradient"
              >
                Bg Gradient
              </Label>
              <BackgroundSelect
                id="gradient"
                value={gradient}
                onChange={setGradient}
              />
            </div>
            <div className="relative flex w-28 shrink-0 flex-col space-y-1">
              <Label
                className="text-xs w-full text-gray-800 dark:text-gray-200/90"
                htmlFor="removeBg"
              >
                Background
              </Label>
              <Select
                value={isBackgroundHidden ? "no" : "yes"}
                onValueChange={(value: string) => {
                  setIsBackgroundHidden(value === "no");
                }}
              >
                <SelectTrigger
                  id="removeBg"
                  className="h-7 w-full border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <span className="truncate">
                    {isBackgroundHidden ? "No" : "Yes"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative flex w-28 shrink-0 flex-col space-y-1">
              <Label
                className="text-xs w-full text-gray-800 dark:text-gray-200/90"
                htmlFor="lineNumbers"
              >
                Line Numbers
              </Label>
              <Select
                value={showLineNumbers ? "yes" : "no"}
                onValueChange={(value: string) => {
                  setShowLineNumbers(value === "yes");
                }}
              >
                <SelectTrigger
                  id="lineNumbers"
                  className="h-7 w-full border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <span className="truncate">
                    {showLineNumbers ? "Yes" : "No"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative flex w-36 shrink-0 flex-col space-y-1">
              <Label
                className="text-xs w-full text-gray-800 dark:text-gray-200/90"
                htmlFor="codeLanguage"
              >
                Language
              </Label>
              <Select
                value={codeLanguage}
                onValueChange={(value: string) => {
                  setCodeLanguage(value);
                }}
              >
                <SelectTrigger
                  id="codeLanguage"
                  className="h-7 w-full border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <span className="truncate">
                    {getOptionLabel(CODE_LANGUAGES, codeLanguage, "JavaScript")}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {CODE_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative flex w-40 shrink-0 flex-col space-y-1">
              <Label
                className="text-xs w-full text-gray-800 dark:text-gray-200/90"
                htmlFor="codeTheme"
              >
                Theme
              </Label>
              <Select
                value={codeThemePreset}
                onValueChange={(value: string) => {
                  setCodeThemePreset(value);
                }}
              >
                <SelectTrigger
                  id="codeTheme"
                  className="h-7 w-full border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <span className="truncate">
                    {getOptionLabel(
                      CODE_THEME_PRESETS,
                      codeThemePreset,
                      "Midnight",
                    )}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {CODE_THEME_PRESETS.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative flex w-28 shrink-0 flex-col space-y-1">
              <Label
                className="text-xs w-full text-gray-800 dark:text-gray-200/90"
                htmlFor="codeWindowStyle"
              >
                Window
              </Label>
              <Select
                value={codeWindowStyle}
                onValueChange={(value: string) => {
                  if (
                    value === "plain" ||
                    value === "macos" ||
                    value === "windows"
                  ) {
                    setCodeWindowStyle(value);
                  }
                }}
              >
                <SelectTrigger
                  id="codeWindowStyle"
                  className="h-7 w-full border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <span className="truncate">
                    {codeWindowStyle === "macos"
                      ? "macOS"
                      : codeWindowStyle === "windows"
                        ? "Windows"
                        : "Plain"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plain">Plain</SelectItem>
                  <SelectItem value="macos">macOS</SelectItem>
                  <SelectItem value="windows">Windows</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-24 shrink-0 space-y-1">
              <Label
                className="text-xs text-gray-800 dark:text-gray-200/90"
                htmlFor="fontSize"
              >
                Font Size
              </Label>
              <Input
                id="fontSize"
                type="number"
                value={fontSize}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFontSize(parseInt(e.target.value, 10) || 14)
                }
                className="h-7 w-full border-black/30 bg-white/80 text-center text-xs [color-scheme:dark] dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
              />
            </div>
            <div className="w-24 shrink-0 space-y-1">
              <Label
                className="text-xs text-gray-800 dark:text-gray-200/90"
                htmlFor="snippetPadding"
              >
                Padding
              </Label>
              <Select
                value={String(codePadding)}
                onValueChange={(value: string) =>
                  setCodePadding(parseInt(value, 10))
                }
              >
                <SelectTrigger
                  id="snippetPadding"
                  className="h-7 w-full border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <span className="truncate">{codePadding}</span>
                </SelectTrigger>
                <SelectContent>
                  {CODE_PADDING_OPTIONS.map((padding) => (
                    <SelectItem key={padding} value={String(padding)}>
                      {padding}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
