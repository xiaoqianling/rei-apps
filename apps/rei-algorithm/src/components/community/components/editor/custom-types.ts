import { BaseEditor, BaseRange, Range, Element } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { HistoryEditor } from "slate-history";
import {
  CustomElementType,
  MarkdownElementType,
  SlateElement,
} from "./markdown/type";

// 字体行内元素
export type CustomText = {
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  underline?: boolean;
  // MARKDOWN PREVIEW SPECIFIC LEAF
  underlined?: boolean;
  text: string;
};

// 行内元素标记
export type InlineElementFormat = keyof Omit<CustomText, "text">;
// 块级元素标记
export type BlockElementFormat = MarkdownElementType | AlignType | ListType;
// 自定义元素标记
export type CustomElementFormat = CustomElementType;

export type RenderElementPropsFor<T> = RenderElementProps & {
  element: T;
};

export type CustomEditor = BaseEditor &
  ReactEditor &
  HistoryEditor & {
    nodeToDecorations?: Map<Element, Range[]>;
  };

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: SlateElement;
    Text: CustomText;
    Range: BaseRange & {
      [key: string]: unknown;
    };
  }
}

// 定义列表类型和对齐类型的常量
export const LIST_TYPES = ["numbered-list", "bulleted-list"] as const;
export const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"] as const;

// 定义类型别名
export type AlignType = (typeof TEXT_ALIGN_TYPES)[number];
export type ListType = (typeof LIST_TYPES)[number];
