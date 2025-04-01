import { ContentTypes } from "../../type/content";

export interface FoldBlockContent {
  type: ContentTypes.FOLD;
  content: string;
  title: string;
}
