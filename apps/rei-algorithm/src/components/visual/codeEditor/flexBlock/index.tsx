import { IoClose } from "react-icons/io5";
import { FaChevronRight } from "react-icons/fa";
import styles from "./index.module.scss";
import { FunctionComponent, useState } from "react";
import classNames from "classnames";

interface FlexBlockProps {
  className?: string;
  // 是否展示
  show?: boolean;
  // 打开或收起
  open: boolean;
  text: string;
  // 自由模式 可拖动和缩放
  free?: boolean;
  // 关闭回调
  onClose?: () => void;
  // 切换折叠状态
  onFoldClick?: (open: boolean) => void;
}

/**
 * 可折叠容器
 */
const FlexBlock: FunctionComponent<FlexBlockProps> = ({
  className,
  open,
  text,
  show,
  free,
  onFoldClick,
  onClose,
}) => {
  if (!show) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(open ?? true);

  const handleFoldClick = () => {
    setIsOpen((prev) => !prev);
    onFoldClick?.(!isOpen);
  };

  const block = (
    <div className={classNames(className, styles.container)}>
      <header className={styles.header}>
        <FaChevronRight
          onClick={handleFoldClick}
          className={classNames(styles.arrow, isOpen ? styles.openArrow : "")}
        />
        <span>控制台输出</span>
        <IoClose size={22} onClick={onClose} />
      </header>
      <main className={isOpen ? styles.main : styles.hidden_main}>{text}</main>
    </div>
  );
  return block;
};

export default FlexBlock;
