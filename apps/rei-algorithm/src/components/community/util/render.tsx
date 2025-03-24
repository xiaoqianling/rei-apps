import { ReactNode } from "react";
import PostCode from "../components/code";
import PostFoldBlock from "../components/foldBlock";
import PostMarkdown from "../components/markdown";
import PostTip from "../components/tip";
import { BlogContent } from "../type/content/content";

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
      default:
        return null;
    }
  });
}
