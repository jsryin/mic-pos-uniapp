# 登录弹窗组件 (LoginPopup)

一个从底部弹出的占屏幕50%的登录窗口组件，支持多种登录方式。

## 特性

- 🎨 从底部平滑弹出动画
- 📱 占屏幕高度50%
- 🎭 点击遮罩层关闭
- 🔒 支持普通账号登录
- 💬 支持微信小程序登录
- 👤 支持游客模式
- ✨ 表单验证和加载状态
- 🎯 TypeScript 完整支持

## 使用方法

### 1. 基本使用

```vue
<template>
  <view>
    <button @click="showLogin">显示登录弹窗</button>

    <LoginPopup
      v-model="showLoginPopup"
      :on-success="handleLoginSuccess"
      @close="handleClose"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LoginPopup from '@/components/LoginPopup/LoginPopup.vue'

const showLoginPopup = ref(false)

const showLogin = () => {
  showLoginPopup.value = true
}

const handleLoginSuccess = () => {
  console.log('登录成功')
  // 执行登录成功后的操作
}

const handleClose = () => {
  console.log('弹窗已关闭')
}
</script>
```

### 2. 使用组合式函数

```vue
<script setup lang="ts">
import { useLoginPopup } from '@/hooks/useLoginPopup'

const { showLoginPopup, showLogin, hideLogin, handleLoginSuccess } = useLoginPopup()

// 显示登录弹窗
const handleLoginClick = () => {
  showLogin(
    // 登录成功回调
    () => {
      console.log('登录成功，执行后续操作')
    },
    // 关闭弹窗回调
    () => {
      console.log('用户关闭了登录弹窗')
    }
  )
}
</script>

<template>
  <LoginPopup
    v-model="showLoginPopup"
    :on-success="handleLoginSuccess"
    @close="hideLogin"
  />
</template>
```

### 3. 使用登录检查装饰器

```vue
<script setup lang="ts">
import { withLoginCheck } from '@/hooks/useLoginPopup'

// 需要登录的操作会自动检查登录状态
const handleAddToCart = withLoginCheck(() => {
  // 只有登录后才会执行这里
  console.log('添加到购物车')
  cartCount.value++
})

const handleCheckout = withLoginCheck(() => {
  // 只有登录后才会执行这里
  console.log('去结算')
})
</script>

<template>
  <LoginPopup v-model="showLoginPopup" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | boolean | false | 控制弹窗显示/隐藏 |
| onSuccess | Function | undefined | 登录成功后的回调函数 |
| onClose | Function | undefined | 关闭弹窗的回调函数 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | (value: boolean) | 弹窗显示状态变化时触发 |
| success | - | 登录成功时触发 |
| close | - | 弹窗关闭时触发 |

## 登录方式

### 1. 普通账号登录
- 输入用户名和密码
- 表单验证
- 错误提示

### 2. 微信小程序登录
- 仅在微信小程序中显示
- 自动获取微信授权
- 一键登录

### 3. 游客模式
- 不需要登录即可关闭弹窗
- 适合浏览模式

## 样式定制

组件使用了 SCSS 变量和 UnoCSS 类，可以通过以下方式定制：

```scss
// 覆盖主题色
.login-popup-content {
  --primary-color: #your-color;
}
```

## 注意事项

1. 组件依赖 `useTokenStore` 进行登录状态管理
2. 微信登录仅在微信小程序环境中可用
3. 组件会自动处理表单验证和加载状态
4. 支持 v-model 双向绑定控制显示状态

## 示例页面

- `src/pages/me/me.vue` - 我的页面中的登录示例
- `src/pages/order/order.vue` - 点餐页面中的登录检查示例