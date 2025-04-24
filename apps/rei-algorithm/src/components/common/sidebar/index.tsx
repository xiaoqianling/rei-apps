import React, { useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import styles from "./index.module.scss";
import { MenuItem } from "rei-design/menu/type";
import { FaAngleRight } from "react-icons/fa";

/**
 * export interface MenuItem {
  // 名字
  label: string;
  // 是否为叶子节点(包含具体路由) 默认根据subItems推断
  endPoint?: boolean;
  // 路由
  path: string;
  // 是否处于激活 只在endPoint为true时生效
  active?: boolean;
  subItems?: MenuItem[];
}

 */

export interface SidebarProps {
  menuData: MenuItem[];
  prefix: string;
  title?: string;
}

// Helper function to render menu items recursively
const renderMenuItems = (
  items: MenuItem[],
  prefix: string,
  level = 0,
  expandedItems: Set<string>,
  toggleExpand: (path: string) => void,
  parentPath = "", // 新增参数，记录父级路径
): React.ReactNode => {
  return (
    <ul className={`${styles.menuList} ${level > 0 ? styles.submenu : ""}`}>
      {items.map((item) => {
        const currentPath = parentPath
          ? `${parentPath}/${item.path}`
          : item.path;
        const fullPath = `${prefix}/${currentPath}`.replace(/\/+/g, "/");
        const isBranch = item.subItems && item.subItems.length > 0;
        const isExpanded = isBranch && expandedItems.has(item.path);

        return (
          <li
            key={item.path}
            className={`${styles.menuItem} ${isExpanded ? styles.itemExpanded : ""}`}
          >
            {!isBranch ? (
              <NavLink
                to={fullPath}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ""}`
                }
                end
              >
                <span className={styles.iconPlaceholder}>
                  {level === 0 ? "📄" : "•"}
                </span>
                <span className={styles.linkLabel}>{item.label}</span>
              </NavLink>
            ) : (
              <div
                className={styles.branchLabel}
                onClick={() => toggleExpand(item.path)}
              >
                <span className={styles.iconPlaceholder}>📁</span>
                <span className={styles.branchText}>{item.label}</span>
                <span
                  className={`${styles.collapseIcon} ${isExpanded ? styles.iconExpanded : ""}`}
                >
                  <FaAngleRight />
                </span>
              </div>
            )}
            {isBranch && (
              <div className={styles.submenuContainer}>
                {renderMenuItems(
                  item.subItems!,
                  prefix,
                  level + 1,
                  expandedItems,
                  toggleExpand,
                  currentPath, // 传递当前路径作为下一级的父级路径
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

function Sidebar({ menuData, prefix, title = "文档导航" }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = useCallback((path: string) => {
    setExpandedItems((prevExpanded) => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      return newExpanded;
    });
  }, []);

  return (
    <aside className={styles.sidebarContainer}>
      {/* --- Navigation Menu --- */}
      <nav className={styles.navigation}>
        {renderMenuItems(menuData, prefix, 0, expandedItems, toggleExpand)}
      </nav>

      {/* Optional Footer */}
      {/* <div className={styles.sidebarFooter}>...</div> */}
    </aside>
  );
}

export default Sidebar;

//-----
