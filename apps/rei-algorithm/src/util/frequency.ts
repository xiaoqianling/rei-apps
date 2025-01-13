/**
 * 防抖函数
 * @param fn 要执行的函数
 * @param delay 防抖时间
 * @returns 防抖函数
 */
export function debounce(fn: Function, delay: number) {
  let timer: NodeJS.Timeout | null = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn();
    }, delay);
  };
}

/**
 * 节流函数
 * @param fn 要执行的函数
 * @param delay 节流时间
 * @returns 节流函数
 */
export function throttle(fn: Function, delay: number) {
  let timer: NodeJS.Timeout | null = null;
  return function () {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      fn();
      timer = null;
    }, delay);
  };
}
