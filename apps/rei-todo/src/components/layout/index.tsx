import React from "react";
import { FunctionComponent } from "react";
import { Outlet } from "react-router-dom";
import './index.scss'
import TodoSidebar from "../sider";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({children}) => {
  return (
    <div className="root-container">
      <TodoSidebar/>
      <div style={{backgroundColor:'red', width: '300px'}}></div>
      <div style={{backgroundColor:'green', flex: 1}}></div>
      {/* TODO: 布局 */}
      {/* <h1>hello! Here is Layout</h1> */}
      <Outlet/>
    </div>
  );
};

export default Layout;
