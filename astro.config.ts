import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { SITE } from "./src/config";
import { remarkAozoraRuby } from "@sgawarat/remark-aozora-ruby";
import {
  createGlob,
  remarkObsidianWikilink,
} from "@sgawarat/remark-obsidian-wikilink";
import { slugifyStr } from "./src/utils/slugify";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { remarkPandocCitation } from "@sgawarat/remark-pandoc-citation";
import mdx from "@astrojs/mdx";
import rehypeSectionize from "@hbsnow/rehype-sectionize";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    mdx(),
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
    icon(),
  ],
  markdown: {
    gfm: true,
    remarkPlugins: [
      [remarkMath, { singleDollarTextMath: true }],
      [remarkAozoraRuby, {}],
      [
        remarkObsidianWikilink,
        {
          glob: createGlob(SITE.contentDir),
          slugify: slugifyStr,
          baseUrl: `${SITE.website}/posts`,
        },
      ],
      [remarkPandocCitation, { bibliography: SITE.bibliography }],
    ],
    rehypePlugins: [
      rehypeHeadingIds,
      [rehypeSectionize, {}],
      [rehypeKatex, { output: "mathml" }],
    ],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      // themes: { light: "min-light", dark: "night-owl" },
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
      wrap: true,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    // eslint-disable-next-line
    // @ts-ignore
    // This will be fixed in Astro 6 with Vite 7 support
    // See: https://github.com/withastro/astro/issues/14030
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    preserveScriptOrder: true,
  },
});
