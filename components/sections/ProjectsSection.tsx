"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import type { PortfolioProject } from "@/lib/projects";

type ProjectsSectionProps = {
  projects: PortfolioProject[];
  title: string;
  subtitle: string;
};

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function ProjectsSection({ projects, title, subtitle }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || projects.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(".project-card", {
        y: 60,
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        stagger: 0.12,
        ease: "back.out(1.7)"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [projects]);

  return (
    <section ref={sectionRef} className="section-card" aria-label={title}>
      <div className="section-heading">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      {projects.length === 0 ? (
        <p className="empty-state">
          Projects are loading from GitHub. If this persists, please refresh in a moment.
        </p>
      ) : (
        <div className="project-grid">
          {projects.map((project) => {
            const isFeaturedProject = project.priority === "primary" && project.featuredRank === 1;
            const cardClassName = isFeaturedProject ? "project-card project-card-featured" : "project-card";

            return (
            <article key={project.id} className={cardClassName}>
              <div className="project-head">
                {isFeaturedProject ? <span className="project-badge">Featured</span> : null}
                <h3>{project.displayName}</h3>
                <span className="project-language">{project.language}</span>
              </div>
              <p>{project.summary}</p>
              <ul className="project-highlights">
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="project-meta">
                <span>{formatDate(project.updatedAt)}</span>
                <span>{project.stars} ★ · {project.forks} ⑂</span>
              </div>
              <div className="project-actions">
                <Link href={`/projects/${project.slug}`} className="btn btn-secondary">
                  Case Study
                </Link>
                <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                  GitHub
                </a>
                {project.liveUrl ? (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-tertiary">
                    Live
                  </a>
                ) : null}
              </div>
            </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
