"use client";

import { PointerAuraProvider } from "@/components/providers/PointerAuraProvider";
import { SiteBackground } from "@/components/effects/SiteBackground";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type ClientShellProps = {
  children: React.ReactNode;
};

export function ClientShell({ children }: ClientShellProps) {
  return (
    <PointerAuraProvider>
      <SiteBackground />
      <div className="bg-aurora" aria-hidden />
      <div className="bg-grid" aria-hidden />
      <div className="topbar">
        <ThemeToggle />
      </div>
      <main className="site-shell">{children}</main>
    </PointerAuraProvider>
  );
}
