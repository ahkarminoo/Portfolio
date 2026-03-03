const GITHUB_API_BASE = "https://api.github.com";

export type GitHubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  homepage: string | null;
  fork: boolean;
};

export type GitHubProfile = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
};

async function fetchGitHub<T>(path: string): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers: { Accept: "application/vnd.github+json" },
    next: { revalidate: 1800 }
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getGitHubProfile(username: string): Promise<GitHubProfile> {
  return fetchGitHub<GitHubProfile>(`/users/${username}`);
}

export async function getGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const repos = await fetchGitHub<GitHubRepo[]>(
    `/users/${username}/repos?sort=updated&per_page=100&type=owner`
  );

  return repos.filter((repo) => !repo.fork);
}
