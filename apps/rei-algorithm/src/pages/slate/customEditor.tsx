import { Editor, Element, Transforms } from "slate";
import { SlateEditor } from "./type";

// 自定义的一些编辑器操作，直接导出函数也行，这里没有上下文
export const CustomEditor = {
  // 检查是否有bold标记
  isBoldMarkActive: (editor: Editor) => {
    const marks = Editor.marks(editor);
    return marks ? marks.bold === true : false;
  },
  // 切换bold标记
  toggleBoldMark: (editor: Editor) => {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    if (isActive) {
      Editor.removeMark(editor, "bold");
    } else {
      Editor.addMark(editor, "bold", true);
    }
  },
  // 检查当前是否为code块
  isCodeBlockActive: (editor: SlateEditor) => {
    const [match] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === "code",
    });
    return Boolean(match);
  },
  // 切换code块
  toggleCodeBlock: (editor: SlateEditor) => {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? "paragraph" : "code" },
      { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) },
    );
  },
};
