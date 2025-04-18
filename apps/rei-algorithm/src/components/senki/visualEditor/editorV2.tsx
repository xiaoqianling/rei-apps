import { langs } from "@uiw/codemirror-extensions-langs";
import { noctisLilac } from "@uiw/codemirror-theme-noctis-lilac";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { useRef } from "react";
function EditorV2() {
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  return (
    <div>
      <CodeMirror
        ref={editorRef}
        value="console.log('hello world!');"
        height="200px"
        basicSetup={{
          foldGutter: false,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: false,
        }}
        extensions={[langs.tsx()]}
        theme={noctisLilac}
        style={{ fontSize: "16px" }}
      />
    </div>
  );
}

export default EditorV2;
