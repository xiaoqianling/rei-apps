import { FaUser } from "react-icons/fa";
import { LuTag } from "react-icons/lu";
import { MdOutlineDateRange } from "react-icons/md";
import Tooltip from "rei-design/tooltip";
import { BlogPost } from "../../../type/post";
import Tag from "../tag";
import styles from "./index.module.scss";
import { FunctionComponent } from "react";
import { renderContents } from "../../../util/render";

interface PostContentProps {
  post: BlogPost;
  // @default true
  showInfo?: boolean;
}

const PostContent: FunctionComponent<PostContentProps> = ({
  post,
  showInfo,
}) => {
  const content = renderContents(post.contents ?? []);

  return (
    <div className={styles.main}>
      <header>{post.title}</header>
      <hr />
      {showInfo === false || (
        <>
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
        </>
      )}
      <div className={styles.content}>{content}</div>
    </div>
  );
};

export default PostContent;
