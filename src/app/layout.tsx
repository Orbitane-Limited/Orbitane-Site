import type { Metadata } from "next";
import { Bricolage_Grotesque, Martian_Mono } from "next/font/google";
import "./globals.css";
import { site, contact } from "@/content/site";
import { LenisProvider } from "@/lib/lenis";
import { Grain } from "@/components/motion/grain";
import { OrbitalSystem } from "@/components/system/orbital-system";
import { Nav } from "@/components/sections/nav";

/**
 * Type (docs/03 §3): Bricolage Grotesque for display and body (variable, with the
 * optical-size axis so large sizes get character and body sizes stay calm);
 * Martian Mono 500 for telemetry and numerals only.
 */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const martian = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
  weight: "500",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  description: site.description,
  ...(contact.email ? { email: contact.email } : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bricolage.variable} ${martian.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
        <LenisProvider>
          <Grain />
          <OrbitalSystem />
          <Nav />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
