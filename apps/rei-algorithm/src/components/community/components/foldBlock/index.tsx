import { IoIosArrowForward } from "react-icons/io";
import styles from "./index.module.scss";
import { FunctionComponent, useState } from "react";
import classNames from "classnames";

interface PostFoldBlockProps {
  title: string;
  // TODO: 内容支持md
  content: string;
  open: boolean;
}

const PostFoldBlock: FunctionComponent<PostFoldBlockProps> = ({
  title,
  content,
  open: initialOpen,
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header} onClick={toggleOpen}>
        <div
          className={classNames(styles.arrowContainer, {
            [styles.arrowOpen]: isOpen,
          })}
        >
          <IoIosArrowForward className={styles.arrow} size={24} />
        </div>
        <div className={styles.title}>{title}</div>
      </div>
      <div
        className={classNames(styles.content, { [styles.contentOpen]: isOpen })}
      >
        {content}
      </div>
    </div>
  );
};

export default PostFoldBlock;
