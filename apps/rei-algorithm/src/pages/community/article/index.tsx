import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useParams, useLocation } from "react-router-dom";
import styles from "./index.module.scss";
import { ArticleData, CommentData } from "../types";
import { mockArticleData, mockComments } from "../mockData";
import ArticleHeader from "@/src/components/community/article/ArticleHeader";
import ArticleInteractionBar from "@/src/components/community/article/ArticleInteractionBar";
import CommentSection from "@/src/components/community/article/CommentSection";
import SlateRenderer from "@/src/components/community/article/slateRenderer";
import { parseBlogAnchors } from "@/src/components/slate/markdown/util";
import Anchor, { AnchorItem } from "@/src/components/community/article/Anchor";
import ReportModal from "@/src/components/community/article/ReportModal";

const BlogArticlePage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const location = useLocation();

  const [article, setArticle] = useState<ArticleData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [anchorItems, setAnchorItems] = useState<AnchorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- State for Interactions --- //
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [views, setViews] = useState(0);
  const [userAction, setUserAction] = useState<"like" | "dislike" | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  // --- 初始化&模拟API ---
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

  // --- 解析锚点 ---
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

  // --- 评价文章交互 ---
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
        setDislikes((d) => d - 1);
        return null;
      } else {
        if (prev === "like") setLikes((l) => l - 1); // Remove like if exists
        setDislikes((d) => d + 1); // Dislike
        return "dislike";
      }
    });
    // TODO: Send API request to backend
  }, []);

  // 举报模态框状态
  const handleOpenReportModal = useCallback(() => {
    setIsReportModalOpen(true);
  }, []);
  const handleCloseReportModal = useCallback(() => {
    setIsReportModalOpen(false);
  }, []);

  // 提交举报
  const handleReportSubmit = useCallback(
    (reason: string, details: string) => {
      console.log("Submitting Report:", { articleId, reason, details });
      // TODO: Send API request to backend
      alert(`已提交举报：${reason}${details ? ` (${details})` : ""}`);
      setIsReportModalOpen(false);
    },
    [articleId],
  );

  // --- 展示编辑按钮 ---
  const showEditButton = useMemo(() => {
    return article?.author?.id === "user1"; // MOCK
  }, [article]);

  const content = useMemo(() => {
    // data={article.content}
    return <SlateRenderer ref={contentRef} />;
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

        {/* Slate渲染 */}
        <div className={styles.slateContent}>{content}</div>
        {/* <article
          ref={contentRef}
          className={styles.articleContent}
          dangerouslySetInnerHTML={{ __html: article.content }}
        /> */}

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
