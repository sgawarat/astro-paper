import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/posts";

const posts = defineCollection({
  // loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  loader: glob({ pattern: ["**/*.md", "!**/_*/**", "!**/_*"], base: BLOG_PATH }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
/*
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
*/
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
/*
      description: z.string(),
*/
      description: z.string().default(""),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
/*
    }),
*/
      pubDatetime: z.date().optional(),
      modDatetime: z.date().optional().nullable(),
      dateCreated: z.date().optional(),
      dateModified: z.date().optional().nullable(),
    }).transform(data => ({
      ...data,
      pubDatetime: data.pubDatetime ?? data.dateCreated ?? new Date(),
      modDatetime: data.modDatetime ?? data.dateModified,
    })),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

export const collections = { posts, pages };
