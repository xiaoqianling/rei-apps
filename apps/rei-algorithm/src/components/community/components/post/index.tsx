import styles from "./index.module.scss";
import { FunctionComponent } from "react";
import { BlogPost } from "../../type/post";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { getMockPost } from "@/src/api/post";
import PostContent from "./postContent";

interface PostProps {
  post: BlogPost;
}

interface Heading {
  id: string;
  offsetTop: number;
}

const Post: FunctionComponent<PostProps> = ({}) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getMockPost();
        console.log("data", data);
        setPost(data);
      } catch (err) {
      } finally {
      }
    };

    fetchPost();
  }, []);

  // 获取所有h1标题元素及其位置
  useEffect(() => {
    const h1Elements = Array.from(document.querySelectorAll("h1"));
    const headingData = h1Elements.map((heading) => ({
      id: heading.id,
      offsetTop: heading.offsetTop,
    }));
    setHeadings(headingData);
  }, [post]);

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
      {post && <PostContent post={post} />}
    </div>
  );
};

export default Post;
