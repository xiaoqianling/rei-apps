import styles from "./index.module.scss";
import SlateRenderer from "@/src/components/community/article/slateRenderer";
import { useState } from "react";
import { Descendant } from "slate";

function LearnPage() {
  //
  const [content, useContent] = useState<Descendant[]>([]);
  return (
    <div className={styles.main}>
      <SlateRenderer />
      <SlateRenderer />
      <SlateRenderer />
    </div>
  );
}

export default LearnPage;
