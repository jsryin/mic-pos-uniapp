---
trigger: manual
alwaysApply: false
---
# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 重要规则

**全部使用中文回复**：在此代码仓库中工作时，Claude 必须使用中文进行所有回复和交流。这包括代码注释、文档说明、问题解答和技术讨论等所有形式的沟通。

# unibest 项目概览

基于 uniapp + Vue3 + TypeScript + Vite5 + UnoCSS 的跨平台开发框架，支持 H5、小程序、APP 多平台开发。

## 核心特点
- 最新前端技术栈，内置约定式路由、layout布局、请求封装
- 无需依赖 HBuilderX，支持命令行开发
- 严格 TypeScript 开发，使用 Composition API
- 集成 z-paging 等优秀的第三方组件库

## 核心配置
- `package.json` - 依赖和脚本
- `vite.config.ts` - Vite 构建
- `pages.config.ts` - 页面路由
- `manifest.config.ts` - 应用清单
- `uno.config.ts` - UnoCSS 配置

## 目录结构
```
src/
├── api/                 # API 接口
├── components/          # Vue 组件（自动导入）
├── pages/              # 主应用页面
├── pages-fg/           # 分包页面（登录、注册、404 等）
├── layouts/            # 布局组件
├── hooks/              # Vue 3 组合式函数（自动导入）
├── http/               # HTTP 客户端配置和拦截器
├── store/              # Pinia 状态管理
├── router/             # 路由配置和拦截器
├── locale/             # i18n 国际化
├── service/            # 自动生成的 API 服务
├── tabbar/             # 标签栏配置
├── utils/              # 工具函数
├── static/             # 静态资源（图片、图标）
├── style/              # 全局样式和 SCSS
└── App.ku.vue          # 全局根组件
```

## 开发命令
- `pnpm dev` - H5 版本
- `pnpm dev:mp` - 微信小程序
- `pnpm dev:mp-alipay` - 支付宝小程序(含钉钉)
- `pnpm dev:app` - APP 版本
- `pnpm build` - 生产构建

# 开发规范

## Vue SFC 组件
- **标签顺序**: `<script setup lang="ts">` → `<template>` → `<style scoped>`
- **命名**: 组件 PascalCase，页面文件即路由路径
- **组件放置**: 全局组件在 `src/components/`，局部组件在页面 `/components/`
- **页面配置**: 使用 `definePage` 宏配置，自动生成到 `pages.json`

## TypeScript 严格规范
- 避免 `any` 类型，为 API 响应定义接口
- `interface` 定义对象类型，`type` 定义联合类型
- 使用 `import type` 导入类型

## 状态管理与样式
- **Pinia**: Store 文件在 `src/store/`，使用 `defineStore`
- **UnoCSS**: 原子化 CSS，优先使用预设类名，配置在 `uno.config.ts`
- **SCSS**: 使用 `scoped` 属性，遵循 BEM 规范

## UI 组件库使用
- **样式优先使用原生方式实现**
- **z-paging**: 分页组件，用于列表和分页功能
- **UnoCSS图标**: 支持 Carbon 图标集合，使用 `i-` 前缀

## 平台适配
- 使用条件编译 `#ifdef/#endif` 处理平台差异
- 优先使用 `uni.xxx` API 替代原生 API

## 生命周期
- **页面**: onLoad、onShow、onReady、onHide、onUnload
- **组件**: 遵循 Vue3 规范
- 注意页面栈和导航管理

## 示例代码结构
```vue
<script setup lang="ts">
// #ifdef H5
import { h5Api } from '@/utils/h5'
// #endif

// #ifdef MP-WEIXIN
import { mpApi } from '@/utils/mp'
// #endif

const handleClick = () => {
  // #ifdef H5
  h5Api.showToast('H5 平台')
  // #endif
  
  // #ifdef MP-WEIXIN
  mpApi.showToast('微信小程序')
  // #endif
}
</script>

<template>
  <view class="page">
    <!-- uni-app 组件 -->
    <button @click="handleClick">点击</button>
    
    <!-- 条件渲染 -->
    <!-- #ifdef H5 -->
    <view>H5 特有内容</view>
    <!-- #endif -->
  </view>
</template>
```

## 响应式设计/样式组织
- 使用 `rpx` 单位适配不同屏幕
- 优先使用 UnoCSS 的 flexbox 和 grid 类
- 全局样式在 [src/style/](mdc:src/style/) 目录下
- 组件样式使用 scoped 作用域
- 图标字体在 [src/style/iconfont.css](mdc:src/style/iconfont.css)
- 主题变量在 [src/uni_modules/uni-scss/](mdc:src/uni_modules/uni-scss/) 目录下

## 示例代码结构
```vue
<template>
  <view class="container flex flex-col items-center p-4">
    <text class="title text-lg font-bold mb-2">标题</text>
    <view class="content bg-gray-100 rounded-lg p-3">
      <!-- 内容 -->
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  
  .title {
    color: var(--primary-color);
  }
  
  .content {
    width: 100%;
    max-width: 600rpx;
  }
}
</style>
---
globs: *.vue,*.scss,*.css
---