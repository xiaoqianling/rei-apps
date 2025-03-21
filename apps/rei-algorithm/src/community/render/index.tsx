import { ReactNode } from "react";
import { BlogContent } from "../type/content";
import { renderMarkdown } from "./md";
import { renderPostCode } from "./code";

export function renderPostContent(content: BlogContent[]): ReactNode {
  return content.map((item) => {
    switch (item.type) {
      case "markdown":
        return renderMarkdown(item);
      case "code":
        return renderPostCode(item);
      default:
        return null;
    }
  });
}
