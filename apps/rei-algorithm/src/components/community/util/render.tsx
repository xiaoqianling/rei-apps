import { ReactNode } from "react";
import { Descendant } from "slate";
import SlateRenderer from "../components/blog/slateRenderer";

export function renderSlate(contents: Descendant[]): ReactNode {
  return <SlateRenderer data={contents} />;
}
