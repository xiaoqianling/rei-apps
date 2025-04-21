import classNames from "classnames";
import mermaid from "mermaid";
import { FunctionComponent, useEffect, useRef } from "react";
import styles from "./index.module.scss";

interface BlogMermaidProps {
  content: string;
}

// https://github.com/mermaid-js/mermaid/blob/HEAD/README.zh-CN.md 流程图组件 支持的有很多...
// 一点基础：https://www.oryoy.com/news/shi-yong-react-he-mermaid-shi-xian-dong-tai-liu-cheng-tu-xuan-ran-de-wan-zheng-zhi-nan.html
const BlogMermaid: FunctionComponent<BlogMermaidProps> = ({ content }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: "forest" });
    if (mermaidRef.current) {
      try {
        mermaid.run();
      } catch (error) {
        console.error("Mermaid rendering error:", error);
      }
    }
  }, [content]);

  return (
    <div className={classNames("mermaid", styles.svg)} ref={mermaidRef}>
      {content}
    </div>
  );
};

export default BlogMermaid;
