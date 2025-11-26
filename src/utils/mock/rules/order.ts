import type { MockRule } from '@/utils/mock/mock.config'
import { mockGenerators } from '@/utils/mock/mock.generators'

export const orderMockRules: MockRule[] = [
  // 获取所有商品分类
  {
    urlPattern: '/api/categories',
    method: 'GET',
    enabled: true,
    delay: 200,
    response: () => ({
      code: 200,
      data: mockGenerators.order.categories(),
      message: '获取商品分类成功',
    }),
  },

  // 获取所有商品（按分组）
  {
    urlPattern: '/api/products',
    method: 'GET',
    enabled: true,
    delay: 300,
    response: () => ({
      code: 200,
      data: mockGenerators.order.list(),
      message: '获取商品列表成功',
    }),
  },

  // 根据分类ID获取商品
  {
    urlPattern: '/api/products/category/:id',
    method: 'GET',
    enabled: true,
    delay: 200,
    response: (request) => {
      const categoryId = Number.parseInt(request.params?.id || '1')
      const products = mockGenerators.order.getByCategory(categoryId)

      return {
        code: 200,
        data: products,
        message: '获取分类商品成功',
      }
    },
  },

  // 搜索商品
  {
    urlPattern: '/api/products/search',
    method: 'GET',
    enabled: true,
    delay: 250,
    response: (request) => {
      const keyword = request.query?.keyword || ''
      const allProducts = mockGenerators.order.list()

      // 简单的搜索逻辑：在商品标题和描述中查找关键词
      const searchResults = allProducts
        .map(group => ({
          ...group,
          items: group.items.filter(item =>
            item.title.includes(keyword)
            || item.desc.includes(keyword),
          ),
        }))
        .filter(group => group.items.length > 0)

      return {
        code: 200,
        data: searchResults,
        message: '搜索商品成功',
      }
    },
  },

  // 获取单个商品详情
  {
    urlPattern: '/api/products/:id',
    method: 'GET',
    enabled: true,
    delay: 150,
    response: (request) => {
      const productId = Number.parseInt(request.params?.id || '1')
      const allProducts = mockGenerators.order.list()

      let product = null
      for (const group of allProducts) {
        const found = group.items.find(item => item.id === productId)
        if (found) {
          product = found
          break
        }
      }

      if (!product) {
        return {
          code: 404,
          data: null,
          message: '商品不存在',
        }
      }

      return {
        code: 200,
        data: product,
        message: '获取商品详情成功',
      }
    },
  },

  // 获取热门商品
  {
    urlPattern: '/api/products/popular',
    method: 'GET',
    enabled: true,
    delay: 200,
    response: () => {
      const allProducts = mockGenerators.order.list()

      // 收集所有带有热销、推荐等标签的商品
      const popularProducts = allProducts
        .flatMap(group => group.items)
        .filter(item => ['热销', '推荐', '季节限定'].includes(item.badge))
        .slice(0, 8) // 最多返回8个

      return {
        code: 200,
        data: popularProducts,
        message: '获取热门商品成功',
      }
    },
  },
]
