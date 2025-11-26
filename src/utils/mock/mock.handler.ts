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
    console.log('[MOCK] Handler - 检查是否应该Mock:', {
      请求URL: context.url,
      请求方法: context.method,
      Mock总启用: this.isMockEnabled(),
      规则数量: this.rules.length,
    })

    if (!this.isMockEnabled()) {
      console.log('[MOCK] Handler - Mock未全局启用')
      return false
    }

    for (let i = 0; i < this.rules.length; i++) {
      const rule = this.rules[i]
      console.log(`[MOCK] Handler - 检查规则${i + 1}:`, {
        规则URL: rule.urlPattern,
        规则方法: rule.method,
        规则启用: rule.enabled,
      })

      if (!rule.enabled) {
        console.log(`[MOCK] Handler - 规则${i + 1}未启用，跳过`)
        continue
      }

      const urlMatch = this.matchUrl(context.url, rule.urlPattern)
      const methodMatch = !rule.method || rule.method.toLowerCase() === context.method.toLowerCase()

      console.log(`[MOCK] Handler - 规则${i + 1}匹配结果:`, {
        URL匹配: urlMatch,
        方法匹配: methodMatch,
      })

      if (urlMatch && methodMatch) {
        console.log(`[MOCK] Handler - ✅ 规则${i + 1}匹配成功`)
        return true
      }
    }

    console.log('[MOCK] Handler - ❌ 没有匹配的规则')
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
            console.log(`rule为: `, rule)
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
    // 如果数据已经是完整的API响应格式（包含code字段），直接返回
    if (data && typeof data === 'object' && 'code' in data) {
      return data
    }

    // 否则包装为标准API响应格式
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
