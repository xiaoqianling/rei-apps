import React from "react";
import { RenderElementProps, RenderLeafProps } from "slate-react";
import { AlignType } from "./types";
import { isAlignElement } from "./util";
import { MarkdownH1, MarkdownH2, MarkdownP } from "../markdown/common";
import MarkdownCode from "../markdown/code";
import BlogTip from "../tip";
import BlogMultiCodeBlock from "../multiCodeBlock";
import BlogFoldBlock from "../foldBlock";

export type SlateAttributes = {
  "data-slate-node": "element";
  "data-slate-inline"?: true;
  "data-slate-void"?: true;
  dir?: "rtl";
  ref: any;
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
    case "heading-one":
      return <MarkdownH1>{children}</MarkdownH1>;
    case "heading-two":
      return <MarkdownH2>{children}</MarkdownH2>;
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case "code-block":
      return (
        <MarkdownCode
          attributes={attributes}
          language="js"
          element={element}
          code={element.code}
        ></MarkdownCode>
      );
    case "multi-code-block":
      return <BlogMultiCodeBlock element={element} attributes={attributes} />;
    case "note":
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
