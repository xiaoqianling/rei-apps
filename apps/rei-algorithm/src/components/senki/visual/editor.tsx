import plugin from "../lib/babel/plugin-senki-wait";
import styles from "./index.module.scss";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlgoSource, CodeControl, CodeContext } from "../lib/algo_desc";
import { Scene, SenkiArray, SenkiLinkedNode } from "../lib/senki";
import CodeDesc from "./common/codeDesc/CodeDesc";
import { transform } from "@babel/standalone";
import { FaUpload, FaSave, FaEdit, FaSquare } from "react-icons/fa";

const EMPTY_ALGO_SOURCE: AlgoSource = { rawCode: "", desc: [], asyncCode: "" };

interface VisualEditorProps {
  initialTitle?: string;
}

const initCode = `const A = new SenkiArray(1, 3, 4, 2, 5);
A.push(50);`;

const VisualEditor: React.FC<VisualEditorProps> = ({
  initialTitle = "未命名算法",
}) => {
  const navigate = useNavigate();
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
  const [rawCode, setRawCode] = useState<string>(initCode);
  statusRef.current = status; // 没办法，为了在闭包函数里引用，只能干这种愚蠢操作。
  const canvas = useRef<HTMLCanvasElement>(null);
  const [title, setTitle] = useState<string>(initialTitle);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

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

  const handleCodeChange = useCallback((newCode: string) => {
    setRawCode(newCode);
  }, []);

  // --- Title Editing --- //
  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length <= 30) {
      setTitle(event.target.value);
    }
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (!title.trim()) {
      setTitle("未命名算法"); // Reset if empty
    }
    console.log("Title updated (placeholder):", title);
  };

  const handleTitleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "Escape") {
      titleInputRef.current?.blur();
    }
  };

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  // --- Header Button Actions (Placeholders) --- //
  const handleUpload = () => {
    alert("上传算法功能待实现");
  };

  const handleSave = () => {
    alert("保存算法功能待实现");
  };

  return (
    <div className={styles.sortContainer}>
      {/* --- Editor Header --- */}
      <div className={styles.editorHeader}>
        <div className={styles.titleContainer}>
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className={styles.titleInput}
              maxLength={30}
            />
          ) : (
            <span
              onClick={handleTitleClick}
              className={styles.titleDisplay}
              title="点击编辑标题"
            >
              {title || "未命名算法"}{" "}
              <FaEdit
                style={{ fontSize: "0.8em", marginLeft: "5px", opacity: 0.6 }}
              />
            </span>
          )}
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={handleUpload}
            className={styles.headerButton}
            title="上传新算法"
          >
            <FaUpload /> 上传
          </button>
          <button
            onClick={handleSave}
            className={`${styles.headerButton} ${styles.saveButton}`}
            title="保存当前算法"
          >
            <FaSave /> 保存
          </button>
          <Link
            to={"/community"}
            className={styles.algoSquareButton}
            title="前往算法广场"
          >
            <FaSquare /> 算法广场
          </Link>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className={styles.mainContent}>
        <div className={styles.codeArea}>
          <CodeDesc
            info={codeInfo}
            code={rawCode}
            onChange={handleCodeChange}
            readonly={false}
          />
        </div>
        <canvas ref={canvas} className={styles.canvasArea}></canvas>
      </div>

      {/* --- Controls --- */}
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
