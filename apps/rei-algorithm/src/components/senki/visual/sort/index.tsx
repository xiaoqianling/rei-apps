import styles from "./index.module.scss";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import CodeDesc from "../common/codeDesc/CodeDesc";
import { Scene, SenkiArray } from "../../lib/senki";
import { Link, useLocation, useParams } from "react-router-dom";
import BreadcrumbNav from "../common/breadcrumb/BreadcrumbNav";
import { AlgoSource } from "../../lib/algo_desc/makeAlgoSource";
import { CodeControl } from "../../lib/algo_desc";
import { getAlgo } from "@/src/api/algo/sort";

const EMPTY_ALGO_SOURCE: AlgoSource = { shower: "", desc: [], realcode: "" };

const SimulateSort = () => {
  const { id } = useParams();
  // ---状态变量---
  // 用户输入的数组
  const [algoSource, setAlgoSource] = useState<AlgoSource>(EMPTY_ALGO_SOURCE);
  const [codeControl, setCodeControl] = useState<CodeControl>();
  const [tempTask, setTempTask] = useState<(() => void) | undefined>();
  const [scene, setScene] = useState<Scene | undefined>();
  const [reviseArray, setReviseArray] = useState();
  const location = useLocation();
  const [status, setStatus] = useState<"stop" | "play" | "finish">("stop");
  const [codeInfo, setCodeInfo] = useState({ line: [-1, -1], desc: -1 });
  const statusRef = useRef(status);
  statusRef.current = status; // 没办法，为了在闭包函数里引用，只能干这种愚蠢操作。
  const canvas = useRef<HTMLCanvasElement>(null);

  const createNewCodeControl = () => {
    setCodeControl(new CodeControl(algoSource.realcode));
  };

  const handlePlay = () => {
    if (tempTask) {
      tempTask();
    }
    setStatus("play");
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

  // API 获取算法
  useEffect(() => {
    if (id) {
      getAlgo(id).then((res) => {
        if (res) setAlgoSource(res);
      });
    }
  }, [id]);

  // 创建 codeControl
  useEffect(() => {
    if (algoSource !== EMPTY_ALGO_SOURCE && !codeControl) {
      createNewCodeControl();
    }
  }, [algoSource]);

  // 监听 codeControl 的状态变化
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
  }, [scene]);

  return (
    <div className={styles.sortContainer}>
      <BreadcrumbNav />
      <div className={styles.mainContent}>
        <div className={styles.codeArea}>
          <CodeDesc
            code={algoSource.shower}
            desc={algoSource.desc}
            info={codeInfo}
          />
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
              <button className={styles.confirmButton} onClick={handleRestart}>
                确认
              </button>
            </div>
          </div>
        </div>
        <div className={styles.actionButtons}>
          <button onClick={handlePlay} disabled={status === "play"}>
            play
          </button>
          <button
            onClick={handleStop}
            disabled={status === "stop" || status === "finish"}
          >
            stop
          </button>
          <button
            onClick={handleNext}
            disabled={status === "play" || status === "finish"}
          >
            next
          </button>
          <button onClick={handleChangeSpeed}>speed</button>
          <button onClick={handleRestart}>restart</button>
        </div>
      </div>
    </div>
  );
};

export default SimulateSort;
