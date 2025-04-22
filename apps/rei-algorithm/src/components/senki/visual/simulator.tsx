import styles from "./index.module.scss";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import CodeDesc from "./common/codeDesc/CodeDesc";
import { Scene, SenkiArray, SenkiLinkedNode } from "../lib/senki";
import { Link, useLocation, useParams } from "react-router-dom";
import BreadcrumbNav from "./common/breadcrumb/BreadcrumbNav";
import { AlgoSource } from "../lib/algo_desc/makeAlgoSource";
import { CodeContext, CodeControl } from "../lib/algo_desc";
import { getAlgo } from "@/src/api/algo/sort";

const EMPTY_ALGO_SOURCE: AlgoSource = { rawCode: "", desc: [], asyncCode: "" };

const VisualSimulator = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const statusRef = useRef(status);
  statusRef.current = status; // 没办法，为了在闭包函数里引用，只能干这种愚蠢操作。
  const canvas = useRef<HTMLCanvasElement>(null);

  // --- 数据获取逻辑 ---
  const fetchAlgoData = useCallback(() => {
    if (id) {
      setIsLoading(true);
      setError(null);
      // 清理旧的 CodeControl 和 Senki 对象
      codeControl?.destroy();
      setCodeControl(undefined); // 重置 codeControl 状态
      setAlgoSource(EMPTY_ALGO_SOURCE); // 重置算法源

      getAlgo(id)
        .then((res) => {
          if (res) {
            setAlgoSource(res);
            // 注意：CodeControl 的创建现在依赖 algoSource 的 useEffect
          } else {
            setError("获取算法数据失败，未找到资源。");
          }
        })
        .catch((err) => {
          console.error("获取算法数据时出错:", err);
          setError(`获取算法数据失败: ${err.message || "未知错误"}`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // 如果没有 id，也进行状态重置
      setAlgoSource(EMPTY_ALGO_SOURCE);
      codeControl?.destroy();
      setCodeControl(undefined);
      setError(null);
      setIsLoading(false);
    }
  }, [id]);

  // --- 事件处理函数 ---
  const createNewCodeControl = () => {
    setCodeControl(new CodeControl(algoSource.asyncCode));
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

  // API 获取算法 - 初始加载和 ID 变化时触发
  useEffect(() => {
    fetchAlgoData(); // 调用提取出的函数
  }, [id, fetchAlgoData]); // 依赖 fetchAlgoData

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
      <BreadcrumbNav />
      <div className={styles.mainContent}>
        <div className={styles.codeArea}>
          <CodeDesc
            code={algoSource.rawCode}
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
          <button
            onClick={handlePlay}
            disabled={status === "play" || isLoading || !!error}
          >
            play
          </button>
          <button
            onClick={handleStop}
            disabled={
              status === "stop" || status === "finish" || isLoading || !!error
            }
          >
            stop
          </button>
          <button
            onClick={handleNext}
            disabled={
              status === "play" || status === "finish" || isLoading || !!error
            }
          >
            next
          </button>
          <button onClick={handleChangeSpeed} disabled={isLoading || !!error}>
            speed
          </button>
          <button onClick={handleRestart} disabled={isLoading || !!error}>
            restart
          </button>
        </div>
      </div>
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
          <span>正在加载算法数据...</span>
        </div>
      )}
      {error && (
        <div className={styles.errorOverlay}>
          <div className={styles.errorIcon}>!</div>
          <span>{error}</span>
          <button onClick={fetchAlgoData} className={styles.retryButton}>
            重试
          </button>
        </div>
      )}
    </div>
  );
};

export default VisualSimulator;
