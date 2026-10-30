import Path from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration, RehypePlugins, RemarkPlugins } from "astro";
import {
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { rehypeHeadingIds, type RemarkPlugin } from "@astrojs/markdown-remark";
import remarkSectionize from "remark-sectionize";
import rehypeExternalLinks from "rehype-external-links";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { AstroPaperConfig } from "./src/types/config";

export { defineAstroPaperConfig } from "./src/types/config";

// 処理中のファイルのパスをログに出力するremarkプラグイン
const remarkLog: RemarkPlugin<[]> = () => (_tree, vfile) => {
  // eslint-disable-next-line no-console
  console.log(`::: In "${vfile.path}"`);
};

export interface AstroPaperIntegrationOptions {
  remarkPlugins?: RemarkPlugins | undefined;
  rehypePlugins?: RehypePlugins | undefined;
};

export function astroPaperIntegration(userConfig: AstroPaperConfig, opts?: AstroPaperIntegrationOptions | undefined): AstroIntegration {
  return {
    name: "@sgawarat/astro-paper",
    hooks: {
      "astro:config:setup": ({ updateConfig, injectRoute }) => {
        const currentDir = Path.dirname(fileURLToPath(import.meta.url));
        updateConfig({
          integrations: [
            sitemap({
              filter: page => !page.endsWith("/archives/"),
            }),
          ],
          markdown: {
            processor: unified({
              remarkPlugins: [
                remarkLog,
                [remarkMath, { singleDollarTextMath: true }],
                remarkSectionize,
                ...opts?.remarkPlugins ?? [],
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
                ...opts?.rehypePlugins ?? [],
              ],
            }),
            shikiConfig: {
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
                  return `export default ${JSON.stringify(userConfig)};`;
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
                    src: [Path.join(currentDir, "src/assets/fonts/STIX Two/STIXTwoMath-Regular.woff2")],
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
                    src: [
                      Path.join(currentDir, "src/assets/fonts/STIX Two/STIXTwoText-Regular.woff2"),
                      Path.join(currentDir, "src/assets/fonts/STIX Two/STIXTwoText-Italic.woff2"),
                      Path.join(currentDir, "src/assets/fonts/STIX Two/STIXTwoText-Medium.woff2"),
                      Path.join(currentDir, "src/assets/fonts/STIX Two/STIXTwoText-MediumItalic.woff2"),
                      Path.join(currentDir, "src/assets/fonts/STIX Two/STIXTwoText-SemiBold.woff2"),
                      Path.join(currentDir, "src/assets/fonts/STIX Two/STIXTwoText-SemiBoldItalic.woff2"),
                      Path.join(currentDir, "src/assets/fonts/STIX Two/STIXTwoText-Bold.woff2"),
                      Path.join(currentDir, "src/assets/fonts/STIX Two/STIXTwoText-BoldItalic.woff2"),
                    ]
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

        const routes = [
          ["/archives", "archives/index.astro"],
          ["/posts/[...slug]", "posts/[...slug]/index.astro"],
          ["/posts/[...slug]/index.png", "posts/[...slug]/index.png.ts"],
          ["/posts/[...page]", "posts/[...page].astro"],
          ["/tags/[tag]/[...page]", "tags/[tag]/[...page].astro"],
          ["/tags", "tags/index.astro"],
          ["/404", "404.astro"],
          ["/", "index.astro"],
          ["/og.png", "og.png.ts"],
          ["/robots.txt", "robots.txt.ts"],
          ["/rss.xml", "rss.xml.ts"],
          ["/search", "search.astro"],
        ];
        for (const [pattern, path] of routes) {
          injectRoute({ pattern, entrypoint: Path.join(currentDir, "src", "pages", path) });
        }
      },
    }
  };
}
