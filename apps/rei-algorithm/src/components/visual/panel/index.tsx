import { useState } from "react";
import TreeVisualizer, { tree } from "..";
import CodeEditor from "../../codeEditor";
import styles from "./index.module.scss";

function VisualPanel() {
  const [treeData, setTreeData] = useState(tree);
  return (
    <div className={styles.container}>
      <div className={styles.half}>
        <CodeEditor
          initialValue={`console.log("123");\nconst A = 5;\nconsole.log(A ** 6);`}
        />
      </div>
      <div className={styles.half}>
        <TreeVisualizer tree={treeData} height={580} />
      </div>
    </div>
  );
}

export default VisualPanel;
