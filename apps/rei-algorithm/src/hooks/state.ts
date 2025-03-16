import { useState } from "react";

// 控制打开状态的hook
export function useOpenState(isVisible: boolean) {
  const [visible, setVisible] = useState(isVisible);
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  return { visible, open, close };
}
