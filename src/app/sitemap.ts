import type {MetadataRoute} from "next";
import {SITE_URL} from "@/utils/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    {
      path: "/",
      priority: 1,
    },
    {
      path: "/editor",
      priority: 0.9,
    },
    {
      path: "/free-code-snippet-generator-online",
      priority: 0.95,
    },
    {
      path: "/free-screenshot-editor-online",
      priority: 0.95,
    },
    {path: "/privacy", priority: 0.3},
    {path: "/terms", priority: 0.3},
    {path: "/contact", priority: 0.4},
  ] as const;

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route.priority,
  }));
}
