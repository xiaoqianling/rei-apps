import ReiSplit from "rei-design/split";
import { useMemo } from "react";
import styles from "./index.module.scss";
import CodeEditor from "../../visual/codeEditor";
import VisualEngineDemo from "@/src/pages/demo/demo";
import { initialCode } from "../../visual/panel/mock";

function VisualPanelV2() {
  // 缓存树可视化组件，在拖动时也不会重绘
  const visualizer = useMemo(() => {
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
        secondElement={visualizer}
        direction="horizontal"
        range={[25, 75]}
      />
    </div>
  );
}

export default VisualPanelV2;
