import Markdown from "react-markdown";
import { ReactNode } from "react";
import { MarkdownContent } from "../type/content";

export function renderMarkdown(markdown: MarkdownContent): ReactNode {
  return <Markdown>{markdown.content}</Markdown>;
}
3;
