import { FaUser } from "react-icons/fa";
import { LuTag } from "react-icons/lu";
import { MdOutlineDateRange } from "react-icons/md";
import Tooltip from "rei-design/tooltip";
import { BlogDetail } from "../../../type";
import Tag from "../tag";
import styles from "./index.module.scss";
import { FunctionComponent } from "react";
import { renderContents } from "../../../util/render";

interface BlogContentProps {
  blog: BlogDetail;
  // @default true
  showInfo?: boolean;
}

// 渲染博客标题+主体内容
const BlogContent: FunctionComponent<BlogContentProps> = ({
  blog,
  showInfo,
}) => {
  const content = renderContents(blog.contents ?? []);

  return (
    <div className={styles.main}>
      <header>{blog.title}</header>
      <hr />
      {showInfo === false || (
        <>
          <div className={styles.info}>
            <Tooltip content="作者" className={styles.author}>
              <FaUser />
              <span>{blog.username}</span>
            </Tooltip>
            <Tooltip content="创建时间" className={styles.createAt}>
              <MdOutlineDateRange size={22} />
              <span>{blog.createdAt.toLocaleString()}</span>
            </Tooltip>
            <Tooltip content="标签" className={styles.tag}>
              <LuTag size={24} />
              {blog.tags.map((tag, index) => (
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

export default BlogContent;
