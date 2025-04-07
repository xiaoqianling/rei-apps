import { MenuItem } from "rei-design/menu/type";
import styles from "./index.module.scss";
import { useLocation, useNavigate } from "react-router";
import {
  Fragment,
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { IoIosArrowForward } from "react-icons/io";

export interface SidebarProps {
  menuData: MenuItem[];
  prefix: string;
}

function DocsSidebarV2({ menuData, prefix }: SidebarProps) {
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
      <Menu menu={internalMenuData} />
    </div>
  );
}

export default DocsSidebarV2;

export interface Props {
  menu: MenuItem[];
  onClick?: (path: string) => void;
}

// 在组件顶部新增状态管理
const Menu: FunctionComponent<Props> = ({ menu, onClick }): ReactNode => {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() => {
    const paths = new Set<string>();
    const traverse = (items: MenuItem[]) => {
      items.forEach((item) => {
        if (item.subItems?.length) {
          paths.add(item.path);
          traverse(item.subItems);
        }
      });
    };
    traverse(menu);
    return paths;
  });

  const toggleMenu = (path: string) => {
    setExpandedPaths((prev) => {
      const newSet = new Set(prev);
      newSet.has(path) ? newSet.delete(path) : newSet.add(path);
      return newSet;
    });
  };

  return menu.map((item) => {
    if (item.subItems?.length) {
      const isExpanded = expandedPaths.has(item.path);
      isExpanded && console.log("expandedPaths", item.path);

      return (
        <Fragment key={item.path}>
          <div
            className={styles.title}
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu(item.path);
            }}
          >
            {item.label}
            <IoIosArrowForward
              className={`${styles.arrow} ${isExpanded ? styles.rotated : ""}`}
            />
          </div>
          <div
            className={`${styles.list} ${isExpanded ? styles.expanded : ""}`}
          >
            <Menu menu={item.subItems} onClick={onClick} />
          </div>
        </Fragment>
      );
    }
    return (
      <span
        key={item.path}
        className={styles.leaf}
        onClick={() => onClick?.(item.path)}
      >
        {item.label}
      </span>
    );
  });
};
