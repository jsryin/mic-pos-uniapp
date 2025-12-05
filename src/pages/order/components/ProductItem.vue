<script lang="ts" setup>
export interface Product {
  id: number
  title: string
  desc: string
  price: string | number
  image: string
  hasSpec?: number // 是否需要选择规格，0=直接添加，1=选规格
}

interface Props {
  item: Product
}

interface Emits {
  (e: 'add-to-cart', product: Product): void
  (e: 'select-spec', product: Product): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function handleAddToCart(product: Product) {
  emit('add-to-cart', product)
}

function handleSelectSpec(product: Product) {
  emit('select-spec', product)
}
</script>

<template>
  <view class="mb-6 flex">
    <!-- 商品图片 -->
    <view class="relative h-[96px] w-[96px] shrink-0 overflow-hidden rounded-lg bg-gray-100">
      <image :src="item.image" class="h-full w-full object-cover" mode="aspectFill" />
    </view>

    <!-- 商品信息 -->
    <view class="ml-3 flex flex-1 flex-col justify-between py-0.5">
      <view>
        <text class="line-clamp-2 mb-1 text-[15px] text-[#222] font-bold leading-snug">{{ item.title }}</text>
        <text class="line-clamp-2 text-[11px] text-gray-400 leading-relaxed">{{ item.desc }}</text>
      </view>

      <view class="mt-2 flex items-end justify-between">
        <!-- 价格 -->
        <view class="flex items-baseline text-[#222]">
          <text class="mr-[1px] text-[11px] font-bold">¥</text>
          <text class="text-[17px] font-bold font-sans">{{ item.price }}</text>
          <text class="ml-0.5 text-[11px] text-gray-400 font-normal">起</text>
        </view>

        <!-- 操作按钮 -->
        <view
          v-if="item.hasSpec === 1"
          class="h-[26px] flex items-center justify-center rounded-full bg-[#BA9257] px-3 shadow-md transition-transform active:scale-95"
          @click="handleSelectSpec(item)"
        >
          <text class="text-[11px] text-white font-medium">选规格</text>
        </view>
        <view
          v-else
          class="h-[26px] w-[26px] flex items-center justify-center rounded-full bg-[#BA9257] shadow-md transition-transform active:scale-95"
          @click="handleAddToCart(item)"
        >
          <wd-icon name="add" size="18px" color="white" />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
