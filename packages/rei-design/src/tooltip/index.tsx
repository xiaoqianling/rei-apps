import { FunctionComponent, ReactNode, useRef, useState } from "react";
import styles from "./index.module.less";

interface ReiTooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const ReiTooltip: FunctionComponent<ReiTooltipProps> = ({
  children,
  content,
  position,
  className,
}) => {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculatePosition = (): "top" | "bottom" => {
    if (!containerRef.current) return "bottom";

    const rect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // 计算下方可用空间
    const spaceBelow = viewportHeight - rect.bottom;
    // 计算上方可用空间
    const spaceAbove = rect.top;

    // 优先下方，如果下方空间不足则显示在上方
    return spaceBelow > 100 || spaceBelow > spaceAbove ? "bottom" : "top";
  };

  const actualPosition = position || calculatePosition();

  return (
    <div
      ref={containerRef}
      className={`${styles.tooltipContainer} ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={`${styles.tooltip} ${styles[actualPosition]}`}>
          {content}
        </div>
      )}
    </div>
  );
};

export default ReiTooltip;
