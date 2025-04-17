import { FC, ReactNode } from "react";
import styles from "./index.module.scss";
import { ExtraProps } from "react-markdown";
import classNames from "classnames";

// markdown库的props参数类型
type MarkdownProps = React.ClassAttributes<HTMLHeadingElement> &
  React.HTMLAttributes<HTMLHeadingElement> &
  ExtraProps;

interface Props {
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLHeadingElement>) => void;
  props?: MarkdownProps;
  children: ReactNode;
}

export const MarkdownH1: FC<Props> = ({
  className,
  onClick,
  props,
  children,
}) => {
  return (
    <h1
      {...props}
      children={children}
      onClick={onClick}
      className={classNames(styles.title, className, props?.className)}
    />
  );
};

export const MarkdownH2: FC<Props> = ({
  className,
  onClick,
  props,
  children,
}) => {
  return (
    <h2
      {...props}
      children={children}
      onClick={onClick}
      className={classNames(styles.title, className, props?.className)}
    />
  );
};

export const MarkdownH3: FC<Props> = ({
  className,
  onClick,
  props,
  children,
}) => {
  return (
    <h3
      {...props}
      children={children}
      onClick={onClick}
      className={classNames(styles.title, className, props?.className)}
    />
  );
};

export const MarkdownP: FC<Props> = ({
  className,
  onClick,
  props,
  children,
}) => {
  return (
    <p
      {...props}
      children={children}
      onClick={onClick}
      className={classNames(styles.p, className, props?.className)}
    />
  );
};
