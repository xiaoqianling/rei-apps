import React from "react";
import { FunctionComponent } from "react";
import { Outlet } from "react-router";

interface LayoutProps {}

const Layout: FunctionComponent<LayoutProps> = () => {
  return (
    <div>
      <h1>hello! Here is Layout</h1>
      <Outlet />
    </div>
  );
};

export default Layout;
