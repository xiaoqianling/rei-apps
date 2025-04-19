import ReiSplit from "rei-design/split";
import { useState, useMemo } from "react";
import CodeEditor from "../codeEditor";
import styles from "./index.module.scss";
import { initialCode } from "./mock";
import VisualEngineDemo from "@/src/pages/demo/demo";

function VisualPanel() {
  // 缓存树可视化组件，在拖动时也不会重绘
  const treeVisualizer = useMemo(() => {
    return (
      <div className={styles.treeWrapper}>
        <VisualEngineDemo />
      </div>
    );
  }, []);

  return (
    <div style={{ height: "500px" }}>
      <ReiSplit
        firstElement={<CodeEditor initialValue={initialCode} />}
        secondElement={treeVisualizer}
        direction="horizontal"
        range={[25, 75]}
      />
    </div>
  );
}

export default VisualPanel;
