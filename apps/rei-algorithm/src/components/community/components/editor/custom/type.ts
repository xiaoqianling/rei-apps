import { Descendant } from "slate";
import { TipLevelsTypes } from "../../tip";

// 模拟的自定义特色组件
export type CustomElement =
  | InsertElement
  | NoteElement
  | CodeBlockElement
  | MultiCodeBlockElement
  | FoldBlockElement;
type InsertElement = {
  type: "insert";
  content: string;
  children: Descendant[];
};

type NoteElement = {
  type: "note";
  level: TipLevelsTypes;
  children?: Descendant[];
};

export type CodeBlockElement = {
  type: "code-block";
  language: string;
  code: string;
  children?: Descendant[];
};

export type MultiCodeBlockElement = {
  type: "multi-code-block";
  language: string[];
  children?: Descendant[];
};

export type FoldBlockElement = {
  type: "fold";
  title: string;
  children?: Descendant[];
};
