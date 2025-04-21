import React from "react";
import { Link } from "react-router-dom";
import styles from "./index.module.scss";
import { CommunityUser, CommunityTag } from "../../../../pages/community/types";
import ActionButtons from "../ActionButtons";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

interface ArticleHeaderProps {
  title: string;
  author: CommunityUser;
  createdAt: string;
  tags: CommunityTag[];
  showEditButton?: boolean;
  likes: number;
  dislikes: number;
  views: number;
  onLike: () => void;
  onDislike: () => void;
  onReport: () => void;
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: zhCN });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "未知日期";
  }
};

const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  title,
  author,
  createdAt,
  tags,
  showEditButton = false,
  likes,
  dislikes,
  views,
  onLike,
  onDislike,
  onReport,
}) => {
  const handleEdit = () => {
    alert("编辑功能待实现！");
  };

  return (
    <header className={styles.articleHeader}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.metaContainer}>
        <div className={styles.authorDate}>
          <Link
            to={`/community/profile/${author.id}`}
            className={styles.authorLink}
          >
            <img
              src={author.avatarUrl || "/avatars/default.png"}
              alt={author.name}
              className={styles.authorAvatar}
            />
            <span className={styles.authorName}>{author.name}</span>
          </Link>
          <span className={styles.separator}>•</span>
          <time dateTime={createdAt} className={styles.publishDate}>
            发布于 {formatDate(createdAt)}
          </time>
          <span className={styles.separator}>•</span>
          <span className={styles.viewCount}>阅读 {views}</span>
        </div>

        <ActionButtons
          onEdit={showEditButton ? handleEdit : undefined}
          onReport={onReport}
        />
      </div>

      {tags && tags.length > 0 && (
        <div className={styles.tagsContainer}>
          {tags.map((tag) => (
            <Link
              key={tag.id}
              to={`/community?tag=${tag.name}`}
              className={styles.tagLink}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default ArticleHeader;
