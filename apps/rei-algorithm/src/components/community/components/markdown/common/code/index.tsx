import styles from "./index.module.scss";
import {
  forwardRef,
  FunctionComponent,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { SlateAttributes } from "../../../editor/element";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Transforms, Node, Editor } from "slate";
import {
  useSlateStatic,
  useSelected,
  useFocused,
  ReactEditor,
} from "slate-react";
import { langs } from "@uiw/codemirror-extensions-langs";
import { noctisLilac } from "@uiw/codemirror-theme-noctis-lilac";
import { CodeBlockElement } from "../../../editor/custom/type";

type SupportedLanguage = "ts" | "js" | "cpp" | "html" | "java" | "python";

interface MarkdownCodeProps {
  className?: string;
  language: SupportedLanguage;
  code: string;
  attributes?: SlateAttributes;
  element: CodeBlockElement;
}

/**
 * 渲染markdown的code组件
 * TODO: 多语言高亮
 * @returns
 */
const MarkdownCode: FunctionComponent<MarkdownCodeProps> = forwardRef(
  ({ className, attributes, language, element }, ref) => {
    const editor = useSlateStatic();
    const selected = useSelected();
    const focused = useFocused();

    const getCodeText = useCallback(() => {
      return element.code;
    }, [editor]);

    const handleChange = useCallback(
      (value: string) => {
        const path = ReactEditor.findPath(editor, element);
        if (!path) return;
        Transforms.setNodes(
          editor,
          {
            type: "code-block",
            language: "hello",
            code: value,
          },
          { at: path },
        );
      },
      [editor, element],
    );

    return (
      <div
        {...attributes}
        className={`${styles.container} ${selected && focused ? styles.selected : ""} ${className}`}
        contentEditable={false}
        data-slate-void={true}
        data-slate-editor={false}
      >
        <ReactCodeMirror
          value={getCodeText()}
          onChange={handleChange}
          basicSetup={{
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: false,
          }}
          width="700px"
          extensions={[langs.tsx()]}
          theme={noctisLilac}
          style={{ fontSize: "16px" }}
        />
      </div>
    );
  },
);

export default MarkdownCode;
