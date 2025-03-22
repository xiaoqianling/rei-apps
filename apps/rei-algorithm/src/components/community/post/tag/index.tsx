import styles from "./index.module.scss";
import { FunctionComponent } from "react";
import { TagTypes } from "../../type/tag";

interface TagProps {
  tag: TagTypes;
}

const Tag: FunctionComponent<TagProps> = ({ tag }) => {
  return <div className={styles.container}>{tag}</div>;
};

export default Tag;
