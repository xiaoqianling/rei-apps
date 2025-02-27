import { FunctionComponent, useEffect } from "react";
import SlateMarkdown from "./md";
import SaveEditor from "./saveEditor";

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
    </div>
  );
};

export default SlatePage;
