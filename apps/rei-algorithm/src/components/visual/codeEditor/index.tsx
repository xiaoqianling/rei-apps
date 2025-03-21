import { TbFreezeRow } from "react-icons/tb";
import {
  LuClipboardCopy,
  LuPanelLeftOpen,
  LuPanelLeftClose,
} from "react-icons/lu";
import { MdCode, MdCodeOff } from "react-icons/md";
import ReiTooltip from "rei-design/tooltip";
import styles from "./index.module.scss";
import { useEffect, useRef, useState } from "react";
import { basicSetup, EditorView } from "codemirror";
import { javascript, javascriptLanguage } from "@codemirror/lang-javascript";
import { transform } from "@babel/standalone";
import { CodeEditorProps } from "./type";
import FlexBlock from "./flexBlock";
import { copyToClipboard } from "@/src/util/dom";
// 编辑器配置
import { CustomAutoCompletion } from "@/src/core/engine/editor/autocompletion";

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

  const handleCopy = () => {
    copyToClipboard(editorRef.current?.innerText || "");
  };

  // 初始化
  useEffect(() => {
    if (!editorRef.current) return;

    viewRef.current = new EditorView({
      doc: initialValue,
      extensions: [
        basicSetup,
        javascriptLanguage.data.of({ autocomplete: CustomAutoCompletion }),
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
      <header>
        <button
          className={styles.executeButton}
          onClick={() =>
            executeCode(viewRef.current?.state.doc.toString() || "")
          }
        >
          执行代码
        </button>
        {/* 一组操作 */}
        <div className={styles.operation}>
          <div>
            <ReiTooltip content="打开控制台">
              <MdCode />
            </ReiTooltip>
          </div>
          <div>
            <ReiTooltip content="关闭控制台">
              <MdCodeOff />
            </ReiTooltip>
          </div>
          <div>
            <ReiTooltip content="复制">
              <LuClipboardCopy onClick={handleCopy} />
            </ReiTooltip>
          </div>
          <div>
            <ReiTooltip content="关闭面板">
              <LuPanelLeftOpen />
            </ReiTooltip>
          </div>
          <div>
            <ReiTooltip content="悬浮面板">
              <TbFreezeRow />
            </ReiTooltip>
          </div>
        </div>
      </header>
      <div className={styles.editor} ref={editorRef} />
      <FlexBlock open={true} text={output} show />
    </div>
  );
};

export default CodeEditor;
