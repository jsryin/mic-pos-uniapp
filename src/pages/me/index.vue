<template>
  <view
    class="page-container"
    :style="{
      backgroundColor: '#f7f8fa',
      minHeight: '100vh',
    }"
  >
    <view
      class="navbar flex items-center justify-between px-4"
      :style="{
        paddingTop: `${safeAreaInsets?.top}px`,
        height: '44px',
      }"
    >
      <view class="flex items-center" @click="handleFriendsClick">
        <image src="/static/logo.png" class="h-9 w-9 rounded-full" />
        <text class="ml-3 text-lg font-bold">登录</text>
        <view class="i-carbon-chevron-right text-lg text-gray-500" />
      </view>
      <view class="flex items-center space-x-4">
        <image src="/static/flag-malaysia.png" class="h-5 w-7" />
        <view class="i-carbon-settings text-xl text-gray-700" @click="handleSettingsClick" />
        <view class="i-carbon-notification text-xl text-gray-700" @click="handleNotificationClick" />
      </view>
    </view>

    <view class="p-4">
      <view
        class="friends-card relative overflow-hidden rounded-xl p-4"
        style="background: linear-gradient(120deg, #e6f1e6, #d8eade);"
        @click="handleFriendsClick"
      >
        <view
          class="absolute h-3/4 w-3/4 rounded-full bg-white/30 -left-1/4 -top-1/4"
        />

        <view class="flex items-start justify-between">
          <text class="text-brandGreenDark text-lg font-bold">朋友</text>
          <image src="/static/profile-icon.png" class="h-16 w-16" />
        </view>
        <view class="relative z-10 mt-4 flex items-center justify-end">
          <text class="text-sm text-gray-700">看法 我的好处</text>
          <view class="i-carbon-chevron-right ml-1 text-gray-700" />
        </view>
      </view>

      <text class="mb-3 mt-6 block text-lg font-bold">我的帐户</text>
      <view class="account-card flex items-center rounded-lg bg-white p-3 shadow-sm">
        <view class="flex flex-1 flex-col items-center border-r border-gray-200" @click="handleWalletClick">
          <view class="i-carbon-wallet mb-2 text-2xl text-green-600" />
          <text class="text-xl font-bold">0</text>
          <view class="mt-1 flex items-baseline">
            <text class="text-sm text-gray-500">钱包</text>
            <text class="ml-1 text-xs text-gray-500">(RM)</text>
          </view>
        </view>

        <view class="flex flex-1 flex-col items-center" @click="handleCouponClick">
          <view class="i-carbon-gift mb-2 text-2xl text-green-600" />
          <text class="text-xl font-bold">0</text>
          <text class="mt-1 text-sm text-gray-500">代金券</text>
        </view>

        <view class="flex flex-1 flex-col items-center border-r border-gray-200" @click="handleAddressClick">
          <view class="i-carbon-location mb-2 text-2xl text-green-600" />
          <text class="text-xl font-bold">0</text>
          <text class="mt-1 text-sm text-gray-500">地址</text>
        </view>
      </view>

      <view class="faq-link mt-6 flex items-center justify-between px-1" @click="handleFAQClick">
        <text class="text-lg font-bold">常见问题</text>
        <view class="i-carbon-chevron-right text-lg text-gray-500" />
      </view>
    </view>

    <!-- 全局登录弹窗 -->
    <LoginPopup
      v-model="showLoginPopup"
      :on-success="handleLoginSuccess"
      @close="hideLogin"
    />
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import LoginPopup from '@/components/LoginPopup/LoginPopup.vue'
// 引入登录弹窗
import { useLoginPopup, withLoginCheck } from '@/hooks/useLoginPopup'

// 定义页面配置
definePage({
  navigationStyle: 'custom',
  navigationBarTitleText: '%tabbar.me%',
})

// 登录相关
const { showLoginPopup, showLogin, hideLogin, handleLoginSuccess } = useLoginPopup()

// 用于获取安全区域（刘海屏适配）
const safeAreaInsets = ref<UniApp.SafeAreaInsets | undefined>()

// 需要登录的功能处理
const handleWalletClick = withLoginCheck(() => {
  uni.showToast({
    title: '钱包功能开发中',
    icon: 'none',
  })
})

const handleCouponClick = withLoginCheck(() => {
  uni.showToast({
    title: '代金券功能开发中',
    icon: 'none',
  })
})

const handleAddressClick = withLoginCheck(() => {
  uni.showToast({
    title: '地址管理功能开发中',
    icon: 'none',
  })
})

const handleFriendsClick = withLoginCheck(() => {
  uni.showToast({
    title: '朋友功能开发中',
    icon: 'none',
  })
})

const handleSettingsClick = withLoginCheck(() => {
  uni.showToast({
    title: '设置功能开发中',
    icon: 'none',
  })
})

const handleNotificationClick = withLoginCheck(() => {
  uni.showToast({
    title: '通知功能开发中',
    icon: 'none',
  })
})

function handleFAQClick() {
  uni.showToast({
    title: '常见问题功能开发中',
    icon: 'none',
  })
}

onShow(() => {
  try {
    const info = uni.getSystemInfoSync()
    safeAreaInsets.value = info.safeAreaInsets
  }
  catch (e) {
    console.error('获取系统信息失败', e)
  }
})
</script>

<style lang="scss" scoped>
/* uniapp 中, 推荐将页面背景色设置在 page 上 */
page {
  background-color: #f7f8fa;
}

.page-container {
  position: relative;
}

/* 自定义导航栏的高度需要是内容高度+状态栏高度 */
.navbar {
  box-sizing: content-box; /* 确保 padding-top 不会撑开 height */
  background-color: transparent;
  border-bottom: 1px solid rgba(240, 240, 240, 0.3); /* 增加一个细微的底部分隔线 */
}

.friends-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.account-card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>
