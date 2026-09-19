import type {Metadata} from "next";

export const SITE_URL = "https://shotzly.com";
export const SITE_NAME = "Shotzly";
export const SITE_CREATOR = "Arun Kumar";
export const SITE_CREATOR_URL = "https://x.com/hiarun02";
export const GITHUB_REPO_URL = "https://github.com/HiRunOSS/shotzly";
export const DEFAULT_OG_IMAGE = "/preview.jpg";
export const SCREENSHOT_OG_IMAGE = "/sample-img/editor2.png";

export const coreKeywords = [
  "code snippet generator",
  "code screenshot generator",
  "code image generator",
  "keyboard for code",
  "screenshot editor",
  "screenshot tool",
  "syntax highlighter",
  "code editor online",
  "developer screenshot tool",
  "code beautifier",
  "share code snippets",
  "social media code snippets",
];

export const defaultRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
