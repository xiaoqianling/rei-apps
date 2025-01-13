import { Link } from "react-router";
import "./index.scss";
import HeaderLink from "../header-link";

function LayoutHeader() {
  return (
    <div className="rei-router-layout-header">
      <span>LOGO</span>
      <span>
        一组路由
        <HeaderLink to="/">首页</HeaderLink>
      </span>
    </div>
  );
}

export default LayoutHeader;
