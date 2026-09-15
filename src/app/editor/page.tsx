import EditorPageClient from "@/components/EditorPageClient";
import {generateEditorMetadata} from "@/utils/metadata";
import {
  DEFAULT_OG_IMAGE,
  SCREENSHOT_OG_IMAGE,
  SITE_CREATOR,
  absoluteUrl,
} from "@/utils/seo";

export const metadata = generateEditorMetadata();

const editorSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Shotzly Editor",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: absoluteUrl("/editor"),
  image: [absoluteUrl(DEFAULT_OG_IMAGE), absoluteUrl(SCREENSHOT_OG_IMAGE)],
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
    "Generate code snippet images",
    "Create keyboard-style code screenshots",
    "Edit screenshots with gradients and frames",
    "Export code snippets as PNG or SVG",
    "Export screenshots as PNG, JPEG, or WebP",
  ],
};

export default function EditorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(editorSchema)}}
      />
      <EditorPageClient />
    </>
  );
}
