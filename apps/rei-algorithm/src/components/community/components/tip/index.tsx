import { AiFillInfoCircle } from "react-icons/ai";
import styles from "./index.module.scss";
import { forwardRef, FunctionComponent, ReactNode, useState } from "react";
import { IoWarning } from "react-icons/io5";
import { VscError } from "react-icons/vsc";
import { SlateAttributes } from "../editor/element";

// 提示组件
export enum TipLevelsTypes {
  TIP = "tip",
  WARNING = "warning",
  ERROR = "error",
}

interface BlogTipProps {
  // tip: TipContent;
  initLevel?: TipLevelsTypes;
  onTextChange?: (value: string) => void;
  onLevelChange?: (value: TipLevelsTypes) => void;
  attributes?: SlateAttributes;
  children?: ReactNode;
}

const BlogTip: FunctionComponent<BlogTipProps> = forwardRef<
  HTMLSpanElement,
  BlogTipProps
>(
  (
    {
      initLevel = TipLevelsTypes.TIP,
      onLevelChange,
      onTextChange,
      attributes,
      children,
    },
    ref,
  ) => {
    const [level, setLevel] = useState<TipLevelsTypes>(initLevel);

    const getIcon = () => {
      switch (level) {
        case "warning":
          return <IoWarning size={30} />;
        case "tip":
          return <AiFillInfoCircle size={30} />;
        case "error":
          return <VscError size={30} />;
        default:
          return null;
      }
    };

    const getClassname = () => {
      switch (level) {
        case "warning":
          return styles.warning;
        case "tip":
          return styles.tip;
        case "error":
          return styles.error;
        default:
          return null;
      }
    };
    return (
      <div className={`${styles.container} ${getClassname()}`} {...attributes}>
        <div className={styles.icon}>{getIcon()}</div>
        <span className={styles.content}>{children}</span>
      </div>
    );
  },
);

export default BlogTip;
