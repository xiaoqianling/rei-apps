import { ContentTypes } from "./content";

export interface FoldBlockContent {
  type: ContentTypes.FOLD;
  content: string;
  title: string;
}
