import type { MockRule } from './mock.config'
import { getMockConfig, saveMockConfig } from './mock.config'
import { mockInterceptor } from './mock.interceptor'

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
      rule.urlPattern !== urlPattern
      || (rule.urlPattern instanceof RegExp && rule.urlPattern.toString() === urlPattern.toString()),
    )
    this.saveConfig()
    mockInterceptor.getMockHandler().removeRule(urlPattern)
  }

  /**
   * 启用/禁用特定规则
   */
  public toggleRule(urlPattern: string | RegExp): boolean {
    const rule = this.config.rules.find(rule =>
      rule.urlPattern === urlPattern
      || (rule.urlPattern instanceof RegExp && rule.urlPattern.toString() === urlPattern.toString()),
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
    }
    catch (error) {
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
