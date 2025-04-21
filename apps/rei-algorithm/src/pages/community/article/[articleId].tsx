import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useParams, useLocation } from "react-router-dom";
import styles from "./index.module.scss";
import ArticleHeader from "../components/ArticleHeader";
import Anchor from "../components/Anchor";
import CommentSection from "../components/CommentSection";
import ArticleInteractionBar from "../components/ArticleInteractionBar";
import ReportModal from "../components/ReportModal";
import { ArticleData, CommentData } from "../types";
import { mockArticleData, mockComments } from "../mockData";
import { parseBlogAnchors } from "@/src/components/slate/markdown/util";
import { AnchorItem as ReiAnchorItem } from "rei-design/anchor";
// import LoadingSpinner from '@/components/common/LoadingSpinner';

const BlogArticlePage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const location = useLocation();

  const [article, setArticle] = useState<ArticleData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [anchorItems, setAnchorItems] = useState<ReiAnchorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- State for Interactions --- //
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [views, setViews] = useState(0);
  const [userAction, setUserAction] = useState<"like" | "dislike" | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  // --- Simulate Data Fetching & Initial State Setup ---
  useEffect(() => {
    setLoading(true);
    setError(null);
    setAnchorItems([]);
    setUserAction(null); // Reset user action on new article
    setIsReportModalOpen(false); // Close modal on navigation
    console.log("Fetching article for:", articleId);

    setTimeout(() => {
      if (articleId && mockArticleData[articleId]) {
        const fetchedArticle = mockArticleData[articleId];
        setArticle(fetchedArticle);
        setComments(mockComments[articleId] || []);
        // Initialize state from fetched data
        setLikes(fetchedArticle.likes || 0);
        setDislikes(fetchedArticle.dislikes || 0);
        setViews(fetchedArticle.views || 0);
        // Simulate incrementing views (in real app, backend handles this)
        setViews((v) => (fetchedArticle.views || 0) + 1);

        setLoading(false);
      } else {
        setError("无法加载文章或评论。");
        setArticle(null);
        setComments([]);
        setLoading(false);
      }
    }, 1000);
  }, [articleId]);

  // --- Parse Anchors (keep existing logic) ---
  useEffect(() => {
    if (!loading && article && contentRef.current) {
      const timer = setTimeout(() => {
        if (contentRef.current) {
          const parsedAnchors = parseBlogAnchors(contentRef.current);
          setAnchorItems(parsedAnchors);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, article, location.pathname]);

  // --- Interaction Handlers (Mocked) ---
  const handleLike = useCallback(() => {
    setUserAction((prev) => {
      if (prev === "like") {
        setLikes((l) => l - 1); // Unlike
        return null;
      } else {
        if (prev === "dislike") setDislikes((d) => d - 1); // Remove dislike if exists
        setLikes((l) => l + 1); // Like
        return "like";
      }
    });
    // TODO: Send API request to backend
  }, []);

  const handleDislike = useCallback(() => {
    setUserAction((prev) => {
      if (prev === "dislike") {
        setDislikes((d) => d - 1); // Undislike
        return null;
      } else {
        if (prev === "like") setLikes((l) => l - 1); // Remove like if exists
        setDislikes((d) => d + 1); // Dislike
        return "dislike";
      }
    });
    // TODO: Send API request to backend
  }, []);

  const handleOpenReportModal = useCallback(() => {
    setIsReportModalOpen(true);
  }, []);

  const handleCloseReportModal = useCallback(() => {
    setIsReportModalOpen(false);
  }, []);

  const handleReportSubmit = useCallback(
    (reason: string, details: string) => {
      console.log("Submitting Report:", { articleId, reason, details });
      // TODO: Send API request to backend
      alert(`已提交举报：${reason}${details ? ` (${details})` : ""}`);
      setIsReportModalOpen(false);
    },
    [articleId],
  );

  // --- Edit Button Logic (keep existing) ---
  const showEditButton = useMemo(() => {
    return article?.author?.id === "user1"; // MOCK
  }, [article]);

  // --- Render Logic --- //
  if (loading) {
    return <div className={styles.loadingState}>正在加载文章...</div>;
  }
  if (error) {
    return <div className={styles.errorState}>{error}</div>;
  }
  if (!article) {
    return <div className={styles.errorState}>未找到文章。</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainArticleArea}>
        <ArticleHeader
          title={article.title}
          author={article.author}
          createdAt={article.createdAt}
          tags={article.tags}
          showEditButton={showEditButton}
          // --- Pass stats and handlers --- //
          likes={likes} // Pass current likes state
          dislikes={dislikes} // Pass current dislikes state
          views={views} // Pass current views state
          onLike={handleLike} // Pass handler
          onDislike={handleDislike} // Pass handler
          onReport={handleOpenReportModal} // Pass handler to open modal
        />

        <article
          ref={contentRef}
          className={styles.articleContent}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* --- Interaction Bar --- */}
        <ArticleInteractionBar
          likes={likes}
          dislikes={dislikes}
          onLike={handleLike}
          onDislike={handleDislike}
          userAction={userAction}
        />

        <CommentSection
          comments={comments}
          articleId={article.id}
          // Pass currentUser prop here
        />
      </div>

      {anchorItems.length > 0 && (
        <div className={styles.anchorWrapper}>
          <Anchor items={anchorItems} offsetTop={70} />
        </div>
      )}

      {/* --- Report Modal --- */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={handleCloseReportModal}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default BlogArticlePage;
