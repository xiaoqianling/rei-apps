import { useState } from "react";
import { createEditor, Descendant } from "slate";
import { Editable, Slate, withReact } from "slate-react";

// 可保存的编辑器
function SaveEditor() {
  const [editor] = useState(() => withReact(createEditor()));

  const handleChange = (value: React.ChangeEvent<HTMLDivElement>) => {};
  return (
    <div>
      <Slate editor={editor} initialValue={initialValue}>
        <Editable onChange={handleChange} />
      </Slate>
    </div>
  );
}

export default SaveEditor;

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];
