import React, { useState, useCallback } from 'react';
import styles from './index.module.scss';
import CommentForm from '../CommentForm';
import CommentItem from '../CommentItem';
import { CommentData, CommunityUser } from '../../types';
import { mockUsers } from '../../mockData'; // For mocking new comment author

interface CommentSectionProps {
  comments: CommentData[];
  articleId: string; // Needed to associate new comments
  // Assume a way to get current user - passed as prop or from context
  currentUser?: CommunityUser | null;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments: initialComments,
  articleId,
  currentUser = mockUsers.user2, // MOCK: Use a mock user for now
}) => {
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = useCallback((content: string) => {
    if (!currentUser) {
      alert("请先登录后再评论！"); // Placeholder for login check
      return;
    }

    setIsSubmitting(true);
    console.log(`Submitting comment for article ${articleId}:`, content);

    // --- Mock Submission --- //
    // Simulate API call delay
    setTimeout(() => {
      const newComment: CommentData = {
        id: `comment-${Date.now()}`,
        author: currentUser,
        content: content,
        createdAt: new Date().toISOString(),
      };
      setComments(prevComments => [newComment, ...prevComments]);
      setIsSubmitting(false);
    }, 800);
    // --- End Mock Submission --- //

  }, [articleId, currentUser]);

  return (
    <section className={styles.commentSection}>
      <h3 className={styles.sectionTitle}>
        评论区 ({comments.length})
      </h3>

      {/* Conditionally render form based on login status (placeholder) */}
      {currentUser ? (
         <CommentForm onSubmit={handleAddComment} isSubmitting={isSubmitting} />
      ) : (
         <p className={styles.loginPrompt}>请 <a href="/login">登录</a>后发表评论。</p>
      )}


      <div className={styles.commentList}>
        {comments.length > 0 ? (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <p className={styles.noComments}>还没有评论，快来抢沙发吧！</p>
        )}
      </div>
    </section>
  );
};

export default CommentSection; 