import {
  defineConfig,
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
/*
import mdx from "@astrojs/mdx";
*/
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
/*
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
*/
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { rehypeHeadingIds, type RemarkPlugin } from "@astrojs/markdown-remark";
import remarkSectionize from "remark-sectionize";
import rehypeExternalLinks from "rehype-external-links";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// 処理中のファイルのパスをログに出力するremarkプラグイン
const remarkLog: RemarkPlugin<[]> = () => (_tree, vfile) => {
  // eslint-disable-next-line no-console
  console.log(`::: In "${vfile.path}"`);
};

export default defineConfig({
  site: config.site.url,
  integrations: [
/*
    mdx(),
*/
    sitemap({
      filter: page =>
        config.features?.showArchives !== false || !page.endsWith("/archives/"),
    }),
  ],
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
/*
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts],
*/
      remarkPlugins: [
        remarkLog,
        [remarkMath, { singleDollarTextMath: true }],
        remarkSectionize,
      ],
      remarkRehype: {
        footnoteLabelProperties: {},
      },
      rehypePlugins: [
        rehypeCallouts,
        rehypeHeadingIds,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "append",
            content: {
              type: "element",
              tagName: "span",
              properties: { "aria-hidden": true },
              children: [{ type: "text", value: "#" }],
            },
            headingProperties: { class: "group" },
            properties: {
              class:
                "heading-link ms-2 no-underline opacity-75 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100",
            },
          },
        ],
        [rehypeKatex, { output: "mathml" }],
        [
          rehypeExternalLinks,
          {
            target: "_blank",
            rel: ["noopener", "noreferrer", "nofollow", "external"],
          },
        ],
      ],
    }),
    shikiConfig: {
/*
      themes: { light: "min-light", dark: "night-owl" },
*/
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
      {
        name: "virtual astro-paper.config",
        resolveId(id) {
          if (id !== "virtual:astro-paper.config") return undefined;
          return "\0virtual:astro-paper.config";
        },
        load(id) {
          if (id !== "\0virtual:astro-paper.config") return undefined;
          return `export default ${JSON.stringify(config)};`;
        },
      }
    ],
  },
  fonts: [
    {
      name: "Google Sans Code",
      cssVariable: "--font-google-sans-code",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      formats: ["woff", "ttf"],
    },
    {
      provider: fontProviders.local(),
      name: "STIX Two Math",
      cssVariable: "--font-math",
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/STIX Two/STIXTwoMath-Regular.woff2"],
          },
        ],
      },
      fallbacks: ["Cambria Math", "Noto Sans Math"],
    },
    {
      provider: fontProviders.local(),
      name: "STIX Two Text",
      cssVariable: "--font-math-text",
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/STIX Two/STIXTwoText-Regular.woff2"],
          },
          {
            weight: 400,
            style: "italic",
            src: ["./src/assets/fonts/STIX Two/STIXTwoText-Italic.woff2"],
          },
          {
            weight: 500,
            style: "normal",
            src: ["./src/assets/fonts/STIX Two/STIXTwoText-Medium.woff2"],
          },
          {
            weight: 500,
            style: "italic",
            src: [
              "./src/assets/fonts/STIX Two/STIXTwoText-MediumItalic.woff2",
            ],
          },
          {
            weight: 600,
            style: "normal",
            src: ["./src/assets/fonts/STIX Two/STIXTwoText-SemiBold.woff2"],
          },
          {
            weight: 600,
            style: "italic",
            src: [
              "./src/assets/fonts/STIX Two/STIXTwoText-SemiBoldItalic.woff2",
            ],
          },
          {
            weight: 700,
            style: "normal",
            src: ["./src/assets/fonts/STIX Two/STIXTwoText-Bold.woff2"],
          },
          {
            weight: 700,
            style: "italic",
            src: ["./src/assets/fonts/STIX Two/STIXTwoText-BoldItalic.woff2"],
          },
        ],
      },
      fallbacks: [],
    },
  ],
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
    svgOptimizer: svgoOptimizer(),
  },
});
