<template>
  <view class="function-card">
    <view class="function-grid">
      <view
        v-for="item in functionItems"
        :key="item.id"
        class="function-item"
        @tap="handleFunctionClick(item)"
      >
        <view class="function-icon" :class="item.iconClass">
          <text :class="item.icon" />
        </view>
        <text class="function-label">{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 类型定义
interface FunctionItem {
  id: string
  label: string
  icon: string
  iconClass: string
  route?: string
  action?: string
}

// 组件 Props 定义
interface Props {
  items?: FunctionItem[]
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
})

// 组件 Emits 定义
const emit = defineEmits<{
  'function-click': [item: FunctionItem]
}>()

// 功能菜单数据
const functionItems = ref<FunctionItem[]>(props.items.length > 0
  ? props.items
  : [
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

// 事件处理
function handleFunctionClick(item: FunctionItem) {
  emit('function-click', item)
}
</script>

<style lang="scss" scoped>
.function-card {
  @apply rounded-b-lg bg-white pt-4 pb-6 shadow-xl;
}

.function-grid {
  @apply grid grid-cols-4 gap-4 text-center;
}

.function-item {
  @apply flex flex-col items-center;
}

.function-icon {
  @apply text-2xl p-2 rounded-full;
}

.function-label {
  @apply text-xs text-gray-500 mt-1;
}

/* 点击反馈效果 */
.function-item:active {
  @apply opacity-80 transition-opacity;
}
</style>
