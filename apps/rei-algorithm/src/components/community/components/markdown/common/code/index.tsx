import styles from "./index.module.scss";
import { FunctionComponent, ReactNode } from "react";
import { Highlight, themes } from "prism-react-renderer";
import classNames from "classnames";

interface MarkdownCodeProps {
  children?: ReactNode;
  className?: string;
}

/**
 * 渲染markdown的code组件
 * TODO:这里的高亮不可修改，用codemirror替代
 * @returns
 */
const MarkdownCode: FunctionComponent<MarkdownCodeProps> = ({
  children,
  className,
}) => {
  const match = /language-(\w+)/.exec(className || "");
  const code = match ? (
    <Highlight
      theme={themes.github}
      code={String(children).replace(/\n$/, "")}
      language={match[1]}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => {
        return (
          <div className={classNames(className, styles.pre)}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </div>
        );
      }}
    </Highlight>
  ) : (
    <code className={className}>{children}</code>
  );

  return (
    <div className={styles.container}>
      {code}
      <div className={styles.languageTag}>language:{match && match[1]}</div>
    </div>
  );
};

export default MarkdownCode;
