import styles from "./index.module.scss";
import { FunctionComponent } from "react";
import { VisualItemProps } from "./type";

const VisualItem: FunctionComponent<VisualItemProps> = ({
  type,
  label,
  onClick,
  color,
}) => {
  return <div className={styles.item}>{label}</div>;
};

export default VisualItem;
