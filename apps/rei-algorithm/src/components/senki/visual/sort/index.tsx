import styles from "./index.module.scss";
import React, { useLayoutEffect, useRef, useState } from "react";
import CodeDesc from "../common/codeDesc/CodeDesc";
import { Scene, SenkiArray } from "../../lib/senki";
import {
  CodeContext,
  CodeControl,
  makeBubbleAlgoSource,
  makeMergeAlgoSource,
  makeQuickSortAlgoSource,
  makeSelectionAlgoSource,
  makeShellAlgoSource,
} from "../../lib/algo_desc";
import { Link, useLocation } from "react-router-dom";
import BreadcrumbNav from "../common/breadcrumb/BreadcrumbNav";

let scene: Scene;
let codeControl: CodeControl;
let makeAlgoSource = makeBubbleAlgoSource;
let fakeCode: string = "",
  desc: string[] = [],
  realCode: string = "";

let tempTask: () => void | undefined; // 保存断点继续的执行函数

const SimulateSort = () => {
  // 用户输入的数组
  const [reviseArray, setReviseArray] = useState();
  const location = useLocation();
  const [status, setStatus] = useState<"stop" | "play" | "finish">("stop");
  const [codeInfo, setCodeInfo] = useState({ line: [-1, -1], desc: -1 });

  const statusRef = useRef(status);
  statusRef.current = status; // 没办法，为了在闭包函数里引用，只能干这种愚蠢操作。
  const canvas = useRef<HTMLCanvasElement>(null);

  const createNewCodeControl = () => {
    codeControl = new CodeControl(realCode);

    const handleWait = ({ info, resolve }: CodeContext) => {
      setCodeInfo(info);

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
      setCodeInfo({ line: [-1, -1], desc: -1 });
    };

    const handleDestroy = () => {
      scene.removeAllChild();
    };

    codeControl.on("wait", handleWait);
    codeControl.on("end", handleEnd);
    codeControl.on("destroy", handleDestroy);

    codeControl.start();
  };

  const handlePlay = () => {
    if (tempTask) tempTask();
    setStatus("play");
  };

  const handleRestart = () => {
    [fakeCode, desc, realCode] = makeAlgoSource(reviseArray);
    codeControl.destroy(); // 一定要记得销毁
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

  const reviseArrayInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      let data = JSON.parse(event.target.value);
      setReviseArray(data);
    } catch (err) {
      setReviseArray(undefined);
    }
  };

  useLayoutEffect(() => {
    scene = new Scene(canvas.current!);
    SenkiArray.config.scene = scene;
    SenkiArray.config.width = scene.width;
    SenkiArray.config.height = scene.height;

    let path = location.pathname;

    if (/bubble/.test(path)) makeAlgoSource = makeBubbleAlgoSource;
    if (/merge/.test(path)) makeAlgoSource = makeMergeAlgoSource;
    if (/quick/.test(path)) makeAlgoSource = makeQuickSortAlgoSource;
    if (/selection/.test(path)) makeAlgoSource = makeSelectionAlgoSource;
    if (/shell/.test(path)) makeAlgoSource = makeShellAlgoSource;

    [fakeCode, desc, realCode] = makeAlgoSource(reviseArray);

    createNewCodeControl();
  }, [canvas, location.pathname]);

  return (
    <div className={styles.sortContainer}>
      <BreadcrumbNav />
      <div className={styles.mainContent}>
        <div className={styles.codeArea}>
          <CodeDesc code={fakeCode} desc={desc} info={codeInfo} />
        </div>
        <canvas ref={canvas} className={styles.canvasArea}></canvas>
      </div>
      <div className={styles.controlsArea}>
        <div className={styles.controlTop}>
          <div className={styles.navLinks}>
            <div style={{ padding: 24 }} className={""}>
              <Link to="/simulatedetail/sort/bubble">
                <span>冒泡</span>
              </Link>
              <Link to="/simulatedetail/sort/merge">
                <span>归并</span>
              </Link>
              <Link to="/simulatedetail/sort/quick">
                <span>快排</span>
              </Link>
              <Link to="/simulatedetail/sort/selection">
                <span>选择</span>
              </Link>
              <Link to="/simulatedetail/sort/shell">
                <span>希尔</span>
              </Link>
            </div>
          </div>
          <div className={styles.inputSection}>
            <div className={styles.inputGroup}>
              <input
                className={styles.arrayInput}
                placeholder="输入数组，例：[1,2,3,4,5]"
                onChange={(event) => {
                  reviseArrayInputChange(event);
                }}
              />
              <button className={styles.confirmButton} onClick={handleRestart}>确认</button>
            </div>
          </div>
        </div>
        <div className={styles.actionButtons}>
          <button onClick={handlePlay} disabled={status === 'play'}>play</button>
          <button onClick={handleStop} disabled={status === 'stop' || status === 'finish'}>stop</button>
          <button onClick={handleNext} disabled={status === 'play' || status === 'finish'}>next</button>
          <button onClick={handleChangeSpeed}>speed</button>
          <button onClick={handleRestart}>restart</button>
        </div>
      </div>
    </div>
  );
};

export default SimulateSort;
