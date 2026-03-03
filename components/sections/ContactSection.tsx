import { contactLinks, profileConfig } from "@/data/projects";

export function ContactSection() {
  return (
    <section className="section-card" aria-label="Contact">
      <div className="section-heading">
        <h2>Let&apos;s Connect</h2>
        <p>I&apos;m open to internship and junior software opportunities.</p>
      </div>
      <div className="contact-row">
        {contactLinks.map((link) => (
          <a key={link.label} href={link.href} className="btn btn-secondary" target="_blank" rel="noreferrer">
            {link.label}
          </a>
        ))}
      </div>
      <p className="contact-note">
        Preferred contact: <a href={`mailto:${profileConfig.email}`}>{profileConfig.email}</a>
      </p>
    </section>
  );
}
