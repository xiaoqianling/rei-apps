import CodeMirror from "@uiw/react-codemirror";
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
import { EditorView } from "codemirror";
import { transform } from "@babel/standalone";
import { CodeEditorProps } from "./type";
import FlexBlock from "./flexBlock";
import { copyToClipboard } from "@/src/util/dom";
// 编辑器配置
import isHotkey from "is-hotkey";
import { useOpenState } from "@/src/hooks";
import ReiSplit from "rei-design/split";
import { parse } from "@babel/parser";
import { transformAST } from "@/src/core/parse/ast";
import { highlightEffect } from "./extension";
import { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { noctisLilac } from "@uiw/codemirror-theme-noctis-lilac";
import { langs } from "@uiw/codemirror-extensions-langs";

export interface CodeEditorRef {
  blur: () => void;
}

// https://codemirror.net/examples/styling/
const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(
  ({ initialValue = "", onChange }, ref) => {
    const [showToast, ToastComponent] = useToast();
    const editorRef = useRef<ReactCodeMirrorRef>(null);
    // STATE
    const [output, setOutput] = useState<string>("");
    // 展示控制台
    const [consoleVisible, openConsole, closeConsole] = useOpenState(false);
    // 高亮代码区间
    const [highlightPos, setHighlightPos] = useState<[number, number] | null>(
      null,
    );
    const [isReadonly, setIsReadonly] = useState(false);

    // 执行代码 输出
    const executeCode = (code: string) => {
      try {
        // 使用 Babel 编译代码
        const compiled = transform(code, {
          presets: ["typescript"],
          filename: "code.ts",
        }).code;
        // console.log("compiled", compiled);
        console.log("AST:", parse(code));
        console.log("STEPS:", transformAST(parse(code)));
        setHighlightPos([0, 19]);

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
      copyToClipboard(editorRef.current?.state?.doc.toString() || "")
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

    // 更新高亮位置
    useEffect(() => {
      if (!editorRef.current) return;

      // if (!highlightPos) {
      //   // 消除高亮
      //   console.log("消除高亮");
      //   viewRef.current.dispatch({
      //     effects: highlightEffect.of({ from: 0, to: 0 }),
      //   });
      //   return;
      // }
      // console.log("添加高亮");
      // const [from, to] = highlightPos;
      // viewRef.current.dispatch({
      //   effects: highlightEffect.of({ from, to }),
      // });
    }, [highlightPos]);

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
                  onClick={
                    () => {}
                    // executeCode(viewRef.current?.state.doc.toString() || "")
                  }
                />
              </ReiTooltip>
            </div>
          </div>
        </header>
        <CodeMirror
          ref={editorRef}
          // value={code[mode]}
          height="200px"
          basicSetup={{
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: false,
          }}
          extensions={[langs.tsx()]}
          theme={noctisLilac}
          style={{ fontSize: "16px" }}
          // 高亮方案
        />
        {/* <div
          className={styles.editor}
          ref={editorRef}
          data-readonly={isReadonly}
        /> */}
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
