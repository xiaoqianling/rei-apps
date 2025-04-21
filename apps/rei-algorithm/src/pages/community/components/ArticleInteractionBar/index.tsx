import React from 'react';
import styles from './index.module.scss';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

interface ArticleInteractionBarProps {
  likes: number;
  dislikes: number;
  onLike: () => void;
  onDislike: () => void;
  // Optional: Add state to indicate if user has already liked/disliked
  userAction?: 'like' | 'dislike' | null;
}

const ArticleInteractionBar: React.FC<ArticleInteractionBarProps> = ({
  likes,
  dislikes,
  onLike,
  onDislike,
  userAction = null,
}) => {
  return (
    <div className={styles.interactionBar}>
      <button
        onClick={onLike}
        className={`${styles.actionButton} ${userAction === 'like' ? styles.active : ''}`}
        aria-pressed={userAction === 'like'}
        title="赞同"
      >
        <FaThumbsUp />
        <span>{likes}</span>
      </button>
      <button
        onClick={onDislike}
        className={`${styles.actionButton} ${userAction === 'dislike' ? styles.active : ''}`}
        aria-pressed={userAction === 'dislike'}
        title="反对"
      >
        <FaThumbsDown />
        <span>{dislikes}</span>
      </button>
    </div>
  );
};

export default ArticleInteractionBar; 