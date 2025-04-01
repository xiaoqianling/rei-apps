import { ContentTypes } from "../community/type/content";

export interface VisualPanelContent {
  type: ContentTypes.VISUAL;
  content: string;
}
