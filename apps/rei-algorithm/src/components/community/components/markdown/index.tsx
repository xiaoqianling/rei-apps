import { FunctionComponent, useEffect } from "react";
import Markdown from "react-markdown";
import { useLocation, useNavigate } from "react-router-dom";
import rehypeSlug from "rehype-slug";
import MarkdownCode from "./common/code";
import { MarkdownContent } from "./type";
import { MarkdownH1, MarkdownH2, MarkdownH3, MarkdownP } from "./common";

interface BlogMarkdownProps {
  markdown: MarkdownContent;
}

const BlogMarkdown: FunctionComponent<BlogMarkdownProps> = ({ markdown }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent<HTMLHeadingElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    const id = target.id;
    navigate(`#${id}`, { replace: true });
  };

  // 监听URL变化并滚动到对应元素
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const id = decodeURI(hash.replace("#", ""));
      const element = document.getElementById(id);
      if (element) {
        console.log("跳转到Hash: ", id);
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <Markdown
      rehypePlugins={[rehypeSlug]}
      components={{
        h1: (props) => (
          <MarkdownH1
            props={props}
            children={props.children}
            onClick={handleClick}
          />
        ),
        h2: (props) => (
          <MarkdownH2
            props={props}
            children={props.children}
            onClick={handleClick}
          />
        ),
        h3: (props) => (
          <MarkdownH3
            props={props}
            children={props.children}
            onClick={handleClick}
          />
        ),
        p: (props) => <MarkdownP props={props} children={props.children} />,
        code: ({ node, className, children, ...props }) => {
          return <MarkdownCode className={className}>{children}</MarkdownCode>;
        },
      }}
    >
      {markdown.content}
    </Markdown>
  );
};

export default BlogMarkdown;
