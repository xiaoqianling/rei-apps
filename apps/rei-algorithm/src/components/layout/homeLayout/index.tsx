import { FunctionComponent, useEffect, useMemo, useState } from "react";
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
        <HeaderLink to="/learn">开始使用</HeaderLink>
        <HeaderLink to="/docs">文档</HeaderLink>
        <HeaderLink to="/slate">杂项</HeaderLink>
        <HeaderLink to="/community">社区</HeaderLink>
        <HeaderLink to="/about">关于</HeaderLink>
      </>
    );
  }, []);
  return <Layout header={header} />;
};

export default HomeLayout;
