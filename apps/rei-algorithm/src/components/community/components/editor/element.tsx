import React from "react";
import { RenderElementProps, RenderLeafProps } from "slate-react";
import { AlignType } from "./custom-types";
import { isAlignElement } from "./util";
import { MarkdownH1, MarkdownH2 } from "../markdown/common";
import MarkdownCode from "../markdown/common/code";
import BlogTip from "../tip";
import { TipContent, TipLevelsTypes } from "../tip/type";
import { ContentTypes } from "../../type/content";

// 自定义元素
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
    case "insert":
      return (
        <MarkdownCode className="language-jsx">{element.content}</MarkdownCode>
      );
    case "note":
      const tip: TipContent = {
        type: ContentTypes.TIP,
        level: element.level,
        content: element.content,
      };
      return <BlogTip tip={tip} />;
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

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
