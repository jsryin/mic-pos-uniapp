import type { MockRule } from '@/utils/mock/mock.config'
import { mockGenerators } from '@/utils/mock/mock.generators'

export const orderMockRules: MockRule[] = [
  // 获取订单列表
  {
    urlPattern: '/api/order/list',
    method: 'GET',
    enabled: true,
    priority: 1,
    delay: 250,
    response: (request) => {
      const page = Number.parseInt(request.query?.page || '1')
      const pageSize = Number.parseInt(request.query?.pageSize || '10')
      const status = request.query?.status

      let orderList = mockGenerators.order.list(100)

      // 按状态筛选
      if (status) {
        orderList = orderList.filter(item => item.status === status)
      }

      return mockGenerators.pagination(orderList, page, pageSize)
    },
  },

  // 获取订单详情
  {
    urlPattern: '/api/order/\\w+',
    method: 'GET',
    enabled: true,
    priority: 1,
    delay: 200,
    response: (request) => {
      const orderId = request.url.split('/').pop()
      return mockGenerators.order.detail(orderId)
    },
  },

  // 创建订单
  {
    urlPattern: '/api/order/create',
    method: 'POST',
    enabled: true,
    priority: 1,
    delay: 400,
    response: (request) => {
      const newOrder = {
        id: `ORD${String(Date.now()).slice(-8)}`,
        orderNo: `NO${String(Date.now()).slice(-12)}`,
        ...request.data,
        status: 'pending',
        statusText: '待付款',
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      }
      return { success: true, data: newOrder }
    },
  },

  // 更新订单状态
  {
    urlPattern: '/api/order/status',
    method: 'PUT',
    enabled: true,
    priority: 1,
    delay: 300,
    response: (request) => {
      const { orderId, status } = request.data || {}
      const statusText = {
        pending: '待付款',
        paid: '已付款',
        shipped: '已发货',
        completed: '已完成',
        cancelled: '已取消',
      }[status] || status

      return {
        success: true,
        data: {
          orderId,
          status,
          statusText,
          updateTime: new Date().toISOString(),
        },
      }
    },
  },

  // 取消订单
  {
    urlPattern: '/api/order/cancel',
    method: 'POST',
    enabled: true,
    priority: 1,
    delay: 200,
    response: (request) => {
      const { orderId } = request.data || {}
      return {
        success: true,
        data: {
          orderId,
          status: 'cancelled',
          statusText: '已取消',
          cancelTime: new Date().toISOString(),
        },
      }
    },
  },
]
