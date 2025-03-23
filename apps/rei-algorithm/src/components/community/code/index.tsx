import { FunctionComponent, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { CodeContent } from "../type/content";
import styles from "./index.module.scss";
import { materialLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface PostCodeProps {
  code: CodeContent;
  /**
export interface CodeContent {
  type: "code";
  // tuple: [language, content]
  metadata: Array<[language: string, content: string]>;
}

   */
}

// 多语言代码块
const PostCode: FunctionComponent<PostCodeProps> = ({ code }) => {
  const [activeLangIndex, setActiveLangIndex] = useState(0);
  const activeCode = code.metadata[activeLangIndex];

  return (
    <div className={styles.container}>
      <div className={styles.languageTabs}>
        {code.metadata.map(([language], index) => (
          <button
            key={language}
            className={`${styles.tab} ${
              index === activeLangIndex ? styles.active : ""
            }`}
            onClick={() => setActiveLangIndex(index)}
          >
            {language}
          </button>
        ))}
      </div>
      {/* TODO: 优化几个语言的高亮效果 */}
      <SyntaxHighlighter
        language={activeCode[0]}
        style={materialDark}
        customStyle={{ margin: 0 }}
      >
        {activeCode[1]}
      </SyntaxHighlighter>
    </div>
  );
};

export default PostCode;
