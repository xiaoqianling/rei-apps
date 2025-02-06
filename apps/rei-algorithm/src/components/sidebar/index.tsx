import { MenuItem } from "rei-design/menu/type";
import styles from "./index.module.scss";
import { ReiMenu } from "rei-design/menu";
import { useLocation, useNavigate, useRoutes } from "react-router";
import { useEffect, useState } from "react";
import { docsMenuData } from "@/src/pages/docs/type";

function DocsSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuData, setMenuData] = useState<MenuItem[]>(docsMenuData);

  // 高亮当前路由
  useEffect(() => {
    const pathname = location.pathname;
    const prefix = "/docs";

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
      setMenuData((data) => {
        const ret = data.map((item) => {
          return processSub(item, path);
        });
        console.log(ret);
        return ret;
      });
    }
  }, [location]);

  // 导航到文档id
  const handleClick = (path: string) => {
    console.log("rei-algo DocsSidebar handleClick", path);
    navigate(path);
  };

  return (
    <div className={styles.container}>
      <ReiMenu menuItems={menuData} onClick={handleClick} />
    </div>
  );
}

export default DocsSidebar;

//-----
