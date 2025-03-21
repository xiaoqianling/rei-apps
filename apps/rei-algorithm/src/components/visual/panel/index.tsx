import { useState, useRef, useMemo } from "react";
import CodeEditor from "../codeEditor";
import styles from "./index.module.scss";
import { initialCode } from "./mock";
import TreeVisualizer, { tree } from "../treeVisualizer";

function VisualPanel() {
  const [treeData, setTreeData] = useState(tree);
  const [splitPosition, setSplitPosition] = useState(50); // 初始分割位置百分比
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // 缓存树可视化组件，在拖动时也不会重绘
  const treeVisualizer = useMemo(() => {
    return (
      <div className={styles.treeWrapper}>
        <TreeVisualizer tree={treeData} />
      </div>
    );
  }, [treeData]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newPosition =
      ((e.clientX - containerRect.left) / containerRect.width) * 100;
    setSplitPosition(Math.max(25, Math.min(75, newPosition))); // 限制在25%-75%之间
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.half} style={{ width: `${splitPosition}%` }}>
        <CodeEditor initialValue={initialCode} />
      </div>
      <div className={styles.divider} onMouseDown={handleMouseDown} />
      <div className={styles.half} style={{ width: `${100 - splitPosition}%` }}>
        {treeVisualizer}
      </div>
    </div>
  );
}

export default VisualPanel;
