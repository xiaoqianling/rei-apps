import "./index.scss";
import { FunctionComponent, HTMLAttributeAnchorTarget } from "react";
import { NavLink, To } from "react-router";

interface LinkProps {
  to: To;
  children?: React.ReactNode;
  target?: HTMLAttributeAnchorTarget;
}

/**
 * 用于在header中使用的链接组件
 * @returns
 */
const HeaderLink: FunctionComponent<LinkProps> = ({ to, children, target }) => {
  return (
    <NavLink to={to} className="rei-router-layout-header-link" target={target}>
      {children}
    </NavLink>
  );
};

export default HeaderLink;
