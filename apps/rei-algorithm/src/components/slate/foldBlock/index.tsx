import { IoIosArrowForward } from "react-icons/io";
import styles from "./index.module.scss";
import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import classNames from "classnames";
import { SlateAttributes } from "../slateEditor/element";
import { Transforms } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";
import element from "slate-react/dist/components/element";
import { FoldBlockElement } from "../slateEditor/custom/type";

interface BlogFoldBlockProps {
  // TODO: 内容支持md
  open: boolean;
  attributes: SlateAttributes;
  children?: React.ReactNode;
  element: FoldBlockElement;
}

const BlogFoldBlock: FunctionComponent<BlogFoldBlockProps> = ({
  open: initialOpen,
  attributes,
  children,
  element,
}) => {
  const editor = useSlateStatic();
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [titleValue, setTitleValue] = useState<string>(element.title);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLDivElement>) => {
      const path = ReactEditor.findPath(editor, element);
      if (!path) return;
      const newTitle = event.currentTarget.textContent || "";
      setTitleValue(newTitle);
      console.log(newTitle, editor.children);
      Transforms.setNodes(
        editor,
        {
          type: "fold",
          title: newTitle,
        },
        { at: path },
      );
    },
    [editor, element],
  );
  return (
    <div className={styles.container} {...attributes}>
      <div className={styles.header}>
        <div
          className={classNames(styles.arrowContainer, {
            [styles.arrowOpen]: isOpen,
          })}
        >
          <IoIosArrowForward
            className={styles.arrow}
            size={24}
            onClick={toggleOpen}
          />
        </div>
        <div className={styles.title} onChange={handleChange}>
          {titleValue}
        </div>
      </div>
      <div
        className={classNames(styles.content, { [styles.contentOpen]: isOpen })}
      >
        {children}
      </div>
    </div>
  );
};

export default BlogFoldBlock;
