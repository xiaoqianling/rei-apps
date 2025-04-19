import styles from "./index.module.scss";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CodeControl } from "../lib/algo_desc";
import { Scene, SenkiArray, SenkiLinkedNode } from "../lib/senki";
import { noctisLilac } from "@uiw/codemirror-theme-noctis-lilac";
import { langs } from "@uiw/codemirror-extensions-langs";
import ReiSplit from "rei-design/split";
import { makeCodeSource, createNewCodeControl } from "../util";
import {
  highlightEffect,
  highlightField,
} from "../../visual/codeEditor/extension";
import { LuClipboardCopy, LuPanelLeftOpen } from "react-icons/lu";
import { MdCodeOff, MdCode } from "react-icons/md";
import { TbFreezeRow } from "react-icons/tb";
import { VscRunAll } from "react-icons/vsc";
import ReiTooltip from "rei-design/tooltip";
import { copyToClipboard } from "@/src/util/dom";
import { useToast } from "rei-design/toast";

let historyCodeStr = localStorage.getItem("code");

const historyCode: string = historyCodeStr
  ? JSON.parse(historyCodeStr)
  : 'import { SenkiArray } from "senki"\n\n';

const editorHeight = 400;

function VisualEditor() {
  let scene: Scene;
  let codeControl: CodeControl = new CodeControl("");
  let tempTask: undefined | (() => void); // 保存断点继续的执行函数

  // 高亮行
  const [highlightLine, setCodeInfo] = useState<[number, number]>([-1, -1]);
  const [format, setFormat] = useState(true);
  const [code, setCode] = useState(historyCode);
  const [status, setStatus] = useState<"stop" | "play" | "finish">("stop");
  const [showToast, ToastComponent] = useToast();

  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statusRef = useRef(status);
  statusRef.current = status; // 没办法，为了在函数里引用，只能干这种愚蠢操作。

  // 触发高亮
  useEffect(() => {
    // editorRef.current?.view?.dispatch({
    //   effects: highlightEffect.of(highlightLine),
    // });
  }, [highlightLine]);

  const handleSaveCode = () => {
    setCode(editorRef.current?.view?.state.doc.toString() || "");
    localStorage.setItem("code", JSON.stringify(code));
  };

  const handleRunCode = () => {
    setCode(editorRef.current?.view?.state.doc.toString() || "");
    localStorage.setItem("code", JSON.stringify(code));

    let { fakeCode, error, realCode } = makeCodeSource(code, format);

    createNewCodeControl(
      realCode,
      statusRef,
      setStatus,
      () => {},
      setCodeInfo,
      scene,
      tempTask,
    );

    if (format) {
      setCode('import { SenkiArray } from "senki"\n\n' + fakeCode);
      // editor.current?.editor.setValue(code[mode]);
      localStorage.setItem("code", JSON.stringify(code));
    }

    setStatus("play");
  };

  const handlePlay = () => {
    if (!codeControl || codeControl.status !== "running")
      if (tempTask) tempTask();
    setStatus("play");
  };

  const handleRestart = () => {
    codeControl.destroy(); // 一定要记得销毁

    let { error, realCode } = makeCodeSource(code, format);

    createNewCodeControl(
      realCode,
      statusRef,
      setStatus,
      () => {},
      setCodeInfo,
      scene,
      tempTask,
    );

    setStatus("play");
  };

  const handleStop = () => {
    setStatus("stop");
  };

  const handleNext = () => {
    if (tempTask) tempTask();
  };

  const handleChangeSpeed = () => {};

  // 初始化canvas
  useLayoutEffect(() => {
    scene = new Scene(canvasRef.current!);
    SenkiArray.config.scene = scene;
    SenkiArray.config.width = scene.width;
    SenkiArray.config.height = scene.height;
    SenkiLinkedNode.setCanvasDimensions({
      width: scene.width,
      height: scene.height,
    });
    scene.add(SenkiLinkedNode.senkiForest);
  }, [canvasRef]);

  const handleCopy = () => {
    copyToClipboard(editorRef.current?.state?.doc.toString() || "")
      .then(() => {
        showToast({ message: "复制成功", position: "top" });
      })
      .catch(() => {
        showToast({ message: "复制失败" });
      });
  };

  const editor = (
    <CodeMirror
      ref={editorRef}
      value={code}
      height={`${editorHeight}px`}
      basicSetup={{
        foldGutter: false,
        dropCursor: false,
        allowMultipleSelections: false,
        indentOnInput: false,
      }}
      extensions={[langs.tsx(), highlightField]}
      theme={noctisLilac}
      style={{ fontSize: "16px" }}
      // 高亮方案
    />
  );

  return (
    <div className={styles.container}>
      {/* 操作栏 */}
      <ToastComponent />
      <header>
        <span className={styles.title}>
          示例代码: 展示代码执行、特定注解、可视化联动能力
        </span>
        {/* 一组操作 */}
        <div className={styles.operation}>
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
              <VscRunAll onClick={handleRunCode} />
            </ReiTooltip>
          </div>
        </div>
      </header>
      <div>
        <ReiSplit
          firstElement={editor}
          secondElement={
            <canvas ref={canvasRef} height={editorHeight}></canvas>
          }
          direction={"horizontal"}
          range={[25, 75]}
        />
        <div>
          <span>
            {status === "stop"
              ? "暂无正在执行的代码"
              : status === "play"
                ? "正在执行动画"
                : "代码执行结束"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default VisualEditor;
