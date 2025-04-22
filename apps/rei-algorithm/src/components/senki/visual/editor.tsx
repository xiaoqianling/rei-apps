import plugin from "../lib/babel/plugin-senki-wait";
import styles from "./index.module.scss";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AlgoSource, CodeControl, CodeContext } from "../lib/algo_desc";
import { Scene, SenkiArray, SenkiLinkedNode } from "../lib/senki";
import CodeDesc from "./common/codeDesc/CodeDesc";
import { transform } from "@babel/standalone";

const EMPTY_ALGO_SOURCE: AlgoSource = { rawCode: "", desc: [], asyncCode: "" };

const VisualEditor = () => {
  // ---状态变量---
  // 用户输入的数组
  const [algoSource, setAlgoSource] = useState<AlgoSource>(EMPTY_ALGO_SOURCE);
  const [codeControl, setCodeControl] = useState<CodeControl>();
  const [tempTask, setTempTask] = useState<(() => void) | undefined>();
  const [scene, setScene] = useState<Scene | undefined>();
  const location = useLocation();
  const [status, setStatus] = useState<"stop" | "play" | "finish">("stop");
  const [codeInfo, setCodeInfo] = useState({ line: [-1, -1], desc: -1 });
  // const [error, setError] = useState<string | null>(null);
  const statusRef = useRef(status);
  const [rawCode, setRawCode] = useState("");
  statusRef.current = status; // 没办法，为了在闭包函数里引用，只能干这种愚蠢操作。
  const canvas = useRef<HTMLCanvasElement>(null);

  // --- 事件处理函数 ---
  const createNewCodeControl = () => {
    setCodeControl(new CodeControl(algoSource.asyncCode));
  };

  const handlePlay = () => {
    // 先解析代码
    const newAlgoSource = {
      rawCode,
      desc: [],
      asyncCode: transform(rawCode, {
        plugins: [plugin],
      }).code!,
    };
    console.log(newAlgoSource);
    setAlgoSource(newAlgoSource);

    setStatus("play");
    return;
    // if (tempTask) {
    //   tempTask();
    // }
  };

  const handleRestart = () => {
    codeControl?.destroy(); // 一定要记得销毁
    createNewCodeControl();
    setStatus("play");
  };

  const handleStop = () => {
    setStatus("stop");
  };

  const handleNext = () => {
    if (tempTask) tempTask();
  };

  const handleChangeSpeed = () => {};

  // 初始化场景
  useLayoutEffect(() => {
    if (!canvas.current) {
      return;
    }
    setScene(new Scene(canvas.current!));
    return () => {
      codeControl?.destroy();
    };
  }, [canvas, location.pathname]);

  // 创建 codeControl - 当 algoSource 更新且非空时触发
  useEffect(() => {
    if (algoSource !== EMPTY_ALGO_SOURCE && !codeControl) {
      createNewCodeControl();
    }
  }, [algoSource]);

  // [核心逻辑] 监听 codeControl 的状态变化
  useEffect(() => {
    if (!codeControl) return;
    const handleWait = ({ info, resolve }: CodeContext) => {
      setCodeInfo(info);

      // 确定动画结束了再进行下一步
      const tryToNext = () => {
        if (statusRef.current === "play") {
          if (scene && scene.isAnimAllOver()) {
            resolve();
          } else setTimeout(tryToNext, 100);
        } else {
          setTempTask(() => {
            return resolve;
          });
        }
      };

      setTimeout(tryToNext, 500);
    };

    const handleEnd = () => {
      setStatus("finish");
      setCodeInfo({ line: [-1, -1], desc: -1 });
    };

    const handleDestroy = () => {
      scene?.removeAllChild();
    };

    codeControl?.on("wait", handleWait);
    codeControl?.on("end", handleEnd);
    codeControl?.on("destroy", handleDestroy);

    setTimeout(() => {
      codeControl?.start();
    }, 0);
  }, [codeControl]);

  // 初始化 senki
  useEffect(() => {
    if (!scene) return;
    SenkiArray.config.scene = scene;
    SenkiArray.config.width = scene.width;
    SenkiArray.config.height = scene.height;
    SenkiLinkedNode.setCanvasDimensions({
      width: scene.width,
      height: scene.height,
    });
    scene.add(SenkiLinkedNode.senkiForest);
  }, [scene]);

  return (
    <div className={styles.sortContainer}>
      <header>顶部栏 上传</header>
      <div className={styles.mainContent}>
        <div className={styles.codeArea}>
          <CodeDesc
            code={rawCode}
            onChange={(value) => {
              setRawCode(value);
            }}
            // desc={algoSource.desc}
            info={codeInfo}
            readonly={false}
          />
        </div>
        <canvas ref={canvas} className={styles.canvasArea}></canvas>
      </div>
      <div className={styles.controlsArea}>
        <div className={styles.controlTop}></div>
        <div className={styles.actionButtons}>
          <button onClick={handlePlay}>play</button>
          <button onClick={handleStop}>stop</button>
          <button onClick={handleNext}>next</button>
          <button onClick={handleChangeSpeed}>speed</button>
          <button onClick={handleRestart}>restart</button>
        </div>
      </div>
    </div>
  );
};

export default VisualEditor;
