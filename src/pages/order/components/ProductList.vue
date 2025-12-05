<script lang="ts" setup>
import type { ProductGroup } from '@/api/product'
import ProductItem from './ProductItem.vue'

interface Props {
  productGroups: ProductGroup[]
  scrollIntoViewId: string
}

interface Emits {
  (e: 'scroll', event: any): void
  (e: 'add-to-cart', product: any): void
  (e: 'select-spec', product: any): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function handleRightScroll(event: any) {
  emit('scroll', event)
}

function handleAddToCart(product: any) {
  emit('add-to-cart', product)
}

function handleSelectSpec(product: any) {
  emit('select-spec', product)
}
</script>

<template>
  <scroll-view
    scroll-y
    class="scroll-content h-full flex-1 bg-white px-3"
    :scroll-into-view="scrollIntoViewId"
    :scroll-with-animation="true"
    :enhanced="true"
    @scroll="handleRightScroll"
  >
    <view class="pb-32 pt-3">
      <!-- 优惠横幅 -->
      <view class="relative mb-6 h-[140px] overflow-hidden rounded-xl shadow-sm">
        <view class="absolute inset-0 from-[#dcebd9] via-[#c8dcc4] to-[#a9c2a4] bg-gradient-to-br" />
        <view class="absolute inset-0 flex flex-col items-start justify-center p-4">
          <text class="mb-1 text-sm text-[#3e583b] font-bold tracking-widest font-serif">CHAGEE</text>
          <text class="mb-1 text-2xl text-[#4a6847] font-bold font-serif">送您新人专属礼</text>
          <view class="mt-2 rounded bg-white/80 px-2 py-0.5 text-xs text-[#3e583b] font-bold backdrop-blur-sm">
            首单立减 3 元
          </view>
        </view>
      </view>

      <!-- 商品分组列表 -->
      <view v-for="group in productGroups" :key="group.id" class="mb-8">
        <!-- 分类标题占位符 -->
        <view :id="`category-head-${group.id}`" class="mb-1" />

        <!-- 粘性分类标题 -->
        <view :id="`category-${group.id}`" class="sticky top-[0px] z-10 mb-6 bg-white py-1 text-[13px] text-gray-800 font-bold">
          {{ group.name }}
        </view>

        <!-- 商品列表 -->
        <ProductItem
          v-for="item in group.items"
          :id="`product-${item.id}`"
          :key="item.id"
          :item="item"
          @add-to-cart="handleAddToCart"
          @select-spec="handleSelectSpec"
        />
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
</style>
