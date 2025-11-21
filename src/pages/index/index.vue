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
      @activity-click="handleMemberActivityAction"
    />

    <!-- 全局登录弹窗 -->
    <LoginPopup
      v-model="showLoginPopup"
      :on-success="handleLoginSuccess"
      @close="hideLogin"
    />
  </view>
</template>

<script setup lang="ts">
import type { FunctionItem } from './components'
import { ref } from 'vue'
// 引入登录弹窗
import { useLoginPopup, withLoginCheck } from '@/hooks/useLoginPopup'
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

// 登录相关
const { showLoginPopup, showLogin, hideLogin, handleLoginSuccess } = useLoginPopup()

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

// 门店自取（不需要登录）
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

// 需要登录的功能点击（使用登录检查装饰器）
const handleInviteAction = withLoginCheck(() => {
  uni.showToast({
    title: '邀请有礼功能开发中',
    icon: 'none',
  })
})

const handlePointsMallAction = withLoginCheck(() => {
  uni.showToast({
    title: '积分商城功能开发中',
    icon: 'none',
  })
})

const handleCupCollectionAction = withLoginCheck(() => {
  uni.showToast({
    title: '集杯有礼功能开发中',
    icon: 'none',
  })
})

const handleCommunityAction = withLoginCheck(() => {
  uni.showToast({
    title: '茶友社群功能开发中',
    icon: 'none',
  })
})

// 处理功能点击
function handleFunctionClick(item: FunctionItem) {
  console.log('点击功能项:', item)

  switch (item.action) {
    case 'invite':
      handleInviteAction()
      break
    case 'points-mall':
      handlePointsMallAction()
      break
    case 'cup-collection':
      handleCupCollectionAction()
      break
    case 'community':
      handleCommunityAction()
      break
    default:
      if (item.route) {
        uni.navigateTo({
          url: item.route,
        })
      }
  }
}

// 会员活动（需要登录）
const handleMemberActivityAction = withLoginCheck(() => {
  uni.showToast({
    title: '会员活动功能开发中',
    icon: 'none',
  })
})

// 显示登录弹窗
function handleShowLogin() {
  showLogin(
    // 登录成功后的回调
    () => {
      uni.showToast({
        title: '登录成功',
        icon: 'success',
      })
    },
    // 关闭弹窗的回调
    () => {
      console.log('用户关闭了登录弹窗')
    },
  )
}

// 页面生命周期
onLoad(() => {
  console.log('首页加载')
})
</script>

<style scoped>
/* 主页面特定样式 */
</style>
