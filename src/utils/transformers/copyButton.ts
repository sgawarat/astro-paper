import type { ShikiTransformer } from "@shikijs/types";

export function transformerCopyButton(): ShikiTransformer {
  return {
    pre(node) {
      node.properties["tabindex"] = 0;
      node.children.push({
        type: "element",
        tagName: "button",
        properties: {
          class:
            "copy-code absolute end-3 top-(--file-name-offset) rounded bg-muted border border-muted px-2 py-1 text-xs leading-4 text-foreground font-medium",
        },
        children: [
          {
            type: "text",
            value: "Copy",
          },
        ],
      });
      return {
        type: "element",
        tagName: "div",
        properties: {
          class: "relative",
        },
        children: [node],
      };
    },
  };
}
