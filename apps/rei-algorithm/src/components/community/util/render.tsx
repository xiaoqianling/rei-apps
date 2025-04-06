import { ReactNode } from "react";
import BlogCode from "../components/codeBlock";
import BlogFoldBlock from "../components/foldBlock";
import BlogMarkdown from "../components/markdown";
import BlogTip from "../components/tip";
import { BlogContent } from "../type/content";
import BlogMermaid from "../components/mermaid";
import { TreeVisualizer, VisualPanel } from "../../visual";

export function renderContents(contents: BlogContent[]): ReactNode {
  return contents.map((item, index) => {
    switch (item.type) {
      case "markdown":
        return <BlogMarkdown markdown={item} key={index} />;
      case "code":
        return <BlogCode code={item} key={index} />;
      case "tip":
        return <BlogTip tip={item} key={index} />;
      case "fold":
        return (
          <BlogFoldBlock
            title={item.title}
            content={item.content}
            key={index}
            open={false}
          />
        );
      case "mermaid":
        return <BlogMermaid content={item.content} key={index} />;
      case "visual":
        return <VisualPanel key={index} />;
      default:
        return null;
    }
  });
}
