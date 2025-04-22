import { CSSProperties, FC, ReactNode } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";
import { scrollToElementByID } from "@/src/util/dom";
import { NavLink } from "react-router";

interface Props {
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
  id?: string;
}

export const MarkdownH1: FC<Props> = ({ className, children, id }) => {
  return (
    <h1 id={id} className={classNames(styles.title, className)}>
      <NavLink
        to={`#${id}`}
        className={styles.hashLink}
        onClick={() => scrollToElementByID(id)}
      >
        #
      </NavLink>
      {children}
    </h1>
  );
};

export const MarkdownH2: FC<Props> = ({ className, children, id }) => {
  return (
    <h2 id={id} className={classNames(styles.title, className)}>
      <NavLink
        to={`#${id}`}
        className={styles.hashLink}
        onClick={() => scrollToElementByID(id)}
      >
        #
      </NavLink>
      {children}
    </h2>
  );
};

export const MarkdownH3: FC<Props> = ({ className, children, id }) => {
  return (
    <h3 id={id} className={classNames(styles.title, className)}>
      <NavLink
        to={`#${id}`}
        className={styles.hashLink}
        onClick={() => scrollToElementByID(id)}
      >
        #
      </NavLink>
      {children}
    </h3>
  );
};

export const MarkdownP: FC<Props> = ({ className, children, style }) => {
  return (
    <p
      children={children}
      className={classNames(styles.p, className)}
      style={style}
    />
  );
};
