import { CodeContent } from "./codeBlockContent";
import { FoldBlockContent } from "./foldBlockContent";
import { TipContent } from "./tipContent";

// 一个内容片段
export type BlogContent =
  | MarkdownContent
  | CodeContent
  | TipContent
  | FoldBlockContent;

export enum ContentTypes {
  MARKDOWN = "markdown",
  CODE = "code",
  TIP = "tip",
  FOLD = "fold",
  VISUAL = "visual", // 可视化内容
}

export interface MarkdownContent {
  type: ContentTypes.MARKDOWN;
  content: string;
}
