import { ReactNode } from "react";

export interface ResizeContainerProps {
  children: ReactNode;
  // px
  initWidth: number;
  initHeight: number;
  maxWidth?: number;
  minWidth?: number;
  maxHeight?: number;
  minHeight?: number;
  // 横纵比 默认不保持比例 范围[0,5]
  ratio?: number;
}
