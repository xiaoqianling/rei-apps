import { FunctionComponent } from "react";
import { Outlet } from "react-router-dom";
import "./index.scss";
import LayoutHeader from "./header";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <div className="rei-router-layout">
      <header className="rei-router-layout__header">
        <LayoutHeader />
      </header>
      {children}
      {/* 主页面路由相关 */}
      <Outlet />
    </div>
  );
};

export default Layout;
