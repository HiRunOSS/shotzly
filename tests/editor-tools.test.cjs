const {test} = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

// Load the project's TypeScript and @/ aliases without an additional test dependency.
const resolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...args) {
  return resolve.call(this, name.startsWith("@/") ? path.join(__dirname, "../src", name.slice(2)) : name, ...args);
};
require.extensions[".ts"] = (module, filename) => {
  const {outputText} = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020},
  });
  module._compile(outputText, filename);
};

function freshStore() {
  const saved = new Map();
  global.window = {};
  global.localStorage = {getItem: (key) => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value)};
  const file = require.resolve("../src/store/useEditorStore.ts");
  delete require.cache[file];
  const {useEditorStore: store} = require(file);
  return {store, saved};
}

test("undo and redo restore image replacement and persist it", () => {
  const {store, saved} = freshStore();
  store.getState().setUploadedImage("original");
  store.getState().setUploadedImage("redacted");
  store.getState().undo();
  assert.equal(store.getState().uploadedImage, "original");
  assert.equal(JSON.parse(saved.get("shotzly-editor-state")).uploadedImage, "original");
  store.getState().redo();
  assert.equal(store.getState().uploadedImage, "redacted");
});

test("continuous settings updates form one undo step; new edits discard redo", () => {
  const {store} = freshStore();
  const original = store.getState().screenshotSettings;
  store.getState().setScreenshotSettings({...original, rotation: 10});
  store.getState().setScreenshotSettings({...original, rotation: 20});
  store.getState().undo();
  assert.equal(store.getState().screenshotSettings.rotation, original.rotation);
  assert.equal(store.getState().canUndo, false);
  store.getState().setScreenshotGradient("#ffffff");
  assert.equal(store.getState().canRedo, false);
});

test("transient state and no-op edits never add undo steps", () => {
  const {store} = freshStore();
  store.getState().setIsExporting(true);
  store.getState().setPreviewRef({});
  store.getState().setScreenshotSettings({...store.getState().screenshotSettings});
  store.getState().setEditorMode("code");
  assert.equal(store.getState().canUndo, false);
});

test("undo cancels stale debounced code persistence", async () => {
  const {store, saved} = freshStore();
  const original = store.getState().code;
  store.getState().setCode("edited");
  store.getState().undo();
  await new Promise((done) => setTimeout(done, 300));
  assert.equal(JSON.parse(saved.get("shotzly-editor-state")).code, original);
});

test("deleting the selected layer selects a remaining image and history keeps selection valid", () => {
  const {store} = freshStore();
  const image = {src: "data:image/png;base64,test", name: "test", x: 50, y: 50, width: 40, rotation: 0, radius: 8, shadow: false};
  const first = {...image, id: "first"};
  const second = {...image, id: "second"};
  store.getState().setCanvasImages([first, second]);
  store.getState().selectCanvasImage("second");
  store.getState().setCanvasImages([first]);
  assert.equal(store.getState().selectedCanvasImageId, "first");
  store.getState().setCanvasImages([]);
  assert.equal(store.getState().selectedCanvasImageId, null);
  store.getState().undo();
  assert.equal(store.getState().selectedCanvasImageId, "first");
  store.getState().redo();
  assert.equal(store.getState().selectedCanvasImageId, null);
});

test("history is bounded to forty image edits", () => {
  const {store} = freshStore();
  for (let index = 0; index < 50; index++) store.getState().setUploadedImage(String(index));
  for (let index = 0; index < 40; index++) store.getState().undo();
  assert.equal(store.getState().uploadedImage, "9");
  assert.equal(store.getState().canUndo, false);
});

test("redaction uses opaque black pixels and covers reverse-drag bounds", () => {
  const {drawMark} = require("../src/utils/markup.ts");
  const calls = [];
  const context = {
    save() {}, restore() {},
    fillRect(...bounds) { calls.push({bounds, color: this.fillStyle, alpha: this.globalAlpha}); },
    globalAlpha: 1,
  };
  drawMark(context, {tool: "redact", start: {x: 80.4, y: 60.2}, end: {x: 10.1, y: 20.1}, width: 4, color: "red", text: ""});
  assert.deepEqual(calls, [{bounds: [10, 20, 72, 42], color: "#000000", alpha: 1}]);
});

test("clipboard write starts before image rendering resolves", async () => {
  const {writeImageToClipboard} = require("../src/utils/snippetExport.ts");
  let item;
  Object.defineProperty(global, "navigator", {configurable: true, value: {clipboard: {write: async (items) => { item = items[0]; }}}});
  global.ClipboardItem = class { constructor(data) { this.data = data; } };
  let finish;
  const blob = new Promise((resolve) => { finish = resolve; });
  const writing = writeImageToClipboard(() => blob);
  assert.equal(item.data["image/png"], blob);
  finish(new Blob());
  await writing;
});

test("unsupported clipboard rejects instead of reporting a successful copy", async () => {
  const {writeImageToClipboard} = require("../src/utils/snippetExport.ts");
  Object.defineProperty(global, "navigator", {configurable: true, value: {}});
  await assert.rejects(() => writeImageToClipboard(async () => new Blob()), /unavailable/);
});
