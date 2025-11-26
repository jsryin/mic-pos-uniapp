import type { CustomRequestOptions } from '@/http/types'
import { getMockConfig, saveMockConfig } from './mock.config'
import { MockHandler } from './mock.handler'

/**
 * Mock拦截器
 */
class MockInterceptor {
  private mockHandler: MockHandler

  constructor() {
    const config = getMockConfig()
    this.mockHandler = new MockHandler(config)
  }

  /**
   * 创建Mock请求上下文
   */
  private createMockContext(options: CustomRequestOptions) {
    return {
      url: options.url,
      method: options.method || 'GET',
      headers: options.header || {},
      data: options.data,
      query: options.query,
    }
  }

  /**
   * 处理Mock请求
   */
  public async processRequest(options: CustomRequestOptions): Promise<{ shouldMock: boolean, mockResponse?: any, processedOptions?: CustomRequestOptions }> {
    const context = this.createMockContext(options)

    if (!this.mockHandler.shouldMock(context)) {
      return { shouldMock: false, processedOptions: options }
    }

    console.log(`[MOCK] ✅ 匹配规则 - ${context.method} ${context.url}`)

    if (this.mockHandler.getConfig().debug) {
      console.log(`[MOCK] 请求上下文:`, context)
    }

    const mockResponse = await this.mockHandler.generateMockResponse(context)

    if (mockResponse) {
      if (this.mockHandler.getConfig().debug) {
        console.log(`[MOCK] 生成响应:`, mockResponse)
      }
      return {
        shouldMock: true,
        mockResponse,
        processedOptions: options,
      }
    }

    console.log(`[MOCK] ⚠️ 响应生成失败 - ${context.method} ${context.url}`)
    return { shouldMock: false, processedOptions: options }
  }

  /**
   * 获取Mock处理器实例
   */
  public getMockHandler(): MockHandler {
    return this.mockHandler
  }

  /**
   * 保存当前配置
   */
  public saveConfig(): void {
    saveMockConfig(this.mockHandler.getConfig())
  }
}

// 全局Mock拦截器实例
export const mockInterceptor = new MockInterceptor()

/**
 * 在拦截器中使用的Mock检查函数
 */
export function checkMockRequest(options: CustomRequestOptions): Promise<any> {
  return mockInterceptor.processRequest(options)
}
