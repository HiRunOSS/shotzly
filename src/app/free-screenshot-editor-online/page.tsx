import type {Metadata} from "next";
import ToolSeoPage from "@/components/seo-pages/ToolSeoPage";
import editorPreview from "../../../public/sample-img/editor1.png";
import {
  SCREENSHOT_OG_IMAGE,
  SITE_CREATOR,
  SITE_NAME,
  absoluteUrl,
  defaultRobots,
} from "@/utils/seo";

const pageUrl = absoluteUrl("/free-screenshot-editor-online");
const title = "Free Screenshot Editor Online";
const description =
  "Free screenshot editor online and screenshot beautifier. Add backgrounds, frames, shadows, and markup, then export images with no signup or watermark.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "free screenshot editor online",
    "screenshot editor",
    "online screenshot editor",
    "screenshot beautifier",
    "screenshot background generator",
    "screenshot mockup maker",
    "screenshot mockup generator",
    "screenshot editor without watermark",
    "free screenshot tool",
  ],
  alternates: {
    canonical: "/free-screenshot-editor-online",
  },
  openGraph: {
    title,
    description,
    url: pageUrl,
    type: "website",
    siteName: SITE_NAME,
    images: [
      {
        url: absoluteUrl(SCREENSHOT_OG_IMAGE),
        width: 4096,
        height: 2304,
        type: "image/png",
        alt: "Shotzly free screenshot editor online preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [absoluteUrl(SCREENSHOT_OG_IMAGE)],
  },
  robots: defaultRobots,
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: title,
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  url: pageUrl,
  image: absoluteUrl(SCREENSHOT_OG_IMAGE),
  author: {
    "@type": "Person",
    name: SITE_CREATOR,
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Free online screenshot editor",
    "Upload or capture website screenshots",
    "Add backgrounds, shadows, frames, blur, and browser chrome",
    "Arrange multiple screenshots",
    "Export PNG, JPEG, or WebP without watermark",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Shotzly a free screenshot editor online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Shotzly lets you edit screenshots in your browser for free, with no signup and no watermark on exports.",
      },
    },
    {
      "@type": "Question",
      name: "Can I add backgrounds and shadows to screenshots?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Shotzly includes gradients, image backgrounds, frames, shadows, blur, rounded corners, browser chrome, and layout controls.",
      },
    },
    {
      "@type": "Question",
      name: "Can I export edited screenshots?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Edited screenshots can be exported as PNG, JPEG, or WebP images in high resolution.",
      },
    },
  ],
};

export default function FreeScreenshotEditorOnlinePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([webAppSchema, faqSchema]),
        }}
      />
      <ToolSeoPage
        badge="100% Free | No Signup | No Watermarks"
        title="Free Screenshot Editor Online"
        description="Beautify screenshots online with backgrounds, shadows, browser frames, blur, and markup. Export polished images from your browser without a watermark."
        primaryCta="Open Free Editor"
        secondaryCta="See All Features"
        editorHref="/editor?mode=screenshot"
        preview={editorPreview}
        previewAlt="Shotzly screenshot editor with background and export controls"
        sectionTitle="Online Screenshot Editor and Beautifier"
        sectionDescription="Create cleaner product shots and tutorials with a screenshot background generator and simple editing tools in your browser."
        features={[
          {
            icon: "upload",
            title: "Upload or capture",
            description:
              "Drop in an existing screenshot or capture a website screenshot, then start polishing it right inside the browser.",
          },
          {
            icon: "layers",
            title: "Screenshot mockup maker",
            description:
              "Add browser frames, rounded corners, shadows, background images, gradients, and multi-screenshot layouts.",
          },
          {
            icon: "wand",
            title: "Markup and export",
            description:
              "Highlight important areas, hide private details, add stickers, then export crisp PNG, JPEG, or WebP files.",
          },
        ]}
        steps={[
          "Upload a screenshot or capture a webpage from a URL inside the editor.",
          "Choose the background, aspect ratio, frame, shadow, crop, blur, and markup that fit the story.",
          "Export the polished screenshot as a high-resolution image with no signup and no watermark.",
        ]}
        faq={[
          {
            question: "Can I edit screenshots online?",
            answer:
              "Yes. Shotzly runs in the browser, so you can upload, style, annotate, and export screenshots online.",
          },
          {
            question: "Can I make product screenshots?",
            answer:
              "Yes. Shotzly works well for product launches, app previews, tutorials, documentation, landing pages, and social posts.",
          },
          {
            question: "Does Shotzly add watermarks?",
            answer:
              "No. Screenshot exports are watermark-free, and you do not need to create an account to download them.",
          },
        ]}
      />
    </>
  );
}
