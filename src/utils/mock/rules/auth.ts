import type { MockRule } from '@/utils/mock/mock.config'
import { mockGenerators } from '@/utils/mock/mock.generators'

export const authMockRules: MockRule[] = [
  // 用户登录
  {
    urlPattern: '/api/auth/login',
    method: 'POST',
    enabled: true,
    priority: 1,
    delay: 500,
    response: (request) => {
      const { username, password } = request.data || {}

      // 模拟登录验证
      if (username === 'admin' && password === '123456') {
        return mockGenerators.auth.loginSuccess(username, `mock-jwt-token-${Date.now()}`)
      }
      else if (username === 'error') {
        return mockGenerators.auth.loginError('用户名或密码错误')
      }
      else {
        return mockGenerators.auth.loginError('用户不存在')
      }
    },
  },

  // 获取验证码
  {
    urlPattern: '/api/auth/captcha',
    method: 'GET',
    enabled: true,
    priority: 1,
    delay: 200,
    response: () => {
      return mockGenerators.auth.captcha()
    },
  },

  // 刷新Token
  {
    urlPattern: '/api/auth/refresh',
    method: 'POST',
    enabled: true,
    priority: 1,
    delay: 300,
    response: (request) => {
      const { refreshToken } = request.data || {}

      if (refreshToken && refreshToken.startsWith('refresh-')) {
        const newToken = `mock-jwt-token-${Date.now()}`
        const newRefreshToken = `refresh-${newToken}`
        return {
          code: 200,
          data: {
            token: newToken,
            refreshToken: newRefreshToken,
          },
        }
      }
      else {
        return {
          code: 401,
          data: null,
          message: '刷新Token失败',
        }
      }
    },
  },

  // 用户登出
  {
    urlPattern: '/api/auth/logout',
    method: 'POST',
    enabled: true,
    priority: 1,
    delay: 200,
    response: () => {
      return {
        code: 200,
        data: null,
        message: '登出成功',
      }
    },
  },
]
