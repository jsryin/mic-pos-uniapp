# Mock功能实现指南

## 目录
- [项目现有架构分析](#项目现有架构分析)
- [Mock功能设计方案](#mock功能设计方案)
- [具体实现代码](#具体实现代码)
- [集成步骤](#集成步骤)
- [使用指南](#使用指南)
- [开发工具](#开发工具)
- [最佳实践](#最佳实践)

## 项目现有架构分析

### HTTP请求架构

本项目采用**基于uni.request的HTTP架构**设计：

#### 核心HTTP方案 (`src/http/http.ts`)

**核心特点**：
- 基于原生`uni.request`封装
- 支持token自动刷新机制（双token策略）
- 提供RESTful方法：`httpGet`, `httpPost`, `httpPut`, `httpDelete`
- 完善的拦截器机制
- 支持多域名配置和环境切换

**关键文件**：
- `src/http/http.ts` - HTTP核心封装
- `src/http/interceptor.ts` - 请求/响应拦截器
- `src/http/types.ts` - TypeScript类型定义

### 环境配置

项目使用环境变量进行配置管理：

```bash
# .env.development
VITE_SERVER_BASEURL=http://localhost:8080
VITE_MOCK_ENABLED=true
VITE_MOCK_DEBUG=true

# .env.production
VITE_SERVER_BASEURL=https://api.example.com
VITE_MOCK_ENABLED=false
```

### 拦截器机制

**请求拦截器**：
- 认证处理：自动添加token到请求头
- Content-Type：默认`application/json`
- 动态域名：支持根据meta配置切换域名

**响应拦截器**：
- HTTP状态码处理：统一错误处理
- 业务逻辑错误：处理`code`字段判断
- Token刷新：401错误时自动刷新token
- 错误提示：统一的错误消息展示

### API接口结构

```
src/api/
├── login.ts          # 登录相关接口
├── foo.ts           # 示例接口
└── types/
    └── login.ts     # 接口类型定义
```

### 当前Mock状态

✅ **项目已实现完整的mock功能**
- Mock核心功能已实现并集成到现有HTTP架构中
- 已实现自动化的规则加载机制，支持零维护成本
- 配置缓存和持久化机制优化，避免重复初始化
- 已有3个规则文件：auth.ts、user.ts、order.ts
- 特别针对POS点单场景实现了商品和分类的Mock数据
- Mock功能已集成到 main.ts，开发环境下自动启用

## Mock功能实现方案

### 已实现的设计原则

1. **✅ 零侵入性**：不改变现有API调用方式，已集成到现有HTTP架构
2. **✅ 渐进式实施**：可以逐步添加mock数据，已实现自动化规则加载
3. **✅ 环境隔离**：开发环境启用，生产环境禁用
4. **✅ 类型安全**：保持现有TypeScript类型系统
5. **✅ 架构兼容**：完美适配现有uni.request封装

### 核心架构实现

```
API调用 → Mock拦截器检查 → 分流处理
                        ↓
                  ├─ 匹配规则 → 返回Mock数据
                  └─ 未匹配 → 执行真实请求
```

### Mock系统组件（已实现）

1. **✅ Mock配置层** (`src/utils/mock/mock.config.ts`)
   - Mock规则类型定义
   - 全局配置管理
   - 环境隔离配置
   - 配置缓存机制，避免重复初始化

2. **✅ Mock处理器** (`src/utils/mock/mock.handler.ts`)
   - URL模式匹配
   - Mock数据生成
   - 延迟处理
   - 规则优先级管理

3. **✅ Mock拦截器** (`src/utils/mock/mock.interceptor.ts`)
   - 集成到现有uni.request拦截器
   - 请求分流处理
   - 响应格式统一

4. **✅ Mock控制器** (`src/utils/mock/mock.controller.ts`)
   - 运行时控制
   - 规则管理
   - 配置持久化

5. **✅ Mock数据生成器** (`src/utils/mock/mock.generators.ts`)
   - 标准化数据生成
   - 类型安全保障
   - 动态数据模拟
   - 针对POS点单场景的专项数据生成

### 选择性Mock机制

#### URL模式匹配
```typescript
// 支持多种匹配方式
const mockRules = [
  {
    urlPattern: '/api/user/*',           // 通配符匹配
    method: 'GET',
    enabled: true
  },
  {
    urlPattern: /\/api\/order\/\d+/,     // 正则表达式匹配
    method: 'GET',
    enabled: true
  },
  {
    urlPattern: '/api/product/list',     // 精确匹配
    method: 'POST',
    enabled: false                       // 可以单独禁用
  }
]
```

#### 优先级控制
- 支持规则优先级，数字越小优先级越高
- 避免规则冲突，确保匹配的准确性

#### 条件性Mock
```typescript
{
  urlPattern: '/api/product/search',
  response: (request) => {
    if (request.query?.keyword === 'mock') {
      return mockProducts
    }
    return null // 走真实接口
  }
}
```

## 已实现的核心代码

### 1. Mock配置文件（已优化）

#### `src/utils/mock/mock.config.ts` ✨ **已优化**

**核心优化**：
- 配置缓存机制，避免重复初始化
- 智能持久化：只保存可序列化状态，避免函数序列化问题
- 环境变量优先级配置

**关键代码结构**：
```typescript
// 缓存配置避免重复初始化
let cachedConfig: MockConfig | null = null

export function getMockConfig(): MockConfig {
  // 如果已经有缓存配置，直接返回
  if (cachedConfig) {
    return { ...cachedConfig }
  }

  // ... 配置获取和缓存逻辑
}

export function saveMockConfig(config: MockConfig): void {
  if (import.meta.env.DEV) {
    // 只保存可序列化状态，不保存 rules 数组（避免函数序列化问题）
    const savableConfig = {
      enabled: config.enabled,
      environments: config.environments,
      defaultDelay: config.defaultDelay,
      debug: config.debug,
    }
    localStorage.setItem('mockConfig', JSON.stringify(savableConfig))
  }
}
```

### 2. Mock核心处理器

#### `src/utils/mock/mock.handler.ts`

```typescript
import type { CustomRequestOptions } from '@/http/types'
import type { MockRule, MockConfig } from './mock.config'

interface MockRequestContext {
  url: string
  method: string
  headers: Record<string, any>
  data?: any
  query?: any
}

/**
 * Mock核心处理器
 */
export class MockHandler {
  private config: MockConfig
  private rules: MockRule[] = []

  constructor(config: MockConfig) {
    this.config = config
    this.loadRules()
  }

  private loadRules() {
    this.rules = this.config.rules.sort((a, b) => (a.priority || 0) - (b.priority || 0))
  }

  /**
   * 判断是否应该Mock
   */
  public shouldMock(context: MockRequestContext): boolean {
    if (!this.isMockEnabled()) return false

    for (const rule of this.rules) {
      if (!rule.enabled) continue

      const urlMatch = this.matchUrl(context.url, rule.urlPattern)
      const methodMatch = !rule.method || rule.method.toLowerCase() === context.method.toLowerCase()

      if (urlMatch && methodMatch) {
        return true
      }
    }
    return false
  }

  /**
   * 生成Mock响应
   */
  public generateMockResponse(context: MockRequestContext): Promise<any> {
    return new Promise((resolve) => {
      const rule = this.findMatchingRule(context)
      if (!rule) {
        resolve(null)
        return
      }

      const delay = rule.delay || this.config.defaultDelay || 0

      setTimeout(() => {
        try {
          if (this.config.debug) {
            console.log(`[MOCK] 生成响应: ${context.method} ${context.url}`)
          }

          const mockData = rule.response(context)
          resolve(this.formatMockResponse(mockData))
        } catch (error) {
          console.error('Mock数据生成错误:', error)
          resolve(null)
        }
      }, delay)
    })
  }

  private matchUrl(url: string, pattern: string | RegExp): boolean {
    if (pattern instanceof RegExp) {
      return pattern.test(url)
    }

    // 支持通配符模式：/api/user/* 匹配 /api/user/1, /api/user/profile 等
    if (pattern.includes('*')) {
      const regexPattern = pattern.replace(/\*/g, '.*')
      return new RegExp(regexPattern).test(url)
    }

    return url.includes(pattern)
  }

  private findMatchingRule(context: MockRequestContext): MockRule | null {
    for (const rule of this.rules) {
      if (!rule.enabled) continue

      const urlMatch = this.matchUrl(context.url, rule.urlPattern)
      const methodMatch = !rule.method || rule.method.toLowerCase() === context.method.toLowerCase()

      if (urlMatch && methodMatch) {
        return rule
      }
    }
    return null
  }

  private formatMockResponse(data: any): any {
    // 保持与后端响应格式一致
    return {
      code: 200,
      data: data,
      message: 'success'
    }
  }

  private isMockEnabled(): boolean {
    const env = import.meta.env.MODE || 'development'
    return this.config.enabled && this.config.environments[env] === true
  }

  /**
   * 添加Mock规则
   */
  public addRule(rule: MockRule): void {
    this.rules.push(rule)
    this.rules.sort((a, b) => (a.priority || 0) - (b.priority || 0))
    this.config.rules = this.rules
  }

  /**
   * 移除Mock规则
   */
  public removeRule(urlPattern: string | RegExp): void {
    this.rules = this.rules.filter(rule =>
      rule.urlPattern !== urlPattern &&
      !(rule.urlPattern instanceof RegExp && rule.urlPattern.toString() === urlPattern.toString())
    )
    this.config.rules = this.rules
  }

  /**
   * 清空所有规则
   */
  public clearRules(): void {
    this.rules = []
    this.config.rules = []
  }

  /**
   * 获取所有规则
   */
  public getRules(): MockRule[] {
    return [...this.rules]
  }

  /**
   * 启用/禁用全局Mock
   */
  public setGlobalEnabled(enabled: boolean): void {
    this.config.enabled = enabled
  }

  /**
   * 获取当前配置
   */
  public getConfig(): MockConfig {
    return { ...this.config }
  }
}
```

### 3. Mock拦截器集成（已实现）

#### `src/utils/mock/mock.interceptor.ts` ✅ **已实现**

**实现特点**：
- 无缝集成到现有HTTP架构（http.ts）
- 请求上下文构建和Mock决策
- 调试日志支持
- 响应格式标准化

**核心功能**：
```typescript
// 已集成到 src/http/http.ts
export function http<T>(options: CustomRequestOptions) {
  return new Promise<T>((resolve, reject) => {
    // 首先检查是否需要Mock
    checkMockRequest(options).then((mockResult) => {
      if (mockResult.shouldMock && mockResult.mockResponse) {
        // 直接返回Mock数据，处理业务逻辑错误
        const responseData = mockResult.mockResponse as IResponse<T>
        // ... 错误处理逻辑
        return resolve(responseData.data)
      }

      // 不需要Mock，执行真实请求
      uni.request({ ... })
    })
  })
}
```

### 4. Mock控制器

#### `src/utils/mock/mock.controller.ts`

```typescript
import { mockInterceptor } from './mock.interceptor'
import { getMockConfig, saveMockConfig } from './mock.config'
import type { MockRule } from './mock.config'

/**
 * Mock控制器 - 提供运行时控制Mock功能
 */
export class MockController {
  private config = getMockConfig()

  /**
   * 启用Mock
   */
  public enable(): void {
    this.config.enabled = true
    this.saveConfig()
    mockInterceptor.getMockHandler().setGlobalEnabled(true)
  }

  /**
   * 禁用Mock
   */
  public disable(): void {
    this.config.enabled = false
    this.saveConfig()
    mockInterceptor.getMockHandler().setGlobalEnabled(false)
  }

  /**
   * 切换Mock状态
   */
  public toggle(): boolean {
    this.config.enabled = !this.config.enabled
    this.saveConfig()
    mockInterceptor.getMockHandler().setGlobalEnabled(this.config.enabled)
    return this.config.enabled
  }

  /**
   * 添加Mock规则
   */
  public addRule(rule: MockRule): void {
    this.config.rules.push(rule)
    this.saveConfig()
    mockInterceptor.getMockHandler().addRule(rule)
  }

  /**
   * 移除Mock规则
   */
  public removeRule(urlPattern: string | RegExp): void {
    this.config.rules = this.config.rules.filter(rule =>
      rule.urlPattern !== urlPattern ||
      (rule.urlPattern instanceof RegExp && rule.urlPattern.toString() === urlPattern.toString())
    )
    this.saveConfig()
    mockInterceptor.getMockHandler().removeRule(urlPattern)
  }

  /**
   * 启用/禁用特定规则
   */
  public toggleRule(urlPattern: string | RegExp): boolean {
    const rule = this.config.rules.find(rule =>
      rule.urlPattern === urlPattern ||
      (rule.urlPattern instanceof RegExp && rule.urlPattern.toString() === urlPattern.toString())
    )

    if (rule) {
      rule.enabled = !rule.enabled
      this.saveConfig()
      return rule.enabled
    }

    return false
  }

  /**
   * 清空所有规则
   */
  public clearRules(): void {
    this.config.rules = []
    this.saveConfig()
    mockInterceptor.getMockHandler().clearRules()
  }

  /**
   * 获取所有规则
   */
  public getRules(): MockRule[] {
    return [...this.config.rules]
  }

  /**
   * 获取Mock配置
   */
  public getConfig() {
    return { ...this.config }
  }

  /**
   * 设置Mock配置
   */
  public setConfig(config: Partial<typeof this.config>): void {
    Object.assign(this.config, config)
    this.saveConfig()
  }

  /**
   * 开启调试模式
   */
  public enableDebug(): void {
    this.config.debug = true
    this.saveConfig()
  }

  /**
   * 关闭调试模式
   */
  public disableDebug(): void {
    this.config.debug = false
    this.saveConfig()
  }

  /**
   * 按环境启用/禁用Mock
   */
  public setEnvironment(env: string, enabled: boolean): void {
    this.config.environments[env] = enabled
    this.saveConfig()
  }

  /**
   * 导出当前配置
   */
  public exportConfig(): string {
    return JSON.stringify(this.config, null, 2)
  }

  /**
   * 导入配置
   */
  public importConfig(configJson: string): boolean {
    try {
      const newConfig = JSON.parse(configJson)
      Object.assign(this.config, newConfig)
      this.saveConfig()
      return true
    } catch (error) {
      console.error('导入配置失败:', error)
      return false
    }
  }

  /**
   * 保存配置
   */
  private saveConfig(): void {
    saveMockConfig(this.config)
  }
}

// 全局Mock控制器实例
export const mockController = new MockController()

// 开发环境下暴露到全局，方便调试
if (import.meta.env.DEV) {
  (window as any).mockController = mockController
}
```

### 5. Mock数据生成器

#### `src/utils/mock/mock.generators.ts`

```typescript
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
      createTime: new Date(Date.now() - Math.random() * 10000000000).toISOString()
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
      lastLoginTime: new Date(Date.now() - Math.random() * 86400000).toISOString()
    })
  },

  // 商品相关Mock数据
  product: {
    list: (count: number = 20) => Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `商品${i + 1}`,
      description: `这是商品${i + 1}的详细描述`,
      price: Math.floor(Math.random() * 1000) + 10,
      originalPrice: Math.floor(Math.random() * 1200) + 100,
      image: `https://picsum.photos/seed/product${i + 1}/200/200`,
      category: ['电子产品', '服装', '食品', '图书', '家居'][Math.floor(Math.random() * 5)],
      stock: Math.floor(Math.random() * 100) + 1,
      status: Math.random() > 0.1 ? 1 : 0,
      sales: Math.floor(Math.random() * 1000),
      createTime: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    })),

    detail: (id: number) => ({
      id,
      name: `商品${id}`,
      description: `这是商品${id}的详细描述，包含丰富的产品信息和特色介绍。`,
      price: Math.floor(Math.random() * 1000) + 10,
      originalPrice: Math.floor(Math.random() * 1200) + 100,
      images: [
        `https://picsum.photos/seed/product${id}a/400/400`,
        `https://picsum.photos/seed/product${id}b/400/400`,
        `https://picsum.photos/seed/product${id}c/400/400`
      ],
      category: ['电子产品', '服装', '食品', '图书', '家居'][Math.floor(Math.random() * 5)],
      stock: Math.floor(Math.random() * 100) + 1,
      status: Math.random() > 0.1 ? 1 : 0,
      sales: Math.floor(Math.random() * 1000),
      specifications: {
        color: ['红色', '蓝色', '绿色', '黑色'][Math.floor(Math.random() * 4)],
        size: ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)],
        material: ['棉', '麻', '丝', '合成纤维'][Math.floor(Math.random() * 4)]
      },
      createTime: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    })
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
        image: `https://picsum.photos/seed/item${j}/100/100`
      })),
      createTime: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      updateTime: new Date(Date.now() - Math.random() * 1000000000).toISOString()
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
          image: `https://picsum.photos/seed/item${j}/100/100`
        })),
        address: {
          name: '张三',
          phone: '13800138000',
          province: '广东省',
          city: '深圳市',
          district: '南山区',
          detail: '科技园南区XX大厦1001室'
        },
        createTime: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        updateTime: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
        payTime: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        shipTime: new Date(Date.now() - Math.random() * 43200000).toISOString()
      }
      return order
    }
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
      totalPages: Math.ceil(total / pageSize)
    }
  },

  // 错误响应生成器
  error: {
    businessError: (code: number, message: string) => ({
      code,
      data: null,
      message,
      success: false
    }),

    systemError: (error: string) => ({
      code: 500,
      data: null,
      message: '系统错误：' + error,
      success: false
    }),

    networkError: () => ({
      code: -1,
      data: null,
      message: '网络连接失败',
      success: false
    }),

    timeoutError: () => ({
      code: -2,
      data: null,
      message: '请求超时',
      success: false
    })
  },

  // 登录相关Mock数据
  auth: {
    loginSuccess: (username: string, token: string) => ({
      code: 200,
      data: {
        token,
        refreshToken: 'refresh-' + token,
        userInfo: {
          id: 1,
          username,
          nickname: '测试用户',
          avatar: 'https://picsum.photos/seed/avatar/100/100'
        }
      },
      message: '登录成功'
    }),

    loginError: (message: string = '用户名或密码错误') => ({
      code: 401,
      data: null,
      message,
      success: false
    }),

    captcha: () => ({
      code: 200,
      data: {
        captchaEnabled: true,
        uuid: 'mock-uuid-' + Date.now(),
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      }
    })
  }
}

/**
 * 创建Mock响应
 */
export const createMockResponse = (generator: MockGenerator, options?: any): any => {
  return generator.generate(options)
}

/**
 * 创建延迟Mock响应
 */
export const createDelayedMockResponse = (generator: MockGenerator, delay: number = 300, options?: any): Promise<any> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(generator.generate(options))
    }, delay)
  })
}
```

## 集成步骤

### 1. 修改现有拦截器

#### `src/http/interceptor.ts` 修改

```typescript
import type { CustomRequestOptions } from '@/http/types'
import { useTokenStore } from '@/store'
import { getEnvBaseUrl } from '@/utils'
import { checkMockRequest } from '@/utils/mock/mock.interceptor'  // 新增
import { stringifyQuery } from './tools/queryString'

// ... 其他导入保持不变

// 拦截器配置
const httpInterceptor = {
  // 拦截前触发
  invoke(options: CustomRequestOptions) {
    // 1. 处理Mock请求 - 新增逻辑
    return checkMockRequest(options).then(mockResult => {
      if (mockResult.shouldMock) {
        // 如果是Mock请求，直接返回Promise，不执行后续逻辑
        return Promise.resolve(mockResult.mockResponse.data)
      }

      // 2. 处理请求基准地址 - 原有逻辑
      if (!options.url.startsWith('http')) {
        options.url = getEnvBaseUrl(options.meta?.serverName) + options.url
      }

      // 3. 处理请求参数 - 原有逻辑
      if (options.params && Object.keys(options.params).length > 0) {
        const url = new URL(options.url)
        Object.keys(options.params).forEach((key) => {
          url.searchParams.append(key, options.params[key])
        })
        options.url = url.toString()
      }

      // 4. 添加认证Token - 原有逻辑
      const tokenStore = useTokenStore()
      const token = tokenStore.getToken
      if (token) {
        options.header = {
          ...options.header,
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json;charset=UTF-8',
        }
      }

      // 5. 处理超时时间 - 原有逻辑
      if (!options.timeout) {
        options.timeout = 60000
      }

      return options
    })
  },
  // ... 其他拦截器方法保持不变
}

// ... 其他代码保持不变
```

### 2. 创建Mock规则文件

#### `src/utils/mock/rules/user.ts`

```typescript
import { mockGenerators } from '@/utils/mock/mock.generators'
import type { MockRule } from '@/utils/mock/mock.config'

export const userMockRules: MockRule[] = [
  // 获取用户列表
  {
    urlPattern: '/api/user/list',
    method: 'GET',
    enabled: true,
    priority: 1,
    delay: 200,
    response: (request) => {
      const page = parseInt(request.query?.page || '1')
      const pageSize = parseInt(request.query?.pageSize || '10')
      const userList = mockGenerators.user.list(100)
      return mockGenerators.pagination(userList, page, pageSize)
    }
  },

  // 获取用户详情
  {
    urlPattern: '/api/user/\\d+',
    method: 'GET',
    enabled: true,
    priority: 1,
    delay: 150,
    response: (request) => {
      const userId = parseInt(request.url.split('/').pop())
      return mockGenerators.user.detail(userId)
    }
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
        createTime: new Date().toISOString()
      }
      return { success: true, data: newUser }
    }
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
          updateTime: new Date().toISOString()
        }
      }
    }
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
    }
  }
]
```

#### `src/utils/mock/rules/product.ts`

```typescript
import { mockGenerators } from '@/utils/mock/mock.generators'
import type { MockRule } from '@/utils/mock/mock.config'

export const productMockRules: MockRule[] = [
  // 获取商品列表
  {
    urlPattern: '/api/product/list',
    method: 'GET',
    enabled: true,
    priority: 2,
    delay: 300,
    response: (request) => {
      const page = parseInt(request.query?.page || '1')
      const pageSize = parseInt(request.query?.pageSize || '10')
      const category = request.query?.category
      const keyword = request.query?.keyword

      let productList = mockGenerators.product.list(100)

      // 按分类筛选
      if (category) {
        productList = productList.filter(item => item.category === category)
      }

      // 按关键词搜索
      if (keyword) {
        productList = productList.filter(item =>
          item.name.includes(keyword) || item.description.includes(keyword)
        )
      }

      return mockGenerators.pagination(productList, page, pageSize)
    }
  },

  // 获取商品详情
  {
    urlPattern: '/api/product/\\d+',
    method: 'GET',
    enabled: true,
    priority: 2,
    delay: 200,
    response: (request) => {
      const productId = parseInt(request.url.split('/').pop())
      return mockGenerators.product.detail(productId)
    }
  },

  // 商品搜索
  {
    urlPattern: '/api/product/search',
    method: 'GET',
    enabled: true,
    priority: 2,
    delay: 400,
    response: (request) => {
      const keyword = request.query?.keyword || ''
      const page = parseInt(request.query?.page || '1')
      const pageSize = parseInt(request.query?.pageSize || '10')

      let productList = mockGenerators.product.list(100)

      if (keyword) {
        productList = productList.filter(item =>
          item.name.includes(keyword) || item.description.includes(keyword)
        )
      }

      return mockGenerators.pagination(productList, page, pageSize)
    }
  }
]
```

#### `src/utils/mock/rules/auth.ts`

```typescript
import { mockGenerators } from '@/utils/mock/mock.generators'
import type { MockRule } from '@/utils/mock/mock.config'

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
        return mockGenerators.auth.loginSuccess(username, 'mock-jwt-token-' + Date.now())
      } else if (username === 'error') {
        return mockGenerators.auth.loginError('用户名或密码错误')
      } else {
        return mockGenerators.auth.loginError('用户不存在')
      }
    }
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
    }
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
        const newToken = 'mock-jwt-token-' + Date.now()
        const newRefreshToken = 'refresh-' + newToken
        return {
          code: 200,
          data: {
            token: newToken,
            refreshToken: newRefreshToken
          }
        }
      } else {
        return {
          code: 401,
          data: null,
          message: '刷新Token失败'
        }
      }
    }
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
        message: '登出成功'
      }
    }
  }
]
```

### 5. Mock初始化文件（已优化）

#### `src/utils/mock/index.ts` ✅ **已优化**

**核心优化**：
- 自动化规则加载机制已实现
- 支持多种导出格式（default导出 + 具名导出）
- 零维护成本：新创建的规则文件自动生效
- 已修复MockHandler规则同步问题

**自动化导入优势**：
```typescript
// ✨ 零维护成本：新创建规则文件自动生效
const modules = import.meta.glob('./rules/*.ts', { eager: true })

// 🔄 支持多种导出格式
if (mod.default && Array.isArray(mod.default)) {
  allRules.push(...mod.default)  // default导出
}

const namedExports = Object.keys(mod).filter(key =>
  key.endsWith('MockRules') && Array.isArray(mod[key])
)
```

**已实现的规则文件**：
- `src/utils/mock/rules/auth.ts` - 认证相关Mock规则
- `src/utils/mock/rules/user.ts` - 用户相关Mock规则
- `src/utils/mock/rules/order.ts` - POS点单相关Mock规则（重点）

#### POS点单Mock规则特色 ✨

**API接口支持**：
- `/api/categories` - 获取商品分类（甄选套餐、新品尝鲜等）
- `/api/products` - 获取所有商品（按分组返回）
- `/api/products/category/:id` - 根据分类ID获取商品
- `/api/products/search` - 商品搜索功能
- `/api/products/:id` - 获取商品详情
- `/api/products/popular` - 获取热门商品

**数据内容**：
- 6个商品分类：甄选套餐、新品尝鲜、原叶鲜奶茶、原叶特调茶、活力轻果茶、低负担专区
- 丰富的商品数据：包含真实的饮品名称、价格、描述
- 支持热销、推荐、季节限定等标签系统
- 包含真实的商品图片URL和详细描述

### 6. 应用入口集成（已完成）

#### `src/main.ts` ✅ **已集成**

Mock功能已在应用入口中完成集成：

```typescript
import { createSSRApp } from 'vue'
import App from './App.vue'
import { requestInterceptor } from './http/interceptor'
import i18n from './locale/index'
import { routeInterceptor } from './router/interceptor'
import store from './store'
import '@/style/index.scss'
import 'virtual:uno.css'

// ✅ Mock功能初始化 - 已集成
import '@/utils/mock'

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(i18n)
  app.use(routeInterceptor)
  app.use(requestInterceptor)

  return { app }
}
```

**集成状态**：Mock功能在开发环境下自动启用，无需手动配置。

### 7. 环境变量配置（需配置）

#### `.env.development` 🔧 **需要配置**

```bash
# Mock功能配置
VITE_MOCK_ENABLED=true
VITE_MOCK_DEBUG=true

# API配置
VITE_SERVER_BASEURL=http://localhost:8080
```

#### `.env.production` 🔧 **需要配置**

```bash
# Mock功能配置
VITE_MOCK_ENABLED=false
VITE_MOCK_DEBUG=false

# API配置
VITE_SERVER_BASEURL=https://api.example.com
```

**说明**：如果项目根目录还没有这些环境变量文件，需要创建它们以控制Mock功能的启用状态。

### 8. 工具函数导出（需要配置）

#### `src/utils/index.ts` 🔧 **需要配置**

为了方便在其他地方使用Mock功能，建议在utils中导出相关工具：

```typescript
// ... 其他导出

// Mock功能导出（建议添加）
export * from './mock/mock.config'
export * from './mock/mock.controller'
export * from './mock/mock.generators'
export { mockController } from './mock/mock.controller'
```

**状态**：当前可能还未配置，可以根据需要添加。

## 使用指南

### 1. 基本使用

#### 启用/禁用Mock

```typescript
import { mockController } from '@/utils'

// 启用全局Mock
mockController.enable()

// 禁用全局Mock
mockController.disable()

// 切换Mock状态
const isEnabled = mockController.toggle()
console.log('Mock状态:', isEnabled)
```

#### 添加Mock规则

```typescript
import { mockController } from '@/utils'

// 添加新的Mock规则
mockController.addRule({
  urlPattern: '/api/custom/data',
  method: 'GET',
  enabled: true,
  priority: 10,
  delay: 200,
  response: (request) => {
    return {
      id: 1,
      name: '自定义数据',
      timestamp: new Date().toISOString()
    }
  }
})
```

#### 启用/禁用特定规则

```typescript
// 启用特定规则的Mock
mockController.addRule({
  urlPattern: '/api/specific/endpoint',
  enabled: true,
  response: () => ({ data: 'mocked' })
})

// 切换规则状态
const ruleEnabled = mockController.toggleRule('/api/specific/endpoint')
```

### 2. 高级使用

#### 条件性Mock

```typescript
// 根据请求参数决定是否Mock
mockController.addRule({
  urlPattern: '/api/product/search',
  method: 'GET',
  enabled: true,
  response: (request) => {
    // 如果搜索关键词包含"mock"，返回Mock数据
    if (request.query?.keyword?.includes('mock')) {
      return {
        products: [
          { id: 1, name: 'Mock商品1', price: 99 },
          { id: 2, name: 'Mock商品2', price: 199 }
        ]
      }
    }

    // 否则返回null，走真实接口
    return null
  }
})
```

#### 错误场景模拟

```typescript
import { mockGenerators } from '@/utils'

// 模拟业务错误
mockController.addRule({
  urlPattern: '/api/user/create',
  method: 'POST',
  enabled: true,
  response: () => {
    return mockGenerators.error.businessError(400, '用户名已存在')
  }
})

// 模拟系统错误
mockController.addRule({
  urlPattern: '/api/payment/process',
  method: 'POST',
  enabled: true,
  response: () => {
    return mockGenerators.error.systemError('数据库连接失败')
  }
})
```

#### 动态数据生成

```typescript
import { mockGenerators } from '@/utils'

// 使用数据生成器
mockController.addRule({
  urlPattern: '/api/user/list',
  method: 'GET',
  enabled: true,
  response: (request) => {
    const page = parseInt(request.query?.page || '1')
    const pageSize = parseInt(request.query?.pageSize || '10')

    // 生成100个用户，然后分页
    const users = mockGenerators.user.list(100)
    return mockGenerators.pagination(users, page, pageSize)
  }
})
```

### 3. 配置管理

#### 导出/导入配置

```typescript
import { mockController } from '@/utils'

// 导出当前配置
const configJson = mockController.exportConfig()
console.log('当前Mock配置:', configJson)

// 复制到剪贴板
uni.setClipboardData({
  data: configJson,
  success: () => {
    uni.showToast({ title: '配置已复制', icon: 'success' })
  }
})

// 导入配置
const newConfig = `{
  "enabled": true,
  "rules": [
    {
      "urlPattern": "/api/test/*",
      "enabled": true,
      "response": "() => ({ data: 'test' })"
    }
  ]
}`

const success = mockController.importConfig(newConfig)
if (success) {
  console.log('配置导入成功')
} else {
  console.error('配置导入失败')
}
```

#### 环境配置

```typescript
import { mockController } from '@/utils'

// 按环境配置Mock
mockController.setEnvironment('development', true)
mockController.setEnvironment('test', false)
mockController.setEnvironment('production', false)
```

### 4. 调试支持

#### 开启调试模式

```typescript
import { mockController } from '@/utils'

// 开启调试模式，会在控制台输出详细的Mock信息
mockController.enableDebug()

// 关闭调试模式
mockController.disableDebug()
```

#### 调试输出示例

```
[MOCK] 拦截请求: GET /api/user/list
[MOCK] 匹配规则: /api/user/* (优先级: 1)
[MOCK] 响应延迟: 200ms
[MOCK] 生成响应: 20条用户数据
```

#### 获取Mock统计信息

```typescript
import { getMockStats } from '@/utils/mock'

const stats = getMockStats()
console.log('Mock统计信息:', stats)
// 输出:
// {
//   totalRules: 15,
//   enabledRules: 12,
//   disabledRules: 3,
//   globalEnabled: true,
//   debugMode: true
// }
```

## 开发工具

### 1. Mock控制组件

#### `src/components/MockController.vue`

```vue
<script setup lang="ts">
import { mockController, getMockStats } from '@/utils'
import { ref, onMounted, computed } from 'vue'

const isMockEnabled = ref(false)
const debugMode = ref(false)
const mockStats = ref<any>({})

onMounted(() => {
  loadMockConfig()
})

const loadMockConfig = () => {
  isMockEnabled.value = mockController.getConfig().enabled
  debugMode.value = mockController.getConfig().debug
  mockStats.value = getMockStats()
}

const toggleMock = () => {
  const newState = mockController.toggle()
  isMockEnabled.value = newState
  loadMockConfig()

  uni.showToast({
    title: newState ? 'Mock已启用' : 'Mock已禁用',
    icon: 'success'
  })
}

const toggleDebug = () => {
  if (debugMode.value) {
    mockController.disableDebug()
  } else {
    mockController.enableDebug()
  }
  loadMockConfig()

  uni.showToast({
    title: debugMode.value ? '调试已关闭' : '调试已开启',
    icon: 'success'
  })
}

const exportConfig = () => {
  const config = mockController.exportConfig()
  uni.setClipboardData({
    data: config,
    success: () => {
      uni.showToast({ title: '配置已复制到剪贴板', icon: 'success' })
    }
  })
}

const importConfig = () => {
  uni.showModal({
    title: '导入Mock配置',
    editable: true,
    placeholderText: '请粘贴配置JSON',
    success: (res) => {
      if (res.confirm && res.content) {
        const success = mockController.importConfig(res.content)
        if (success) {
          uni.showToast({ title: '导入成功', icon: 'success' })
          loadMockConfig()
        } else {
          uni.showToast({ title: '导入失败，请检查JSON格式', icon: 'error' })
        }
      }
    }
  })
}

const resetConfig = () => {
  uni.showModal({
    title: '重置Mock配置',
    content: '确定要重置所有Mock配置吗？此操作不可恢复。',
    success: (res) => {
      if (res.confirm) {
        mockController.clearRules()
        loadMockConfig()
        uni.showToast({ title: '配置已重置', icon: 'success' })
      }
    }
  })
}
</script>

<template>
  <view class="mock-controller">
    <view class="header">
      <text class="title">Mock控制器</text>
      <view class="stats">
        <text class="stat-item">总计: {{ mockStats.totalRules }}</text>
        <text class="stat-item">启用: {{ mockStats.enabledRules }}</text>
        <text class="stat-item">禁用: {{ mockStats.disabledRules }}</text>
      </view>
    </view>

    <view class="section">
      <view class="section-title">基础控制</view>
      <view class="control-grid">
        <view class="control-item">
          <text class="control-label">全局Mock</text>
          <wd-switch
            v-model="isMockEnabled"
            @change="toggleMock"
            size="small"
          />
        </view>
        <view class="control-item">
          <text class="control-label">调试模式</text>
          <wd-switch
            v-model="debugMode"
            @change="toggleDebug"
            size="small"
          />
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">配置管理</view>
      <view class="button-grid">
        <wd-button type="primary" size="small" @click="exportConfig">
          导出配置
        </wd-button>
        <wd-button type="success" size="small" @click="importConfig">
          导入配置
        </wd-button>
        <wd-button type="warning" size="small" @click="resetConfig">
          重置配置
        </wd-button>
      </view>
    </view>

    <view class="section" v-if="mockStats.totalRules > 0">
      <view class="section-title">规则分布</view>
      <view class="rule-distribution">
        <view class="distribution-item">
          <view class="progress-bar">
            <view
              class="progress-fill enabled"
              :style="{ width: (mockStats.enabledRules / mockStats.totalRules * 100) + '%' }"
            ></view>
          </view>
          <text class="distribution-label">启用规则: {{ mockStats.enabledRules }}</text>
        </view>
        <view class="distribution-item">
          <view class="progress-bar">
            <view
              class="progress-fill disabled"
              :style="{ width: (mockStats.disabledRules / mockStats.totalRules * 100) + '%' }"
            ></view>
          </view>
          <text class="distribution-label">禁用规则: {{ mockStats.disabledRules }}</text>
        </view>
      </view>
    </view>

    <view class="tips">
      <view class="tip-title">💡 使用提示</view>
      <view class="tip-item">• Mock功能仅在开发环境生效</view>
      <view class="tip-item">• 可以通过 console.mockController 访问控制器</view>
      <view class="tip-item">• 支持导出/导入配置，方便团队共享</view>
      <view class="tip-item">• 开启调试模式查看详细日志</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.mock-controller {
  padding: 30rpx;
  background: #fff;
  border-radius: 12rpx;
  margin: 20rpx;

  .header {
    margin-bottom: 30rpx;

    .title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
      display: block;
    }

    .stats {
      display: flex;
      gap: 20rpx;

      .stat-item {
        font-size: 24rpx;
        color: #666;
        padding: 8rpx 16rpx;
        background: #f5f5f5;
        border-radius: 20rpx;
      }
    }
  }

  .section {
    margin-bottom: 40rpx;

    .section-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
      position: relative;
      padding-left: 20rpx;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 8rpx;
        height: 24rpx;
        background: #007AFF;
        border-radius: 4rpx;
      }
    }
  }

  .control-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20rpx;

    .control-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24rpx;
      background: #f8f9fa;
      border-radius: 8rpx;

      .control-label {
        font-size: 28rpx;
        color: #333;
      }
    }
  }

  .button-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15rpx;
  }

  .rule-distribution {
    .distribution-item {
      margin-bottom: 20rpx;

      .progress-bar {
        height: 12rpx;
        background: #f0f0f0;
        border-radius: 6rpx;
        overflow: hidden;
        margin-bottom: 10rpx;

        .progress-fill {
          height: 100%;
          border-radius: 6rpx;
          transition: width 0.3s ease;

          &.enabled {
            background: #52c41a;
          }

          &.disabled {
            background: #ff4d4f;
          }
        }
      }

      .distribution-label {
        font-size: 24rpx;
        color: #666;
      }
    }
  }

  .tips {
    background: #f0f7ff;
    border: 1px solid #d4e8fc;
    border-radius: 8rpx;
    padding: 20rpx;

    .tip-title {
      font-size: 26rpx;
      font-weight: bold;
      color: #007AFF;
      margin-bottom: 15rpx;
    }

    .tip-item {
      font-size: 24rpx;
      color: #666;
      line-height: 1.6;
      margin-bottom: 8rpx;
    }
  }
}
</style>
```

### 2. 在开发工具中使用

#### Chrome DevTools控制台

```javascript
// 全局访问Mock控制器
window.mockController

// 快速操作
mockController.enable()           // 启用Mock
mockController.disable()          // 禁用Mock
mockController.toggle()           // 切换Mock状态
mockController.enableDebug()      // 开启调试
mockController.getStats()         // 获取统计信息

// 添加临时Mock规则
mockController.addRule({
  urlPattern: '/api/temp/*',
  enabled: true,
  response: () => ({ data: '临时Mock', timestamp: Date.now() })
})
```

### 3. VSCode调试配置

#### `.vscode/launch.json` 添加Mock调试

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug H5 with Mock",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src",
      "sourceMaps": true,
      "env": {
        "VITE_MOCK_ENABLED": "true",
        "VITE_MOCK_DEBUG": "true"
      }
    }
  ]
}
```

## 最佳实践

### 1. Mock规则设计原则

#### 单一职责
```typescript
// ✅ 好的做法 - 单一职责
const userRules = [
  { urlPattern: '/api/user/list', response: () => userList },
  { urlPattern: '/api/user/\\d+', response: () => userDetail },
  { urlPattern: '/api/user/create', response: () => createResult }
]

// ❌ 避免的做法 - 一个规则处理多个接口
const badRule = {
  urlPattern: '/api/user/*',
  response: (request) => {
    // 复杂的逻辑判断...
  }
}
```

#### 优先级设置
```typescript
// ✅ 合理的优先级设置
const rules = [
  // 具体接口优先级高
  { urlPattern: '/api/user/123', priority: 1 },
  { urlPattern: '/api/user/list', priority: 2 },
  // 通用接口优先级低
  { urlPattern: '/api/user/*', priority: 10 }
]
```

#### 延迟模拟
```typescript
// ✅ 模拟真实网络延迟
{
  urlPattern: '/api/user/list',
  delay: 300,        // 列表查询稍慢
  response: () => userList
}

{
  urlPattern: '/api/user/detail',
  delay: 150,        // 详情查询较快
  response: () => userDetail
}

{
  urlPattern: '/api/user/create',
  delay: 500,        // 创建操作较慢
  response: () => createResult
}
```

### 2. 数据管理策略

#### 数据一致性
```typescript
// ✅ 使用统一的数据生成器
import { mockGenerators } from '@/utils'

const userRule = {
  urlPattern: '/api/user/list',
  response: () => mockGenerators.user.list(20)
}

const userDetailRule = {
  urlPattern: '/api/user/\\d+',
  response: (request) => {
    const userId = parseInt(request.url.split('/').pop())
    return mockGenerators.user.detail(userId)
  }
}
```

#### 数据关联性
```typescript
// ✅ 保持数据之间的关联
const orderRules = [
  {
    urlPattern: '/api/order/list',
    response: () => {
      const orders = mockGenerators.order.list(50)
      // 确保订单中的用户ID在用户列表中存在
      orders.forEach(order => {
        order.userId = Math.floor(Math.random() * 100) + 1
      })
      return orders
    }
  }
]
```

### 3. 环境管理

#### 环境隔离
```typescript
// ✅ 严格的环境配置
const config = {
  enabled: false,
  environments: {
    development: true,    // 开发环境启用
    test: false,         // 测试环境禁用
    staging: false,      // 预发布环境禁用
    production: false    // 生产环境禁用
  }
}
```

#### 配置验证
```typescript
// ✅ 添加配置验证
function validateMockConfig(config: MockConfig): boolean {
  if (!config.environments || typeof config.environments !== 'object') {
    console.error('Mock环境配置无效')
    return false
  }

  if (!Array.isArray(config.rules)) {
    console.error('Mock规则配置无效')
    return false
  }

  return true
}
```

### 4. 团队协作

#### 配置共享
```typescript
// ✅ 提供团队配置模板
export const teamMockTemplate: MockConfig = {
  enabled: true,
  environments: {
    development: true,
    test: false,
    production: false
  },
  rules: [
    // 团队通用的Mock规则
    ...commonMockRules
  ],
  defaultDelay: 200,
  debug: true
}
```

#### 文档维护
```typescript
// ✅ 为Mock规则添加详细注释
const userMockRules: MockRule[] = [
  {
    urlPattern: '/api/user/list',
    method: 'GET',
    enabled: true,
    priority: 1,
    delay: 200,
    // 支持分页参数：page, pageSize
    // 支持筛选参数：status, keyword
    response: (request) => {
      /* 实现逻辑... */
    }
  }
]
```

### 5. 性能优化

#### 延迟加载
```typescript
// ✅ 按需加载Mock规则
export function loadUserMockRules() {
  return import('@/mock/rules/user').then(module => {
    return module.userMockRules
  })
}

export function loadProductMockRules() {
  return import('@/mock/rules/product').then(module => {
    return module.productMockRules
  })
}
```

#### 内存管理
```typescript
// ✅ 及时清理Mock数据
export function clearMockCache() {
  // 清理localStorage中的Mock数据
  if (import.meta.env.DEV) {
    localStorage.removeItem('mockConfig')
  }

  // 清理内存中的Mock规则
  mockController.clearRules()
}
```

### 6. 错误处理

#### 异常捕获
```typescript
// ✅ 完善的错误处理
class MockHandler {
  public generateMockResponse(context: MockRequestContext): Promise<any> {
    return new Promise((resolve) => {
      try {
        const rule = this.findMatchingRule(context)
        if (!rule) {
          resolve(null)
          return
        }

        const mockData = rule.response(context)
        resolve(this.formatMockResponse(mockData))

      } catch (error) {
        console.error('[Mock] 生成响应时出错:', error)

        // 降级处理：返回null，走真实接口
        resolve(null)
      }
    })
  }
}
```

#### 降级策略
```typescript
// ✅ Mock失败时的降级处理
export function safeMockResponse(rule: MockRule, context: MockRequestContext): any {
  try {
    return rule.response(context)
  } catch (error) {
    console.warn(`[Mock] 规则 ${rule.urlPattern} 执行失败，降级到默认响应`)

    // 返回安全的默认响应
    return {
      code: 200,
      data: null,
      message: 'Mock数据生成失败'
    }
  }
}
```

### 7. 测试支持

#### Mock数据测试
```typescript
// ✅ 为Mock数据添加测试
import { mockGenerators } from '@/utils'

describe('Mock数据生成器测试', () => {
  test('用户列表数据格式正确', () => {
    const users = mockGenerators.user.list(5)

    expect(users).toHaveLength(5)
    expect(users[0]).toHaveProperty('id')
    expect(users[0]).toHaveProperty('username')
    expect(users[0]).toHaveProperty('email')
  })

  test('分页数据格式正确', () => {
    const data = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }))
    const paginated = mockGenerators.pagination(data, 2, 10)

    expect(paginated.page).toBe(2)
    expect(paginated.pageSize).toBe(10)
    expect(paginated.list).toHaveLength(10)
    expect(paginated.totalPages).toBe(3)
  })
})
```

#### Mock规则验证
```typescript
// ✅ Mock规则验证工具
export function validateMockRules(rules: MockRule[]): boolean {
  for (const rule of rules) {
    if (!rule.urlPattern) {
      console.error('Mock规则缺少urlPattern:', rule)
      return false
    }

    if (typeof rule.response !== 'function') {
      console.error('Mock规则response不是函数:', rule)
      return false
    }

    // 测试响应函数是否能正常执行
    try {
      const testContext = {
        url: 'test-url',
        method: 'GET',
        headers: {},
        data: null,
        query: null
      }

      rule.response(testContext)
    } catch (error) {
      console.error('Mock规则响应函数执行失败:', rule, error)
      return false
    }
  }

  return true
}
```

## 实现状态总结

### ✅ 已完成的功能

#### 核心架构（100%完成）
- [x] Mock配置系统 - 支持缓存和持久化
- [x] Mock拦截器 - 无缝集成到现有HTTP架构
- [x] Mock处理器 - URL匹配和数据生成
- [x] Mock控制器 - 运行时控制和规则管理
- [x] Mock数据生成器 - 标准化数据生成

#### 自动化机制（100%完成）
- [x] 自动规则加载 - 零维护成本
- [x] 多种导出格式支持 - default导出 + 具名导出
- [x] 配置缓存优化 - 避免重复初始化
- [x] 智能持久化 - 只保存可序列化状态

#### 业务场景（100%完成）
- [x] 认证相关Mock规则 - 登录、验证码、token刷新
- [x] 用户相关Mock规则 - 用户列表、详情、增删改查
- [x] POS点单专项Mock规则 - 商品分类、商品列表、搜索等

#### 集成优化（100%完成）
- [x] 应用入口集成 - main.ts自动初始化
- [x] HTTP架构集成 - http.ts无缝拦截
- [x] 环境隔离 - 开发环境启用，生产环境禁用

### 🔧 待配置项

1. **环境变量文件**：项目根目录创建 `.env.development` 和 `.env.production`
2. **Utils导出**：可选的Mock工具导出配置

### 💡 使用优势

1. **零侵入性**：完全不改变现有API调用方式
2. **零维护成本**：新规则文件自动生效
3. **高性能**：配置缓存机制，避免重复初始化
4. **类型安全**：完整的TypeScript类型支持
5. **业务导向**：针对POS点单场景专项优化

这个Mock功能实现方案提供了完整的选择性Mock能力，已在本项目中全面实现并投入使用。通过合理的使用和配置，可以显著提升开发效率，特别是在后端接口尚未完成或网络不稳定的情况下。