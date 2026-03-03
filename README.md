# Recruiter-First Next.js Portfolio

A recruiter-focused portfolio built with Next.js App Router, using GitHub repositories as project sources with manual case-study overrides for better hiring signal.

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- GitHub REST API for profile/repository data
- Local metadata overrides for project narratives

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build and Validate

```bash
npm run lint
npm run build
```

## Project Structure

- `app/` – routes, global styles, SEO routes, error/loading states
- `components/sections/` – homepage sections
- `data/projects.ts` – profile content, skills, and project case-study overrides
- `lib/github.ts` – GitHub API fetching
- `lib/projects.ts` – merge layer for GitHub data + overrides

## Customization

- Update recruiter content in `data/projects.ts`:
  - `profileConfig`
  - `skillGroups`
  - `projectOverrides`
- Update deployment URL placeholders in:
  - `app/layout.tsx`
  - `app/sitemap.ts`
  - `app/robots.ts`

## Notes

- GitHub data is fetched with revalidation (`30m` level behavior through `revalidate` usage).
- `projectOverrides` ensures clean project names, better summaries, and consistent case-study quality even when repo descriptions are sparse.
