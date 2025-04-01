import { ContentTypes } from "../../type/content";

// 多语言代码组件(区别于markdown的code)
export interface CodeContent {
  type: ContentTypes.CODE;
  // tuple: [language, content]
  metadata: Array<CodeBlock>;
}

type CodeBlock = {
  language: string;
  code: string;
};
