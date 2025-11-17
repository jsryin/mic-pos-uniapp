<template>
  <view class="user-card">
    <view class="user-header">
      <text class="user-greeting">Hi, {{ userNickname }}</text>
      <view class="user-stats">
        <view class="stat-item">
          优惠券<text class="stat-value">{{ couponCount }}</text>张
        </view>
        <view class="stat-item">
          积分<text class="stat-value">{{ userPoints }}</text>个
        </view>
      </view>
    </view>

    <!-- 点单方式选择 -->
    <view class="order-options">
      <view
        class="order-option border-r border-gray-100"

        @tap="$emit('pickup-order')"
      >
        <text class="order-title">门店自取</text>
        <text class="order-subtitle">茶友里面请</text>
      </view>

      <view
        class="order-option"
        @tap="$emit('delivery-order')"
      >
        <text class="order-title">外卖点单</text>
        <text class="order-subtitle">奉茶到家</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/store/user'

// 组件 Props 定义
interface Props {
  couponCount?: number
  userPoints?: number
}

const props = withDefaults(defineProps<Props>(), {
  couponCount: 3,
  userPoints: 0,
})

// 组件 Emits 定义
const emit = defineEmits<{
  'pickup-order': []
  'delivery-order': []
}>()

// 状态管理
const userStore = useUserStore()

// 计算属性
const userNickname = computed(() => {
  return userStore.userInfo.nickname || userStore.userInfo.username || '微信用户'
})
</script>

<style lang="scss" scoped>
.user-card {
  @apply relative z-20 mx-4 -mt-12 rounded-t-lg bg-white p-4 shadow-xl;
}

.user-header {
  @apply flex items-center justify-between text-base;
}

.user-greeting {
  @apply text-xl font-bold;
}

.user-stats {
  @apply flex space-x-6 text-gray-600;
}

.stat-item {
  @apply text-center;
}

.stat-value {
  @apply text-xl font-bold text-red-500 ml-1;
}

.order-options {
  @apply mt-6 flex justify-around text-center;
}

.order-option {
  @apply p-3 w-1/2;
}

.order-title {
  @apply text-2xl font-bold text-gray-800 block;
}

.order-subtitle {
  @apply text-sm text-gray-500 mt-1 block;
}

/* 点击反馈效果 */
.order-option:active {
  @apply opacity-80 transition-opacity;
}

/* 响应式适配 */
@media (max-width: 750rpx) {
  .user-stats {
    @apply space-x-4;
  }

  .stat-value {
    @apply text-lg;
  }

  .order-title {
    @apply text-xl;
  }
}
</style>
