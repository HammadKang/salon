import type { MetadataRoute } from "next";
import { salon } from "@/config/salon";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: salon.url, changeFrequency: "weekly", priority: 1 }, { url: `${salon.url}/privacy`, changeFrequency: "yearly", priority: 0.2 }];
}
