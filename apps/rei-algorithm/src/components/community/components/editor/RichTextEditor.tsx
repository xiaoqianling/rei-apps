// 导入必要的库和类型
import {
  BsInfoSquareFill,
  BsTypeBold,
  BsTypeH1,
  BsTypeH2,
  BsTypeItalic,
  BsTypeUnderline,
} from "react-icons/bs";
import isHotkey from "is-hotkey";
import { KeyboardEvent, useCallback, useMemo } from "react";
import { Descendant, Editor, Transforms, createEditor } from "slate";
import { withHistory } from "slate-history";
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from "slate-react";
import {
  BlockButton,
  CustomButton,
  InlineMarkButton,
  Toolbar,
} from "./component";
import { InlineElementFormat } from "./custom-types";
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaCode,
  FaQuoteRight,
} from "react-icons/fa";
import styles from "./index.module.scss";
import { Element, Leaf } from "./element";
import { toggleInlineMark } from "./util";
import { MdOutlineNoteAlt } from "react-icons/md";
import { TipLevelsTypes } from "../tip/type";

// 定义快捷键映射
const HOTKEYS: Record<string, InlineElementFormat> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const ICON_SIZE = 20;

// 主组件 - 富文本编辑器
const RichTextEditor = () => {
  // 渲染元素和叶节点的回调函数
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    [],
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    [],
  );

  // 创建带有历史和React集成的编辑器实例
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const handleChange = (value: Descendant[]) => {
    console.log(value);
  };

  // 处理快捷键
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event)) {
        event.preventDefault();
        const mark = HOTKEYS[hotkey];
        toggleInlineMark(editor, mark);
        return;
      }
    }

    // 处理引用块
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === "md-quote",
    });
    if (match && isHotkey("shift+enter", event)) {
      event.preventDefault();
      editor.insertText("\n");
      return;
    } else if (match && isHotkey("enter", event)) {
      // 行尾换行，新建段落
      if (Editor.isEnd(editor, editor.selection?.focus, match[1])) {
        event.preventDefault();
        Transforms.insertNodes(editor, {
          type: "paragraph",
          children: [{ text: "" }],
        });
        return;
      } else {
        // 行内换行，插入换行符
        event.preventDefault();
        Transforms.insertText(editor, "\n");
      }
    }
  };

  return (
    <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
      {/* 工具栏 */}
      <Toolbar>
        <InlineMarkButton
          format="bold"
          icon={<BsTypeBold size={22} />}
          tip="加粗"
        />
        <InlineMarkButton
          format="italic"
          icon={<BsTypeItalic size={24} />}
          tip="斜体"
        />
        <InlineMarkButton
          format="underline"
          icon={<BsTypeUnderline size={ICON_SIZE} />}
          tip="下划线"
        />
        <InlineMarkButton
          format="code"
          icon={<FaCode size={ICON_SIZE} />}
          tip="代码"
        />
        <BlockButton
          format="heading-one"
          icon={<BsTypeH1 size={ICON_SIZE} />}
          tip="一级标题"
        />
        <BlockButton
          format="heading-two"
          icon={<BsTypeH2 size={ICON_SIZE} />}
          tip="二级标题"
        />
        <BlockButton
          format="md-quote"
          icon={<FaQuoteRight size={16} />}
          tip="引用"
        />
        {/* <BlockButton format="numbered-list" icon="format_list_numbered" /> */}
        {/* <BlockButton format="bulleted-list" icon="format_list_bulleted" /> */}
        <BlockButton
          format="left"
          icon={<FaAlignLeft size={ICON_SIZE} />}
          tip={"左对齐"}
        />
        <BlockButton
          format="center"
          icon={<FaAlignCenter size={ICON_SIZE} />}
          tip="居中对齐"
        />
        <BlockButton
          format="right"
          icon={<FaAlignRight size={ICON_SIZE} />}
          tip={"右对齐"}
        />
        <BlockButton
          format="justify"
          icon={<FaAlignJustify size={ICON_SIZE} />}
          tip="两端对齐"
        />
        <CustomButton
          format="insert"
          icon={<MdOutlineNoteAlt size={24} />}
          tip="测试"
        />
        <CustomButton
          format="note"
          icon={<BsInfoSquareFill size={22} />}
          tip="提示块"
        />
      </Toolbar>

      {/* 可编辑区域 */}
      <Editable
        className={styles.editor}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onCopy={(event) => {
          // 获取选中的纯文本
          const text = window.getSelection()?.toString();
          event.clipboardData?.setData("text/plain", text || "");
          // 阻止默认的JSON复制行为
          event.preventDefault();
        }}
        onKeyDown={handleKeyDown}
      />
    </Slate>
  );
};

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [
      { text: "This is editable " },
      { text: "rich", bold: true },
      { text: " text, " },
      { text: "much", italic: true },
      { text: " better than a " },
      { text: "<textarea>", code: true },
      { text: "!" },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: "bold", bold: true },
      {
        text: ", or add a semantically rendered block quote in the middle of the page, like this:",
      },
    ],
  },
  {
    type: "md-quote",
    children: [{ text: "A wise quote." }],
  },
  {
    type: "note",
    level: TipLevelsTypes.TIP,
    content: "This\n is\n a\n tip",
    children: [{ text: "Tip" }],
  },
  {
    type: "note",
    level: TipLevelsTypes.WARNING,
    content: "This is a warn",
    children: [{ text: "Tip" }],
  },
  {
    type: "note",
    level: TipLevelsTypes.ERROR,
    content: "This is a ERROR",
    children: [{ text: "Tip" }],
  },
  {
    type: "paragraph",
    align: "center",
    children: [{ text: "Try it out for yourself!" }],
  },
];

export default RichTextEditor;
