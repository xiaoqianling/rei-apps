import { Editor, Element, Path, Transforms } from "slate";
import {
  CustomEditor,
  InlineElementFormat,
  AlignType,
  LIST_TYPES,
  ListType,
  TEXT_ALIGN_TYPES,
  BlockElementFormat,
  CustomElementFormat,
  SlateElement,
} from "./types";
import { CustomElementWithAlign } from "./markdown/type";
import { getCustomElementExample } from "./custom/const";

export const isAlignElement = (
  element: SlateElement,
): element is CustomElementWithAlign => {
  return "align" in element;
};

export const isBlockMarkActive = (
  editor: CustomEditor,
  format: BlockElementFormat,
  blockType: "type" | "align" = "type",
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => {
        if (!Editor.isEditor(n) && Element.isElement(n)) {
          if (blockType === "align" && isAlignElement(n)) {
            return n.align === format;
          }
          return n.type === format;
        }
        return false;
      },
    }),
  );

  return !!match;
};

export const isInlineMarkActive = (
  editor: CustomEditor,
  format: InlineElementFormat,
) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const isCustomMarkActive = (
  editor: CustomEditor,
  format: CustomElementFormat,
): boolean => {
  const marks = Editor.marks(editor);
  // return marks ? marks[format] === true : false;
  return false;
};

export const isAlignType = (
  format: BlockElementFormat,
): format is AlignType => {
  return TEXT_ALIGN_TYPES.includes(format as AlignType);
};

// 是否是列表(包含有序和无序)
export const isListType = (
  format: BlockElementFormat | CustomElementFormat,
): format is ListType => {
  return LIST_TYPES.includes(format as ListType);
};

// 切换行内样式标记的函数
export const toggleInlineMark = (
  editor: CustomEditor,
  format: InlineElementFormat,
) => {
  // 指示当前的状态，点击之后应该切换为相反的状态
  const isActive = isInlineMarkActive(editor, format);
  console.log("切换行内标记", format, "isActive", isActive);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

// 切换块级元素格式的函数
export const toggleBlockMark = (
  editor: CustomEditor,
  format: BlockElementFormat,
) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
  });
  // BUG: 对于非块元素应该无效，但是比较是否是块元素需要类型判断，有点繁琐

  // 检查当前格式是否已激活
  const isActive = isBlockMarkActive(
    editor,
    format,
    isAlignType(format) ? "align" : "type",
  );
  const isList = isListType(format);
  console.log("ToggleBlockMark", " Format", format, "isActive", isActive);

  // 如果是列表类型，先解包现有列表
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      isListType(n.type) &&
      !isAlignType(format),
    split: true,
  });

  // 设置新的节点属性
  let newProperties: Partial<SlateElement>;
  if (isAlignType(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : format,
    };
  }
  Transforms.setNodes<Element>(editor, newProperties);

  // 如果是列表且未激活，则包装节点
  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

export const toggleCustomMark = (
  editor: CustomEditor,
  format: CustomElementFormat,
) => {
  // 获取当前光标位置
  const { selection } = editor;
  if (!selection) return;

  console.log("ToggleCustomMark", " Format", format);
  // 在当前段落后插入新行
  const element = getCustomElementExample(format);
  if (!element) return;
  Transforms.insertNodes(editor, [element], {
    at: Editor.after(editor, selection, { unit: "block" }), // 在下一行插入
    select: true, // 聚焦到新插入的节点
  });
};
