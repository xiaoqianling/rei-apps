import ReiSplit from "rei-design/split";
import { useState, useMemo } from "react";
import CodeEditor from "../codeEditor";
import styles from "./index.module.scss";
import { initialCode } from "./mock";
import TreeVisualizer, { tree } from "../treeVisualizer";

function VisualPanel() {
  const [treeData, setTreeData] = useState(tree);

  // 缓存树可视化组件，在拖动时也不会重绘
  const treeVisualizer = useMemo(() => {
    return (
      <div className={styles.treeWrapper}>
        <TreeVisualizer tree={treeData} />
      </div>
    );
  }, [treeData]);

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
