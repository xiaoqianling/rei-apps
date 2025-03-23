import styles from "./index.module.scss";
import { rem2px } from "@/src/util/css";
import { throttle } from "@/src/util/frequency";
import {
  FunctionComponent,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, Outlet } from "react-router";
import LayoutHeader from "./header";
import HeaderLink from "./header/header-link";

interface LayoutProps {
  header: ReactElement<typeof HeaderLink> | ReactElement<typeof HeaderLink>[];
}

/**
 * layout模板 包含顶部栏
 * 已包含outlet子路由渲染
 */
const Layout: FunctionComponent<LayoutProps> = ({ header }) => {
  const [scroll, setScroll] = useState(false);
  const location = useLocation();
  const scrollPX = useMemo(() => {
    return rem2px(2);
  }, [location]);

  useEffect(() => {
    if (location.pathname !== "/") {
      setScroll(true);
      return;
    }
    // 节流滚动
    const handleScroll = throttle(() => {
      const scrollY = window.scrollY;
      if (scrollY > scrollPX) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    }, 50);
    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location]);

  return (
    <div className={styles.layout}>
      <header
        className={`${styles.header} ${scroll ? styles.header_linear : ""}`}
      >
        <LayoutHeader children={header} />
      </header>
      {/* {children} */}
      {/* 主页面路由相关 */}
      <div className={`${styles.main} ${scroll ? styles.main_linear : ""}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
