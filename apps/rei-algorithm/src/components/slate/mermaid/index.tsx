import classNames from "classnames";
import mermaid from "mermaid";
import { FunctionComponent, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { MermaidElement } from "../slateEditor";
import { SlateAttributes } from "../slateEditor/element";

interface BlogMermaidProps {
  attributes?: SlateAttributes;
  element: MermaidElement;
}

// https://github.com/mermaid-js/mermaid/blob/HEAD/README.zh-CN.md 流程图组件 支持的有很多...
// 一点基础：https://www.oryoy.com/news/shi-yong-react-he-mermaid-shi-xian-dong-tai-liu-cheng-tu-xuan-ran-de-wan-zheng-zhi-nan.html
const BlogMermaid: FunctionComponent<BlogMermaidProps> = ({
  attributes,
  element,
}) => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: "forest" });
    console.log("mermaid init", attributes, element);
    if (mermaidRef.current) {
      try {
        console.log("mermaid: ", attributes, element);
        mermaid.run();
      } catch (error) {
        console.error("Mermaid rendering error:", error);
      }
    }
  }, [element, mermaidRef]);

  return (
    <div className={classNames("mermaid", styles.svg)} ref={mermaidRef}>
      {element.children[0].text}
    </div>
  );
};

export default BlogMermaid;
