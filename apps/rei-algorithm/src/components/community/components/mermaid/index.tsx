import mermaid from "mermaid";
import { FunctionComponent, useEffect } from "react";

interface PostMermaidProps {
  content: string;
}

// https://github.com/mermaid-js/mermaid/blob/HEAD/README.zh-CN.md 流程图组件 支持的有很多...
// 一点基础：https://www.oryoy.com/news/shi-yong-react-he-mermaid-shi-xian-dong-tai-liu-cheng-tu-xuan-ran-de-wan-zheng-zhi-nan.html
const PostMermaid: FunctionComponent<PostMermaidProps> = ({ content }) => {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
  }, []);
  return <div className="mermaid">{content}</div>;
};

export default PostMermaid;
