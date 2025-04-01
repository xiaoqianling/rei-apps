import { ContentTypes } from "../../type/content";

export interface MarkdownContent {
  type: ContentTypes.MARKDOWN;
  content: string;
}
