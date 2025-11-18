<script lang="ts" setup>
import { ref } from 'vue'
import { useLoginPopup, withLoginCheck } from '@/hooks/useLoginPopup'
import { useTokenStore } from '@/store/token'

definePage({
  style: {
    navigationBarTitleText: '点单',
  },
})

const tokenStore = useTokenStore()
const { showLoginPopup, showLogin } = useLoginPopup()

// 购物车数量
const cartCount = ref(0)

// 添加到购物车（需要登录）
const handleAddToCart = withLoginCheck(() => {
  cartCount.value++
  uni.showToast({
    title: '已添加到购物车',
    icon: 'success',
  })
})

// 去结算（需要登录）
const handleCheckout = withLoginCheck(() => {
  if (cartCount.value === 0) {
    uni.showToast({
      title: '购物车为空',
      icon: 'none',
    })
    return
  }

  uni.showToast({
    title: '正在跳转到结算页面',
    icon: 'loading',
  })
})

// 查看订单历史（需要登录）
const viewOrderHistory = withLoginCheck(() => {
  uni.showToast({
    title: '正在加载订单历史',
    icon: 'loading',
  })
})
</script>

<template>
  <view class="order-container">
    <view class="header">
      <text class="title">点单页面</text>
      <view class="header-actions">
        <button class="history-btn" @click="viewOrderHistory">
          订单历史
        </button>
      </view>
    </view>
    <view class="content">
      <view class="category-list">
        <text class="category-title">菜品分类</text>
        <!-- 示例菜品分类 -->
        <view class="category-item active">
          热销
        </view>
        <view class="category-item">
          主食
        </view>
        <view class="category-item">
          小吃
        </view>
        <view class="category-item">
          饮品
        </view>
      </view>
      <view class="menu-list">
        <text class="menu-title">菜单列表</text>
        <!-- 示例菜品 -->
        <view class="menu-item">
          <image class="item-image" src="/static/placeholder-food.jpg" mode="aspectFill" />
          <view class="item-info">
            <text class="item-name">招牌牛肉面</text>
            <text class="item-desc">精选牛肉，秘制汤底</text>
            <text class="item-price">¥28</text>
          </view>
          <button class="add-btn" @click="handleAddToCart">
            <view class="i-carbon-add text-xl text-white" />
          </button>
        </view>

        <view class="menu-item">
          <image class="item-image" src="/static/placeholder-food.jpg" mode="aspectFill" />
          <view class="item-info">
            <text class="item-name">香辣鸡腿堡</text>
            <text class="item-desc">酥脆鸡腿，鲜嫩多汁</text>
            <text class="item-price">¥22</text>
          </view>
          <button class="add-btn" @click="handleAddToCart">
            <view class="i-carbon-add text-xl text-white" />
          </button>
        </view>

        <view class="menu-item">
          <image class="item-image" src="/static/placeholder-food.jpg" mode="aspectFill" />
          <view class="item-info">
            <text class="item-name">珍珠奶茶</text>
            <text class="item-desc">香浓奶茶，Q弹珍珠</text>
            <text class="item-price">¥15</text>
          </view>
          <button class="add-btn" @click="handleAddToCart">
            <view class="i-carbon-add text-xl text-white" />
          </button>
        </view>
      </view>
    </view>
    <view class="cart-bar">
      <view class="cart-info">
        <text class="cart-text">购物车 ({{ cartCount }})</text>
      </view>
      <button class="checkout-btn" :disabled="cartCount === 0" @click="handleCheckout">
        去结算
      </button>
    </view>

    <!-- 全局登录弹窗 -->
    <LoginPopup
      v-model="showLoginPopup"
    />
  </view>
</template>

<style lang="scss" scoped>
.order-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.header {
  background-color: #fff;
  padding: 20rpx 32rpx;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }

  .header-actions {
    .history-btn {
      background-color: #f8f9fa;
      color: #666;
      border: 1px solid #e0e0e0;
      border-radius: 24rpx;
      padding: 16rpx 24rpx;
      font-size: 24rpx;

      &:active {
        background-color: #e9ecef;
      }
    }
  }
}

.content {
  flex: 1;
  display: flex;
  padding: 20rpx;
  gap: 20rpx;
}

.category-list {
  width: 160rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx 0;

  .category-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    padding: 20rpx;
    border-bottom: 1px solid #f0f0f0;
  }

  .category-item {
    padding: 24rpx 20rpx;
    font-size: 28rpx;
    color: #666;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;

    &.active {
      background-color: #e8f5f2;
      color: #018d71;
      font-weight: bold;
      border-left: 6rpx solid #018d71;
    }

    &:not(.active):active {
      background-color: #f8f9fa;
    }
  }
}

.menu-list {
  flex: 1;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;

  .menu-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 24rpx;
    padding-bottom: 16rpx;
    border-bottom: 1px solid #f0f0f0;
  }

  .menu-item {
    display: flex;
    padding: 20rpx 0;
    border-bottom: 1px solid #f0f0f0;
    position: relative;

    &:last-child {
      border-bottom: none;
    }

    .item-image {
      width: 120rpx;
      height: 120rpx;
      border-radius: 12rpx;
      background-color: #f0f0f0;
      margin-right: 20rpx;
    }

    .item-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .item-name {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 8rpx;
      }

      .item-desc {
        font-size: 24rpx;
        color: #666;
        margin-bottom: 12rpx;
      }

      .item-price {
        font-size: 36rpx;
        font-weight: bold;
        color: #ff6b35;
      }
    }

    .add-btn {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
      background: linear-gradient(135deg, #018d71, #02c8a7);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: 20rpx;
      right: 0;
      box-shadow: 0 4rpx 12rpx rgba(1, 141, 113, 0.3);

      &:active {
        transform: scale(0.95);
      }
    }
  }
}

.cart-bar {
  background-color: #fff;
  padding: 24rpx 32rpx;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);

  .cart-info {
    .cart-text {
      font-size: 32rpx;
      color: #333;
      font-weight: 500;
    }
  }

  .checkout-btn {
    background: linear-gradient(135deg, #018d71, #02c8a7);
    color: #fff;
    border: none;
    border-radius: 48rpx;
    padding: 20rpx 48rpx;
    font-size: 32rpx;
    font-weight: bold;
    box-shadow: 0 4rpx 12rpx rgba(1, 141, 113, 0.3);
    transition: all 0.2s;

    &:disabled {
      background: #ccc;
      box-shadow: none;
      color: #999;
    }

    &:not(:disabled):active {
      transform: scale(0.98);
    }
  }
}
</style>
