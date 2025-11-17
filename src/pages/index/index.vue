<template>
  <view class="index-page">
    <!-- 背景图片区域 -->
    <view class="hero-section fade-in">
      <view class="hero-background">
        <image
          src="/static/images/pexels-jess-bg.jpg"
          mode="aspectFill"
          class="hero-image"
        />
      </view>
      <view class="hero-gradient" />
    </view>

    <!-- 用户信息卡片 -->
    <UserCard
      :coupon-count="couponCount"
      :user-points="userPoints"
      @pickup-order="handlePickupOrder"
      @delivery-order="handleDeliveryOrder"
    />

    <!-- 功能图标区域 -->
    <FunctionMenu
      :items="functionItems"
      @function-click="handleFunctionClick"
    />

    <!-- 会员活动区域 -->
    <MemberActivity
      tag-text="会员活动"
      title-text="会员活动专区"
      subtitle-text="Get优惠的饮茶攻略"
      @activity-click="handleMemberActivity"
    />
  </view>
</template>

<script setup lang="ts">
import type { FunctionItem } from './components'
import { ref } from 'vue'
// 引入组件
import { FunctionMenu, MemberActivity, UserCard } from './components'
// 引入样式
import './styles/index.scss'

// 页面配置
definePage({
  navigationBarTitleText: '首页',
  navigationBarBackgroundColor: '#ffffff',
  navigationBarTextStyle: 'black',
})

// 响应式数据
const couponCount = ref(3)
const userPoints = ref(0)

// 功能菜单数据
const functionItems = ref<FunctionItem[]>([
  {
    id: 'invite',
    label: '邀请有礼',
    icon: 'i-carbon-gift',
    iconClass: 'bg-red-100 text-red-500',
    action: 'invite',
  },
  {
    id: 'points-mall',
    label: '积分商城',
    icon: 'i-carbon-shopping-cart',
    iconClass: 'bg-red-100 text-red-500',
    action: 'points-mall',
  },
  {
    id: 'cup-collection',
    label: '集杯有礼',
    icon: 'i-carbon-drink-01',
    iconClass: 'bg-red-100 text-red-500',
    action: 'cup-collection',
  },
  {
    id: 'community',
    label: '茶友社群',
    icon: 'i-carbon-group',
    iconClass: 'bg-red-100 text-red-500',
    action: 'community',
  },
])

// 事件处理方法
function handlePickupOrder() {
  uni.navigateTo({
    url: '/pages/pickup/pickup',
  })
}

function handleDeliveryOrder() {
  uni.navigateTo({
    url: '/pages/order/order',
  })
}

function handleFunctionClick(item: FunctionItem) {
  console.log('点击功能项:', item)

  switch (item.action) {
    case 'invite':
      // 处理邀请有礼
      uni.showToast({
        title: '邀请有礼功能开发中',
        icon: 'none',
      })
      break
    case 'points-mall':
      // 处理积分商城
      uni.showToast({
        title: '积分商城功能开发中',
        icon: 'none',
      })
      break
    case 'cup-collection':
      // 处理集杯有礼
      uni.showToast({
        title: '集杯有礼功能开发中',
        icon: 'none',
      })
      break
    case 'community':
      // 处理茶友社群
      uni.showToast({
        title: '茶友社群功能开发中',
        icon: 'none',
      })
      break
    default:
      if (item.route) {
        uni.navigateTo({
          url: item.route,
        })
      }
  }
}

function handleMemberActivity() {
  uni.showToast({
    title: '会员活动功能开发中',
    icon: 'none',
  })
}

// 页面生命周期
onLoad(() => {
  console.log('首页加载')
})
</script>

<style scoped>
/* 主页面特定样式 */
</style>
