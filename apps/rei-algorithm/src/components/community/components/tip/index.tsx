import { AiFillInfoCircle } from "react-icons/ai";
import styles from "./index.module.scss";
import { FunctionComponent } from "react";
import { IoWarning } from "react-icons/io5";
import { VscError } from "react-icons/vsc";
import { TipContent } from "../../type/content/tipContent";

interface PostTipProps {
  tip: TipContent;
}

const PostTip: FunctionComponent<PostTipProps> = ({ tip }) => {
  const getIcon = () => {
    switch (tip.level) {
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
    switch (tip.level) {
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
    <div className={`${styles.container} ${getClassname()}`}>
      <div className={styles.icon}>{getIcon()}</div>
      <div className={styles.content}>{tip.content}</div>
    </div>
  );
};

export default PostTip;
