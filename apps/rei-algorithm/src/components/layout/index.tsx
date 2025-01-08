import { FunctionComponent } from "react";
import { Outlet } from "react-router-dom";
import "./index.scss";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <div className="root-container">
      <header></header>
      {/* ReiTODO 外部布局 */}
      {children}
      {/* 主页面路由相关 */}
      <Outlet />
    </div>
  );
};

export default Layout;
