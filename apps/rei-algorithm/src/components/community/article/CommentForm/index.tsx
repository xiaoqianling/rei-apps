import React, { useState } from 'react';
import styles from './index.module.scss';

interface CommentFormProps {
  onSubmit: (content: string) => void; // Callback with comment text
  isSubmitting?: boolean; // Optional: To disable button during submission
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;
    onSubmit(commentText);
    setCommentText(''); // Clear the textarea after submission
  };

  return (
    <form onSubmit={handleSubmit} className={styles.commentForm}>
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="添加你的评论... (支持 Markdown)"
        className={styles.commentTextarea}
        rows={4} // Adjust initial rows
        required
        disabled={isSubmitting}
      />
      <button
        type="submit"
        className={styles.submitButton}
        disabled={!commentText.trim() || isSubmitting}
      >
        {isSubmitting ? '提交中...' : '发布评论'}
      </button>
    </form>
  );
};

export default CommentForm; 