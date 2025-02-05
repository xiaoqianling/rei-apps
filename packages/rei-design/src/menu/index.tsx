import { FunctionComponent, useState } from "react";
import { MenuItem } from "./type";
import styles from "./index.module.less";

export interface ReiMenuProps {
  menuItems: MenuItem[];
}

export const ReiMenu: FunctionComponent<ReiMenuProps> = ({ menuItems }) => {
  // 用来跟踪每个菜单项的展开或折叠状态
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleSubItems = (label: string) => {
    console.log(expanded, label);
    setExpanded((prevState) => ({
      ...prevState,
      [label]: !prevState[label], // 切换该菜单项的展开状态
    }));
  };

  // 判断是否为叶子节点
  const isEndPoint = (item: MenuItem) => {
    if (item.endPoint !== undefined) {
      return item.endPoint;
    } else {
      return !Array.isArray(item.subItems) || item.subItems.length === 0;
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    const { label, subItems } = item;
    const endPoint = isEndPoint(item);
    const isExpanded = expanded[label];

    return (
      <div
        key={label}
        className={styles.menuItem}
        onClick={() => {
          item.onClick && item.onClick(item.path);
        }}
      >
        <div
          className={styles.menuItemLabel}
          onClick={() => toggleSubItems(label)}
        >
          <span className={styles.menuItemText}>{label}</span>
          {!endPoint && (
            <span
              className={`${styles.toggleIcon} ${isExpanded ? styles.expanded : ""}`}
            />
          )}
        </div>
        {subItems && (
          <div
            className={`${styles.subMenu} ${isExpanded ? styles.expanded : ""}`}
          >
            {subItems.map((subItem) => renderMenuItem(subItem))}
          </div>
        )}
      </div>
    );
  };

  return <div className={styles.menu}>{menuItems.map(renderMenuItem)}</div>;
};
