import React from "react";
import ReactDOM from "react-dom/client";
import ReiProvider from "./provider";
import "./scss/index.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* provider提供路由 内部渲染全部组件 */}
    <ReiProvider />
  </React.StrictMode>,
);
