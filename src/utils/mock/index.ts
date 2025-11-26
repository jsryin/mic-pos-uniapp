import type { MockRule } from '@/utils/mock/mock.config'
import { getMockConfig } from '@/utils/mock/mock.config'

/**
 * 初始化Mock规则
 * 使用 Vite 的 import.meta.glob 自动加载 rules 目录下的所有 .ts 文件
 */
export function initializeMockRules() {
  const config = getMockConfig()

  // 1. 自动化导入 rules 目录下所有的 .ts 文件
  // { eager: true } 表示同步加载，不是懒加载
  const modules = import.meta.glob('./rules/*.ts', { eager: true })

  const allRules: MockRule[] = []

  // 2. 遍历加载的模块
  for (const path in modules) {
    const mod = modules[path] as any

    // 支持多种导出格式：
    // - export default [MockRule[]]
    // - export const xxxMockRules: MockRule[]

    // 优先使用 default 导出
    if (mod.default && Array.isArray(mod.default)) {
      allRules.push(...mod.default)
    }

    // 兼容具名导出（如 userMockRules）
    const namedExports = Object.keys(mod).filter(key =>
      key.endsWith('MockRules') && Array.isArray(mod[key]),
    )

    for (const exportKey of namedExports) {
      allRules.push(...mod[exportKey])
    }
  }

  // 3. 赋值给配置
  config.rules = [...config.rules, ...allRules]

  // 保存配置到localStorage
  if (import.meta.env.DEV) {
    localStorage.setItem('mockConfig', JSON.stringify(config))
    const loadedFiles = Object.keys(modules).length
    console.log(`[Mock] 自动加载规则文件: ${loadedFiles} 个，共 ${allRules.length} 条规则`)
    console.log(`[Mock] 已加载的规则文件: ${Object.keys(modules).map(path => path.replace('./rules/', '')).join(', ')}`)
  }
}

/**
 * 重置Mock配置
 */
export function resetMockConfig() {
  const config = getMockConfig()
  config.rules = []

  if (import.meta.env.DEV) {
    localStorage.removeItem('mockConfig')
    console.log('[Mock] Mock配置已重置')
  }
}

/**
 * 获取Mock规则统计
 */
export function getMockStats() {
  const config = getMockConfig()
  const stats = {
    totalRules: config.rules.length,
    enabledRules: config.rules.filter(rule => rule.enabled).length,
    disabledRules: config.rules.filter(rule => !rule.enabled).length,
    globalEnabled: config.enabled,
    debugMode: config.debug,
  }

  return stats
}

// 开发环境下自动初始化
if (import.meta.env.DEV) {
  initializeMockRules()
}
