<template>
  <view class="member-activity" @tap="$emit('activity-click')">
    <view class="activity-content">
      <text class="activity-tag">{{ tagText }}</text>
      <text class="activity-title">{{ titleText }}</text>
      <text class="activity-subtitle">{{ subtitleText }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
// 组件 Props 定义
interface Props {
  tagText?: string
  titleText?: string
  subtitleText?: string
}

const props = withDefaults(defineProps<Props>(), {
  tagText: '会员活动',
  titleText: '会员活动专区',
  subtitleText: 'Get优惠的饮茶攻略',
})

// 组件 Emits 定义
const emit = defineEmits<{
  'activity-click': []
}>()
</script>

<style lang="scss" scoped>
.member-activity {
  @apply mx-4 my-4 rounded-lg bg-red-700 p-4 shadow-lg h-40 flex items-end;
}

.activity-content {
  @apply w-full;
}

.activity-tag {
  @apply text-xs text-white opacity-80 block;
}

.activity-title {
  @apply text-2xl font-bold text-white block mt-1;
}

.activity-subtitle {
  @apply text-sm text-white opacity-80 block mt-1;
}

/* 点击反馈效果 */
.member-activity:active {
  @apply opacity-80 transition-opacity;
}

/* 响应式适配 */
@media (max-width: 750rpx) {
  .activity-title {
    @apply text-xl;
  }
}
</style>
