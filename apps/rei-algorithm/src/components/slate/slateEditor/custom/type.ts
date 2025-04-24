import { Descendant } from "slate";
import { TipLevelsTypes } from "../../tip";
import { SupportedLanguage } from "@/src/components";

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
  type: "tip";
  level: TipLevelsTypes;
  children?: Descendant[];
};

export type CodeBlockElement = {
  type: "code-block";
  language: SupportedLanguage;
  code: string;
  children?: Descendant[];
};

type MultiCode = {
  language: SupportedLanguage;
  // 外显语言标签
  label: string;
  code: string;
};

export type MultiCodeBlockElement = {
  type: "multi-code-block";
  content: MultiCode[];
  children?: Descendant[];
};

export type FoldBlockElement = {
  type: "fold";
  title: string;
  children?: Descendant[];
};
