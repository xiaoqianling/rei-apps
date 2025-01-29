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
      <div className="rei-router-layout__bg" />
      <header className="rei-router-layout__header">
        <LayoutHeader />
      </header>
      <h1>welcome to Rei Algorithm</h1>
      {children}
      {/* 主页面路由相关 */}
      <Outlet />
    </div>
  );
};

export default Layout;
