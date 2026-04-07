import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://kairus.ai";
  return [
    { url: base, lastModified: new Date(), priority: 1 },
    { url: `${base}/dashboard`, lastModified: new Date(), priority: 0.9 },
    { url: `${base}/financeiro`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/marketing`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/inbox`, lastModified: new Date(), priority: 0.7 },
    { url: `${base}/tasks`, lastModified: new Date(), priority: 0.7 },
  ];
}
