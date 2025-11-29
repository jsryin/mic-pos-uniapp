<script lang="ts" setup>
import type { Category, ProductGroup } from '@/api/product'
import { computed, onMounted, ref } from 'vue'
import { getCategories, getProductGroups } from '@/api/product'
import { useLoginPopup, withLoginCheck } from '@/hooks/useLoginPopup'
import { useTokenStore } from '@/store/token'
import '@/pages/order/styles/order.scss'

definePage({
  style: {
    navigationBarTitleText: '%pages.order%',
    navigationStyle: 'custom',
  },
})

// --- Interfaces & Mock Data for Cart ---
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  selected: boolean
  desc?: string
}

// 购物车状态
const cartItems = ref<CartItem[]>([])
const isCartExpanded = ref(false) // 控制展开状态

const tokenStore = useTokenStore()
const { showLoginPopup, showLogin } = useLoginPopup()

const tags = ['指定商品特价39.9元起', '2大杯减5元', '3大杯减8元', '4大杯减12元']
const currentCateId = ref(2)
const scrollTop = ref(0)
const loading = ref(false)
const categories = ref<Category[]>([])
const productGroups = ref<ProductGroup[]>([])

// --- Computed Properties for Cart ---

// 购物车总数量
const totalQuantity = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

// 购物车选中总价
const totalPrice = computed(() => {
  return cartItems.value
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
})

// 是否全选
const isAllSelected = computed(() => {
  return cartItems.value.length > 0 && cartItems.value.every(item => item.selected)
})

// --- API Loading ---
async function loadCategories() {
  try {
    loading.value = true
    categories.value = await getCategories()
  }
  catch (error) {
    console.error('加载分类数据失败:', error)
  }
  finally {
    loading.value = false
  }
}

async function loadProducts() {
  try {
    loading.value = true
    productGroups.value = await getProductGroups()
  }
  catch (error) {
    console.error('加载商品数据失败:', error)
  }
  finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadCategories(), loadProducts()])
})

// --- Logic: Main Page ---

function handleCategoryClick(id: number) {
  currentCateId.value = id
  scrollTop.value = scrollTop.value === 0 ? 1 : 0
}

// 添加到购物车 (主页面列表点击)
function handleAddToCart(product: any) {
  const existingItem = cartItems.value.find(item => item.id === product.id)

  if (existingItem) {
    existingItem.quantity++
  }
  else {
    cartItems.value.push({
      id: product.id,
      name: product.title,
      price: Number(product.price),
      quantity: 1,
      image: product.image,
      selected: true,
      desc: product.desc,
    })
  }

  uni.showToast({
    title: '已加入购物袋',
    icon: 'none',
    duration: 1500,
  })
}

// --- Logic: Cart Panel ---

// 切换面板展开/折叠
function toggleCartPanel() {
  if (cartItems.value.length === 0)
    return
  isCartExpanded.value = !isCartExpanded.value
}

// 增加数量
function increaseQuantity(item: CartItem) {
  item.quantity++
}

// 减少数量
function decreaseQuantity(item: CartItem) {
  if (item.quantity > 1) {
    item.quantity--
  }
  else {
    uni.showModal({
      title: '提示',
      content: '确定要移除该商品吗？',
      success: (res) => {
        if (res.confirm) {
          cartItems.value = cartItems.value.filter(i => i.id !== item.id)
          if (cartItems.value.length === 0)
            isCartExpanded.value = false
        }
      },
    })
  }
}

// 切换单选
function toggleItemSelect(item: CartItem) {
  item.selected = !item.selected
}

// 全选/反选
function toggleSelectAll() {
  const newState = !isAllSelected.value
  cartItems.value.forEach(item => item.selected = newState)
}

// 清空购物车
function clearCart() {
  uni.showModal({
    title: '提示',
    content: '确定要清空购物车吗？',
    success: (res) => {
      if (res.confirm) {
        cartItems.value = []
        isCartExpanded.value = false
      }
    },
  })
}

// 去结算
const handleCheckout = withLoginCheck(() => {
  if (totalQuantity.value === 0) {
    uni.showToast({ title: '购物车为空', icon: 'none' })
    return
  }
  console.log('结算金额:', totalPrice.value)
  uni.showToast({ title: '准备结算', icon: 'success' })
})
</script>

<template>
  <view class="box-border h-screen flex flex-col overflow-hidden bg-[#f6f6f6] text-[#333] font-sans">
    <view class="pt-status-bar relative z-10 bg-white pb-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
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

      <view class="mt-2 flex justify-between px-4">
        <view class="flex-1 pr-4">
          <view class="mb-1 flex items-center text-[17px] text-black font-bold">
            <wd-icon name="star-filled" size="16px" color="#999" custom-class="mr-1" />
            <text class="max-w-[220px] truncate">广东深圳南山茂业百货店</text>
            <wd-icon name="arrow-right" size="14px" color="#999" custom-class="ml-1" />
          </view>
          <view class="flex items-center gap-2 text-[11px]">
            <view class="flex items-center text-gray-500">
              <wd-icon name="location" size="10px" custom-class="mr-0.5" />
              距您569m
            </view>
          </view>
        </view>
      </view>

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

    <view class="relative flex flex-1 overflow-hidden" :class="totalQuantity > 0 ? 'pb-24' : 'pb-16'">
      <scroll-view scroll-y class="h-full w-[90px] bg-[#f6f6f6]" :enhanced="true" :show-scrollbar="false">
        <view class="pb-24">
          <view
            v-for="item in categories"
            :key="item.id"
            class="relative flex flex-col items-center justify-center px-2 py-5 transition-all duration-200"
            :class="currentCateId === item.id ? 'bg-white' : 'bg-[#f6f6f6]'"
            @click="handleCategoryClick(item.id)"
          >
            <view v-if="currentCateId === item.id" class="absolute left-0 top-1/2 h-[18px] w-[3px] rounded-r-full bg-[#333] -translate-y-1/2" />
            <view v-if="item.badge" class="absolute right-1 top-1 z-10 origin-center scale-75 rounded-[2px] bg-[#ff4d4f] px-[3px] py-[1px] text-[8px] text-white shadow-sm">
              {{ item.badge }}
            </view>
            <view class="mb-1.5 transition-transform duration-200" :class="currentCateId === item.id ? 'scale-110' : 'opacity-50 grayscale'">
              <wd-icon :name="item.icon" size="24px" :color="currentCateId === item.id ? '#333' : '#666'" />
            </view>
            <text class="text-center text-[11px] leading-tight" :class="currentCateId === item.id ? 'font-bold text-black' : 'text-gray-500'">{{ item.name }}</text>
          </view>
        </view>
      </scroll-view>

      <scroll-view scroll-y class="h-full flex-1 bg-white px-3" :scroll-top="scrollTop" :scroll-with-animation="true">
        <view class="pb-32 pt-3">
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

          <view v-for="group in productGroups" :key="group.id" class="mb-8">
            <view class="sticky top-0 z-10 mb-3 bg-white py-1 text-[13px] text-gray-800 font-bold">
              {{ group.name }}
            </view>
            <view v-for="item in group.items" :key="item.id" class="mb-6 flex">
              <view class="relative h-[96px] w-[96px] shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <image :src="item.image" class="h-full w-full object-cover" mode="aspectFill" />
              </view>
              <view class="ml-3 flex flex-1 flex-col justify-between py-0.5">
                <view>
                  <text class="line-clamp-2 mb-1 text-[15px] text-[#222] font-bold leading-snug">{{ item.title }}</text>
                  <text class="line-clamp-2 text-[11px] text-gray-400 leading-relaxed">{{ item.desc }}</text>
                </view>
                <view class="mt-2 flex items-end justify-between">
                  <view class="flex items-baseline text-[#222]">
                    <text class="mr-[1px] text-[11px] font-bold">¥</text>
                    <text class="text-[17px] font-bold font-sans">{{ item.price }}</text>
                    <text class="ml-0.5 text-[11px] text-gray-400 font-normal">起</text>
                  </view>
                  <view
                    class="h-[26px] w-[26px] flex items-center justify-center rounded-full bg-[#BA9257] shadow-md transition-transform active:scale-95"
                    @click="handleAddToCart(item)"
                  >
                    <wd-icon name="add" size="18px" color="white" />
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view
      v-if="isCartExpanded"
      class="cart-overlay"
      @click="isCartExpanded = false"
    />

    <view
      v-if="cartItems.length > 0"
      class="cart-container"
      :class="isCartExpanded ? 'bg-white' : 'bg-transparent'"
    >
      <view
        v-if="isCartExpanded"
        class="cart-panel animate-slide-in-up"
      >
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

        <scroll-view scroll-y class="max-h-[50vh] min-h-[100px] w-full bg-white px-4 py-2">
          <view
            v-for="item in cartItems"
            :key="item.id"
            class="mb-3 flex items-center py-2 pr-4"
          >
            <view class="mr-3 shrink-0" @click="toggleItemSelect(item)">
              <wd-icon
                name="check-circle-filled"
                size="20px"
                :color="item.selected ? '#8b6e51' : '#ccc'"
              />
            </view>

            <view class="relative mr-3 h-14 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
              <image :src="item.image" mode="aspectFill" class="h-full w-full" />
              <view class="absolute bottom-0 right-0 rounded-tl-md bg-white p-[2px]">
                <wd-icon name="edit" size="12px" color="#333" />
              </view>
            </view>

            <view class="flex flex-1 flex-col self-stretch justify-between">
              <text class="line-clamp-1 text-[15px] text-[#333] font-bold">{{ item.name }}</text>
              <view class="mt-1 flex items-end justify-between">
                <text class="text-[18px] text-[#333] font-bold">¥ {{ item.price }}</text>

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

      <view
        class="cart-button"
        :class="isCartExpanded ? 'bg-white' : 'bg-dark'"
      >
        <view class="flex flex-1 items-center px-4" @click="toggleCartPanel">
          <view class="relative mr-4 shrink-0">
            <view class="h-10 w-10 flex items-center justify-center rounded-[20px]">
              <wd-icon name="shop" size="32px" :color="isCartExpanded ? '#333' : '#fff'" />
            </view>
            <view class="absolute min-w-[18px] flex items-center justify-center border-2 rounded-full bg-[#ff4d4f] px-1 py-[1px] text-[10px] text-white -right-1 -top-1" :class="isCartExpanded ? 'border-gray-200' : 'border-[#2a2a2a]'">
              {{ totalQuantity }}
            </view>
          </view>

          <view class="flex items-baseline" :class="isCartExpanded ? 'text-[#333]' : 'text-white'">
            <text class="text-[14px] font-bold">¥</text>
            <text class="ml-0.5 text-2xl font-bold">{{ totalPrice }}</text>
          </view>
        </view>

        <view
          class="h-full w-24 flex items-center justify-center bg-[#8b6e51] text-[16px] text-white font-bold transition-opacity active:opacity-90"
          @click="handleCheckout"
        >
          去结算
        </view>
      </view>
    </view>

    <LoginPopup v-model="showLoginPopup" />
  </view>
</template>

<style lang="scss" scoped>
</style>
