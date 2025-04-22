// 复制到剪切板
export async function copyToClipboard(text: string) {
  return await navigator.clipboard.writeText(text);
}

// 滚动到元素
export function scrollToElementByID(id?: string) {
  if (!id) return;
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}
