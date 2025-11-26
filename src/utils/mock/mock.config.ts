/**
 * Mock功能配置类型定义
 */
export interface MockRule {
  /** 匹配的URL模式 */
  urlPattern: string | RegExp
  /** HTTP方法 */
  method?: string
  /** 优先级，数字越小优先级越高 */
  priority?: number
  /** 是否启用 */
  enabled?: boolean
  /** 延迟时间（毫秒） */
  delay?: number
  /** Mock数据生成器 */
  response: (request: any) => any
}

export interface MockConfig {
  /** 是否启用全局mock */
  enabled: boolean
  /** 环境配置，按环境启用 */
  environments: {
    [key: string]: boolean
  }
  /** Mock规则配置 */
  rules: MockRule[]
  /** 默认延迟 */
  defaultDelay?: number
  /** 调试模式 */
  debug?: boolean
}

export const defaultMockConfig: MockConfig = {
  enabled: false,
  environments: {
    development: true,
    test: false,
    production: false,
  },
  rules: [],
  defaultDelay: 0,
  debug: false,
}

/**
 * 获取Mock配置
 */
export function getMockConfig(): MockConfig {
  if (import.meta.env.DEV) {
    const saved = localStorage.getItem('mockConfig')
    if (saved) {
      return { ...defaultMockConfig, ...JSON.parse(saved) }
    }
  }

  return {
    ...defaultMockConfig,
    enabled: import.meta.env.VITE_MOCK_ENABLED === 'true',
    debug: import.meta.env.VITE_MOCK_DEBUG === 'true',
  }
}

/**
 * 保存Mock配置
 */
export function saveMockConfig(config: MockConfig): void {
  if (import.meta.env.DEV) {
    localStorage.setItem('mockConfig', JSON.stringify(config))
  }
}
