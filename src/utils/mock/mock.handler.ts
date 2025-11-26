import type { MockConfig, MockRule } from './mock.config'

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
    if (!this.isMockEnabled())
      return false

    for (const rule of this.rules) {
      if (!rule.enabled)
        continue

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
        }
        catch (error) {
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
      if (!rule.enabled)
        continue

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
      data,
      message: 'success',
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
      rule.urlPattern !== urlPattern
      && !(rule.urlPattern instanceof RegExp && rule.urlPattern.toString() === urlPattern.toString()),
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
