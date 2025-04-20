import { CSSProperties, FC, ReactNode } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";

interface Props {
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLHeadingElement>) => void;
  children: ReactNode;
  style?: CSSProperties;
}

export const MarkdownH1: FC<Props> = ({ className, onClick, children }) => {
  return (
    <h1
      children={children}
      onClick={onClick}
      className={classNames(styles.title, className)}
    />
  );
};

export const MarkdownH2: FC<Props> = ({ className, onClick, children }) => {
  return (
    <h2
      children={children}
      onClick={onClick}
      className={classNames(styles.title, className)}
    />
  );
};

export const MarkdownH3: FC<Props> = ({ className, onClick, children }) => {
  return (
    <h3
      children={children}
      onClick={onClick}
      className={classNames(styles.title, className)}
    />
  );
};

export const MarkdownP: FC<Props> = ({
  className,
  onClick,
  children,
  style,
}) => {
  return (
    <p
      children={children}
      onClick={onClick}
      className={classNames(styles.p, className)}
      style={style}
    />
  );
};
