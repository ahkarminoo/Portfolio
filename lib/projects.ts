import { projectOverrides, type ProjectOverride } from "@/data/projects";
import { getGitHubRepos, type GitHubRepo } from "@/lib/github";

export type PortfolioProject = {
  id: number;
  slug: string;
  repoName: string;
  displayName: string;
  summary: string;
  challenge: string;
  architecture: string;
  impact: string[];
  highlights: string[];
  featuredRank: number;
  priority: "primary" | "secondary";
  language: string;
  stars: number;
  forks: number;
  updatedAt: string;
  repoUrl: string;
  liveUrl: string | null;
};

function normalizeProject(repo: GitHubRepo, override: ProjectOverride): PortfolioProject {
  return {
    id: repo.id,
    slug: override.slug,
    repoName: repo.name,
    displayName: override.displayName,
    summary: override.oneLiner,
    challenge: override.challenge,
    architecture: override.architecture,
    impact: override.impact,
    highlights: override.highlights,
    featuredRank: override.featuredRank,
    priority: override.priority,
    language: repo.language ?? "N/A",
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: repo.updated_at,
    repoUrl: repo.html_url,
    liveUrl: override.liveUrl ?? repo.homepage
  };
}

export async function getPortfolioProjects(username: string): Promise<PortfolioProject[]> {
  const repos = await getGitHubRepos(username);
  const repoByName = new Map(repos.map((repo) => [repo.name, repo]));

  const merged = projectOverrides
    .map((override) => {
      const repo = repoByName.get(override.repoName);
      if (!repo) return null;
      return normalizeProject(repo, override);
    })
    .filter((project): project is PortfolioProject => Boolean(project));

  return merged.sort((a, b) => a.featuredRank - b.featuredRank);
}

export function getFeaturedProjects(projects: PortfolioProject[], count = 3): PortfolioProject[] {
  return projects.filter((project) => project.priority === "primary").slice(0, count);
}
