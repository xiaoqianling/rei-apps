import React, { useState, useEffect, useCallback } from "react";
import styles from "./index.module.scss";

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
  onLinkClick: (id: string, e: React.MouseEvent<HTMLAnchorElement>) => void,
): React.ReactNode => {
  return (
    <ul className={`${styles.anchorList} ${level > 0 ? styles.subList : ""}`}>
      {items.map((item) => (
        <li
          key={item.id}
          className={`${styles.anchorItem} ${activeId === item.id ? styles.active : ""}`}
        >
          <a
            href={`#${item.id}`}
            className={styles.anchorLink}
            onClick={(e) => onLinkClick(item.id, e)}
            title={item.title} // Add title attribute for full text on hover
          >
            {item.title}
          </a>
          {/* Render children recursively */}
          {item.children &&
            item.children.length > 0 &&
            renderAnchorLinks(item.children, level + 1, activeId, onLinkClick)}
        </li>
      ))}
    </ul>
  );
};

// --- Main Anchor Component ---
const Anchor: React.FC<AnchorProps> = ({ items, offsetTop = 0 }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Smooth scrolling and active state update logic
  const handleLinkClick = useCallback(
    (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault(); // Prevent default hash jump
      const targetElement = document.getElementById(id);
      if (targetElement) {
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offsetTop;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        // Manually set active state on click for immediate feedback
        setActiveId(id);
        // Optional: Update URL hash without jump
        // window.history.pushState(null, "", `#${id}`);
      }
    },
    [offsetTop],
  );

  // --- Optional: Active state detection on scroll ---
  // This is more complex and can be performance-intensive.
  // Consider using Intersection Observer API for better performance if needed.
  useEffect(() => {
    const handleScroll = () => {
      let currentActiveId: string | null = null;
      let minTop = Infinity;

      items.forEach((item) => {
        const checkItem = (currentItem: AnchorItem) => {
          const element = document.getElementById(currentItem.id);
          if (element) {
            const rect = element.getBoundingClientRect();
            // Check if element top is close to the offsetTop position
            if (rect.top >= 0 && rect.top <= offsetTop + 100) {
              // Adjust threshold (100px)
              if (rect.top < minTop) {
                minTop = rect.top;
                currentActiveId = currentItem.id;
              }
            }
          }
          if (currentItem.children) {
            currentItem.children.forEach(checkItem);
          }
        };
        checkItem(item);
      });

      setActiveId(currentActiveId);
    };

    // Debounce scroll handler for performance
    let scrollTimeout: NodeJS.Timeout;
    const debouncedScrollHandler = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100); // Adjust debounce time
    };

    window.addEventListener("scroll", debouncedScrollHandler);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", debouncedScrollHandler);
      clearTimeout(scrollTimeout);
    };
  }, [items, offsetTop]);
  // --- End Optional Scroll Spy ---

  if (!items || items.length === 0) {
    return null; // Don't render if no items
  }

  return (
    <nav className={styles.anchorContainer} aria-label="文章目录">
      <div className={styles.anchorTitle}>目录</div>
      {renderAnchorLinks(items, 0, activeId, handleLinkClick)}
    </nav>
  );
};

export default Anchor;
