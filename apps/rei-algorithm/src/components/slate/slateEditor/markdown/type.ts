import { Descendant } from "slate";

// 引用块
export type BlockQuoteElement = {
  type: "md-quote";
  align?: string;
  children: Descendant[];
};

export type H1Element = {
  type: "h1";
  align?: string;
  children: Descendant[];
};

export type H2Element = {
  type: "h2";
  align?: string;
  children: Descendant[];
};

export type H3Element = {
  type: "h3";
  align?: string;
  children: Descendant[];
};

export type H4Element = {
  type: "h4";
  align?: string;
  children: Descendant[];
};

export type H5Element = {
  type: "h5";
  align?: string;
  children: Descendant[];
};

export type H6Element = {
  type: "h6";
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

// 列表
export type BulletedListElement = {
  type: "bulleted-list";
  align?: string;
  children: Descendant[];
};

// 有序列表
export type NumberedListItemElement = {
  type: "numbered-list";
  children: Descendant[];
};

export type ListItemElement = {
  type: "list-item";
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

export type CodeLineElement = {
  type: "code-line";
  children: Descendant[];
};

export type MermaidElement = {
  type: "mermaid";
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
  | ListItemElement
  | ParagraphElement
  | VideoElement
  | CodeLineElement
  | MermaidElement;
