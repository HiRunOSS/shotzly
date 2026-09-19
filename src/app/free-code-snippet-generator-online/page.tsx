import type {Metadata} from "next";
import ToolSeoPage from "@/components/seo-pages/ToolSeoPage";
import editorPreview from "../../../public/sample-img/editor2.png";
import {
  DEFAULT_OG_IMAGE,
  SITE_CREATOR,
  SITE_NAME,
  absoluteUrl,
  defaultRobots,
} from "@/utils/seo";

const pageUrl = absoluteUrl("/free-code-snippet-generator-online");
const title = "Free Code Snippet Generator Online";
const description =
  "Free code snippet generator online and code screenshot generator. Paste code, add syntax highlighting and a background, then export PNG or SVG with no watermark.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "free code snippet generator online",
    "code snippet generator",
    "code screenshot generator",
    "code to image generator",
    "code snippet image generator",
    "code image generator",
    "syntax highlighted code image",
    "free code to image tool",
  ],
  alternates: {
    canonical: "/free-code-snippet-generator-online",
  },
  openGraph: {
    title,
    description,
    url: pageUrl,
    type: "website",
    siteName: SITE_NAME,
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE),
        width: 4096,
        height: 2304,
        type: "image/jpeg",
        alt: "Shotzly free code snippet generator online preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
  robots: defaultRobots,
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: title,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: pageUrl,
  image: absoluteUrl(DEFAULT_OG_IMAGE),
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
    "Free online code snippet generator",
    "Syntax highlighting for code images",
    "Themes, backgrounds, padding, line numbers, and window frames",
    "PNG, SVG, and clipboard export",
    "No signup and no watermark",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Shotzly a free code snippet generator online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Shotzly lets you create and export code snippet images in your browser for free, with no signup and no watermark.",
      },
    },
    {
      "@type": "Question",
      name: "Can I export code snippets as images?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can export polished code snippets as PNG or SVG files, or copy the generated image to your clipboard.",
      },
    },
    {
      "@type": "Question",
      name: "Does the code snippet generator support syntax highlighting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Shotzly includes syntax highlighting, themes, line numbers, window styles, backgrounds, and layout controls for clean code visuals.",
      },
    },
  ],
};

export default function FreeCodeSnippetGeneratorOnlinePage() {
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
        title="Free Code Snippet Generator Online"
        description="Turn any snippet into a syntax-highlighted code image in seconds. Choose a theme, background, window frame, and line numbers, then export as PNG or SVG."
        primaryCta="Open Free Generator"
        secondaryCta="See Features"
        editorHref="/editor?mode=code"
        preview={editorPreview}
        previewAlt="Shotzly code editor for creating syntax-highlighted snippet images"
        sectionTitle="Code Screenshot Generator for Shareable Snippets"
        sectionDescription="Use this code to image generator to make readable visuals for docs, GitHub READMEs, blog posts, tutorials, and social media."
        features={[
          {
            icon: "type",
            title: "Syntax-highlighted code images",
            description:
              "Paste JavaScript, TypeScript, HTML, CSS, Python, or other code and turn it into a clean visual with readable highlighting.",
          },
          {
            icon: "palette",
            title: "Themes and backgrounds",
            description:
              "Choose editor themes, gradients, padding, shadows, window styles, and line numbers to match the place you are sharing.",
          },
          {
            icon: "download",
            title: "Export without friction",
            description:
              "Download PNG or SVG files, or copy the generated code image directly to your clipboard when you need to move fast.",
          },
        ]}
        steps={[
          "Paste your code into the online editor and pick the language for accurate syntax styling.",
          "Tune the theme, background, padding, line numbers, and frame until the snippet looks ready to share.",
          "Export the final code snippet image as PNG or SVG with no account, no watermark, and no install.",
        ]}
        faq={[
          {
            question: "Is Shotzly free?",
            answer:
              "Yes. Shotzly is free to use in the browser and does not add watermarks to exported code images.",
          },
          {
            question: "Do I need to sign up?",
            answer:
              "No. You can open the generator, create a code snippet image, and export it without creating an account.",
          },
          {
            question: "Can I use it for social posts?",
            answer:
              "Yes. The editor is built for shareable code visuals for X, LinkedIn, blogs, docs, README files, and tutorials.",
          },
        ]}
      />
    </>
  );
}
