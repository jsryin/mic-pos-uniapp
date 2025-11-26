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

/**
 * 获取Mock配置
 */
export function getMockConfig(): MockConfig {
  let config = { ...defaultMockConfig }

  if (import.meta.env.DEV) {
    const saved = localStorage.getItem('mockConfig')
    if (saved) {
      // 恢复持久化的状态，但保持 defaultMockConfig 中的空 rules 数组
      config = { ...config, ...JSON.parse(saved) }
      console.log('[MOCK] 从localStorage恢复配置:', config.enabled)
    }
  }

  // 应用环境变量配置
  const envEnabled = import.meta.env.VITE_MOCK_ENABLED === 'true'
  const envDebug = import.meta.env.VITE_MOCK_DEBUG === 'true'

  config.enabled = envEnabled || config.enabled
  config.debug = envDebug || config.debug

  console.log('[MOCK] 配置信息:', {
    环境变量启用: envEnabled,
    环境变量调试: envDebug,
    最终启用状态: config.enabled,
    最终调试状态: config.debug,
    当前环境: import.meta.env.MODE,
    规则数量: config.rules.length,
  })

  // ‼️ 重要：这里返回的 config.rules 数组是空的，需要外部 (index.ts) 注入代码中的规则
  return config
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
  }
}
