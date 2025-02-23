import { BaseEditor, Text } from "slate";
import { ReactEditor } from "slate-react";

// 编辑器键盘事件
export type SlateKeyboardEvent = React.KeyboardEvent;
// 自定义组件属性(必须)
export type SlateAttribute = {
  "data-slate-node": "element";
  "data-slate-inline"?: true;
  "data-slate-void"?: true;
  dir?: "rtl";
  ref: any;
};
// 编辑器对象类型
export type SlateEditor = BaseEditor & ReactEditor;

// slate自定义接口

type Paragraph = {
  type: "paragraph";
  children: Text[];
};

type Code = {
  type: "code";
  children: Text[];
};

//// 自定义的组件结构

type CustomElement = Paragraph | Code;

type CustomTypes = {
  Editor: BaseEditor & ReactEditor;
  Element: Paragraph | Code;
  Text: Text;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
  }
}
