import "./index.scss";
import HeaderLink from "./header-link";
import ReiLOGO from "../../custom/logo";

function LayoutHeader() {
  return (
    <div className="rei-router-layout-header">
      <ReiLOGO />
      <span className="rei-router-layout-header__links">
        <HeaderLink to="/">首页</HeaderLink>
        <HeaderLink to="/docs">文档</HeaderLink>
        <HeaderLink to="/learn">开始使用</HeaderLink>
        <HeaderLink to="/about">关于</HeaderLink>
      </span>
    </div>
  );
}

export default LayoutHeader;
