import type { MetadataRoute } from "next";
import { projectOverrides } from "@/data/projects";

const baseUrl = "https://portfolio.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectPages = projectOverrides.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date()
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    ...projectPages
  ];
}
