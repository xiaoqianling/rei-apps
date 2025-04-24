import { FunctionComponent, useCallback, useMemo, useState } from "react";
import styles from "./index.module.scss";
import { SlateAttributes } from "../slateEditor/element";
import { MultiCodeBlockElement } from "../slateEditor/custom/type";
import { Transforms, Node } from "slate";
import {
  useSlateStatic,
  useSelected,
  useFocused,
  ReactEditor,
} from "slate-react";
import MarkdownCode, { SupportedLanguage } from "../markdown/code";
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
  const [languages, setLanguages] = useState<SupportedLanguage[]>(
    element.content.map((item) => item.language),
  );
  const [code, setCode] = useState(element.content.map((item) => item.code)); // 初始代码块为第一个

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
    <div className={styles.container} {...attributes}>
      <div className={styles.languageTabs}>
        {code.map((_, index) => (
          <button
            key={languages[index]}
            className={`${styles.tab} ${
              index === activeLangIndex ? styles.active : ""
            }`}
            onClick={() => setActiveLangIndex(index)}
          >
            {languages[index]}
          </button>
        ))}
      </div>
      <MarkdownCode
        element={{
          type: "code-block",
          language: languages[activeLangIndex],
          code: code[activeLangIndex],
        }}
      />
    </div>
  );
};

export default BlogMultiCodeBlock;
