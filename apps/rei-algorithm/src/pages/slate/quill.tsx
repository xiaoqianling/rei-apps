// QuillEditor.tsx
import React, { useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill"; // React Quill
import "react-quill/dist/quill.snow.css"; // Quill's styles
import { Quill } from "react-quill";

interface QuillEditorProps {
  onChange?: (value: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ onChange }) => {
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();

      // Add custom button or functionality for inserting components
      const toolbar = quill.getModule("toolbar");
      toolbar.addHandler("insertComponent", insertComponent);
    }
  }, []);

  // Insert a custom component into Quill at the current cursor position
  const insertComponent = () => {
    const quill = quillRef.current?.getEditor();
    const range = quill?.getSelection();
    if (range) {
      const componentHTML =
        '<div class="custom-component">My Custom Component</div>';
      quill?.clipboard.dangerouslyPasteHTML(range.index, componentHTML);
    }
  };

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        onChange={onChange}
        modules={{
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline"],
            [{ align: [] }],
            ["link", "image"],
            ["insertComponent"], // Adding the custom button
          ],
        }}
      />
    </div>
  );
};

export default QuillEditor;
