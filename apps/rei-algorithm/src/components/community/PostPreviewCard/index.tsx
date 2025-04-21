import React from "react";
import { Link } from "react-router-dom";
import styles from "./index.module.scss";
import { PostPreview, CommunityTag } from "../../../pages/community/types";
import { FaHeart, FaCommentDots } from "react-icons/fa"; // Example icons

interface PostPreviewCardProps {
  post: PostPreview;
}

// Helper to format date (basic example)
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  // Simple relative time or absolute date based on how old it is
  const diffHours = (Date.now() - date.getTime()) / (1000 * 60 * 60);
  if (diffHours < 24) {
    return `${Math.floor(diffHours)} 小时前`;
  } else if (diffHours < 48) {
    return "昨天";
  }
  return date.toLocaleDateString(); // Or more specific formatting
};

const PostPreviewCard: React.FC<PostPreviewCardProps> = ({ post }) => {
  const { id, title, author, excerpt, tags, createdAt, likes, commentsCount } =
    post;

  const articleLink = `/community/article/${id}`; // Example article link
  const authorLink = `/community/profile/${author.id}`; // Example profile link

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <Link to={authorLink} className={styles.authorInfo}>
          <img
            src={author.avatarUrl || "/avatars/default.png"} // Fallback avatar
            alt={`${author.name} avatar`}
            className={styles.authorAvatar}
          />
          <span className={styles.authorName}>{author.name}</span>
        </Link>
        <span className={styles.postDate}>{formatDate(createdAt)}</span>
      </div>

      <Link to={articleLink} className={styles.titleLink}>
        <h2 className={styles.postTitle}>{title}</h2>
      </Link>

      <p className={styles.postExcerpt}>{excerpt}</p>

      {/* Optional: Visualization Preview Placeholder */}
      {/* {post.visualizationPreview && ... } */}

      <div className={styles.cardFooter}>
        <div className={styles.tagsContainer}>
          {tags.map((tag: CommunityTag) => (
            <Link
              key={tag.id}
              to={`/community?tag=${tag.name}`}
              className={styles.tagLink}
            >
              #{tag.name}
            </Link>
          ))}
        </div>
        <div className={styles.statsContainer}>
          <span className={styles.statItem}>
            <FaHeart className={styles.statIcon} /> {likes}
          </span>
          <span className={styles.statItem}>
            <FaCommentDots className={styles.statIcon} /> {commentsCount}
          </span>
        </div>
      </div>
    </article>
  );
};

export default PostPreviewCard;
