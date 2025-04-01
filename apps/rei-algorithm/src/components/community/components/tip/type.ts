import { ContentTypes } from "../../type/content";

// 提示组件
export enum TipLevelsTypes {
  TIP = "tip",
  WARNING = "warning",
  ERROR = "error",
}
export interface TipContent {
  type: ContentTypes.TIP;
  // 类型：提示、警告、错误
  level: TipLevelsTypes;
  content: string;
}
