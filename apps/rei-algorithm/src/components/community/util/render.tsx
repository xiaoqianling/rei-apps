import { ReactNode } from "react";
import PostCode from "../components/codeBlock";
import PostFoldBlock from "../components/foldBlock";
import PostMarkdown from "../components/markdown";
import PostTip from "../components/tip";
import { BlogContent } from "../type/content";
import PostMermaid from "../components/mermaid";
import { TreeVisualizer, VisualPanel } from "../../visual";

export function renderContents(contents: BlogContent[]): ReactNode {
  return contents.map((item, index) => {
    switch (item.type) {
      case "markdown":
        return <PostMarkdown markdown={item} key={index} />;
      case "code":
        return <PostCode code={item} key={index} />;
      case "tip":
        return <PostTip tip={item} key={index} />;
      case "fold":
        return (
          <PostFoldBlock
            title={item.title}
            content={item.content}
            key={index}
            open={false}
          />
        );
      case "mermaid":
        return <PostMermaid content={item.content} key={index} />;
      case "visual":
        return <VisualPanel key={index} />;
      default:
        return null;
    }
  });
}
