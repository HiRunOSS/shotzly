import type {Metadata} from "next";
import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import LandingFooter from "@/components/landing/Footer";

import Feedback from "@/components/landing/Feedback";
import LiveExamples from "@/components/landing/LiveExamples";
import {
  DEFAULT_OG_IMAGE,
  GITHUB_REPO_URL,
  SITE_CREATOR,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  coreKeywords,
} from "@/utils/seo";
// import SupportDialog from "@/components/landing/SupportDialog";

export const metadata: Metadata = {
  title: "Free Code Snippet Generator, Keyboard for Code & Screenshot Editor",
  description:
    "Shotzly helps developers create beautiful code snippet images, keyboard-style code visuals, and polished screenshots for docs, blogs, GitHub, X, LinkedIn, and presentations.",
  keywords: coreKeywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Shotzly - Free Code Snippet Generator & Screenshot Editor",
    description:
      "Generate code snippet screenshots with syntax highlighting, themes, gradients, and export controls. Edit screenshots with frames, shadows, blur, and aspect ratios.",
    url: SITE_URL,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1920,
        height: 990,
        alt: "Shotzly code snippet generator preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shotzly - Free Code Snippet Generator",
    description:
      "Create code snippet images, keyboard-style code screenshots, and polished screenshot visuals online.",
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: SITE_URL,
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
    "Code snippet generator",
    "Keyboard-style code screenshot creator",
    "Screenshot editor with frames and shadows",
    "Syntax highlighting for 50+ languages",
    "Theme, gradient, layout, and export controls",
  ],
  sameAs: [GITHUB_REPO_URL],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Shotzly?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Shotzly is a free online code snippet generator and screenshot editor for creating shareable developer visuals.",
      },
    },
    {
      "@type": "Question",
      name: "Can I generate code screenshots with syntax highlighting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Shotzly supports syntax-highlighted code snippets with themes, backgrounds, window styles, and export controls.",
      },
    },
    {
      "@type": "Question",
      name: "Can I edit screenshots in Shotzly?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The screenshot editor lets you upload or capture screenshots, apply gradients, frames, shadows, blur, aspect ratios, and export polished images.",
      },
    },
  ],
};

function SeoFeatureSection() {
  const features = [
    {
      title: "Code Snippet Generator",
      description:
        "Paste code, choose a language, apply syntax highlighting, and export clean code screenshots for documentation, blogs, GitHub README files, and social posts.",
    },
    {
      title: "Keyboard for Code",
      description:
        "Create keyboard-style code visuals with polished window chrome, spacing, background gradients, and layout controls that make snippets easier to read and share.",
    },
    {
      title: "Screenshot Editor",
      description:
        "Upload or capture screenshots, then add frames, rounded corners, shadows, blur, aspect ratios, and export-ready backgrounds without opening a design app.",
    },
  ];
  const faqs = [
    {
      question: "What is Shotzly?",
      answer:
        "Shotzly is a free online code snippet generator and screenshot editor for creating shareable developer visuals.",
    },
    {
      question: "Can I generate code screenshots with syntax highlighting?",
      answer:
        "Yes. Shotzly supports syntax-highlighted code snippets with themes, backgrounds, window styles, and export controls.",
    },
    {
      question: "Can I edit screenshots in Shotzly?",
      answer:
        "Yes. The screenshot editor lets you upload or capture screenshots, apply gradients, frames, shadows, blur, aspect ratios, and export polished images.",
    },
  ];

  return (
    <section className="bg-white py-14 dark:bg-[#111010] sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
              Developer image tools
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-950 dark:text-white sm:text-4xl">
              Make code snippets and screenshots ready to share.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              Shotzly combines a code snippet generator, a keyboard-style code
              visual tool, and a screenshot editor in one fast browser
              workspace.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-white/10 dark:bg-white/[0.04]"
              >
                <h3 className="text-lg font-semibold text-gray-950 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {faqs.map((faq) => (
            <article key={faq.question}>
              <h3 className="text-base font-semibold text-gray-950 dark:text-white">
                {faq.question}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50 dark:from-[#111010] dark:via-[#111010] dark:to-[#111010]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([softwareSchema, faqSchema]),
        }}
      />
      <Navbar />
      <main className="flex min-h-screen flex-col justify-between pb-0">
        <Hero />
        <LiveExamples />
        <SeoFeatureSection />
        <Feedback />
        <LandingFooter />
      </main>
      {/* <SupportDialog /> */}
    </div>
  );
}
