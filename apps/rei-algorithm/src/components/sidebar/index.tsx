import { MenuItem } from "rei-design/menu/type";
import styles from "./index.module.scss";
import { ReiMenu } from "rei-design/menu";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export interface SidebarProps {
  menuData: MenuItem[];
  prefix: string;
}

function DocsSidebar({ menuData, prefix }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  // 添加 props 到 state 的同步
  const [internalMenuData, setInternalMenuData] =
    useState<MenuItem[]>(menuData);

  // 当 props.menuData 变化时同步更新 state
  useEffect(() => {
    setInternalMenuData(menuData);
  }, [menuData]);

  // 高亮当前路由
  useEffect(() => {
    const pathname = location.pathname;

    // 递归变更路由active状态
    const processSub = (sub: MenuItem, path: string) => {
      if (sub.path === path) {
        sub.active = true;
      } else {
        sub.active = false;
      }

      if (sub.subItems && sub.subItems.length > 0) {
        sub.subItems = sub.subItems.map((subItem) => {
          return processSub(subItem, path);
        });
      }
      return sub;
    };

    if (pathname.startsWith(prefix)) {
      const path = pathname.replace(prefix, "").replace("/", "");
      setInternalMenuData((data) => {
        // 修改为更新 internalMenuData
        const ret = data.map((item) => {
          return processSub(item, path);
        });
        return ret;
      });
    }
  }, [location]);

  // 导航到文档id
  const handleClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className={styles.container}>
      <ReiMenu menuItems={internalMenuData} onClick={handleClick} />
    </div>
  );
}

export default DocsSidebar;

//-----
