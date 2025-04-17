import { VisualPanelContent } from "../../visual/type";
import { CodeContent } from "../components/codeBlock/type";
import { FoldBlockContent } from "../components/foldBlock/type";
import { MarkdownContent } from "../components/markdown/type";
import { MermaidContent } from "../components/mermaid/type";
import { TipContent } from "../components/tip/type";

// 一个内容片段
export type BlogContent =
  | MarkdownContent
  | CodeContent
  | TipContent
  | FoldBlockContent
  | MermaidContent
  | VisualPanelContent;

export enum ContentTypes {
  // 已实现
  MARKDOWN = "markdown",
  CODE = "code",
  TIP = "tip",
  FOLD = "fold",
  MERMAID = "mermaid",
  VISUAL = "visual", // 可视化内容

  // 新增富文本编辑器类型
  RICH_TEXT = "rich_text",

  // TODO:
}
