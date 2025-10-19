import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const siteConfigPath = "../../site.config.json";
if (!fs.existsSync(siteConfigPath))
  throw Error(`"${siteConfigPath}" does not exist.`);
const siteConfigDir = path.dirname(siteConfigPath);

const socialConfigSchema = z
  .array(
    z.object({
      name: z.string(),
      href: z.url(),
      linkTitle: z.string(),
      icon: z.string(),
    })
  )
  .readonly();

const siteConfigSchema = z
  .object({
    website: z.url(),
    author: z.string(),
    profile: z.string(),
    desc: z.string(),
    title: z.string(),
    ogImage: z.url().optional(),
    lightAndDarkMode: z.boolean().default(true),
    postPerIndex: z.number().default(4),
    postPerPage: z.number().default(4),
    scheduledPostMargin: z.number().default(15 * 60 * 1000),
    showArchives: z.boolean().default(true),
    showBackButton: z.boolean().default(true),
    editPost: z
      .object({
        enabled: z.boolean(),
        text: z.string(),
        url: z.url(),
      })
      .default({ enabled: false, text: "", url: "" })
      .readonly(),
    dynamicOgImage: z.boolean().default(false),
    dir: z.enum(["ltr", "rtl", "auto"]).default("auto"),
    lang: z.string().default("ja"),
    timezone: z.string().default("Asia/Tokyo"),
    contentDir: z
      .string()
      .transform(s =>
        path
          .relative(
            process.cwd(),
            path.isAbsolute(s) ? s : path.resolve(siteConfigDir, s)
          )
          .replaceAll("\\", "/")
      ),
    socials: socialConfigSchema.default([]),
  })
  .readonly();
type SiteConfig = z.infer<typeof siteConfigSchema>;

function loadSiteConfig(filePath: string): SiteConfig {
  const str = fs.readFileSync(filePath, "utf-8");
  const raw = JSON.parse(str);
  const result = siteConfigSchema.safeParse(raw);
  if (!result.success) throw result.error;
  return result.data;
}

export const SITE = loadSiteConfig(siteConfigPath);
