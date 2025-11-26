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
  enabled: true,
  environments: {
    development: true,
    test: false,
    production: false,
  },
  rules: [],
  defaultDelay: 0,
  debug: false,
}

// 缓存配置避免重复初始化
let cachedConfig: MockConfig | null = null

/**
 * 获取Mock配置
 */
export function getMockConfig(): MockConfig {
  // 如果已经有缓存配置，直接返回
  if (cachedConfig) {
    return { ...cachedConfig }
  }

  let config = { ...defaultMockConfig }

  if (import.meta.env.DEV) {
    const saved = localStorage.getItem('mockConfig')
    if (saved) {
      // 恢复持久化的状态，但保持 defaultMockConfig 中的空 rules 数组
      config = { ...config, ...JSON.parse(saved) }
    }
  }

  // 应用环境变量配置
  const envEnabled = import.meta.env.VITE_MOCK_ENABLED === 'true'
  const envDebug = import.meta.env.VITE_MOCK_DEBUG === 'true'

  config.enabled = envEnabled || config.enabled
  config.debug = envDebug || config.debug

  // 缓存配置
  cachedConfig = config

  return { ...config }
}

/**
 * 保存Mock配置
 */
export function saveMockConfig(config: MockConfig): void {
  if (import.meta.env.DEV) {
    // 创建一个只包含可序列化状态的新对象，不保存 rules 数组（因为包含函数无法序列化）
    const savableConfig = {
      enabled: config.enabled,
      environments: config.environments,
      defaultDelay: config.defaultDelay,
      debug: config.debug,
      // 关键：不保存 rules 数组，避免函数序列化问题
    }
    localStorage.setItem('mockConfig', JSON.stringify(savableConfig))

    // 更新缓存配置
    if (cachedConfig) {
      cachedConfig = { ...cachedConfig, ...savableConfig }
    }
  }
}
