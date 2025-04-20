import React, { useState } from "react";
import { Link } from "react-router-dom"; // 假设使用 React Router
import { AlgoCardData, AlgoTag } from "../../types";
import styles from "./index.module.scss";

interface AlgoCardProps {
  data: AlgoCardData;
}

// Helper function to get tag styles (can be expanded)
const getTagStyle = (tag: AlgoTag) => {
  switch (tag) {
    case "官方":
      return styles.tagOfficial;
    case "用户":
      return styles.tagUser;
    case "热门":
      return styles.tagHot;
    case "最新":
      return styles.tagNew;
    case "排序":
    case "搜索":
    case "树":
    case "图":
      return styles.tagCategory;
    default:
      return styles.tagDefault;
  }
};

const AlgoCard: React.FC<AlgoCardProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 确定跳转路径，这里假设排序算法在 /simulatedetail/sort/:id 下
  // 你可能需要根据 category 动态生成路径
  const detailPath = `/visual/detail/${data.id}`;

  return (
    <div className={styles.cardContainer}>
      {/* 可选的预览图区域 */}
      {data.previewImageUrl ? (
        <img
          src={data.previewImageUrl}
          alt={`${data.title} preview`}
          className={styles.previewImage}
        />
      ) : (
        <div className={styles.previewPlaceholder}></div>
      )}

      <div className={styles.cardContent}>
        <Link to={detailPath} className={styles.titleLink}>
          <h3 className={styles.title}>{data.title}</h3>
        </Link>

        {/* 折叠描述 */}
        <div
          className={`${styles.description} ${isExpanded ? styles.expanded : ""}`}
        >
          {data.description}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={styles.expandButton}
        >
          {isExpanded ? "收起" : "展开简介"}
        </button>

        {/* 标签区域 */}
        <div className={styles.tagsContainer}>
          {data.tags.map((tag) => (
            <span key={tag} className={`${styles.tag} ${getTagStyle(tag)}`}>
              {tag}
            </span>
          ))}
        </div>

        {/* 作者信息 */}
        <div className={styles.authorInfo}>
          <span>作者: {data.author}</span>
          <span className={styles.categoryBadge}>{data.category}</span>
        </div>

        {/* 查看详情按钮（可选，因为标题已经是链接） */}
        {/*
         <Link to={detailPath} className={styles.detailsButton}>
            查看详情
         </Link>
         */}
      </div>
    </div>
  );
};

export default AlgoCard;
