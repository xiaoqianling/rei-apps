import { useToast } from "rei-design/toast";
import { VscRunAll } from "react-icons/vsc";
import { TbFreezeRow } from "react-icons/tb";
import { LuClipboardCopy, LuPanelLeftOpen } from "react-icons/lu";
import { MdCode, MdCodeOff } from "react-icons/md";
import ReiTooltip from "rei-design/tooltip";
import styles from "./index.module.scss";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { basicSetup, EditorView } from "codemirror";
import { javascript, javascriptLanguage } from "@codemirror/lang-javascript";
import { transform } from "@babel/standalone";
import { CodeEditorProps } from "./type";
import FlexBlock from "./flexBlock";
import { copyToClipboard } from "@/src/util/dom";
// 编辑器配置
import { CustomAutoCompletion } from "@/src/core/engine/editor/autocompletion";
import isHotkey from "is-hotkey";
import { useOpenState } from "@/src/hooks";
import ReiSplit from "rei-design/split";

export interface CodeEditorRef {
  blur: () => void;
}

const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(
  ({ initialValue = "", onChange }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView>();
    const [output, setOutput] = useState<string>("");
    const [consoleVisible, openConsole, closeConsole] = useOpenState(false);
    const [showToast, ToastComponent] = useToast();

    useImperativeHandle(ref, () => ({
      blur: () => {
        if (viewRef.current) {
          viewRef.current?.dom.blur();
        }
      },
    }));

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
      copyToClipboard(viewRef.current?.state.doc.toString() || "")
        .then(() => {
          showToast({ message: "复制成功", position: "top" });
        })
        .catch(() => {
          showToast({ message: "复制失败" });
        });
    };

    // 处理快捷键
    const handleKeyDown = (event: KeyboardEvent, view: EditorView) => {
      if (isHotkey("mod+s", event)) {
        event.preventDefault();
      }
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
          // 编辑器变化监听
          EditorView.updateListener.of((update) => {
            if (update.docChanged && onChange) {
              onChange(update.state.doc.toString());
            }
          }),
          // hotkey
          EditorView.domEventHandlers({
            keydown: handleKeyDown,
          }),
        ],
        parent: editorRef.current,
      });

      return () => {
        viewRef.current?.destroy();
      };
    }, [initialValue, onChange]);

    const topElement = (
      <>
        <header>
          <span className={styles.title}>
            示例代码: 展示代码执行、特定注解、可视化联动能力
          </span>
          {/* 一组操作 */}
          <div className={styles.operation}>
            {consoleVisible ? (
              <div>
                <ReiTooltip content="关闭控制台">
                  <MdCodeOff onClick={closeConsole} />
                </ReiTooltip>
              </div>
            ) : (
              <div>
                <ReiTooltip content="打开控制台">
                  <MdCode onClick={openConsole} />
                </ReiTooltip>
              </div>
            )}
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
            <div>
              <ReiTooltip content="运行代码">
                <VscRunAll
                  onClick={() =>
                    executeCode(viewRef.current?.state.doc.toString() || "")
                  }
                />
              </ReiTooltip>
            </div>
          </div>
        </header>
        <div className={styles.editor} ref={editorRef} />
      </>
    );

    return (
      <div className={styles.container}>
        <ToastComponent />
        <ReiSplit
          range={[50, 90]}
          firstElement={topElement}
          enable={consoleVisible}
          secondElement={
            consoleVisible && (
              <FlexBlock
                open={true}
                text={output}
                show
                onClose={closeConsole}
              />
            )
          }
          direction="vertical"
        />
      </div>
    );
  },
);

export default CodeEditor;
