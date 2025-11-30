<script lang="ts" setup>
import type { Category } from '@/api/product'

interface Props {
  categories: Category[]
  currentCateId: number
  leftScrollIntoViewId: string
}

interface Emits {
  (e: 'category-click', id: number): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function handleCategoryClick(id: number) {
  emit('category-click', id)
}
</script>

<template>
  <scroll-view
    scroll-y
    class="h-full w-[90px] bg-[#f6f6f6]"
    :enhanced="true"
    :show-scrollbar="false"
    :scroll-into-view="leftScrollIntoViewId"
    :scroll-with-animation="true"
  >
    <view class="py-2">
      <view
        v-for="item in categories"
        :id="`left-category-${item.id}`"
        :key="item.id"
        class="relative flex flex-col items-center justify-center px-2 py-5 transition-all duration-200"
        :class="currentCateId === item.id ? 'bg-white' : 'bg-[#f6f6f6]'"
        @click="handleCategoryClick(item.id)"
      >
        <!-- 选中指示器 -->
        <view v-if="currentCateId === item.id" class="absolute left-0 top-1/2 h-[18px] w-[3px] rounded-r-full bg-[#333] -translate-y-1/2" />

        <!-- 角标 -->
        <view v-if="item.badge" class="absolute right-1 top-1 z-10 origin-center scale-75 rounded-[2px] bg-[#ff4d4f] px-[3px] py-[1px] text-[8px] text-white shadow-sm">
          {{ item.badge }}
        </view>

        <!-- 图标 -->
        <view class="mb-1.5 transition-transform duration-200" :class="currentCateId === item.id ? 'scale-110' : 'opacity-50 grayscale'">
          <wd-icon :name="item.icon" size="24px" :color="currentCateId === item.id ? '#333' : '#666'" />
        </view>

        <!-- 名称 -->
        <text class="text-center text-[11px] leading-tight" :class="currentCateId === item.id ? 'font-bold text-black' : 'text-gray-500'">{{ item.name }}</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
</style>
