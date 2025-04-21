import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { NavLink, useNavigate } from "react-router";

export interface AnchorItem {
  id: string;
  title: string;
  children?: AnchorItem[];
  active?: boolean;
  expanded?: boolean;
}

export interface AnchorProps {
  items: AnchorItem[];
  // Optional offset for fixed headers
  offsetTop?: number;
}

// Recursive function to render anchor links
const renderAnchorLinks = (
  items: AnchorItem[],
  level = 0,
  activeId: string | null,
): React.ReactNode => {
  return (
    <ul className={`${styles.anchorList} ${level > 0 ? styles.subList : ""}`}>
      {items.map((item) => (
        <li
          key={item.id}
          className={`${styles.anchorItem} ${activeId === item.id ? styles.active : ""}`}
        >
          <NavLink
            to={`#${item.id}`}
            className={styles.anchorLink}
            title={item.title} // Add title attribute for full text on hover
          >
            {item.title}
          </NavLink>
          {/* Render children recursively */}
          {item.children &&
            item.children.length > 0 &&
            renderAnchorLinks(item.children, level + 1, activeId)}
        </li>
      ))}
    </ul>
  );
};

// --- Main Anchor Component ---
const Anchor: React.FC<AnchorProps> = ({ items, offsetTop = 0 }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 使用Intersection Observer替代滚动事件监听
  useEffect(() => {
    // 创建Intersection Observer实例
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const intersectingEntries = entries.filter(
          (entry) => entry.isIntersecting,
        );

        if (intersectingEntries.length === 0) return;

        // 找出最接近视口顶部的元素
        const closestEntry = intersectingEntries.reduce((prev, current) => {
          return current.boundingClientRect.top < prev.boundingClientRect.top
            ? current
            : prev;
        });

        setActiveId(closestEntry.target.id);
      },
      {
        root: null,
        rootMargin: `-${offsetTop}px 0px -${window.innerHeight - offsetTop - 100}px 0px`,
        threshold: 0.1, // 降低阈值提高性能
      },
    );

    // 观察所有锚点元素
    const observeElements = () => {
      const observer = observerRef.current;
      if (!observer) return;

      const observeItem = (item: AnchorItem) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.observe(element);
        }
        if (item.children) {
          item.children.forEach(observeItem);
        }
      };

      items.forEach(observeItem);
    };

    observeElements();

    // 清理函数
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [items, offsetTop]);

  // --- 可选: 滚动时的激活状态检测 ---
  // 这个实现较为复杂且可能影响性能
  // 如果需要更好的性能，建议考虑使用 Intersection Observer API
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top),
          );

        if (visibleEntries.length > 0) {
          // 取距离视口顶部最近的元素
          const closestEntry = visibleEntries[0];
          // 添加边界检查，避免误触发
          if (
            Math.abs(closestEntry.boundingClientRect.top) <=
            offsetTop + 150
          ) {
            setActiveId(closestEntry.target.id);
          }
        }
      },
      {
        root: null,
        rootMargin: `-${offsetTop}px 0px -${Math.floor(window.innerHeight * 0.4)}px 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );
  }, [items, offsetTop]);
  // --- End Optional Scroll Spy ---

  if (!items || items.length === 0) {
    return null; // Don't render if no items
  }

  return (
    <nav className={styles.anchorContainer} aria-label="文章目录">
      <div className={styles.anchorTitle}>目录</div>
      {renderAnchorLinks(items, 0, activeId)}
    </nav>
  );
};

export default Anchor;
