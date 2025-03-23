import { FunctionComponent, useCallback, useState } from "react";
import { createEditor, Descendant, Transforms, Element, Editor } from "slate";
import { Editable, RenderElementProps, Slate, withReact } from "slate-react";
import { SlateKeyboardEvent } from "./type";
import isHotkey from "is-hotkey";
import SlateCode from "./slateCode";
import { isBoldKey } from "./util";

interface SlateMarkdownProps {}

const SlateMarkdown: FunctionComponent<SlateMarkdownProps> = () => {
  const [editor] = useState(() => withReact(createEditor()));
  // 后端获取
  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
    {
      type: "code",
      children: [{ text: "A line of text in a code." }],
    },
  ];

  // 编辑器渲染元素
  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "paragraph":
        return <p {...props.attributes}>{props.children}</p>;
      case "code":
        return (
          <SlateCode attributes={props.attributes} children={props.children} />
        );
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);

  // addMark时分割内容，用leaf感知分割后添加的标签
  const renderLeaf = useCallback((props: any) => {
    return <Leaf {...props} />;
  }, []);

  // 快捷键处理
  const handleKeyDown = (event: SlateKeyboardEvent) => {
    if (event.key === "&") {
      event.preventDefault();
      editor.insertText(" and ");
    } else if (isHotkey("mod+`", event)) {
      event.preventDefault();
      const [match] = Editor.nodes(editor, {
        // 这个Match是从最外层的Element向内检验，匹配规则可能需要更费心 NOTE:
        match: (item, path) => {
          //   console.log("MATCH", item, path, Element.isElement(item));
          return Element.isElement(item) && item.type === "code";
        },
      });
      //   console.log("MATCH result", match);
      Transforms.setNodes(
        editor,
        { type: match ? "paragraph" : "code" },
        {
          match: (item) => {
            return Element.isElement(item) && Editor.isBlock(editor, item);
          },
        },
      );
    } else if (isBoldKey(event)) {
      event.preventDefault();
      console.log("BOLD KEY", event);
      // 给选定部分附加KV
      Editor.addMark(editor, "bold", true);
    }
  };

  return (
    <div>
      <Slate editor={editor} initialValue={initialValue}>
        <Editable
          renderElement={renderElement}
          onKeyDown={handleKeyDown}
          renderLeaf={renderLeaf}
        />
      </Slate>
    </div>
  );
};

export default SlateMarkdown;

const DefaultElement = (props: any) => {
  return <p {...props.attributes}>{props.children}</p>;
};

const Leaf = (props: any) => {
  console.log("LEAF", props);
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
    >
      {props.children}
    </span>
  );
};
