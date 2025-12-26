import fs from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import process from "node:process";
import { z } from "zod";

const siteConfigEnv = process.env.SITE_CONFIG ?? "./site.config.json";
const siteConfigPath = isAbsolute(siteConfigEnv)
  ? siteConfigEnv
  : resolve(siteConfigEnv);
if (!fs.existsSync(siteConfigPath)) {
  throw new Error(`"${siteConfigPath}" does not exist.`);
}
const siteConfigDir = dirname(siteConfigPath);

function resolvePath(s: string) {
  return relative(
    process.cwd(),
    isAbsolute(s) ? s : resolve(siteConfigDir, s)
  ).replaceAll("\\", "/");
}

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
    postPerIndex: z.number().default(5),
    postPerPage: z.number().default(8),
    scheduledPostMargin: z.number().default(15 * 60 * 1000),
    showArchives: z.boolean().default(true),
    showBackButton: z.boolean().default(true),
    showProgressBar: z.boolean().default(true),
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
    contentDir: z.string().transform(resolvePath),
    socials: socialConfigSchema.default([]),
    bibliography: z
      .string()
      .optional()
      .transform(s => (s !== undefined ? resolvePath(s) : s)),
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
