import React from "react";
import { Link } from "react-router-dom";
import styles from "./index.module.scss";
import { CommentData } from "../../../../pages/community/types";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

export interface CommentItemProps {
  comment: CommentData;
  onReply?: () => void;
}

// 使用 date-fns 格式化日期
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: zhCN });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "未知日期";
  }
};

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply }) => {
  const { author, content, createdAt } = comment;

  return (
    <div className={styles.commentItem}>
      <Link
        to={`/community/profile/${author.id}`}
        className={styles.avatarLink}
      >
        <img
          src={author.avatarUrl || "/avatars/default.png"}
          alt={`${author.name} avatar`}
          className={styles.commentAvatar}
        />
      </Link>
      <div className={styles.commentContent}>
        <div className={styles.commentHeader}>
          <Link
            to={`/community/profile/${author.id}`}
            className={styles.authorNameLink}
          >
            {author.name}
          </Link>
          <span className={styles.commentDate}>{formatDate(createdAt)}</span>
        </div>
        {/* TODO: Render comment content - assuming plain text for now */}
        {/* If supporting Markdown, use a Markdown renderer here */}
        <p className={styles.commentText}>{content}</p>
        <div className={styles.commentActions}>
          <button onClick={onReply} className={styles.replyButton}>
            回复
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
