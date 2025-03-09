import styles from "./index.module.scss";
import { useEffect, useRef, useState } from "react";
import { basicSetup, EditorView } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { transform } from "@babel/standalone";
import { CodeEditorProps } from "./type";
import FlexBlock from "./flexBlock";

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialValue = "",
  onChange,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView>();
  const [output, setOutput] = useState<string>("");

  // 执行代码 输出
  const executeCode = (code: string) => {
    try {
      // 使用 Babel 编译代码
      const compiled = transform(code, {
        presets: ["typescript"],
        filename: "code.ts",
      }).code;

      // 捕获 console.log 输出
      let consoleOutput = "";
      const originalConsole = console.log;
      console.log = (...args) => {
        consoleOutput += args.join(" ") + "\n";
        // originalConsole(...args);
      };

      // 执行编译后的代码 result 为 undefined
      const result = new Function(compiled!)();
      // console.log("result:", result);
      setOutput(consoleOutput);

      // 恢复原始 console
      console.log = originalConsole;
    } catch (error) {
      setOutput(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  // 初始化
  useEffect(() => {
    if (!editorRef.current) return;

    viewRef.current = new EditorView({
      doc: initialValue,
      extensions: [
        basicSetup,
        javascript({ typescript: true }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChange) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
      parent: editorRef.current,
    });

    return () => {
      viewRef.current?.destroy();
    };
  }, [initialValue, onChange]);

  return (
    <div className={styles.container}>
      <div className={styles.editor} ref={editorRef} />
      <button
        className={styles.executeButton}
        onClick={() => executeCode(viewRef.current?.state.doc.toString() || "")}
      >
        执行代码
      </button>
      <FlexBlock open={true} text={output} show />
    </div>
  );
};

export default CodeEditor;
