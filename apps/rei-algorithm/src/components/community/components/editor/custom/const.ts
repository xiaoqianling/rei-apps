import { TipLevelsTypes } from "../../tip/type";
import { CustomElementFormat } from "../custom-types";
import { CustomElement } from "../markdown/type";

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
        content: "这是一条提示",
        level: TipLevelsTypes.TIP,
        children: [{ text: "" }],
      };
    }
    default:
      return null;
  }
}
