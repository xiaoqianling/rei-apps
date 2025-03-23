import { ReactNode, useEffect, useState } from "react";
import styles from "./index.module.less";

interface ToastProps {
  message: string;
  duration?: number;
  position?:
    | "top"
    | "bottom"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  type?: "success" | "warn" | "error";
}

export const Toast = ({
  message,
  duration = 3000,
  position = "bottom",
  type = "success",
}: ToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className={`${styles.toast} ${styles[position]} ${styles[type]}`}>
      <div className={styles.toast_content}>{message}</div>
    </div>
  );
};

/**
 * 默认显示3秒
 * @returns [showToast, ToastComponent] 元素1：显示Toast的函数，元素2：Toast组件
 */
export const useToast = () => {
  const [toastProps, setToastProps] = useState<ToastProps | null>(null);

  const showToast = (props: ToastProps) => {
    setToastProps(props);
    setTimeout(() => {
      setToastProps(null);
    }, props.duration || 3000);
  };

  const ToastComponent = (): ReactNode => {
    if (!toastProps) return null;
    return <Toast {...toastProps} />;
  };

  // as const 具体元组类型
  return [showToast, ToastComponent] as const;
};
