"use client";

import {useEffect, useRef, useState} from "react";
import dynamic from "next/dynamic";
import type {BeforeMount, OnMount} from "@monaco-editor/react";
import type * as MonacoEditor from "monaco-editor";
import {type CodeWindowStyle, useEditorStore} from "@/store/useEditorStore";

type SyntaxPalette = {
  foreground: string;
  constant?: string;
  string?: string;
  comment?: string;
  keyword?: string;
  parameter?: string;
  function?: string;
  stringExpression?: string;
  punctuation?: string;
  link?: string;
  number?: string;
  property?: string;
};

type CodeThemeDefinition = {
  id: string;
  palette: SyntaxPalette;
  light?: boolean;
};

const DARK_WINDOW_SURFACE = "rgba(0, 0, 0, 0.88)";
const LIGHT_WINDOW_SURFACE = "rgba(255, 255, 255, 0.95)";
const DARK_EDITOR_SURFACE = "#050505";
const LIGHT_EDITOR_SURFACE = "#F9FAFB";

const CODE_THEMES: CodeThemeDefinition[] = [
  {
    id: "shotzly-midnight",
    palette: {foreground: "#FFFFFF", constant: "#9681C2", string: "#6D86A4", comment: "#4A4C56", keyword: "#7DA9AB", parameter: "#51D0F8", function: "#51D0F8", stringExpression: "#6D86A4", punctuation: "#7DA9AB", link: "#7DA9AB", number: "#75D2B1", property: "#9681C2"},
  },
  {
    id: "shotzly-sand",
    palette: {foreground: "#FFFFFF", constant: "#C2B181", string: "#C2B181", comment: "#837E77", keyword: "#D3B48C", parameter: "#F4A361", function: "#F4A361", stringExpression: "#EED5B8", punctuation: "#F4A361", link: "#F4A361", number: "#C2B181", property: "#C2B181"},
  },
  {
    id: "shotzly-emerald-night",
    palette: {foreground: "#FFFFFF", constant: "#6B8F71", string: "#C9C8BC", comment: "#555E56", keyword: "#AAB4A3", parameter: "#6B8F71", function: "#87B882", stringExpression: "#CCBD6E", punctuation: "#AAB4A3", link: "#AAB4A3", number: "#AAB4A3", property: "#C9C7BC"},
  },
  {
    id: "shotzly-carbon",
    palette: {foreground: "#ffffff", constant: "#a7a7a7", string: "#a7a7a7", comment: "#666666", keyword: "#a7a7a7", parameter: "#a7a7a7", function: "#ffffff", stringExpression: "#a7a7a7", punctuation: "#a7a7a7", link: "#a7a7a7", number: "#ffffff", property: "#a7a7a7"},
  },
  {
    id: "shotzly-github-dark",
    palette: {foreground: "#FFFFFF", constant: "#49E8F2", string: "#E9AEFE", comment: "#8A757D", keyword: "#6599FF", parameter: "#F8518D", function: "#F8518D", stringExpression: "#E9AEFE", punctuation: "#F8518D", link: "#ECFEEF", number: "#55E7B2", property: "#49E8F2"},
  },
  {
    id: "shotzly-candy",
    palette: {foreground: "#FFFFFF", constant: "#1AC8FF", string: "#DFD473", comment: "#807796", keyword: "#FF659C", parameter: "#1AC8FF", function: "#73DFA5", stringExpression: "#DFD473", punctuation: "#FF659C", link: "#FF659C", number: "#7A7FFD", property: "#1AC8FF"},
  },
  {
    id: "shotzly-crimson",
    palette: {foreground: "#FEFDFD", constant: "#D15510", string: "#EBB99D", comment: "#895E60", keyword: "#EB6F6F", parameter: "#C88E8E", function: "#C88E8E", stringExpression: "#EBB99D", punctuation: "#EB6F6F", link: "#EB6F6F", number: "#FDA97A", property: "#D15510"},
  },
  {
    id: "shotzly-falcon",
    palette: {foreground: "#FFFFFF", constant: "#799DB1", string: "#6A8697", comment: "#6D7E88", keyword: "#9AB6B2", parameter: "#6D88BB", function: "#6D88BB", stringExpression: "#789083", punctuation: "#9AB6B2", link: "#9AB6B2", number: "#BD9C9C", property: "#799DB1"},
  },
  {
    id: "shotzly-meadow",
    palette: {foreground: "#FFFFFF", constant: "#E4B165", string: "#E9EB9D", comment: "#708B6C", keyword: "#6DD79F", parameter: "#B3D767", function: "#B3D767", stringExpression: "#E9EB9D", punctuation: "#6DD79F", link: "#6DD79F", number: "#46B114", property: "#E4B165"},
  },
  {
    id: "shotzly-raindrop",
    palette: {foreground: "#E4F2FF", constant: "#008BB7", string: "#9DD8EB", comment: "#6C808B", keyword: "#2ED9FF", parameter: "#1AD6B5", function: "#1AD6B5", stringExpression: "#9DD8EB", punctuation: "#2ED9FF", link: "#2ED9FF", number: "#9984EE", property: "#008BB7"},
  },
  {
    id: "shotzly-sunset",
    palette: {foreground: "#FFFFFF", constant: "#E978A1", string: "#F9D38C", comment: "#878572", keyword: "#FFAF65", parameter: "#E2D66B", function: "#E2D66B", stringExpression: "#F9D38C", punctuation: "#FFAF65", link: "#FFAF65", number: "#E7CF55", property: "#E978A1"},
  },
  {
    id: "shotzly-bitmap",
    palette: {foreground: "#FEFDFD", constant: "#E42B37", string: "#E42B37", comment: "#996B6D", keyword: "#EB6F6F", parameter: "#C88E8E", function: "#E42B37", stringExpression: "#EBB99D", punctuation: "#EB6F6F", link: "#EB6F6F", number: "#E42B37", property: "#E42B37"},
  },
  {
    id: "shotzly-ice",
    palette: {foreground: "#FFFFFF", constant: "#92DEF6", string: "#92DEF6", comment: "#5C6A70", keyword: "#BFC4C9", parameter: "#778CB6", function: "#778CB6", stringExpression: "#89C3DC", punctuation: "#778CB6", link: "#778CB6", number: "#00B0E9", property: "#00B0E9"},
  },
  {
    id: "shotzly-noir",
    palette: {foreground: "#ffffff", constant: "#a7a7a7", string: "#a7a7a7", comment: "#666666", keyword: "#a7a7a7", parameter: "#a7a7a7", function: "#ffffff", stringExpression: "#a7a7a7", punctuation: "#a7a7a7", link: "#a7a7a7", number: "#ffffff", property: "#a7a7a7"},
  },
  {
    id: "shotzly-porcelain",
    light: true,
    palette: {foreground: "#434447", constant: "#766599", string: "#5F758F", comment: "#78808C", keyword: "#587678", parameter: "#2F788F", function: "#2F788F", stringExpression: "#5F758F", punctuation: "#587678", link: "#5A797A", number: "#2D8264", property: "#766599"},
  },
];

const THEME_BY_ID = Object.fromEntries(
  CODE_THEMES.map((theme) => [theme.id, theme]),
);

let areCodeThemesRegistered = false;
let isMonacoConsoleFilterInstalled = false;

const isBenignMonacoConsoleError = (value: unknown) => {
  if (value instanceof Error) {
    const message = `${value.name} ${value.message}`;
    const stack = value.stack ?? "";

    return (
      (message.includes("Canceled") ||
        message.includes("NotAllowedError") ||
        message.includes("Write permission denied")) &&
      (stack.includes("monaco-editor") || stack.includes("cdn.jsdelivr.net"))
    );
  }

  if (typeof value !== "string") {
    return false;
  }

  return (
    (value.includes("Canceled") ||
      value.includes("NotAllowedError") ||
      value.includes("Write permission denied")) &&
    (value.includes("monaco-editor") || value.includes("cdn.jsdelivr.net"))
  );
};

const installMonacoConsoleFilter = () => {
  if (isMonacoConsoleFilterInstalled || typeof window === "undefined") {
    return;
  }

  const originalConsoleError = console.error.bind(console);

  console.error = (...args: Parameters<typeof console.error>) => {
    if (args.some(isBenignMonacoConsoleError)) {
      return;
    }

    originalConsoleError(...args);
  };

  isMonacoConsoleFilterInstalled = true;
};

installMonacoConsoleFilter();

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => null,
});

const stripHash = (color?: string, fallback = "#FFFFFF") => {
  return (color ?? fallback).replace("#", "");
};

const defineCodeTheme = (
  monaco: typeof MonacoEditor,
  {id, light = false, palette}: CodeThemeDefinition,
) => {
  const editorBackground = light ? LIGHT_EDITOR_SURFACE : DARK_EDITOR_SURFACE;
  const lineNumber = light ? "#8A929E" : "#4D4D4D";
  const activeLineNumber = light ? palette.keyword : "#8F8F8F";
  const selectionBackground = light ? "#DCEEF2" : "#262B32";

  monaco.editor.defineTheme(id, {
    base: light ? "vs" : "vs-dark",
    inherit: true,
    rules: [
      {token: "comment", foreground: stripHash(palette.comment, palette.foreground), fontStyle: "italic"},
      {token: "keyword", foreground: stripHash(palette.keyword, palette.foreground)},
      {token: "delimiter", foreground: stripHash(palette.punctuation, palette.foreground)},
      {token: "delimiter.bracket", foreground: stripHash(palette.punctuation, palette.foreground)},
      {token: "identifier", foreground: stripHash(palette.foreground)},
      {token: "type.identifier", foreground: stripHash(palette.keyword, palette.foreground)},
      {token: "function", foreground: stripHash(palette.function, palette.foreground)},
      {token: "entity.name.function", foreground: stripHash(palette.function, palette.foreground)},
      {token: "support.function", foreground: stripHash(palette.function, palette.foreground)},
      {token: "variable.parameter", foreground: stripHash(palette.parameter, palette.foreground)},
      {token: "constant", foreground: stripHash(palette.constant, palette.foreground)},
      {token: "property", foreground: stripHash(palette.property, palette.foreground)},
      {token: "string", foreground: stripHash(palette.string, palette.foreground)},
      {token: "string.expression", foreground: stripHash(palette.stringExpression, palette.string)},
      {token: "number", foreground: stripHash(palette.number, palette.foreground)},
    ],
    colors: {
      "editor.background": editorBackground,
      "editor.foreground": palette.foreground,
      "editorLineNumber.foreground": lineNumber,
      "editorLineNumber.activeForeground": activeLineNumber ?? palette.foreground,
      "editor.lineHighlightBackground": editorBackground,
      "editor.selectionBackground": selectionBackground,
      "editorCursor.foreground": palette.foreground,
      "editorWhitespace.foreground": light ? "#D1D5DB" : "#262626",
    },
  });
};

const registerCodeThemes = (monaco: typeof MonacoEditor) => {
  if (areCodeThemesRegistered) {
    return;
  }

  CODE_THEMES.forEach((theme) => defineCodeTheme(monaco, theme));
  areCodeThemesRegistered = true;
};

function CodeEditorLoadingState() {
  return (
    <div
      data-export-ignore="true"
      className="absolute inset-0 z-0 flex items-center justify-center"
    >
      <span className="text-sm font-semibold text-white/90">Loading...</span>
    </div>
  );
}

function CodeWindowChrome({
  style,
  title,
  chromeColor,
  isLight,
  onTitleChange,
}: {
  style: CodeWindowStyle;
  title: string;
  chromeColor: string;
  isLight: boolean;
  onTitleChange: (title: string) => void;
}) {
  if (style === "plain") {
    return null;
  }

  if (style === "windows") {
    return (
      <div
        data-export-sharp-border="true"
        className={`relative flex h-10 items-center border-b px-5 text-[12px] ${
          isLight
            ? "border-black/[0.06] bg-white/95 text-black/45"
            : "border-white/[0.06] bg-[#071010] text-white/55"
        }`}
        style={{backgroundColor: chromeColor}}
      >
        <input
          aria-label="Window title"
          placeholder="untitled"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          className={`w-36 truncate border-0 bg-transparent p-0 text-[12px] outline-none ${
            isLight
              ? "text-black/45 placeholder:text-black/45"
              : "text-white/65 placeholder:text-white/55"
          }`}
        />
        <div className="ml-auto flex h-full items-center">
          <span
            className={`flex h-8 w-9 items-center justify-center ${
              isLight ? "text-black/45" : "text-white/55"
            }`}
          >
            -
          </span>
          <span
            className={`flex h-8 w-9 items-center justify-center ${
              isLight ? "text-black/45" : "text-white/55"
            }`}
          >
            []
          </span>
          <span
            className={`flex h-8 w-9 items-center justify-center ${
              isLight ? "text-black/55" : "text-white/70"
            }`}
          >
            x
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      data-export-sharp-border="true"
      className={`relative flex h-10 items-center border-b px-5 ${
        isLight
          ? "border-black/[0.06] bg-white/95"
          : "border-white/[0.06] bg-[#080b16]"
      }`}
      style={{backgroundColor: chromeColor}}
    >
      <div className="absolute left-5 top-1/2 flex -translate-y-1/2 items-center space-x-2">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>
      <input
        aria-label="Window title"
        placeholder="untitled"
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        className={`mx-auto w-44 truncate border-0 bg-transparent p-0 text-center text-[12px] font-medium outline-none ${
          isLight
            ? "text-black/45 placeholder:text-black/45"
            : "text-white/70 placeholder:text-white/50"
        }`}
      />
    </div>
  );
}

export default function CodeSnippet() {
  const code = useEditorStore((state) => state.code);
  const setCode = useEditorStore((state) => state.setCode);
  const gradient = useEditorStore((state) => state.codeGradient);
  const fontSize = useEditorStore((state) => state.fontSize);
  const codePadding = useEditorStore((state) => state.codePadding);
  const isBackgroundHidden = useEditorStore(
    (state) => state.isBackgroundHidden,
  );
  const showLineNumbers = useEditorStore((state) => state.showLineNumbers);
  const codeThemePreset = useEditorStore((state) => state.codeThemePreset);
  const codeLanguage = useEditorStore((state) => state.codeLanguage);
  const codeWindowStyle = useEditorStore((state) => state.codeWindowStyle);
  const codeWindowTitle = useEditorStore((state) => state.codeWindowTitle);
  const setCodeWindowTitle = useEditorStore(
    (state) => state.setCodeWindowTitle,
  );
  const setPreviewRef = useEditorStore((state) => state.setPreviewRef);
  const monacoRef = useRef<typeof MonacoEditor | null>(null);
  const editorRef = useRef<MonacoEditor.editor.IStandaloneCodeEditor | null>(
    null,
  );
  const contentSizeDisposableRef = useRef<MonacoEditor.IDisposable | null>(
    null,
  );
  const effectiveFontSize = Math.max(fontSize || 14, 10);
  const configuredCodeFont =
    typeof window === "undefined"
      ? ""
      : getComputedStyle(document.body)
          .getPropertyValue("--font-jetbrains-mono")
          .trim();
  // next/font can emit an Arial-based fallback when the Google font is unavailable.
  const codeFontFamily =
    configuredCodeFont && !configuredCodeFont.startsWith("'JetBrains Mono Fallback'")
      ? configuredCodeFont
      : '"SFMono-Regular", "Cascadia Code", "Fira Code", ui-monospace, monospace';
  const effectiveCodePadding = Math.max(0, Math.min(codePadding || 0, 128));
  const editorVerticalPadding = 20;
  const editorLanguage = codeLanguage;
  const minEditorHeight = 282;
  const [editorHeight, setEditorHeight] = useState(minEditorHeight);
  const isLightTheme = THEME_BY_ID[codeThemePreset]?.light ?? false;
  const editorSurfaceColor = isLightTheme
    ? LIGHT_WINDOW_SURFACE
    : DARK_WINDOW_SURFACE;
  const chromeColor = editorSurfaceColor;
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    return () => {
      contentSizeDisposableRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!monacoRef.current || !isEditorReady) {
      return;
    }

    monacoRef.current.editor.setTheme(codeThemePreset);
  }, [codeThemePreset, isEditorReady]);

  const updateEditorHeight = () => {
    if (!editorRef.current) {
      return;
    }

    const contentHeight = editorRef.current.getContentHeight();
    const nextHeight = Math.max(minEditorHeight, Math.ceil(contentHeight));
    setEditorHeight(nextHeight);
    editorRef.current.layout();
  };

  return (
    <div
      ref={setPreviewRef}
      data-export-sharp-border="true"
      className={`mx-auto box-border flex w-full max-w-[900px] items-center justify-center rounded-[4px] shadow-[0_32px_90px_rgba(0,0,0,0.42)] ${
        isBackgroundHidden ? "!bg-none shadow-none" : ""
      }`}
      style={{
        background: gradient,
        padding: `clamp(${Math.min(effectiveCodePadding, 12)}px, 6vw, ${effectiveCodePadding}px)`,
      }}
    >
      <div
        data-export-sharp-border="true"
        className="relative w-full overflow-hidden rounded-[14px] shadow-[0_18px_42px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.38)]"
        style={{backgroundColor: editorSurfaceColor}}
      >
        <CodeWindowChrome
          style={codeWindowStyle}
          title={codeWindowTitle}
          chromeColor={chromeColor}
          isLight={isLightTheme}
          onTitleChange={setCodeWindowTitle}
        />

        {!isEditorReady ? <CodeEditorLoadingState /> : null}

        <div
          className={`relative z-10 transition-opacity duration-200 ${
            isEditorReady ? "opacity-100" : "opacity-0"
          }`}
          style={{minHeight: editorHeight}}
        >
          <Editor
            beforeMount={((monaco) => {
              monacoRef.current = monaco;
              registerCodeThemes(monaco);
              monaco.languages.typescript.javascriptDefaults.setModeConfiguration(
                {
                  completionItems: false,
                  signatureHelp: false,
                },
              );
              monaco.languages.typescript.typescriptDefaults.setModeConfiguration(
                {
                  completionItems: false,
                  signatureHelp: false,
                },
              );
            }) as BeforeMount}
            onMount={((editor, monaco) => {
              editorRef.current = editor;
              editor.addCommand(
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space,
                () => {
                  // Intentionally disable manual suggestion trigger.
                },
              );
              contentSizeDisposableRef.current?.dispose();
              contentSizeDisposableRef.current =
                editor.onDidContentSizeChange(updateEditorHeight);
              updateEditorHeight();
              setIsEditorReady(true);
            }) as OnMount}
            loading={null}
            value={code}
            language={editorLanguage}
            theme={codeThemePreset}
            onChange={(value) => setCode(value ?? "")}
            height={`${editorHeight}px`}
            options={{
              minimap: {enabled: false},
              fontFamily: codeFontFamily,
              fontLigatures: true,
              fontSize: effectiveFontSize,
              lineHeight: Math.round(effectiveFontSize * 1.6),
              letterSpacing: 0,
              lineNumbers: showLineNumbers ? "on" : "off",
              lineNumbersMinChars: showLineNumbers ? 3 : 0,
              lineDecorationsWidth: showLineNumbers ? 12 : 26,
              glyphMargin: false,
              folding: false,
              renderLineHighlight: "none",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              automaticLayout: true,
              roundedSelection: true,
              cursorStyle: "line",
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              smoothScrolling: true,
              overviewRulerBorder: false,
              overviewRulerLanes: 0,
              renderValidationDecorations: "off",
              hideCursorInOverviewRuler: true,
              quickSuggestions: false,
              suggestOnTriggerCharacters: false,
              wordBasedSuggestions: "off",
              inlineSuggest: {enabled: false},
              parameterHints: {enabled: false},
              snippetSuggestions: "none",
              suggest: {showSnippets: false},
              acceptSuggestionOnEnter: "off",
              tabCompletion: "off",
              scrollbar: {
                horizontal: "hidden",
                vertical: "hidden",
                handleMouseWheel: true,
              },
              padding: {
                top: editorVerticalPadding,
                bottom: editorVerticalPadding,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
