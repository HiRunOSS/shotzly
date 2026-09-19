import type {Metadata} from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Shotzly handles editor data, website captures, analytics, and external services.",
  alternates: {canonical: "/privacy"},
};

export default function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy Policy"
      intro="This page explains what happens to your data when you use Shotzly. Last updated September 19, 2026."
    >
      <section>
        <h2 className="text-xl font-semibold">Your work in the editor</h2>
        <p className="mt-3 leading-7 text-white/65">
          Code, uploaded images, and editor settings are processed in your browser. Shotzly saves editor state in your browser&apos;s local storage so you can return to your work. Exports are generated in your browser. Clearing this site&apos;s stored data removes the saved editor state from that browser.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Website screenshot capture</h2>
        <p className="mt-3 leading-7 text-white/65">
          If you choose to capture a website, Shotzly sends the URL you enter to its server, which forwards it to Screenshot Studio to create the image. The returned screenshot is sent back to your browser. Do not use this feature with private or sensitive URLs you do not want shared with that provider.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Analytics and hosting</h2>
        <p className="mt-3 leading-7 text-white/65">
          Shotzly uses Vercel Web Analytics for aggregate page statistics and Vercel Speed Insights for performance measurements. Vercel says its Web Analytics does not use tracking cookies or collect personal identifiers across sites. Hosting providers may also process ordinary request information, such as IP addresses, to deliver and secure the service. Read Vercel&apos;s <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noreferrer" className="text-white underline underline-offset-4">analytics privacy information</a> for details.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold">External services and links</h2>
        <p className="mt-3 leading-7 text-white/65">
          The site loads some badges from external websites and requests the public GitHub star count. Visiting external links or loading their content may send request information to those services. Their own privacy policies apply.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Your choices and questions</h2>
        <p className="mt-3 leading-7 text-white/65">
          You can clear saved work through your browser&apos;s site data settings. For questions about this policy or your data, use the options on the <Link href="/contact" className="text-white underline underline-offset-4">Contact page</Link>. We may update this page when the service changes.
        </p>
      </section>
    </InfoPage>
  );
}
