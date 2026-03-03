import { profileConfig } from "@/data/projects";

export function ExperienceSection() {
  return (
    <section className="section-card" aria-label="Credentials">
      <div className="section-heading">
        <h2>Credentials</h2>
        <p>Academic and foundational credentials relevant to software internship roles.</p>
      </div>

      <div className="credentials-grid">
        <article className="credential-card">
          <h3>Education</h3>
          <p className="credential-main">{profileConfig.education.degree}</p>
          <p>{profileConfig.education.school}</p>
          <p>
            {profileConfig.education.location} · {profileConfig.education.timeline}
          </p>
        </article>
        <article className="credential-card">
          <h3>Certifications</h3>
          <ul>
            {profileConfig.certifications.map((certification) => (
              <li key={certification}>{certification}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
