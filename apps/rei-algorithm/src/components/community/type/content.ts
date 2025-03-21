// 一个内容片段
export type BlogContent = MarkdownContent | CodeContent;

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

export interface CodeContent {
  type: "code";
  content: string;
  metadata: {
    language: string;
  };
}
