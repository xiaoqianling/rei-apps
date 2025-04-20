import { FunctionComponent } from "react";
import styles from "./index.module.scss";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { BlogCardInfo } from "../../../type";

interface BlogCardProps {
  blog: BlogCardInfo;
}

const BlogCard: FunctionComponent<BlogCardProps> = ({ blog }) => {
  const navigate = useNavigate();

  const handleClickPost = () => {
    console.log(`Navigate to post ${blog.pid}`);
    navigate(`/community/post/${blog.pid}`);
  };

  const handleClickAuthor = (event: React.MouseEvent) => {
    event.stopPropagation();
    console.log(`Navigate to user ${blog.username}`);
    // navigate(`/community/user/${post.username}`);
  };

  const handleClickTag = (event: React.MouseEvent) => {
    event.stopPropagation();
    console.log(`Navigate to tag ${blog.tags[0]}`);
  };

  return (
    <div className={styles.card} onClick={handleClickPost}>
      <div className={styles.header}>
        <h3 className={styles.title}>{blog.title}</h3>
        <span className={styles.time}>
          发布于：
          {formatDistanceToNow(new Date(blog.createdAt), {
            addSuffix: true,
            locale: zhCN,
          })}
        </span>
      </div>

      <div className={styles.tags}>
        {blog.tags.map((tag, index) => (
          <span key={index} className={styles.tag} onClick={handleClickTag}>
            #{tag}
          </span>
        ))}
      </div>

      <div className={styles.footer}>
        <span className={styles.author} onClick={handleClickAuthor}>
          @{blog.username}
        </span>
        {blog.updatedAt > blog.createdAt && (
          <span className={styles.updateHint}>
            {/* 年月日格式 */}
            最后编辑于：
            {blog.updatedAt.toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
