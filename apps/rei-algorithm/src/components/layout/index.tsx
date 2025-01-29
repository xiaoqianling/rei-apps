import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import styles from "./index.module.scss";
import LayoutHeader from "./header";
import { throttle } from "@/src/util/frequency";
import { rem2px } from "@/src/util/css";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  const [scroll, setScroll] = useState(false);
  const scrollPX = useMemo(() => {
    return rem2px(3);
  }, []);

  useEffect(() => {
    // 节流滚动
    const handleScroll = throttle(() => {
      console.log(window.scrollY, scrollPX);
      const scrollY = window.scrollY;
      if (scrollY > scrollPX) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    }, 50);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
