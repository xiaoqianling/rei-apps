import { FunctionComponent } from "react";
import { Outlet } from "react-router-dom";
import './index.scss'
import TodoSidebar from "../sidebar";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({children}) => {
  return (
    <div className="root-container">
      <TodoSidebar/>
      {children}
      {/* 主页面路由相关 */}
      <Outlet/>
    </div>
  );
};

export default Layout;
