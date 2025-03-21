import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import styles from "./index.module.scss";
import { throttle } from "@/src/util/frequency";
import { rem2px } from "@/src/util/css";
import LayoutHeader from "./header";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
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
        <LayoutHeader />
      </header>
      {/* {children} */}
      {/* 主页面路由相关 */}
      <div className={styles.main}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
