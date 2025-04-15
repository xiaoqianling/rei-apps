/** 通用二维坐标 */
export interface Position {
  x: number;
  y: number;
}

/** 基础视觉元素的通用选项 */
export interface BaseElementOptions {
  id: string | number;
  parentSelection: d3.Selection<SVGGElement, unknown, null, undefined>; // 渲染的目标父元素
  initialPosition?: Position;
  data?: any; // 关联的原始数据 (可选)
  tooltip?: string; // 悬浮提示 (可选)
}

// 数据结构的基本值类型
export type DataStructureValueType = number | string;
