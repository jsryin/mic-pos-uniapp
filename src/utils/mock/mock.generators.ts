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
    categories: () => [
      { id: 1, name: '甄选套餐', icon: 'gift', badge: '' },
      { id: 2, name: '新品尝鲜', icon: 'filter', badge: 'NEW' },
      { id: 3, name: '原叶鲜奶茶', icon: 'chart-pie', badge: '' },
      { id: 4, name: '原叶特调茶', icon: 'layers', badge: '' },
      { id: 5, name: '活力轻果茶', icon: 'sugar', badge: '' },
      { id: 6, name: '低负担专区', icon: 'info-circle', badge: '0卡' },
    ],

    list: () => [
      {
        id: 1,
        name: '甄选套餐',
        items: [
          {
            id: 101,
            title: '【观象知时冰箱贴】单大杯随心配套餐',
            desc: '购买即得原叶鲜奶茶(大杯)*1+观象知时冰箱贴(随机款)*1，数量有限，售完即止。',
            price: 35.9,
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80',
            badge: '套餐',
          },
          {
            id: 102,
            title: '【降温好茶 伴你入秋】鲜奶茶三大杯随心选套餐',
            desc: '精选三杯好茶，温暖入秋，适合办公室分享。',
            price: 48.6,
            image: 'https://images.unsplash.com/photo-1626202378538-072485e16d87?auto=format&fit=crop&w=200&q=80',
            badge: '特惠',
          },
        ],
      },
      {
        id: 2,
        name: '新品尝鲜',
        items: [
          {
            id: 201,
            title: '赤霞跃金「广东限定」',
            desc: '入口白芽奇兰清雅兰香，回韵醇厚，叠加广东新会陈皮自然甘润，形成独特风味。',
            price: 18.0,
            image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
          {
            id: 202,
            title: '万里木兰（原叶鲜奶茶）',
            desc: '经典红茶底，搭配优质鲜牛乳，茶香浓郁。',
            price: 16.0,
            image: 'https://images.unsplash.com/photo-1571934811356-5cc55449d0a4?auto=format&fit=crop&w=200&q=80',
            badge: '热销',
          },
        ],
      },
      {
        id: 3,
        name: '原叶鲜奶茶',
        items: [
          {
            id: 301,
            title: '烤布蕾拿铁（原叶鲜奶茶）',
            desc: '意式烤布蕾风味融入鲜奶茶中，香甜浓郁。',
            price: 19.0,
            image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=200&q=80',
            badge: '推荐',
          },
          {
            id: 302,
            title: '黑糖波波鲜奶茶',
            desc: '台湾手工黑糖搭配Q弹波波，口感丰富。',
            price: 17.0,
            image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cda9?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
        ],
      },
      {
        id: 4,
        name: '原叶特调茶',
        items: [
          {
            id: 401,
            title: '四季春玛奇朵',
            desc: '清新四季春茶底，搭配绵密奶盖，层次分明。',
            price: 16.0,
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80',
            badge: '',
          },
        ],
      },
      {
        id: 5,
        name: '活力轻果茶',
        items: [
          {
            id: 501,
            title: '多肉葡萄',
            desc: '新鲜葡萄果肉，搭配茉莉绿茶底，清爽怡人。',
            price: 18.0,
            image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=200&q=80',
            badge: '季节限定',
          },
        ],
      },
      {
        id: 6,
        name: '低负担专区',
        items: [
          {
            id: 601,
            title: '0卡糖气泡水',
            desc: '无糖无负担，添加天然果味，清爽解渴。',
            price: 12.0,
            image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=200&q=80',
            badge: '0卡',
          },
        ],
      },
    ],

    // 根据分类ID获取商品
    getByCategory: (categoryId: number) => {
      const allProducts = mockGenerators.product.list()
      const category = allProducts.find(group => group.id === categoryId)
      return category ? category.items : []
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
