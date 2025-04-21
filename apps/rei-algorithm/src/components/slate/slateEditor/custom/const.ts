import { TipLevelsTypes } from "../../tip";
import { CustomElementFormat } from "../types";
import { CustomElement } from "./type";

// 插入自定义元素时，获取一个实例
export function getCustomElementExample(
  format: CustomElementFormat,
): CustomElement | null {
  switch (format) {
    case "insert": {
      return { type: "insert", children: [{ text: "" }], content: "" };
    }
    case "note": {
      return {
        type: "note",
        level: TipLevelsTypes.TIP,
        children: [{ text: "这是一条提示" }],
      };
    }
    case "code-block": {
      return {
        type: "code-block",
        code: "console.log('hello world')",
        children: [{ text: "" }],
        language: "javascript",
      };
    }
    case "fold": {
      return {
        type: "fold",
        title: "折叠标题",
        children: [{ text: "填写内容" }],
      };
    }
    default:
      return null;
  }
}
