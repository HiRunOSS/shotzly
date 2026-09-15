import {Metadata} from "next";
import {
  DEFAULT_OG_IMAGE,
  SCREENSHOT_OG_IMAGE,
  SITE_NAME,
  absoluteUrl,
  coreKeywords,
  defaultRobots,
} from "@/utils/seo";

export function generateEditorMetadata(): Metadata {
  return {
    title: "Code Snippet Generator, Keyboard for Code & Screenshot Editor",
    description:
      "Use Shotzly's free editor to generate code snippet images, create keyboard-style code screenshots, and polish screenshots with gradients, frames, shadows, and export controls.",
    keywords: [
      ...coreKeywords,
      "code snippet editor",
      "code editor",
      "keyboard code generator",
      "screenshot generator",
      "online screenshot editor",
      "code visualization",
    ],
    alternates: {
      canonical: "/editor",
    },
    openGraph: {
      type: "website",
      title: `Code Snippet Generator & Screenshot Editor - ${SITE_NAME}`,
      description:
        "Create polished code snippet images and screenshots with syntax highlighting, themes, background gradients, frame controls, and one-click exports.",
      url: absoluteUrl("/editor"),
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1920,
          height: 990,
          alt: "Shotzly code snippet generator editor preview",
        },
        {
          url: SCREENSHOT_OG_IMAGE,
          width: 1920,
          height: 990,
          alt: "Shotzly screenshot editor preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Code Snippet Generator & Screenshot Editor - Shotzly",
      description:
        "Generate shareable code screenshots and edit screenshots with Shotzly's free online editor.",
      images: [absoluteUrl(DEFAULT_OG_IMAGE)],
    },
    robots: defaultRobots,
  };
}
