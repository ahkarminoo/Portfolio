import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { profileConfig } from "@/data/projects";
import { ClientShell } from "@/components/shell/ClientShell";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}catch(e){}})();`}
        </Script>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
