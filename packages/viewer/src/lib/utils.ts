/**
 * 检查元素是否出现在给定的数组中。
 *
 * @param arr **单调递增**的数组
 * @param target 需要查找的目标
 * @returns 目标是否在 arr 中
 */
export function checkExists(arr: number[], target: number) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return true; // 找到了目标元素，返回true
    }
    if (arr[mid] < target) {
      left = mid + 1; // 目标在右侧
    } else {
      right = mid - 1; // 目标在左侧
    }
  }

  return false;
}

/**
 * 检查元素是否未出现在给定的数组中。
 *
 * @param arr **单调递增**的数组
 * @param target 需要查找的目标
 * @returns 目标是否没有出现在 arr 中
 */
export function checkNonExists(arr: number[], target: number) {
  return !checkExists(arr, target);
}
