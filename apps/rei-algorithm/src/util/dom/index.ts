// 复制到剪切板
export async function copyToClipboard(text: string) {
  return await navigator.clipboard.writeText(text);
}
