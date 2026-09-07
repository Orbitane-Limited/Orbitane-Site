import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Privacy · ${site.name}`,
  description: "What orbitane.com collects: nothing you did not send us.",
};

/**
 * Privacy in plain words (docs/02 §3, docs/05 §12). True as built: no analytics,
 * no cookies, no third-party scripts. Update this page before adding any of them.
 */
export default function PrivacyPage() {
  return (
    <main data-camera="page" className="relative z-10 mx-auto w-full max-w-3xl px-5 pt-40 pb-32 md:px-8">
      <p className="telemetry text-starlight-3">Privacy · plain words</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] leading-[1.0] md:text-6xl">
        This site collects nothing you did not send us.
      </h1>
      <div className="mt-10 flex flex-col gap-6 text-base leading-[1.7] text-starlight-2 md:text-lg">
        <p>orbitane.com sets no cookies, runs no analytics, and loads no third-party tracking scripts.</p>
        <p>
          If you email us, we keep your message and your address so we can reply and continue the conversation. We do
          not add you to a mailing list and we do not share your details.
        </p>
        <p>
          The site is served over HTTPS. Our hosting provider keeps standard server logs (such as IP address and
          request time) for security and reliability; we do not use them to identify visitors.
        </p>
        <p>If any of this changes, this page changes first.</p>
      </div>
      <p className="mt-12 text-sm text-starlight-3">
        Questions: see{" "}
        <Link href="/#contact" className="text-starlight underline-offset-4 hover:underline">
          contact
        </Link>
        .
      </p>
    </main>
  );
}
