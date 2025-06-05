import { describe, it, expect } from 'vitest'
import { 
  formatDate, 
  debounce, 
  throttle,
  generateRandomArray,
  calculateTimeComplexity
} from '../../utils'

describe('工具函数测试', () => {
  describe('formatDate', () => {
    it('应该正确格式化日期', () => {
      const date = new Date('2024-03-20T10:30:00')
      expect(formatDate(date)).toBe('2024-03-20 10:30')
    })

    it('应该处理无效日期', () => {
      expect(formatDate(null)).toBe('未知时间')
      expect(formatDate(undefined)).toBe('未知时间')
    })
  })

  describe('debounce', () => {
    it('应该正确防抖', async () => {
      let count = 0
      const increment = () => count++
      const debouncedIncrement = debounce(increment, 100)

      // 快速调用多次
      debouncedIncrement()
      debouncedIncrement()
      debouncedIncrement()

      // 等待防抖时间
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(count).toBe(1)
    })
  })

  describe('throttle', () => {
    it('应该正确节流', async () => {
      let count = 0
      const increment = () => count++
      const throttledIncrement = throttle(increment, 100)

      // 快速调用多次
      throttledIncrement()
      throttledIncrement()
      throttledIncrement()

      // 等待节流时间
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(count).toBe(2) // 第一次和最后一次调用
    })
  })

  describe('generateRandomArray', () => {
    it('应该生成指定长度的数组', () => {
      const length = 10
      const array = generateRandomArray(length)
      expect(array).toHaveLength(length)
    })

    it('数组元素应该在指定范围内', () => {
      const min = 1
      const max = 100
      const array = generateRandomArray(10, min, max)
      
      array.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(min)
        expect(num).toBeLessThanOrEqual(max)
      })
    })
  })

  describe('calculateTimeComplexity', () => {
    it('应该正确计算时间复杂度', () => {
      const n = 1000
      const result = calculateTimeComplexity(n, 'O(n²)')
      expect(result).toBe(n * n)
    })

    it('应该处理不同的复杂度表示', () => {
      expect(calculateTimeComplexity(100, 'O(1)')).toBe(1)
      expect(calculateTimeComplexity(100, 'O(n)')).toBe(100)
      expect(calculateTimeComplexity(100, 'O(log n)')).toBe(Math.log2(100))
    })
  })
}) 