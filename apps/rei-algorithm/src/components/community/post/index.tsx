import styles from "./index.module.scss";
import { FunctionComponent } from "react";
import { BlogPost } from "../type/post";
import PostCode from "../code";
import PostMarkdown from "../markdown";
import Tooltip from "rei-design/tooltip";
import { FaUser } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { LuTag } from "react-icons/lu";
import Tag from "./tag";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import PostTip from "../tip";

interface PostProps {
  post: BlogPost;
}

interface Heading {
  id: string;
  offsetTop: number;
}

const Post: FunctionComponent<PostProps> = ({ post }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // 获取所有h1标题元素及其位置
  useEffect(() => {
    const h1Elements = Array.from(document.querySelectorAll("h1"));
    const headingData = h1Elements.map((heading) => ({
      id: heading.id,
      offsetTop: heading.offsetTop,
    }));
    setHeadings(headingData);
  }, [post]);

  const content = post.contents.map((item, index) => {
    switch (item.type) {
      case "markdown":
        return <PostMarkdown markdown={item} key={index} />;
      case "code":
        return <PostCode code={item} key={index} />;
      case "tip":
        return <PostTip tip={item} key={index} />;
      default:
        return null;
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.anchor}>
        <span>此页内容:</span>
        {headings.map((heading, index) => (
          <NavLink
            key={index}
            to={`#${heading.id}`}
            className={`${styles.anchorLink} ${
              activeId === heading.id ? styles.active : ""
            }`}
          >
            {document.getElementById(heading.id)?.textContent}
          </NavLink>
        ))}
      </div>
      <div className={styles.main}>
        <header>{post.title}</header>
        <hr />
        <div className={styles.info}>
          <Tooltip content="作者" className={styles.author}>
            <FaUser />
            <span>{post.username}</span>
          </Tooltip>
          <Tooltip content="创建时间" className={styles.createAt}>
            <MdOutlineDateRange size={22} />
            <span>{post.createdAt.toLocaleString()}</span>
          </Tooltip>
          <Tooltip content="标签" className={styles.tag}>
            <LuTag size={24} />
            {post.tags.map((tag, index) => (
              <Tag key={index} tag={tag}></Tag>
            ))}
          </Tooltip>
        </div>
        <hr />
        <div className={styles.content}>{content}</div>
      </div>
    </div>
  );
};

export default Post;
