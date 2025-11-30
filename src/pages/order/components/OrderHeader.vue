<script lang="ts" setup>
interface Props {
  tags: string[]
}

defineProps<Props>()

// 店铺信息数据
const storeInfo = {
  name: '广东深圳南山茂业百货店',
  distance: '569m',
}
</script>

<template>
  <view class="header-area pt-status-bar bg-white">
    <view class="header-content pb-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <!-- 用餐类型选择 -->
      <view class="mt-2 flex items-center justify-between px-4 py-2">
        <view class="flex items-baseline gap-4">
          <view class="relative flex flex-col items-center">
            <text class="text-[18px] text-black font-bold leading-none">堂食</text>
            <view class="mt-1 h-[3px] w-5 rounded-full bg-black" />
          </view>
          <text class="text-[16px] text-gray-400 font-medium leading-none transition-colors hover:text-gray-600">外卖</text>
        </view>
        <view class="flex items-center gap-3">
          <view class="h-8 w-8 flex items-center justify-center rounded-full bg-[#f5f5f5]">
            <wd-icon name="search" size="18px" color="#333" />
          </view>
        </view>
      </view>

      <!-- 店铺信息 -->
      <view class="mt-2 flex justify-between px-4">
        <view class="flex-1 pr-4">
          <view class="mb-1 flex items-center text-[17px] text-black font-bold">
            <wd-icon name="star-filled" size="16px" color="#999" custom-class="mr-1" />
            <text class="max-w-[220px] truncate">{{ storeInfo.name }}</text>
            <wd-icon name="arrow-right" size="14px" color="#999" custom-class="ml-1" />
          </view>
          <view class="flex items-center gap-2 text-[11px]">
            <view class="flex items-center text-gray-500">
              <wd-icon name="location" size="10px" custom-class="mr-0.5" />
              距您{{ storeInfo.distance }}
            </view>
          </view>
        </view>
      </view>

      <!-- 优惠标签 -->
      <view class="mt-3 px-4">
        <scroll-view scroll-x class="no-scrollbar w-full whitespace-nowrap" :show-scrollbar="false">
          <view class="inline-flex gap-2 pb-1">
            <view v-for="(tag, idx) in tags" :key="idx" class="border border-[#f2dcb8] rounded-[4px] bg-[#fffbf5] px-2 py-[2px] text-[10px] text-[#d48a38]">
              {{ tag }}
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
