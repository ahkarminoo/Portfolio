"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type PointerAuraProviderProps = {
  children: React.ReactNode;
};

export function PointerAuraProvider({ children }: PointerAuraProviderProps) {
  const auraRef = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: 0, y: 0, active: false, initialized: false });
  const rafId = useRef<number | null>(null);
  const nodesRef = useRef<NodeListOf<HTMLElement> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const auraEl = auraRef.current;
    if (!auraEl) return;

    gsap.ticker.fps(120);

    const reactiveSelector = [
      ".section-card",
      ".project-card",
      ".profile-card",
      ".skill-card",
      ".credential-card"
    ].join(",");

    const maxDistance = 220;
    const xTo = gsap.quickTo(auraEl, "x", { duration: 0.15, ease: "power3.out" });
    const yTo = gsap.quickTo(auraEl, "y", { duration: 0.15, ease: "power3.out" });

    const update = () => {
      const { x, y, active, initialized } = target.current;

      if (initialized) {
        xTo(x);
        yTo(y);
      }
      gsap.to(auraEl, { opacity: active ? 1 : 0, duration: 0.15, overwrite: "auto" });

      if (!active || !nodesRef.current) return;

      for (const node of nodesRef.current) {
        const rect = node.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - x;
        const dy = cy - y;
        const d = Math.sqrt(dx * dx + dy * dy);

        const proximity = Math.max(0, Math.min(1, 1 - d / maxDistance));
        gsap.to(node, {
          "--pointerProximity": proximity,
          duration: 0.15,
          ease: "power2.out",
          overwrite: "auto"
        });
      }
    };

    const schedule = () => {
      if (rafId.current != null) return;
      rafId.current = window.requestAnimationFrame(update);
    };

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      target.current.active = true;
      target.current.initialized = true;
      schedule();
    };

    const onLeave = () => {
      target.current.active = false;
      gsap.to(auraEl, { opacity: 0, duration: 0.15, overwrite: "auto" });
      if (nodesRef.current) {
        for (const node of nodesRef.current) node.style.removeProperty("--pointerProximity");
      }
    };

    let cancel = false;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (cancel) return;
        nodesRef.current = document.querySelectorAll(reactiveSelector);
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerdown", onMove, { passive: true });
        window.addEventListener("blur", onLeave);
        document.addEventListener("mouseleave", onLeave);
      });
    });

    return () => {
      cancel = true;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("mouseleave", onLeave);
      if (rafId.current != null) window.cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      <div ref={auraRef} className="pointer-aura" aria-hidden />
      {children}
    </>
  );
}
