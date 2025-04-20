export type AlgoTag =
  | "排序"
  | "搜索"
  | "树"
  | "图"
  | "递归"
  | "迭代"
  | "分治"
  | "动态规划"
  | "官方"
  | "用户"
  | "热门"
  | "最新";

export interface AlgoCardData {
  id: string; // 用于跳转和 key
  title: string;
  description: string;
  tags: AlgoTag[];
  author: string; // "官方" 或 用户名
  category: "排序" | "搜索" | "树结构" | "图算法" | "其他"; // 用于分类
  previewImageUrl?: string; // 可选的预览图
}
