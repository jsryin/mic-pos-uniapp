<script lang="ts" setup>
definePage({
  style: {
    navigationBarTitleText: '点单',
  },
})
</script>

<template>
  <view class="order-container">
    <view class="header">
      <text class="title">点单页面</text>
    </view>
    <view class="content">
      <view class="category-list">
        <text class="category-title">菜品分类</text>
        <!-- 这里可以添加菜品分类列表 -->
      </view>
      <view class="menu-list">
        <text class="menu-title">菜单列表</text>
        <!-- 这里可以添加菜品列表 -->
      </view>
    </view>
    <view class="cart-bar">
      <view class="cart-info">
        <text class="cart-text">购物车 (0)</text>
      </view>
      <button class="checkout-btn" disabled>
        去结算
      </button>
    </view>
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
  padding: 20rpx;
  border-bottom: 1px solid #eee;

  .title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
}

.content {
  flex: 1;
  display: flex;
  padding: 20rpx;
  gap: 20rpx;
}

.category-list {
  width: 200rpx;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;

  .category-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
}

.menu-list {
  flex: 1;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;

  .menu-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
}

.cart-bar {
  background-color: #fff;
  padding: 20rpx;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .cart-info {
    .cart-text {
      font-size: 28rpx;
      color: #333;
    }
  }

  .checkout-btn {
    background-color: #018d71;
    color: #fff;
    border: none;
    border-radius: 50rpx;
    padding: 20rpx 40rpx;
    font-size: 28rpx;

    &:disabled {
      background-color: #ccc;
    }
  }
}
</style>
