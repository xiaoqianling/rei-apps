import styles from "./index.module.less";
import { FunctionComponent, ReactNode, useRef, useState } from "react";

interface ReiSplitProps {
  firstElement: ReactNode;
  secondElement: ReactNode;
  direction: "horizontal" | "vertical";
  // firstElement所占空间范围，两个值都取0-100
  range: [number, number];
  onMove?: (position: number) => void;
}

/**
 * 分割器
 * @param param0
 * @returns
 */
const ReiSplit: FunctionComponent<ReiSplitProps> = ({
  firstElement,
  secondElement,
  direction,
  range,
  onMove,
}) => {
  const [splitPosition, setSplitPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const animationFrame = useRef<number | null>(null); // 用于存储requestAnimationFrame的ID

  const isVertical = direction === "vertical";

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    e.preventDefault();

    // 使用requestAnimationFrame进行频控
    if (animationFrame.current !== null) {
      return;
    }

    // 创建动画
    animationFrame.current = requestAnimationFrame(() => {
      const containerRect = containerRef.current!.getBoundingClientRect();
      const newPosition = isVertical
        ? ((e.clientY - containerRect.top) / containerRect.height) * 100
        : ((e.clientX - containerRect.left) / containerRect.width) * 100;

      setSplitPosition(Math.max(range[0], Math.min(range[1], newPosition)));
      onMove && onMove(newPosition);

      animationFrame.current = null;
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.userSelect = "";
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    // 清除未执行的动画帧
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
  };

  return (
    <div
      className={`${styles.container} ${isVertical && styles.vertical}`}
      ref={containerRef}
    >
      <div
        className={styles.half}
        style={{
          [isVertical ? "height" : "width"]: `${splitPosition}%`,
        }}
      >
        {firstElement}
      </div>
      <div
        className={
          isVertical ? styles.vertical_divider : styles.horizontal_divider
        }
        onMouseDown={handleMouseDown}
      />
      <div
        className={styles.half}
        style={{
          [isVertical ? "height" : "width"]: `${100 - splitPosition}%`,
        }}
      >
        {secondElement}
      </div>
    </div>
  );
};

export default ReiSplit;
