import type { Metadata } from "next";
import "./globals.css";
import { profileConfig } from "@/data/projects";
import { PointerAuraProvider } from "@/components/providers/PointerAuraProvider";

const siteUrl = "https://portfolio.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profileConfig.fullName} · Software Developer`,
    template: `%s · ${profileConfig.fullName}`
  },
  description:
    "Recruiter-first portfolio for Ahkar Min Oo featuring full-stack SaaS and local AI engineering projects.",
  openGraph: {
    title: `${profileConfig.fullName} · Software Developer`,
    description:
      "Case studies in full-stack product engineering, local-first AI systems, and production-ready web development.",
    type: "website",
    url: siteUrl
  },
  twitter: {
    card: "summary_large_image",
    title: `${profileConfig.fullName} · Software Developer`,
    description:
      "Internship-focused software portfolio with project impact, architecture, and implementation details."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PointerAuraProvider>
          <div className="bg-aurora" aria-hidden />
          <div className="bg-grid" aria-hidden />
          <main className="site-shell">{children}</main>
        </PointerAuraProvider>
      </body>
    </html>
  );
}
