// 一个内容片段
export type BlogContent = MarkdownContent | CodeContent | TipContent;

export enum ContentTypes {
  MARKDOWN = "markdown",
  CODE = "code",
  DRAWING = "drawing",
  VISUAL = "visual", // 可视化内容
}

export interface MarkdownContent {
  type: "markdown";
  content: string;
}

// 代码片段
export interface CodeContent {
  type: "code";
  content: string;
  metadata: {
    language: string;
  };
}

// 提示片段
export interface TipContent {
  type: "tip";
  // 类型：提示、警告、错误
  level: "tip" | "warning" | "error";
  content: string;
}
