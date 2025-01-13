import "./index.scss";
import { FunctionComponent } from "react";
import { Link, To } from "react-router";

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
    <Link to={to} className="rei-router-layout-header-link">
      {children}
    </Link>
  );
};

export default HeaderLink;
