import { FunctionComponent, useEffect } from "react";
import Markdown from "react-markdown";
import { useLocation, useNavigate } from "react-router-dom";
import rehypeSlug from "rehype-slug";
import { MarkdownContent } from "../type/content";
import styles from "./index.module.scss";
import MarkdownCode from "./code";

interface PostMarkdownProps {
  markdown: MarkdownContent;
}

const PostMarkdown: FunctionComponent<PostMarkdownProps> = ({ markdown }) => {
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
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <Markdown
      rehypePlugins={[rehypeSlug]}
      components={{
        h1: ({ node, ...props }) => (
          <h1
            {...props}
            onClick={handleClick}
            className={`${props.className} ${styles.title}`}
          />
        ),
        h2: ({ node, ...props }) => (
          <h2
            {...props}
            onClick={handleClick}
            className={`${props.className} ${styles.title}`}
          />
        ),
        h3: ({ node, ...props }) => (
          <h3
            {...props}
            onClick={handleClick}
            className={`${props.className} ${styles.title}`}
          />
        ),
        p: ({ node, ...props }) => (
          <p {...props} className={`${props.className} ${styles.p}`} />
        ),
        code: ({ node, className, children, ...props }) => {
          // classname为language-xxx(markdown标记里写的)
          console.assert(
            Object.keys(props).length === 0,
            `[PostMarkDown] props should be empty ${props}`,
          );

          return <MarkdownCode className={className}>{children}</MarkdownCode>;
        },
      }}
    >
      {markdown.content}
    </Markdown>
  );
};

export default PostMarkdown;
