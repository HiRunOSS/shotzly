"use client";

import {useEffect, useState} from "react";
import CodeSnippet from "@/components/CodeSnippet";
import ScreenshotSnippet from "@/components/ScreenshotSnippet";
import CodeEditorFooter from "@/components/editor-footer/CodeEditorFooter";
import ScreenshotEditorFooter from "@/components/editor-footer/ScreenshotEditorFooter";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {useEditorStore} from "@/store/useEditorStore";
import exportAsImage, {
  type ImageExportFormat,
  type ImageExportResolution,
} from "@/utils/DownloadImage";
import {
  copyNodeAsImage,
  saveNodeAsPng,
  saveNodeAsSvg,
} from "@/utils/snippetExport";
import {Copy, Download, ImageIcon, Trash2} from "lucide-react";
import {FaGithub} from "react-icons/fa6";

const X_PROFILE_URL = "https://x.com/hiarun02";
const GITHUB_REPO_URL = "https://github.com/HiRunOSS/shotzly";

export default function EditorPageClient() {
  const [stars, setStars] = useState<number | null>(null);
  const [displayStars, setDisplayStars] = useState(0);
  const [codeExportStatus, setCodeExportStatus] = useState<
    "idle" | "png" | "svg" | "copy" | "error"
  >("idle");
  const [screenshotExportStatus, setScreenshotExportStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [screenshotExportFormat, setScreenshotExportFormat] =
    useState<ImageExportFormat>("png");
  const [screenshotExportResolution, setScreenshotExportResolution] =
    useState<ImageExportResolution>("4k");
  const editorMode = useEditorStore((state) => state.editorMode);
  const setEditorMode = useEditorStore((state) => state.setEditorMode);
  const hydrateFromStorage = useEditorStore(
    (state) => state.hydrateFromStorage,
  );
  const screenshotSettings = useEditorStore(
    (state) => state.screenshotSettings,
  );
  const setScreenshotSettings = useEditorStore(
    (state) => state.setScreenshotSettings,
  );
  const uploadedImage = useEditorStore((state) => state.uploadedImage);
  const setUploadedImage = useEditorStore((state) => state.setUploadedImage);
  const previewRef = useEditorStore((state) => state.previewRef);
  const isExporting = useEditorStore((state) => state.isExporting);
  const setIsExporting = useEditorStore((state) => state.setIsExporting);

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/HiRunOSS/shotzly",
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        if (typeof data?.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      } catch (error) {
        console.error("Failed to fetch GitHub stars", error);
      }
    };

    fetchStars();
  }, []);

  useEffect(() => {
    if (stars === null) {
      return;
    }

    let current = 0;
    const target = stars;
    const step = Math.max(1, Math.floor(target / 40));
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      setDisplayStars(current);

      if (current >= target) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [stars]);

  const runCodeExport = async (
    action: "png" | "svg" | "copy",
    callback: (node: HTMLElement) => Promise<void>,
  ) => {
    if (!previewRef) {
      return;
    }

    try {
      setIsExporting(true);
      setCodeExportStatus("idle");
      await callback(previewRef);
      setCodeExportStatus(action);
      setTimeout(() => setCodeExportStatus("idle"), 2000);
    } catch (error) {
      console.error("Export failed", error);
      setCodeExportStatus("error");
      setTimeout(() => setCodeExportStatus("idle"), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleScreenshotExport = async () => {
    if (!previewRef) {
      return;
    }

    await exportAsImage(
      previewRef,
      {
        format: screenshotExportFormat,
        filename: `shotzly-screenshot-${screenshotExportResolution}.${screenshotExportFormat}`,
        resolution: screenshotExportResolution,
      },
      () => {
        setIsExporting(true);
        setScreenshotExportStatus("idle");
      },
      () => {
        setIsExporting(false);
        setScreenshotExportStatus("success");
        setTimeout(() => setScreenshotExportStatus("idle"), 2000);
      },
      () => {
        setIsExporting(false);
        setScreenshotExportStatus("error");
        setTimeout(() => setScreenshotExportStatus("idle"), 3000);
      },
    );
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-gradient-to-b from-white via-white to-gray-50 dark:from-[#111010] dark:via-[#111010] dark:to-[#111010]">
      <header className="fixed inset-x-0 top-3 z-20 px-3 sm:top-6 sm:px-6">
        <div className="mx-auto grid w-full grid-cols-[1fr_auto] gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-start sm:gap-20 lg:gap-32 xl:gap-44">
          <div className="order-3 col-span-2 rounded-2xl bg-white/40 p-2 backdrop-blur-2xl dark:bg-[#111010]/70 sm:order-none sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:w-[min(460px,32vw)] xl:w-[min(560px,34vw)]">
            <div className="flex w-full items-center justify-center">
              <Button
                type="button"
                aria-pressed={editorMode === "screenshot"}
                variant="ghost"
                className={`h-9 flex-1 rounded-xl border text-sm transition-colors hover:border-white hover:bg-white hover:text-black ${
                  editorMode === "screenshot"
                    ? "border-white bg-white text-black shadow-sm"
                    : "border-transparent text-gray-800 hover:shadow-sm dark:text-white"
                }`}
                onClick={() => setEditorMode("screenshot")}
              >
                Screenshot
              </Button>
              <Button
                type="button"
                aria-pressed={editorMode === "code"}
                variant="ghost"
                className={`h-9 flex-1 rounded-xl border text-sm transition-colors hover:border-white hover:bg-white hover:text-black ${
                  editorMode === "code"
                    ? "border-white bg-white text-black shadow-sm"
                    : "border-transparent text-gray-800 hover:shadow-sm dark:text-white"
                }`}
                onClick={() => setEditorMode("code")}
              >
                Code
              </Button>
            </div>
          </div>

          <div className="contents sm:col-start-3 sm:row-start-1 sm:flex sm:justify-end sm:gap-3">
            <div className="flex w-fit items-center gap-1.5 rounded-xl border border-black/10 bg-white/35 p-1 text-gray-900 shadow-sm backdrop-blur-2xl dark:border-white/10 dark:bg-[#111010]/65 dark:text-white sm:order-2">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Star Shotzly on GitHub"
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold leading-none tabular-nums text-gray-700 transition-colors hover:bg-black/5 hover:text-black focus:outline-none focus:ring-1 focus:ring-blue-400 dark:text-white/75 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <FaGithub className="h-3.5 w-3.5 text-gray-500 dark:text-white/55" />
                {stars === null ? (
                  <span
                    className="h-3 w-3 rounded-full border-2 border-gray-400 border-t-transparent animate-spin dark:border-white/45 dark:border-t-transparent"
                    aria-hidden="true"
                  />
                ) : (
                  <span>{displayStars.toLocaleString()}</span>
                )}
              </a>
              <a
                href={X_PROFILE_URL}
                target="_blank"
                rel="noreferrer"
                className="min-w-[108px] rounded-lg px-3 py-1.5 text-center text-xs font-semibold leading-none text-gray-800 transition-colors hover:bg-black/5 hover:text-black focus:outline-none focus:ring-1 focus:ring-blue-400 dark:text-white/85 dark:hover:bg-white/10 dark:hover:text-white"
              >
                Made by Arun
              </a>
            </div>

            <div className="ml-auto flex w-fit items-center gap-1.5 rounded-xl border border-black/10 bg-white/35 p-0.5 text-gray-900 shadow-sm backdrop-blur-2xl dark:border-white/10 dark:bg-[#111010]/65 dark:text-white sm:order-1 sm:ml-0">
              {editorMode === "screenshot" && uploadedImage ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setUploadedImage("")}
                  aria-label="Remove screenshot"
                  title="Remove screenshot"
                  className="h-8 w-8 rounded-lg px-0 text-gray-700 hover:bg-black/5 hover:text-black dark:text-white/75 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              ) : null}

              <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              aria-label="Open export options"
              title="Export image"
              className="h-8 gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-gray-800 hover:bg-black/5 hover:text-black dark:text-white/85 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[340px] border-white/10 bg-[#15171c] p-4 text-gray-100">
            <DialogHeader>
              <DialogTitle>
                {editorMode === "code" ? "Export Code" : "Export Screenshot"}
              </DialogTitle>
            </DialogHeader>

            {editorMode === "code" ? (
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() =>
                    runCodeExport("png", (node) =>
                      saveNodeAsPng(node, "code.png"),
                    )
                  }
                  disabled={isExporting}
                  aria-busy={isExporting}
                  aria-label="Save code snippet as PNG"
                  variant="ghost"
                  className="h-10 justify-start rounded-md px-3 text-base text-gray-100 hover:bg-white/10"
                >
                  <span className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    {codeExportStatus === "png" ? "PNG saved" : "Save PNG"}
                  </span>
                </Button>
                <Button
                  onClick={() =>
                    runCodeExport("svg", (node) =>
                      saveNodeAsSvg(node, "code.svg"),
                    )
                  }
                  disabled={isExporting}
                  aria-busy={isExporting}
                  aria-label="Save code snippet as SVG"
                  variant="ghost"
                  className="h-10 justify-start rounded-md px-3 text-base text-gray-100 hover:bg-white/10"
                >
                  <span className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    {codeExportStatus === "svg" ? "SVG saved" : "Save SVG"}
                  </span>
                </Button>
                <Button
                  onClick={() =>
                    runCodeExport("copy", (node) => copyNodeAsImage(node))
                  }
                  disabled={isExporting}
                  aria-busy={isExporting}
                  aria-label="Copy code snippet image"
                  variant="ghost"
                  className="h-10 justify-start rounded-md px-3 text-base text-gray-100 hover:bg-white/10"
                >
                  <span className="flex items-center gap-2">
                    <Copy className="h-4 w-4" />
                    {codeExportStatus === "copy" ? "Copied" : "Copy Image"}
                  </span>
                </Button>
                {codeExportStatus === "error" ? (
                  <p className="px-3 text-xs font-medium text-red-200">
                    Export failed
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label
                    htmlFor="top-screenshot-format"
                    className="text-xs text-gray-300"
                  >
                    Format
                  </Label>
                  <Select
                    value={screenshotExportFormat}
                    onValueChange={(value: ImageExportFormat) =>
                      setScreenshotExportFormat(value)
                    }
                  >
                    <SelectTrigger
                      id="top-screenshot-format"
                      className="h-9 border-white/15 bg-[#111010]/80 text-sm text-gray-100"
                    >
                      <SelectValue placeholder="PNG" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpg">JPG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="top-screenshot-resolution"
                    className="text-xs text-gray-300"
                  >
                    Resolution
                  </Label>
                  <Select
                    value={screenshotExportResolution}
                    onValueChange={(value: ImageExportResolution) =>
                      setScreenshotExportResolution(value)
                    }
                  >
                    <SelectTrigger
                      id="top-screenshot-resolution"
                      className="h-9 border-white/15 bg-[#111010]/80 text-sm text-gray-100"
                    >
                      <SelectValue placeholder="4K" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="2k">2K</SelectItem>
                      <SelectItem value="4k">4K</SelectItem>
                      <SelectItem value="6k">6K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleScreenshotExport}
                  disabled={isExporting}
                  aria-busy={isExporting}
                  aria-label="Download screenshot snippet"
                  variant="outline"
                  className="h-9 w-full border-white/20 bg-white/10 text-sm hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isExporting
                    ? "Exporting..."
                    : screenshotExportStatus === "success"
                      ? "Downloaded"
                      : screenshotExportStatus === "error"
                        ? "Failed"
                        : "Download"}
                </Button>
              </div>
            )}
          </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 items-center justify-center overflow-auto px-3 pb-28 pt-32 sm:px-4 sm:pb-32 sm:pt-28">
        <div className="flex h-full w-full max-w-7xl items-center justify-center overflow-hidden rounded-2xl bg-white/20 backdrop-blur-2xl dark:bg-[#111010]/70 sm:rounded-3xl">
          {editorMode === "code" ? (
            <CodeSnippet />
          ) : (
            <ScreenshotSnippet settings={screenshotSettings} />
          )}
        </div>
      </main>

      {editorMode === "code" ? (
        <CodeEditorFooter />
      ) : (
        <ScreenshotEditorFooter
          settings={screenshotSettings}
          onSettingsChange={setScreenshotSettings}
        />
      )}
    </div>
  );
}
