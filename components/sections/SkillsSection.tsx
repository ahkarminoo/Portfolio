"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { SkillGroup } from "@/data/projects";

type SkillsSectionProps = {
  skillGroups: SkillGroup[];
  title: string;
  subtitle: string;
};

export function SkillsSection({ skillGroups, title, subtitle }: SkillsSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || skillGroups.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(".skill-card", {
        y: 60,
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [skillGroups]);

  return (
    <section ref={sectionRef} className="section-card" aria-label={title}>
      <div className="section-heading">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="skills-grid">
        {skillGroups.map((group) => (
          <article key={group.group} className="skill-card">
            <h3>{group.group}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
