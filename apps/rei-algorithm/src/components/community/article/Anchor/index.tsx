import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { NavLink, useNavigate } from "react-router";
import { scrollToElementByID } from "@/src/util/dom";

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
            onClick={() => {
              scrollToElementByID(item.id); // Scroll to the element when clicked
            }}
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

        // 修改比较逻辑，优先选择最靠近视口顶部的元素
        const closestEntry = intersectingEntries.reduce((prev, current) => {
          const prevTop = Math.abs(prev.boundingClientRect.top - offsetTop);
          const currentTop = Math.abs(
            current.boundingClientRect.top - offsetTop,
          );
          return currentTop < prevTop ? current : prev;
        });

        setActiveId(closestEntry.target.id);
      },
      {
        root: null,
        // 调整rootMargin，确保顶部元素能被正确检测
        rootMargin: `-${offsetTop}px 0px -${Math.floor(window.innerHeight * 0.3)}px 0px`,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
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
