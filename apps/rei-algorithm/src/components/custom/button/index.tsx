import styles from "./index.module.scss";
import { FunctionComponent } from "react";

interface ReiButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  onTypeUp?: () => void;
  type: "primary" | "secondary";
}

const ReiButton: FunctionComponent<ReiButtonProps> = ({
  children,
  onClick,
}) => {
  return (
    <div className={styles.button} onClick={onClick}>
      {children}
    </div>
  );
};

export default ReiButton;
