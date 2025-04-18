import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
// import "codemirror/keymap/sublime";
// import "codemirror/theme/eclipse.css";
// import "codemirror/theme/neo.css";
import React, { useLayoutEffect, useRef, useState } from "react";
import { ControlTrack } from "../components";
import { CodeContext, CodeControl } from "../lib/algo_desc";
import pulgin from "../lib/babel/plugin-senki-wait";
import { Scene, SenkiArray, SenkiLinkedNode } from "../lib/senki";
import { transform } from "@babel/standalone";
import { noctisLilac } from "@uiw/codemirror-theme-noctis-lilac";
import { langs } from "@uiw/codemirror-extensions-langs";
import ReiSplit from "rei-design/split";

let scene: Scene;
let codeControl: CodeControl;
let tempTask: undefined | (() => void); // 保存断点继续的执行函数

const Mode = [
  {
    title: "数组",
    className: "SenkiArray",
    header: 'import { SenkiArray } from "senki"\n\n',
  },
  {
    title: "树节点",
    className: "SenkiLinkedNode",
    header: 'import { SenkiLinkedNode } from "senki"\n\n',
  },
];

let histroyCodeStr = localStorage.getItem("code");

const histroyCode: string[] = histroyCodeStr
  ? JSON.parse(histroyCodeStr)
  : Mode.map((m) => m.header);

function VisualEditor() {
  const [codeInfo, setCodeInfo] = useState([-1, -1]);
  const [mode, setMode] = useState(0);
  const [format, setFormat] = useState(true);
  const [code, setCode] = useState(histroyCode);
  const [status, setStatus] = useState<"stop" | "play" | "finish">("stop");

  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const statusRef = useRef(status);
  statusRef.current = status; // 没办法，为了在函数里引用，只能干这种愚蠢操作。
  const codeInfoRef = useRef<number[]>();
  codeInfoRef.current = codeInfo;

  const handleSaveCode = () => {
    code[mode] = editorRef.current?.view?.state.doc.toString() || "";
    localStorage.setItem("code", JSON.stringify(code));
  };

  const handleRunCode = () => {
    code[mode] = editorRef.current?.view?.state.doc.toString() || "";
    localStorage.setItem("code", JSON.stringify(code));

    let { fakeCode, error, realCode } = makeCodeSource(code[mode], format);
    console.log({ fakeCode, error, realCode });

    createNewCodeControl(realCode, statusRef, setStatus, () => {}, setCodeInfo);

    if (format) {
      code[mode] = Mode[mode].header + fakeCode;
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

    let { error, realCode } = makeCodeSource(code[mode], format);

    createNewCodeControl(realCode, statusRef, setStatus, () => {}, setCodeInfo);

    setStatus("play");
  };

  const handleStop = () => {
    setStatus("stop");
  };

  const handleNext = () => {
    if (tempTask) tempTask();
  };

  const handleChangeSpeed = () => {};

  useLayoutEffect(() => {
    scene = new Scene(canvas.current!);
    SenkiArray.config.scene = scene;
    SenkiArray.config.width = scene.width;
    SenkiArray.config.height = scene.height;
    SenkiLinkedNode.setCanvasDimensions({
      width: scene.width,
      height: scene.height,
    });
    scene.add(SenkiLinkedNode.senkiForest);
  }, [canvas]);

  const editor = (
    <CodeMirror
      ref={editorRef}
      value={code[mode]}
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
  );

  return (
    <div>
      {/* 操作栏 */}
      <div>
        <div>
          <button>发布代码</button>
          <button onClick={handleSaveCode}>保存代码</button>
          <button onClick={handleRunCode}>执行代码</button>
        </div>
        <div>
          <ControlTrack
            status={status}
            speed={400}
            light
            onPlay={handlePlay}
            onStop={handleStop}
            onRestart={handleRestart}
            onChangeSpeed={handleChangeSpeed}
            onNext={handleNext}
          />
        </div>
      </div>
      <div>
        <ReiSplit
          firstElement={editor}
          secondElement={<canvas ref={canvas}></canvas>}
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

function makeCodeSource(code: string, format: boolean) {
  code = code.split("\n").slice(2).join("\n").trim();
  let error = "",
    fakeCode = code,
    realCode = "";

  try {
    if (format) fakeCode = transform(code, {}).code!;

    realCode = transform(fakeCode, {
      plugins: [pulgin],
    }).code!;
  } catch (err) {
    // error = err;
    console.error(err);
  }

  return { fakeCode, error, realCode };
}

const createNewCodeControl = (
  realCode: string,
  statusRef: React.MutableRefObject<"stop" | "play" | "finish">,
  setStatus: (bool: "stop" | "play" | "finish") => void,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  setCodeInfo: React.Dispatch<React.SetStateAction<number[]>>,
) => {
  if (codeControl) codeControl.destroy();

  codeControl = new CodeControl(realCode);

  const handleWait = ({ info, resolve }: CodeContext) => {
    setCodeInfo(info.line);
    // 确定动画结束了再进行下一步
    const tryToNext = () => {
      if (statusRef.current === "play") {
        if (scene.isAnimAllOver()) resolve();
        else setTimeout(tryToNext, 100);
      } else tempTask = resolve;
    };

    setTimeout(tryToNext, 500);
  };

  const handleEnd = () => {
    setStatus("finish");
    setCodeInfo([-1, -1]);
  };

  const handleDestroy = () => {
    scene.removeAllChild();
    SenkiLinkedNode.senkiForest.destroyTree();
    SenkiLinkedNode.resetSenkiForest();
    scene.add(SenkiLinkedNode.senkiForest);
  };

  const handleError = (err: string) => {
    setError(err);
  };

  codeControl.on("wait", handleWait);
  codeControl.on("end", handleEnd);
  codeControl.on("destroy", handleDestroy);
  codeControl.on("error", handleError);

  codeControl.start();
};
