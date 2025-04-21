import styles from "./index.module.scss";
import { forwardRef, FunctionComponent, useCallback, useState, useMemo } from "react";
import { SlateAttributes } from "../../slateEditor/element";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Transforms } from "slate";
import {
  useSlateStatic,
  useSelected,
  useFocused,
  ReactEditor,
} from "slate-react";
import { langs } from "@uiw/codemirror-extensions-langs";
import { noctisLilac } from "@uiw/codemirror-theme-noctis-lilac";
import { CodeBlockElement } from "../../slateEditor/custom/type";
import { FaCopy, FaCheck } from 'react-icons/fa';

// --- Language Mapping ---
type SupportedLanguage = "ts" | "js" | "cpp" | "html" | "java" | "python";
const languageMap: Record<SupportedLanguage, keyof typeof langs | null> = {
  ts: 'typescript',
  js: 'javascript',
  cpp: 'cpp',
  html: 'html',
  java: 'java',
  python: 'python',
};

interface MarkdownCodeProps {
  className?: string;
  language: SupportedLanguage;
  code: string;
  attributes?: SlateAttributes;
  element: CodeBlockElement;
}

/**
 * 渲染markdown的code组件，单语言块
 * @returns
 */
const MarkdownCode: FunctionComponent<MarkdownCodeProps> = forwardRef(
  ({ className, attributes, language, element }, ref) => {
    const editor = useSlateStatic();
    const selected = useSelected();
    const focused = useFocused();
    const [copied, setCopied] = useState(false);

    const getCodeText = useCallback(() => {
      return element.code;
    }, [element.code]);

    const handleChange = useCallback(
      (value: string) => {
        const path = ReactEditor.findPath(editor, element);
        if (!path) return;
        Transforms.setNodes(
          editor,
          { type: "code-block", language: element.language, code: value },
          { at: path },
        );
      },
      [editor, element],
    );

    const handleCopy = useCallback(() => {
      const codeToCopy = getCodeText();
      navigator.clipboard.writeText(codeToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }, [getCodeText]);

    // --- Get Language Extension Safely ---
    const getLanguageExtension = () => {
      const langKey = languageMap[language];
      if (langKey && langs[langKey]) {
        // @ts-ignore - We've checked the key exists, but TS might still complain
        return langs[langKey]();
      }
      console.warn(`Unsupported language or mapping not found for: ${language}. Falling back.`);
      return null; // Fallback to no specific language or langs.markdown() if preferred
    };

    const langExtension = useMemo(getLanguageExtension, [language]);

    return (
      <div
        {...attributes}
        className={`${styles.container} ${selected && focused ? styles.selected : ""} ${className}`}
        contentEditable={false}
        data-slate-void={true}
        data-slate-editor={false}
      >
        <button onClick={handleCopy} className={styles.copyButton} title="复制代码">
          {copied ? <><FaCheck /> 已复制</> : <><FaCopy /> 复制</>}
        </button>

        <ReactCodeMirror
          value={getCodeText()}
          onChange={handleChange}
          basicSetup={{
            foldGutter: true,
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            drawSelection: true,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: false,
          }}
          width="auto"
          // Use the safely obtained language extension
          extensions={langExtension ? [langExtension] : []} // Only add if valid
          theme={noctisLilac}
          style={{ fontSize: "var(--font-size)" }}
        />
      </div>
    );
  },
);

export default MarkdownCode;
