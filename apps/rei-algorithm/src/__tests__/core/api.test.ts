import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSortData, getAlgorithmList, createPost } from '../../api'
import { mockSortData, mockAlgorithmList, mockPost } from '../mocks'

// 模拟fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API测试', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getSortData', () => {
    it('应该成功获取排序数据', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSortData)
      })

      const result = await getSortData('bubble-sort')
      expect(result).toEqual(mockSortData)
      expect(mockFetch).toHaveBeenCalledWith('/api/sort/bubble-sort')
    })

    it('应该在请求失败时抛出错误', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      await expect(getSortData('invalid-sort')).rejects.toThrow('API请求失败')
    })
  })

  describe('getAlgorithmList', () => {
    it('应该成功获取算法列表', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAlgorithmList)
      })

      const result = await getAlgorithmList()
      expect(result).toEqual(mockAlgorithmList)
    })

    it('应该支持分页参数', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAlgorithmList)
      })

      await getAlgorithmList({ page: 2, pageSize: 10 })
      expect(mockFetch).toHaveBeenCalledWith('/api/algorithms?page=2&pageSize=10')
    })
  })

  describe('createPost', () => {
    it('应该成功创建帖子', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPost)
      })

      const result = await createPost(mockPost)
      expect(result).toEqual(mockPost)
      expect(mockFetch).toHaveBeenCalledWith('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockPost)
      })
    })

    it('应该在缺少必要字段时抛出错误', async () => {
      const invalidPost = { ...mockPost, title: '' }
      await expect(createPost(invalidPost)).rejects.toThrow('标题不能为空')
    })
  })
}) 