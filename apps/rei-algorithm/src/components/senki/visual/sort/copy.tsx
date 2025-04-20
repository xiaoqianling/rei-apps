import styles from "./index.module.scss";
import React, {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
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
import { Link, useParams } from "react-router-dom";
import BreadcrumbNav from "../common/breadcrumb/BreadcrumbNav";
import { AlgorithmData } from "../type";

// --- Speed Settings ---
type SpeedSetting = "Slow" | "Normal" | "Fast";
// These multipliers will now affect the *pause* duration
const PAUSE_MULTIPLIERS: Record<SpeedSetting, number> = {
  Slow: 1.8, // Longer pause
  Normal: 1.0,
  Fast: 0.4, // Shorter pause
};

// --- Mock Data Store ---
// In a real app, this data would come from an API
const MOCK_ALGORITHM_DATABASE: { [key: string]: Omit<AlgorithmData, "id"> } = {
  bubble: {
    name: "冒泡排序",
    // Note: fakeCode and descriptionSteps could be large, maybe load them async too
    fakeCode: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
    descriptionSteps: [
      "开始冒泡排序", // 1
      "外层循环，确定本轮比较的右边界", // 2
      "内层循环，开始相邻元素比较", // 3
      "比较 arr[j] 和 arr[j+1]", // 4
      "如果 arr[j] > arr[j+1]，交换它们", // 5
      "标记本轮发生过交换", // 6
      "内层循环结束", // 7
      "如果本轮没有发生交换，说明数组已有序，提前结束", // 8
      "外层循环结束", // 9
      "排序完成", // 10
    ],
    makeAlgoSource: makeBubbleAlgoSource,
  },
  merge: {
    name: "归并排序",
    fakeCode: `/* Fake Merge Sort Code */`, // Placeholder
    descriptionSteps: ["开始归并排序", "..."], // Placeholder
    makeAlgoSource: makeMergeAlgoSource,
  },
  quick: {
    name: "快速排序",
    fakeCode: `/* Fake Quick Sort Code */`, // Placeholder
    descriptionSteps: ["开始快速排序", "..."], // Placeholder
    makeAlgoSource: makeQuickSortAlgoSource,
  },
  selection: {
    name: "选择排序",
    fakeCode: `/* Fake Selection Sort Code */`, // Placeholder
    descriptionSteps: ["开始选择排序", "..."], // Placeholder
    makeAlgoSource: makeSelectionAlgoSource,
  },
  shell: {
    name: "希尔排序",
    fakeCode: `/* Fake Shell Sort Code */`, // Placeholder
    descriptionSteps: ["开始希尔排序", "..."], // Placeholder
    makeAlgoSource: makeShellAlgoSource,
  },
  // Add other algorithms here
};

// --- Simulate API Fetch ---
const fetchAlgorithmData = async (
  algoId: string | undefined, // Allow undefined
): Promise<AlgorithmData | null> => {
  if (!algoId) return null; // Handle case where algoId is not yet available
  console.log(`Simulating fetch for: ${algoId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = MOCK_ALGORITHM_DATABASE[algoId];
      if (data) {
        resolve({ id: algoId, ...data });
      } else {
        resolve(null); // Simulate not found
      }
    }, 300); // Simulate network delay
  });
};

// --- Component ---

// Keep CodeControl instance outside if needed across restarts without full remount,
// but manage its lifecycle carefully.
let codeControlInstance: CodeControl | null = null;
let tempTask: (() => void) | undefined;

const SimulateSortCopy = () => {
  const { id: algoId } = useParams<{ id?: string }>();
  console.log("Current algoId from route:", algoId);

  // --- State ---
  const [currentAlgorithmData, setCurrentAlgorithmData] =
    useState<AlgorithmData | null>(null);
  const [generatedCode, setGeneratedCode] = useState<{
    fakeCode: string;
    desc: string[];
    realCode: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviseArray, setReviseArray] = useState<number[] | undefined>([
    5, 1, 4, 2, 8,
  ]);
  const [status, setStatus] = useState<"stop" | "play" | "finish">("stop");
  const [codeInfo, setCodeInfo] = useState({ line: [-1, -1], desc: -1 });
  const [currentSpeed, setCurrentSpeed] = useState<SpeedSetting>("Normal");
  const [sceneInstance, setSceneInstance] = useState<Scene | null>(null);

  // --- Refs ---
  const speedRef = useRef(currentSpeed);
  speedRef.current = currentSpeed;
  const statusRef = useRef(status);
  statusRef.current = status;
  const canvas = useRef<HTMLCanvasElement>(null);

  // --- Core Logic Handler ---
  const generateAndSetupCodeControl = useCallback(
    (inputArray: number[] | undefined) => {
      console.log(
        "generateAndSetupCodeControl called. Data ready:",
        !!currentAlgorithmData,
        "Scene ready:",
        !!sceneInstance,
      );
      if (!currentAlgorithmData) {
        console.warn("generateAndSetupCodeControl skipped: No algorithm data.");
        return;
      }
      if (!sceneInstance) {
        console.warn("generateAndSetupCodeControl skipped: Scene not ready.");
        return;
      }

      try {
        console.log("Generating code with input:", inputArray);
        const [newFakeCode, newDesc, newRealCode] =
          currentAlgorithmData.makeAlgoSource(inputArray);

        console.log("Setting generated code...");
        setGeneratedCode({
          fakeCode: newFakeCode,
          desc: newDesc,
          realCode: newRealCode,
        });
        setCodeInfo({ line: [-1, -1], desc: -1 });
        setStatus("stop");
        tempTask = undefined;

        if (codeControlInstance) {
          codeControlInstance.destroy();
          codeControlInstance = null;
        }
        sceneInstance.removeAllChild();

        console.log("Creating CodeControl instance...");
        codeControlInstance = new CodeControl(newRealCode);
        console.log("CodeControl instance created.");

        const handleWait = ({ info, resolve }: CodeContext) => {
          setCodeInfo(info);
          const tryToNext = () => {
            if (statusRef.current === "play") {
              if (sceneInstance?.isAnimAllOver()) {
                resolve();
              } else {
                setTimeout(tryToNext, 100);
              }
            } else {
              tempTask = resolve;
            }
          };
          const baseDelay = sceneInstance?.isAnimAllOver() ? 50 : 400;
          const dynamicDelay = baseDelay * PAUSE_MULTIPLIERS[speedRef.current];
          console.log(
            `Waiting for ${dynamicDelay}ms (Base: ${baseDelay}, Speed: ${speedRef.current})`,
          );
          setTimeout(tryToNext, dynamicDelay);
        };

        const handleEnd = () => {
          setStatus("finish");
          setCodeInfo({ line: [-1, -1], desc: -1 });
          tempTask = undefined;
        };

        const handleDestroy = () => {
          sceneInstance?.removeAllChild();
          console.log(
            "CodeControl destroyed callback, scene cleared via instance.",
          );
        };

        codeControlInstance.on("wait", handleWait);
        codeControlInstance.on("end", handleEnd);
        codeControlInstance.on("destroy", handleDestroy);

        setStatus("stop");
        console.log("generateAndSetupCodeControl finished successfully.");
      } catch (error) {
        console.error("Error during generateAndSetupCodeControl:", error);
        setError("Failed to setup algorithm execution.");
        setGeneratedCode(null);
      }
    },
    [currentAlgorithmData, sceneInstance],
  );

  // --- Effects ---

  // Effect 1: Initialize Scene using useLayoutEffect
  useLayoutEffect(() => {
    console.log("Effect [SceneInit/useLayoutEffect]: Running...");
    // Run only if canvas element exists and scene state is not yet set
    if (canvas.current && !sceneInstance) {
      console.log(
        "Effect [SceneInit/useLayoutEffect]: Conditions met (canvas exists, scene not set). Initializing...",
      );
      let newScene: Scene | null = null;
      try {
        console.log(
          "Effect [SceneInit/useLayoutEffect]: Calling 'new Scene(canvas.current)'...",
        );
        newScene = new Scene(canvas.current);
        console.log(
          "Effect [SceneInit/useLayoutEffect]: 'new Scene' finished. Result:",
          newScene,
        );

        if (!newScene) {
          console.error(
            "Effect [SceneInit/useLayoutEffect]: 'new Scene' constructor returned null/undefined!",
          );
          setError("Failed to create visualization scene instance.");
          return; // Stop execution if scene creation failed
        }

        console.log(
          "Effect [SceneInit/useLayoutEffect]: Configuring SenkiArray...",
        );
        SenkiArray.config.scene = newScene;
        SenkiArray.config.width = newScene.width;
        SenkiArray.config.height = newScene.height;
        console.log(
          "Effect [SceneInit/useLayoutEffect]: SenkiArray configured.",
        );

        console.log(
          "Effect [SceneInit/useLayoutEffect]: Calling setSceneInstance...",
        );
        setSceneInstance(newScene);
        console.log(
          "Effect [SceneInit/useLayoutEffect]: setSceneInstance called successfully.",
        );
      } catch (error) {
        console.error(
          "Effect [SceneInit/useLayoutEffect]: Error during scene initialization:",
          error,
        );
        setError("Failed to initialize visualization canvas.");
      }
    } else {
      // Log why the conditions were not met
      if (!canvas.current) {
        console.log(
          "Effect [SceneInit/useLayoutEffect]: Skipped - canvas.current is still null/undefined.",
        );
      } else if (sceneInstance) {
        console.log(
          "Effect [SceneInit/useLayoutEffect]: Skipped - sceneInstance state is already set.",
        );
      }
    }
    // Using empty dependency array [] ensures this runs once after initial render + layout
  }, []); // <--- Changed dependency array to empty

  // Effect 2: Fetch Data when algoId changes
  useEffect(() => {
    let isMounted = true;
    console.log("Effect [DataFetch]: algoId changed to", algoId);
    if (!algoId) {
      setError("No algorithm selected.");
      setLoading(false);
      setCurrentAlgorithmData(null);
      setGeneratedCode(null);
      return;
    }
    setLoading(true);
    setError(null);
    setCurrentAlgorithmData(null);
    setGeneratedCode(null);

    fetchAlgorithmData(algoId)
      .then((data) => {
        if (isMounted) {
          if (data) {
            console.log("Effect [DataFetch]: Algorithm data loaded:", data.id);
            setCurrentAlgorithmData(data);
          } else {
            console.error(
              "Effect [DataFetch]: Algorithm data not found for",
              algoId,
            );
            setError(`Algorithm not found: ${algoId}`);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Effect [DataFetch]: Error loading data:", err);
          setError(`Failed to load algorithm data: ${err.message}`);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      // Minimal cleanup needed here now, CodeControl cleanup moved
    };
  }, [algoId]);

  // Effect 3: Generate Code and setup Control when Data and Scene are ready
  useEffect(() => {
    console.log(
      "Effect [SetupCheck]: Checking conditions. Data:",
      !!currentAlgorithmData,
      "Scene:",
      !!sceneInstance,
    );
    if (currentAlgorithmData && sceneInstance) {
      if (status !== "play") {
        console.log(
          "Effect [SetupCheck]: Conditions met, triggering generateAndSetupCodeControl...",
        );
        generateAndSetupCodeControl(reviseArray);
      } else {
        console.log(
          "Effect [SetupCheck]: Conditions met, but currently playing. Setup skipped.",
        );
      }
    } else {
      console.log(
        "Effect [SetupCheck]: Conditions not met (Data or Scene not ready).",
      );
    }
    // Cleanup function for CodeControl remains the same
    return () => {
      if (codeControlInstance) {
        console.log(
          "Effect [SetupCheck]: Cleanup - Destroying CodeControl due to dependency change.",
        );
        codeControlInstance.destroy();
        codeControlInstance = null;
        setStatus("stop");
        setCodeInfo({ line: [-1, -1], desc: -1 });
        tempTask = undefined;
        // Reset generated code? Maybe not, allow restart with same code.
        // setGeneratedCode(null);
      }
    };
  }, [
    currentAlgorithmData,
    sceneInstance,
    reviseArray,
    generateAndSetupCodeControl,
  ]);

  // --- Event Handlers ---

  const handlePlay = () => {
    if (status === "finish") {
      handleRestart(); // Restart if finished
      return;
    }
    if (!codeControlInstance || !sceneInstance) {
      console.warn("Play clicked but controls/scene not ready.");
      return;
    }

    setStatus("play");
    if (tempTask) {
      const taskToRun = tempTask;
      tempTask = undefined;
      taskToRun(); // Resume from breakpoint
    } else if (status === "stop") {
      codeControlInstance.start();
    }
  };

  const handleRestart = () => {
    if (!currentAlgorithmData || !sceneInstance) {
      setError("Cannot restart: Data or Scene not ready.");
      return;
    }
    console.log("Restarting visualization...");
    generateAndSetupCodeControl(reviseArray);
  };

  const handleStop = () => {
    setStatus("stop");
    // CodeControl doesn't have a pause, stop means interrupt and wait for next step/play
    // The actual pausing happens in the tryToNext logic by checking statusRef.current
  };

  const handleNext = () => {
    if (status === "finish") return;
    if (!codeControlInstance || !sceneInstance) return;

    if (tempTask) {
      setStatus("stop"); // Stay in stopped mode after stepping
      const taskToRun = tempTask;
      tempTask = undefined;
      taskToRun(); // Execute the next step
    } else if (status === "stop" && !tempTask) {
      // If completely stopped and no task pending, maybe start it?
      // Or this button should only work when paused.
      // Let's assume it only works when paused (tempTask is set)
      console.log("Next clicked but no task pending.");
    }
  };

  const handleChangeSpeed = () => {
    let nextSpeed: SpeedSetting;
    switch (currentSpeed) {
      case "Slow":
        nextSpeed = "Normal";
        break;
      case "Normal":
        nextSpeed = "Fast";
        break;
      case "Fast":
        nextSpeed = "Slow";
        break;
      default:
        nextSpeed = "Normal";
    }
    setCurrentSpeed(nextSpeed); // This will update speedRef.current automatically due to re-render
    console.log(`Speed setting changed to: ${nextSpeed}`);
    // No need to update SenkiArray.config anymore
  };

  const reviseArrayInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      // Basic validation: try to parse as JSON array
      const rawData = JSON.parse(event.target.value);
      if (
        Array.isArray(rawData) &&
        rawData.every((item) => typeof item === "number")
      ) {
        setReviseArray(rawData as number[]);
      } else {
        setReviseArray(undefined); // Or keep previous valid value
        console.warn("Invalid array input format.");
      }
    } catch (err) {
      setReviseArray(undefined); // Clear on parse error
    }
  };

  // --- Render ---
  console.log(
    "Rendering component. Status:",
    status,
    "GeneratedCode exists:",
    !!generatedCode,
  ); // Log render status

  if (loading) {
    return <div>Loading Algorithm...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!currentAlgorithmData) {
    return <div>Algorithm '{algoId}' not found or not loaded.</div>;
  }

  const isPlayDisabled = status === "play" || !generatedCode;
  console.log(
    `Play button disabled: ${isPlayDisabled} (status=${status}, generatedCode=${!!generatedCode})`,
  ); // Log button state calculation

  return (
    <div className={styles.sortContainer}>
      <BreadcrumbNav />
      <div className={styles.mainContent}>
        <div className={styles.codeArea}>
          <CodeDesc
            code={
              generatedCode?.fakeCode ?? currentAlgorithmData.fakeCode ?? ""
            }
            desc={
              generatedCode?.desc ?? currentAlgorithmData.descriptionSteps ?? []
            }
            info={codeInfo}
          />
        </div>
        <canvas ref={canvas} className={styles.canvasArea}></canvas>
      </div>
      <div className={styles.controlsArea}>
        <div className={styles.controlTop}>
          <div className={styles.navLinks}>
            <div style={{ padding: "10px 24px" }}>
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
                placeholder="输入数组, 例: [1,2,3]"
                defaultValue={JSON.stringify(reviseArray)}
                onChange={reviseArrayInputChange}
                key={algoId}
              />
              <button className={styles.confirmButton} onClick={handleRestart}>
                确认/重置
              </button>
            </div>
          </div>
        </div>
        <div className={styles.actionButtons}>
          <button onClick={handlePlay} disabled={isPlayDisabled}>
            {status === "finish" ? "Replay" : "Play"}
          </button>
          <button onClick={handleStop} disabled={status !== "play"}>
            Stop
          </button>
          <button
            onClick={handleNext}
            disabled={status === "play" || status === "finish" || !tempTask}
          >
            Next
          </button>
          <button onClick={handleChangeSpeed}>Speed: {currentSpeed}</button>
        </div>
      </div>
    </div>
  );
};

export default SimulateSortCopy;
