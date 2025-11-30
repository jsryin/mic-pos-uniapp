<script lang="ts" setup>
import { computed } from 'vue'

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  selected: boolean
  desc?: string
}

interface Props {
  cartItems: CartItem[]
  isCartExpanded: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

// --- Computed Properties ---

// 购物车总数量
const totalQuantity = computed(() => {
  return props.cartItems.reduce((sum, item) => sum + item.quantity, 0)
})

// 购物车选中总价
const totalPrice = computed(() => {
  return props.cartItems
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
})

// 是否全选
const isAllSelected = computed(() => {
  return props.cartItems.length > 0 && props.cartItems.every(item => item.selected)
})

interface Emits {
  (e: 'toggle-cart'): void
  (e: 'increase-quantity', item: CartItem): void
  (e: 'decrease-quantity', item: CartItem): void
  (e: 'toggle-item-select', item: CartItem): void
  (e: 'toggle-select-all'): void
  (e: 'clear-cart'): void
  (e: 'checkout'): void
}

function toggleCartPanel() {
  emit('toggle-cart')
}

function increaseQuantity(item: CartItem) {
  emit('increase-quantity', item)
}

function decreaseQuantity(item: CartItem) {
  emit('decrease-quantity', item)
}

function toggleItemSelect(item: CartItem) {
  emit('toggle-item-select', item)
}

function toggleSelectAll() {
  emit('toggle-select-all')
}

function clearCart() {
  emit('clear-cart')
}

function handleCheckout() {
  emit('checkout')
}
</script>

<template>
  <!-- 购物车悬浮层 -->
  <view
    v-if="isCartExpanded"
    class="cart-overlay"
    @click="toggleCartPanel"
  />

  <!-- 购物车容器 -->
  <view
    v-if="cartItems.length > 0"
    class="cart-container"
    :class="isCartExpanded ? 'bg-white' : 'bg-transparent'"
  >
    <!-- 展开的购物车面板 -->
    <view
      v-if="isCartExpanded"
      class="cart-panel animate-slide-in-up"
    >
      <!-- 购物车头部 -->
      <view class="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
        <view class="flex items-center" @click="toggleSelectAll">
          <wd-icon
            name="check-circle-filled"
            size="20px"
            :color="isAllSelected ? '#8b6e51' : '#ccc'"
          />
          <text class="ml-2 text-[14px] text-gray-800 font-medium">全选</text>
        </view>
        <view class="flex items-center text-gray-500 transition hover:text-red-500" @click="clearCart">
          <wd-icon name="delete" size="16px" />
          <text class="ml-1 text-[12px]">清空</text>
        </view>
      </view>

      <!-- 购物车商品列表 -->
      <scroll-view scroll-y class="max-h-[50vh] min-h-[100px] w-full bg-white px-4 py-2">
        <view
          v-for="item in cartItems"
          :key="item.id"
          class="mb-3 flex items-center py-2 pr-4"
        >
          <!-- 选择框 -->
          <view class="mr-3 shrink-0" @click="toggleItemSelect(item)">
            <wd-icon
              name="check-circle-filled"
              size="20px"
              :color="item.selected ? '#8b6e51' : '#ccc'"
            />
          </view>

          <!-- 商品图片 -->
          <view class="relative mr-3 h-14 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
            <image :src="item.image" mode="aspectFill" class="h-full w-full" />
            <view class="absolute bottom-0 right-0 rounded-tl-md bg-white p-[2px]">
              <wd-icon name="edit" size="12px" color="#333" />
            </view>
          </view>

          <!-- 商品信息 -->
          <view class="flex flex-1 flex-col self-stretch justify-between">
            <text class="line-clamp-1 text-[15px] text-[#333] font-bold">{{ item.name }}</text>
            <view class="mt-1 flex items-end justify-between">
              <text class="text-[18px] text-[#333] font-bold">¥ {{ item.price }}</text>

              <!-- 数量控制器 -->
              <view class="flex items-center">
                <button
                  class="m-0 h-7 w-7 flex items-center justify-center border border-gray-300 rounded-full bg-white p-0 text-[16px] text-[#8b6e51] font-bold leading-none after:border-none"
                  @click.stop="decreaseQuantity(item)"
                >
                  -
                </button>
                <view class="mx-1 h-7 flex items-center justify-center px-2 text-[14px] font-medium">
                  {{ item.quantity }}
                </view>
                <button
                  class="m-0 h-7 w-7 flex items-center justify-center border border-gray-300 rounded-full bg-[#8b6e51] p-0 text-white leading-none after:border-none"
                  @click.stop="increaseQuantity(item)"
                >
                  +
                </button>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 底部购物车按钮 -->
    <view class="cart-button bg-dark">
      <view class="flex flex-1 items-center px-4" @click="toggleCartPanel">
        <!-- 购物车图标和数量徽章 -->
        <view class="relative mr-4 shrink-0">
          <view class="h-10 w-10 flex items-center justify-center rounded-[20px]">
            <wd-icon name="shop" size="32px" color="#fff" />
          </view>
          <view class="absolute min-w-[18px] flex items-center justify-center border-2 border-[#2a2a2a] rounded-full bg-[#ff4d4f] px-1 py-[1px] text-[10px] text-white -right-1 -top-1">
            {{ totalQuantity }}
          </view>
        </view>

        <!-- 总价 -->
        <view class="flex items-baseline text-white">
          <text class="text-[14px] font-bold">¥</text>
          <text class="ml-0.5 text-2xl font-bold">{{ totalPrice }}</text>
        </view>
      </view>

      <!-- 结算按钮 -->
      <view
        class="h-full w-28 flex items-center justify-center bg-[#8b6e51] text-[16px] text-white font-bold transition-opacity active:opacity-90"
        @click="handleCheckout"
      >
        去结算
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
