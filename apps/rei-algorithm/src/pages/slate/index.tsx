import { FunctionComponent, useEffect, useState } from "react";
import SlateMarkdown from "./md";
import SaveEditor from "./saveEditor";
import CodeEditor from "@/src/components/codeEditor";
import TreeVisualizer, { tree } from "@/src/components/visual";
import VisualPanel from "@/src/components/visual/panel";

interface SlatePageProps {}

const SlatePage: FunctionComponent<SlatePageProps> = () => {
  useEffect(() => {});
  return (
    <div>
      <h2>Slate Page</h2>
      <hr />
      {/* <SlateMarkdown /> */}
      <hr />
      <h2>可保存的编辑器</h2>
      <hr />
      <SaveEditor />
      <hr />
      <VisualPanel />
    </div>
  );
};

export default SlatePage;
