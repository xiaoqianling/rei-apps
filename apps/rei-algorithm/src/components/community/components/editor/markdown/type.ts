import { Descendant } from "slate";
import { CustomText } from "../custom-types";

// 引用块
export type BlockQuoteElement = {
  type: "md-quote";
  align?: string;
  children: Descendant[];
};

// 列表
export type BulletedListElement = {
  type: "bulleted-list";
  align?: string;
  children: Descendant[];
};

export type H1Element = {
  type: "heading-one";
  align?: string;
  children: Descendant[];
};

export type H2Element = {
  type: "heading-two";
  align?: string;
  children: Descendant[];
};

export type H3Element = {
  type: "heading-three";
  align?: string;
  children: Descendant[];
};

export type H4Element = {
  type: "heading-four";
  align?: string;
  children: Descendant[];
};

export type H5Element = {
  type: "heading-five";
  align?: string;
  children: Descendant[];
};

export type H6Element = {
  type: "heading-six";
  align?: string;
  children: Descendant[];
};

export type ImageElement = {
  type: "image";
  url: string;
  children: EmptyText[];
};

// 超链接
export type LinkElement = { type: "link"; url: string; children: Descendant[] };

export type ButtonElement = { type: "button"; children: Descendant[] };

// 有序列表
export type NumberedListItemElement = {
  type: "numbered-list";
  children: Descendant[];
};

export type ParagraphElement = {
  type: "paragraph";
  align?: string;
  children: Descendant[];
};

export type VideoElement = {
  type: "video";
  url: string;
  children: EmptyText[];
};

export type EmptyText = {
  text: string;
};

export type CodeBlockElement = {
  type: "code-block";
  language: string;
  children: Descendant[];
};

export type CodeLineElement = {
  type: "code-line";
  children: Descendant[];
};

// 支持align属性的组件
export type CustomElementWithAlign =
  | ParagraphElement
  | H1Element
  | H2Element
  | H3Element
  | H4Element
  | H5Element
  | H6Element
  | BlockQuoteElement
  | BulletedListElement;

// 所有markdown组件
export type MarkdownElement =
  | BlockQuoteElement
  | BulletedListElement
  | H1Element
  | H2Element
  | H3Element
  | H4Element
  | H5Element
  | H6Element
  | ImageElement
  | LinkElement
  | ButtonElement
  | NumberedListItemElement
  | ParagraphElement
  | VideoElement
  | CodeBlockElement
  | CodeLineElement;

// 模拟的自定义特色组件
type CustomElement = {
  type: "insert";
  content: string;
  children: Descendant[];
};

// 所有编辑器支持的组件
export type SlateElement = MarkdownElement | CustomElement;
// toolbar的块元素按钮
export type MarkdownElementType = MarkdownElement["type"];
// toolbar的插入自定义元素按钮
export type CustomElementType = CustomElement["type"];
