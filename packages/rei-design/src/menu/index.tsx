import { FunctionComponent, useState } from "react";
import { MenuItem } from "./type";
import styles from "./index.module.less";

export interface ReiMenuProps {
  menuItems: MenuItem[];
  onClick?: (path: string) => void;
  customStyle?: ReiMenuCustomStyle;
}

export interface ReiMenuCustomStyle {
  // 菜单项的背景颜色
  itemActiveBackgroundColor?: string;
}

export const ReiMenu: FunctionComponent<ReiMenuProps> = ({
  menuItems,
  onClick,
}) => {
  // 用来跟踪每个菜单项的展开或折叠状态
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initialExpanded: Record<string, boolean> = {};
    menuItems.forEach((item) => {
      initialExpanded[item.label] = true; // 默认展开所有路由
    });
    return initialExpanded;
  });

  const toggleSubItems = (label: string) => {
    setExpanded((prevState) => ({
      ...prevState,
      [label]: !prevState[label],
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
          endPoint && onClick && onClick(item.path);
        }}
      >
        <div
          className={`${item.active ? styles.activeLabel : styles.menuItemLabel}`}
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
