import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

const blog = defineCollection({
  loader: glob({
    pattern: ["**/*.{md,mdx}", "!**/_*/**", "!**/_*"],
    base: SITE.contentDir,
  }),
  schema: ({ image }) =>
    z
      .object({
        author: z.string().default(SITE.author),
        // pubDatetime: z.date(),
        // modDatetime: z.date().optional().nullable(),
        title: z.string(),
        featured: z.boolean().optional(),
        draft: z.boolean().optional(),
        tags: z.array(z.string()).default(["others"]),
        ogImage: image().or(z.string()).optional(),
        description: z.string().default(""),
        canonicalURL: z.string().optional(),
        hideEditPost: z.boolean().optional(),
        timezone: z.string().optional(),
        dateCreated: z.date().optional(),
        dateModified: z.date().optional(),
        date: z.date().optional(),
        lastmod: z.date().optional(),
      })
      .transform(data => ({
        ...data,
        pubDatetime: data.dateCreated ?? data.date ?? new Date(),
        modDatetime: data.dateModified ?? data.lastmod,
      })),
});

export const collections = { blog };
