import type { MockRule } from '@/utils/mock/mock.config'
import { mockGenerators } from '@/utils/mock/mock.generators'

export const userMockRules: MockRule[] = [
  // 获取用户列表
  {
    urlPattern: '/api/user/list',
    method: 'GET',
    enabled: true,
    priority: 1,
    delay: 200,
    response: (request) => {
      const page = Number.parseInt(request.query?.page || '1')
      const pageSize = Number.parseInt(request.query?.pageSize || '10')
      const userList = mockGenerators.user.list(100)
      return mockGenerators.pagination(userList, page, pageSize)
    },
  },

  // 获取用户详情
  {
    urlPattern: '/api/user/\\d+',
    method: 'GET',
    enabled: true,
    priority: 1,
    delay: 150,
    response: (request) => {
      const userId = Number.parseInt(request.url.split('/').pop())
      return mockGenerators.user.detail(userId)
    },
  },

  // 创建用户
  {
    urlPattern: '/api/user/create',
    method: 'POST',
    enabled: true,
    priority: 1,
    delay: 300,
    response: (request) => {
      const newUser = {
        id: Date.now(),
        ...request.data,
        createTime: new Date().toISOString(),
      }
      return { success: true, data: newUser }
    },
  },

  // 更新用户
  {
    urlPattern: '/api/user/update',
    method: 'PUT',
    enabled: true,
    priority: 1,
    delay: 300,
    response: (request) => {
      return {
        success: true,
        data: {
          ...request.data,
          updateTime: new Date().toISOString(),
        },
      }
    },
  },

  // 删除用户
  {
    urlPattern: '/api/user/delete',
    method: 'DELETE',
    enabled: true,
    priority: 1,
    delay: 200,
    response: () => {
      return { success: true, message: '删除成功' }
    },
  },
]
