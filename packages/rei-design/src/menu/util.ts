import { MenuItem } from "./type";

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

// 递归遍历menuItems，组合到label的所有path
export function getCombinedPath(
  menuItems: MenuItem[],
  label: string,
): string | null {
  const findPath = (
    items: MenuItem[],
    label: string,
    currentPath: string,
  ): string | null => {
    for (const item of items) {
      const newPath = currentPath ? `${currentPath}/${item.path}` : item.path;
      if (item.label === label) {
        return newPath;
      }
      if (item.subItems) {
        const foundPath = findPath(item.subItems, label, newPath);
        if (foundPath) {
          return foundPath;
        }
      }
    }
    return null;
  };

  return findPath(menuItems, label, "");
}
