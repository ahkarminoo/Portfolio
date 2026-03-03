import Link from "next/link";
import { notFound } from "next/navigation";
import { profileConfig } from "@/data/projects";
import { getPortfolioProjects } from "@/lib/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const projects = await getPortfolioProjects(profileConfig.githubUsername);
  const project = projects.find((item) => item.slug === slug);

  if (!project) notFound();

  return (
    <article className="project-layout">
      <section className="section-card">
        <Link href="/" className="project-page-back">
          ← Back to portfolio
        </Link>
        <h1>{project.displayName}</h1>
        <p className="summary">{project.summary}</p>
        <div className="project-actions">
          <a href={project.repoUrl} className="btn btn-primary" target="_blank" rel="noreferrer">
            View repository
          </a>
          {project.liveUrl ? (
            <a href={project.liveUrl} className="btn btn-tertiary" target="_blank" rel="noreferrer">
              Open live demo
            </a>
          ) : null}
        </div>
      </section>

      <section className="section-card">
        <h2>Challenge</h2>
        <p>{project.challenge}</p>
      </section>

      <section className="section-card">
        <h2>Architecture Snapshot</h2>
        <p>{project.architecture}</p>
        <p className="summary">
          Flow: User request → frontend/app layer → domain logic and data services → output and monitoring.
        </p>
      </section>

      <section className="section-card">
        <h2>Implementation Highlights</h2>
        <ul className="impact-list">
          {project.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="section-card">
        <h2>Outcome and Recruiter Signal</h2>
        <ul className="impact-list">
          {project.impact.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
