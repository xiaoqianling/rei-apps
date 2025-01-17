import "./index.scss";
import { FunctionComponent } from "react";
import { NavLink, To } from "react-router";

interface LinkProps {
  to: To;
  children?: React.ReactNode;
}

/**
 * 用于在header中使用的链接组件
 * @returns
 */
const HeaderLink: FunctionComponent<LinkProps> = ({ to, children }) => {
  return (
    <NavLink to={to} className="rei-router-layout-header-link">
      {children}
    </NavLink>
  );
};

export default HeaderLink;
