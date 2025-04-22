import styles from "./index.module.scss";
import { FunctionComponent, HTMLAttributeAnchorTarget, useState } from "react";
import { NavLink, NavLinkRenderProps, To } from "react-router";

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
  const getLinkClassnames = ({ isActive }: NavLinkRenderProps) => {
    return isActive ? styles.active_link : styles.link;
  };
  return (
    <NavLink to={to} className={getLinkClassnames} target={target}>
      {children}
    </NavLink>
  );
};

export default HeaderLink;
