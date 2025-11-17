<script lang="ts" setup>
definePage({
  style: {
    navigationBarTitleText: '取餐',
  },
})
</script>

<template>
  <view class="pickup-container">
    <view class="header">
      <text class="title">取餐页面</text>
    </view>
    <view class="content">
      <view class="order-status">
        <text class="status-title">订单状态</text>
        <!-- 这里可以添加订单状态显示 -->
      </view>
      <view class="order-info">
        <text class="info-title">取餐信息</text>
        <!-- 这里可以添加取餐信息 -->
      </view>
      <view class="queue-info">
        <text class="queue-title">排队信息</text>
        <!-- 这里可以添加排队信息 -->
      </view>
    </view>
    <view class="actions">
      <button class="refresh-btn">
        刷新状态
      </button>
      <button class="cancel-btn">
        取消订单
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.pickup-container {
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
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.order-status,
.order-info,
.queue-info {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;

  .status-title,
  .info-title,
  .queue-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
}

.actions {
  background-color: #fff;
  padding: 20rpx;
  border-top: 1px solid #eee;
  display: flex;
  gap: 20rpx;

  .refresh-btn,
  .cancel-btn {
    flex: 1;
    border-radius: 50rpx;
    padding: 20rpx;
    font-size: 28rpx;
    border: none;
  }

  .refresh-btn {
    background-color: #018d71;
    color: #fff;
  }

  .cancel-btn {
    background-color: #f56c6c;
    color: #fff;
  }
}
</style>
