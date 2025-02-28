import { FunctionComponent, useEffect } from "react";
import SlateMarkdown from "./md";
import SaveEditor from "./saveEditor";
import CodeEditor from "@/src/components/codeEditor";

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
      <CodeEditor
        initialValue={`console.log("123");
const A = 5;
console.log(A ** 6);`}
      />
    </div>
  );
};

export default SlatePage;
