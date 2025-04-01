import { ContentTypes } from "../../type/content";

export interface MermaidContent {
  type: ContentTypes.MERMAID;
  content: string;
}
