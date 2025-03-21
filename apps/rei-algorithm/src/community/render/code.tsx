import { ReactNode } from "react";
import { CodeContent } from "../type/content";

export function renderPostCode(code: CodeContent): ReactNode {
  return (
    <div>
      {code.content}-{code.metadata.language}
    </div>
  );
}
