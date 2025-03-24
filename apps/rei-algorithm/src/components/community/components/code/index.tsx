import { FunctionComponent, useState } from "react";
import styles from "./index.module.scss";
import { Highlight, themes } from "prism-react-renderer";
import classNames from "classnames";
import { CodeContent } from "../../type/content/codeBlockContent";
interface PostCodeProps {
  code: CodeContent;
}

// 多语言代码块
const PostCode: FunctionComponent<PostCodeProps> = ({ code }) => {
  const [activeLangIndex, setActiveLangIndex] = useState(0);
  const activeCode = code.metadata[activeLangIndex].code;
  const language = code.metadata[activeLangIndex].language;

  return (
    <div className={styles.container}>
      <div className={styles.languageTabs}>
        {code.metadata.map(({ language }, index) => (
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
      <Highlight theme={themes.vsLight} code={activeCode} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre style={style} className={classNames(className, styles.pre)}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export default PostCode;
