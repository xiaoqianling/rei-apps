import { useState } from "react";
import TreeVisualizer, { tree } from "..";
import CodeEditor from "../../codeEditor";
import styles from "./index.module.scss";
import { initialCode } from "./mock";

function VisualPanel() {
  const [treeData, setTreeData] = useState(tree);
  return (
    <div className={styles.container}>
      <div className={styles.half}>
        <CodeEditor initialValue={initialCode} />
      </div>
      <div className={styles.half}>
        <TreeVisualizer tree={treeData} />
      </div>
    </div>
  );
}

export default VisualPanel;
