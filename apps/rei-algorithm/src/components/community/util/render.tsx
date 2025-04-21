import { ReactNode } from "react";
import { Descendant } from "slate";
import SlateRenderer from "../../slate/blog/slateRenderer";

export function renderSlate(contents: Descendant[]): ReactNode {
  return <SlateRenderer data={contents} />;
}
