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

// 多语言代码组件(区别于markdown的code)
export interface CodeContent {
  type: "code";
  // tuple: [language, content]
  metadata: Array<[language: string, content: string]>;
}

// 提示组件
export interface TipContent {
  type: "tip";
  // 类型：提示、警告、错误
  level: "tip" | "warning" | "error";
  content: string;
}
