import styles from "./index.module.scss";
import { FunctionComponent } from "react";
import { BlogPost } from "../type/post";
import PostCode from "../code";
import PostMarkdown from "../markdown";

interface PostProps {
  post: BlogPost;
}

const Post: FunctionComponent<PostProps> = ({ post }) => {
  const content = post.contents.map((item) => {
    switch (item.type) {
      case "markdown":
        return <PostMarkdown markdown={item} />;
      case "code":
        return <PostCode code={item} />;
      default:
        return null;
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <header>{post.title}</header>
        <div>
          {post.id}-{post.createdAt.toLocaleString()}-
          {post.updatedAt.toLocaleString()}
        </div>
        <div>{content}</div>
      </div>
      {/* 此页内容锚点 */}
      <div className={styles.anchor}>
        <span>此页内容</span>
      </div>
    </div>
  );
};

export default Post;
