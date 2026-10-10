import type { MetadataRoute } from "next";
import { salon } from "@/config/salon";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${salon.url}/sitemap.xml` };
}
