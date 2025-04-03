import { FunctionComponent } from "react";
import { BlogPost } from "../../../type";
import styles from "./index.module.scss";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
  post: BlogPost;
}

const PostCard: FunctionComponent<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // TODO: 跳转到帖子详情页
    console.log(`Navigate to post ${post.id}`);
    navigate(`/community/post/${post.id}`);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.header}>
        <h3 className={styles.title}>{post.title}</h3>
        <span className={styles.time}>
          {formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
            locale: zhCN,
          })}
        </span>
      </div>

      <div className={styles.tags}>
        {post.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            #{tag}
          </span>
        ))}
      </div>

      <div className={styles.footer}>
        <span className={styles.author}>@{post.username}</span>
        {post.updatedAt > post.createdAt && (
          <span className={styles.updateHint}>已更新</span>
        )}
      </div>
    </div>
  );
};

export default PostCard;
