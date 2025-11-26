/**
 * Mock数据生成器
 */
export interface MockGenerator {
  generate: (options?: any) => any
}

export const mockGenerators = {
  // 用户相关Mock数据
  user: {
    list: (count: number = 10) => Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      username: `user${i + 1}`,
      nickname: `用户${i + 1}`,
      avatar: `https://picsum.photos/seed/user${i + 1}/100/100`,
      email: `user${i + 1}@example.com`,
      phone: `1380000${String(i + 1).padStart(4, '0')}`,
      status: Math.random() > 0.2 ? 1 : 0,
      createTime: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    })),

    detail: (id: number) => ({
      id,
      username: `user${id}`,
      nickname: `用户${id}`,
      avatar: `https://picsum.photos/seed/user${id}/100/100`,
      email: `user${id}@example.com`,
      phone: `1380000${String(id).padStart(4, '0')}`,
      status: Math.random() > 0.2 ? 1 : 0,
      createTime: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      lastLoginTime: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    }),
  },

  // 订单相关Mock数据
  order: {
    list: (count: number = 20) => Array.from({ length: count }, (_, i) => ({
      id: `ORD${String(Date.now() + i).slice(-8)}`,
      orderNo: `NO${String(Date.now() + i).slice(-12)}`,
      userId: Math.floor(Math.random() * 100) + 1,
      status: ['pending', 'paid', 'shipped', 'completed', 'cancelled'][Math.floor(Math.random() * 5)],
      statusText: ['待付款', '已付款', '已发货', '已完成', '已取消'][Math.floor(Math.random() * 5)],
      totalAmount: Math.floor(Math.random() * 1000) + 50,
      discountAmount: Math.floor(Math.random() * 100),
      paymentAmount: Math.floor(Math.random() * 900) + 50,
      items: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
        productId: Math.floor(Math.random() * 50) + 1,
        productName: `商品${Math.floor(Math.random() * 50) + 1}`,
        quantity: Math.floor(Math.random() * 5) + 1,
        price: Math.floor(Math.random() * 200) + 10,
        image: `https://picsum.photos/seed/item${j}/100/100`,
      })),
      createTime: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      updateTime: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
    })),

    detail: (id: string) => {
      const order = {
        id,
        orderNo: `NO${String(Date.now()).slice(-12)}`,
        userId: Math.floor(Math.random() * 100) + 1,
        status: ['pending', 'paid', 'shipped', 'completed', 'cancelled'][Math.floor(Math.random() * 5)],
        statusText: ['待付款', '已付款', '已发货', '已完成', '已取消'][Math.floor(Math.random() * 5)],
        totalAmount: Math.floor(Math.random() * 1000) + 50,
        discountAmount: Math.floor(Math.random() * 100),
        paymentAmount: Math.floor(Math.random() * 900) + 50,
        items: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
          productId: Math.floor(Math.random() * 50) + 1,
          productName: `商品${Math.floor(Math.random() * 50) + 1}`,
          quantity: Math.floor(Math.random() * 5) + 1,
          price: Math.floor(Math.random() * 200) + 10,
          image: `https://picsum.photos/seed/item${j}/100/100`,
        })),
        address: {
          name: '张三',
          phone: '13800138000',
          province: '广东省',
          city: '深圳市',
          district: '南山区',
          detail: '科技园南区XX大厦1001室',
        },
        createTime: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        updateTime: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
        payTime: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        shipTime: new Date(Date.now() - Math.random() * 43200000).toISOString(),
      }
      return order
    },
  },

  // 分页数据生成器
  pagination: (data: any[], page: number = 1, pageSize: number = 10) => {
    const total = data.length
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      list: data.slice(start, end),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  },

  // 错误响应生成器
  error: {
    businessError: (code: number, message: string) => ({
      code,
      data: null,
      message,
      success: false,
    }),

    systemError: (error: string) => ({
      code: 500,
      data: null,
      message: `系统错误：${error}`,
      success: false,
    }),

    networkError: () => ({
      code: -1,
      data: null,
      message: '网络连接失败',
      success: false,
    }),

    timeoutError: () => ({
      code: -2,
      data: null,
      message: '请求超时',
      success: false,
    }),
  },

  // 登录相关Mock数据
  auth: {
    loginSuccess: (username: string, token: string) => ({
      code: 200,
      data: {
        token,
        refreshToken: `refresh-${token}`,
        userInfo: {
          id: 1,
          username,
          nickname: '测试用户',
          avatar: 'https://picsum.photos/seed/avatar/100/100',
        },
      },
      message: '登录成功',
    }),

    loginError: (message: string = '用户名或密码错误') => ({
      code: 401,
      data: null,
      message,
      success: false,
    }),

    captcha: () => ({
      code: 200,
      data: {
        captchaEnabled: true,
        uuid: `mock-uuid-${Date.now()}`,
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      },
    }),
  },
}

/**
 * 创建Mock响应
 */
export function createMockResponse(generator: MockGenerator, options?: any): any {
  return generator.generate(options)
}

/**
 * 创建延迟Mock响应
 */
export function createDelayedMockResponse(generator: MockGenerator, delay: number = 300, options?: any): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generator.generate(options))
    }, delay)
  })
}
