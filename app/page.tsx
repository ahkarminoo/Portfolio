import { FlipGateway } from "@/components/sections/FlipGateway";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { profileConfig, skillGroups } from "@/data/projects";
import { getGitHubProfile, type GitHubProfile } from "@/lib/github";
import { getPortfolioProjects, type PortfolioProject } from "@/lib/projects";

export default async function HomePage() {
  let profile: GitHubProfile | null = null;
  let projects: PortfolioProject[] = [];

  try {
    [profile, projects] = await Promise.all([
      getGitHubProfile(profileConfig.githubUsername),
      getPortfolioProjects(profileConfig.githubUsername)
    ]);
  } catch {
    profile = null;
  }

  if (!profile) {
    return (
      <section className="section-card" aria-live="polite">
        <h1>{profileConfig.fullName}</h1>
        <p>
          Unable to load GitHub data right now. Please try again in a moment or visit{" "}
          <a href={`https://github.com/${profileConfig.githubUsername}`}>GitHub profile</a>.
        </p>
      </section>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profileConfig.fullName,
    jobTitle: profileConfig.targetRole,
    email: profileConfig.email,
    alumniOf: profileConfig.education.school,
    url: profile.html_url,
    sameAs: [profile.html_url],
    knowsAbout: [
      "Next.js",
      "React",
      "TypeScript",
      "Local-first AI systems",
      "LangChain",
      "Ollama",
      "MongoDB"
    ]
  };

  const projectListData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: projects.map((project, index) => ({
      "@type": "CreativeWork",
      position: index + 1,
      name: project.displayName,
      description: project.summary,
      url: project.repoUrl
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectListData) }} />
      <FlipGateway
        avatarUrl={profile.avatar_url}
        fullName={profileConfig.fullName}
        role={profileConfig.targetRole}
      >
        <div className="reveal-item">
          <HeroSection profile={profile} />
        </div>
        <div className="reveal-item">
          <SkillsSection 
            skillGroups={skillGroups} 
            title="Technical Skills" 
            subtitle="Tools and technologies I work with"
          />
        </div>
        <div className="reveal-item">
          <ProjectsSection 
            projects={projects} 
            title="Featured Projects" 
            subtitle="Systems and products I've built"
          />
        </div>
        <div className="reveal-item">
          <ExperienceSection 
            education={profileConfig.education} 
            certifications={profileConfig.certifications}
            title="Experience" 
            subtitle="Education and certifications"
          />
        </div>
        <div className="reveal-item">
          <ContactSection 
            email={profileConfig.email} 
            resumePath={profileConfig.resumePath}
            links={[
              { label: "GitHub", href: `https://github.com/${profileConfig.githubUsername}` },
              { label: "Live", href: "https://foodloft.me" }
            ]}
          />
        </div>
      </FlipGateway>
    </>
  );
}
