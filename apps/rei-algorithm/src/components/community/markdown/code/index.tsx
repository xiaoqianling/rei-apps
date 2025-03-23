import styles from "./index.module.scss";
import { FunctionComponent, ReactNode } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownCodeProps {
  children?: ReactNode;
  className?: string;
}

/**
 * 渲染markdown的code组件
 * @returns
 */
const MarkdownCode: FunctionComponent<MarkdownCodeProps> = ({
  children,
  className,
}) => {
  const match = /language-(\w+)/.exec(className || "");
  const code = match ? (
    <SyntaxHighlighter
      style={materialLight}
      customStyle={{ fontSize: "18px" }}
      language={match[1]}
      PreTag="div"
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code className={className}>{children}</code>
  );

  return (
    <div>
      {code}
      <div className={styles.languageTag}>{match && match[1]}</div>
    </div>
  );
};

export default MarkdownCode;
