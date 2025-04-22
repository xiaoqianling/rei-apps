// 热键，柯里化提高性能
import isHotkey from "is-hotkey";

// 保存快捷键
export const isSaveKey = isHotkey("mod+s");
export const isBoldKey = isHotkey("mod+b");
