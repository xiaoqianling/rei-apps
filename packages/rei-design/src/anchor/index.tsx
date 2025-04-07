import React, { useState, forwardRef, useImperativeHandle } from "react";
import styles from "./index.module.less";
import Arrow from "rei-design/icons/arrow";

export interface AnchorItem {
  id: string;
  title: string;
  children?: AnchorItem[];
  active?: boolean;
  expanded?: boolean;
}

interface AnchorProps {
  items: AnchorItem[];
  onClick?: (id: string) => void;
  className?: string;
  activeId?: string;
}

interface Ref {
  activateAnchor: (id: string) => void;
}

const Anchor = forwardRef<Ref, AnchorProps>(
  ({ items, onClick, className, activeId }, ref) => {
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [internalActiveId, setInternalActiveId] = useState(activeId || "");

    const toggleExpand = (id: string) => {
      setExpandedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
      );
    };

    useImperativeHandle(ref, () => ({
      activateAnchor: (id: string) => {
        setInternalActiveId(id);
        // 展开所有父级
        const parentIds = getParentIds(id, items);
        setExpandedIds((prev) => [...new Set([...prev, ...parentIds])]);
      },
    }));

    const renderItems = (items: AnchorItem[], level: number = 0) => {
      return items.map((item) => (
        <div key={item.id} className={styles.menuItem}>
          <div
            className={`${styles.itemContent} ${internalActiveId === item.id ? styles.active : ""}`}
            style={{ paddingLeft: 16 + level * 12 }}
            onClick={(e) => {
              e.stopPropagation();
              setInternalActiveId(item.id);
              onClick?.(item.id);
            }}
          >
            <span
              className={styles.expandIcon}
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(item.id);
              }}
            >
              {item.children?.length !== 0 && (
                <Arrow
                  size={20}
                  className={expandedIds.includes(item.id) && styles.activeIcon}
                />
              )}
            </span>
            {item.title}
          </div>
          {item.children && (
            <div
              className={styles.subItems}
              data-expanded={expandedIds.includes(item.id)} // 新增数据属性控制动画
            >
              {renderItems(item.children, level + 1)}
            </div>
          )}
        </div>
      ));
    };

    return (
      <div className={`${styles.anchorContainer} ${className || ""}`}>
        {renderItems(items)}
      </div>
    );
  },
);

// 辅助函数：获取某个ID的所有父级ID
function getParentIds(
  targetId: string,
  items: AnchorItem[],
  path: string[] = [],
): string[] {
  for (const item of items) {
    if (item.id === targetId) return path;
    if (item.children) {
      const found = getParentIds(targetId, item.children, [...path, item.id]);
      if (found.length) return found;
    }
  }
  return [];
}

export default Anchor;
