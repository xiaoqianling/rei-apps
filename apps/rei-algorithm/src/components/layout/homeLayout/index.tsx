import { FunctionComponent, useMemo } from "react";
import Layout from "../layout";
import HeaderLink from "../layout/header/header-link";

interface LayoutProps {
  children?: React.ReactNode;
}

const HomeLayout: FunctionComponent<LayoutProps> = ({ children }) => {
  const header = useMemo(() => {
    return (
      <>
        <HeaderLink to="/">首页</HeaderLink>
        <HeaderLink to="/learn">数据结构基础</HeaderLink>
        <HeaderLink to="/visual">算法可视化</HeaderLink>
        <HeaderLink to="/slate">Playground</HeaderLink>
        <HeaderLink to="/community">社区</HeaderLink>
        <HeaderLink to="/about">关于</HeaderLink>
      </>
    );
  }, []);
  return <Layout header={header} />;
};

export default HomeLayout;
