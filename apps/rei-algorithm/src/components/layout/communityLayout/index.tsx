import { FC, useMemo } from "react";
import Layout from "../layout";
import HeaderLink from "../layout/header/header-link";

/**
 * @deprecated 暂时不需要单独的社区布局
 */
const CommunityLayout: FC = () => {
  const header = useMemo(() => {
    return (
      <>
        <HeaderLink to="/">首页</HeaderLink>
        <HeaderLink to="/community">社区</HeaderLink>
        <HeaderLink to="/community/i">我的</HeaderLink>
      </>
    );
  }, []);
  return <Layout header={header} />;
};

export default CommunityLayout;
