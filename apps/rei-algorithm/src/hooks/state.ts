import { useState } from "react";

/**
 * 控制打开状态的hook
 * @param isVisible 初始状态
 * @returns visible 状态, open 打开, close 关闭
 */
export function useOpenState(
  isVisible: boolean,
): [boolean, () => void, () => void] {
  const [visible, setVisible] = useState(isVisible);
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  return [visible, open, close];
}
