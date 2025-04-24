import React from "react";
import { RenderElementProps, RenderLeafProps } from "slate-react";
import { AlignType } from "./types";
import { isAlignElement } from "./util";
import {
  MarkdownH1,
  MarkdownH2,
  MarkdownH3,
  MarkdownP,
} from "../markdown/common";
import MarkdownCode from "../markdown/code";
import BlogTip from "../tip";
import BlogMultiCodeBlock from "../multiCodeBlock";
import BlogFoldBlock from "../foldBlock";
import BlogMermaid from "../mermaid";

export type SlateAttributes = {
  "data-slate-node": "element";
  "data-slate-inline"?: true;
  "data-slate-void"?: true;
  dir?: "rtl";
  ref: any;
};

// 在组件外部维护ID计数器
const idCounter = new Map<string, number>();

// 修改后的generateId函数
const generateId = (text: string) => {
  const baseId = text.replace(" ", "_").substring(0, 20);
  const count = (idCounter.get(baseId) || 0) + 1;
  idCounter.set(baseId, count);
  return count > 1 ? `${baseId}-${count}` : baseId;
};

// 块元素
export const Element = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const style: React.CSSProperties = {};
  if (isAlignElement(element)) {
    style.textAlign = element.align as AlignType;
  }

  switch (element.type) {
    case "md-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "h1":
      return (
        <MarkdownH1 id={generateId(children[0].props.text.text)}>
          {children}
        </MarkdownH1>
      );
    case "h2":
      return (
        <MarkdownH2 id={generateId(children[0].props.text.text)}>
          {children}
        </MarkdownH2>
      );
    case "h3":
      return (
        <MarkdownH3 id={generateId(children[0].props.text.text)}>
          {children}
        </MarkdownH3>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "code-block":
      return (
        <MarkdownCode attributes={attributes} element={element}></MarkdownCode>
      );
    case "multi-code-block":
      return <BlogMultiCodeBlock element={element} attributes={attributes} />;
    case "mermaid":
      return <BlogMermaid element={element} attributes={attributes} />;
    case "tip":
      return (
        <BlogTip
          initLevel={element.level}
          {...attributes}
          children={children}
        />
      );
    case "fold":
      return (
        <BlogFoldBlock
          attributes={attributes}
          open
          children={children}
          element={element}
        />
      );
    default:
      return <MarkdownP style={style}>{children}</MarkdownP>;
  }
};

// 行内元素
export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};
