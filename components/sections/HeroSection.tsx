"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { profileConfig } from "@/data/projects";

export function HeroSection() {
  const heroRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out"
      });

      if (!cardRef.current) return;

      const hoverTimeline = gsap.timeline({ paused: true });
      hoverTimeline.to(cardRef.current, {
        duration: 0.35,
        y: -6,
        scale: 1.015,
        rotateX: -3,
        boxShadow: "0 22px 46px rgba(0,0,0,0.32)",
        ease: "power2.out"
      });

      const node = cardRef.current;
      const onEnter = () => hoverTimeline.play();
      const onLeave = () => hoverTimeline.reverse();

      node.addEventListener("pointerenter", onEnter);
      node.addEventListener("pointerleave", onLeave);
      node.addEventListener("focusin", onEnter);
      node.addEventListener("focusout", onLeave);

      return () => {
        node.removeEventListener("pointerenter", onEnter);
        node.removeEventListener("pointerleave", onLeave);
        node.removeEventListener("focusin", onEnter);
        node.removeEventListener("focusout", onLeave);
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero-card-wrapper" aria-label="Intro">
      <div ref={cardRef} className="hero-card section-card" tabIndex={0}>
        <p className="eyebrow">One-page portfolio experience</p>
        <h1>{profileConfig.fullName}</h1>
        <p className="hero-role">{profileConfig.targetRole}</p>
        <p className="hero-summary">{profileConfig.heroSummary}</p>
        <div className="cta-row">
          <a className="btn btn-primary" href={profileConfig.resumePath}>
            Download Resume
          </a>
          <Link className="btn btn-tertiary" href="/projects/foodloft">
            Explore FoodLoft
          </Link>
          <a className="btn btn-secondary" href={`mailto:${profileConfig.email}`}>
            Contact Me
          </a>
        </div>
        <p className="availability">{profileConfig.availability}</p>
      </div>
    </section>
  );
}
