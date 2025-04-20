import { FunctionComponent, useCallback, useMemo, useState } from "react";
import styles from "./index.module.scss";
import ReactCodeMirror from "@uiw/react-codemirror";
import { SlateAttributes } from "../editor/element";
import { MultiCodeBlockElement } from "../editor/custom/type";
import { Transforms, Node } from "slate";
import {
  useSlateStatic,
  useSelected,
  useFocused,
  ReactEditor,
} from "slate-react";
interface BlogCodeProps {
  attributes?: SlateAttributes;
  element: MultiCodeBlockElement;
}

// 多语言代码块
const BlogMultiCodeBlock: FunctionComponent<BlogCodeProps> = ({
  element,
  attributes,
}) => {
  const editor = useSlateStatic();
  const selected = useSelected();
  const focused = useFocused();
  const [activeLangIndex, setActiveLangIndex] = useState(0);
  const [languages, setLanguages] = useState<string[]>([]);

  const path = ReactEditor.findPath(editor, element);
  const codeText = useMemo(() => {
    return Node.string(element);
  }, [element]);

  // 处理代码变更
  const handleChange = useCallback(
    (value: string) => {
      Transforms.insertText(editor, value, { at: path });
    },
    [editor, path],
  );

  return (
    <div className={styles.container}>
      <div className={styles.languageTabs}>
        {code.metadata.map(({ language }, index) => (
          <button
            key={language}
            className={`${styles.tab} ${
              index === activeLangIndex ? styles.active : ""
            }`}
            onClick={() => setActiveLangIndex(index)}
          >
            {language}
          </button>
        ))}
      </div>
      <ReactCodeMirror />
    </div>
  );
};

export default BlogMultiCodeBlock;
