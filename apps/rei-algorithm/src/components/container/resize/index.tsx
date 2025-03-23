import { css } from "@emotion/css";
import styles from "./index.module.scss";
import { FunctionComponent, useState, useRef, useEffect } from "react";
import classNames from "classnames";
import { ResizeContainerProps } from "./type";
import { isInRange } from "@/src/util/math";

const ResizeContainer: FunctionComponent<ResizeContainerProps> = ({
  children,
  initWidth,
  initHeight,
  maxWidth,
  minWidth,
  maxHeight,
  minHeight,
  ratio,
}) => {
  const [size, setSize] = useState({ width: initWidth, height: initHeight });
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isRationValid = ratio !== undefined && isInRange(ratio, 0, 5);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing && containerRef.current) {
      const newWidth =
        e.clientX - containerRef.current.getBoundingClientRect().left;

      let finalWidth = newWidth;
      let finalHeight = size.height;

      // 如果ratio存在，则只处理水平拖动
      if (isRationValid) {
        finalHeight = newWidth / ratio;
      } else {
        // 如果没有ratio，则正常处理
        const newHeight =
          e.clientY - containerRef.current.getBoundingClientRect().top;
        finalHeight = newHeight;
      }

      setSize({
        width: Math.min(
          Math.max(finalWidth, minWidth || 0),
          maxWidth || Infinity,
        ),
        height: Math.min(
          Math.max(finalHeight, minHeight || 0),
          maxHeight || Infinity,
        ),
      });
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const containerClassname = css`
    width: ${size.width}px;
    height: ${size.height}px;
  `;

  return (
    <div
      ref={containerRef}
      className={classNames(styles.container, containerClassname)}
    >
      {children}
      <div
        className={classNames(
          styles.resizeHandle,
          css`
            cursor: ${isRationValid ? "ew-resize" : "se-resize"};
          `,
        )}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default ResizeContainer;
export type { ResizeContainerProps };
