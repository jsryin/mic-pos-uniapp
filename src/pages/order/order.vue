<script lang="ts" setup>
import { ref } from 'vue'
import { useLoginPopup, withLoginCheck } from '@/hooks/useLoginPopup'
import { useTokenStore } from '@/store/token'
import '@/pages/order/styles/order.scss'

definePage({
  style: {
    navigationBarTitleText: '%pages.order%',
    navigationStyle: 'custom',
  },
})

const tokenStore = useTokenStore()
const { showLoginPopup, showLogin } = useLoginPopup()

// --- Mock Data ---
const tags = ['指定商品特价39.9元起', '2大杯减5元', '3大杯减8元', '4大杯减12元']

// 购物车数量
const cartCount = ref(2)

// 当前选中的分类ID
const currentCateId = ref(2)

// 滚动位置
const scrollTop = ref(0)

// 接口类型定义
interface Category {
  id: number
  name: string
  icon?: string
  tag?: string
}

interface Product {
  id: number
  title: string
  desc: string
  price: number
  image: string
  badge?: string
}

interface ProductGroup {
  id: number
  name: string
  items: Product[]
}

// 分类数据
const categories = ref<Category[]>([
  { id: 1, name: '甄选套餐', icon: 'gift', badge: '' },
  { id: 2, name: '新品尝鲜', icon: 'filter', badge: 'NEW' },
  { id: 3, name: '原叶鲜奶茶', icon: 'chart-pie', badge: '' },
  { id: 4, name: '原叶特调茶', icon: 'layers', badge: '' },
  { id: 5, name: '活力轻果茶', icon: 'sugar', badge: '' },
  { id: 6, name: '低负担专区', icon: 'info-circle', badge: '0卡' },
])

// 商品数据
const productGroups = ref<ProductGroup[]>([
  {
    id: 1,
    name: '甄选套餐',
    items: [
      {
        id: 101,
        title: '【观象知时冰箱贴】单大杯随心配套餐',
        desc: '购买即得原叶鲜奶茶(大杯)*1+观象知时冰箱贴(随机款)*1，数量有限，售完即止。',
        price: 35.9,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80',
        badge: '套餐',
      },
      {
        id: 102,
        title: '【降温好茶 伴你入秋】鲜奶茶三大杯随心选套餐',
        desc: '精选三杯好茶，温暖入秋，适合办公室分享。',
        price: 48.6,
        image: 'https://images.unsplash.com/photo-1626202378538-072485e16d87?auto=format&fit=crop&w=200&q=80',
        badge: '特惠',
      },
    ],
  },
  {
    id: 2,
    name: '新品尝鲜',
    items: [
      {
        id: 201,
        title: '赤霞跃金「广东限定」',
        desc: '入口白芽奇兰清雅兰香，回韵醇厚，叠加广东新会陈皮自然甘润，形成独特风味。',
        price: 18.0,
        image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=200&q=80',
        badge: '',
      },
      {
        id: 202,
        title: '万里木兰（原叶鲜奶茶）',
        desc: '经典红茶底，搭配优质鲜牛乳，茶香浓郁。',
        price: 16.0,
        image: 'https://images.unsplash.com/photo-1571934811356-5cc55449d0a4?auto=format&fit=crop&w=200&q=80',
        badge: '热销',
      },
    ],
  },
])

// --- Logic ---
// 添加到购物车（需要登录）
const handleAddToCart = withLoginCheck(() => {
  cartCount.value++
  uni.showToast({
    title: '已添加到购物车',
    icon: 'success',
  })
})

// 去结算（需要登录）
const handleCheckout = withLoginCheck(() => {
  if (cartCount.value === 0) {
    uni.showToast({
      title: '购物车为空',
      icon: 'none',
    })
    return
  }

  uni.showToast({
    title: '正在跳转到结算页面',
    icon: 'loading',
  })
})

// 切换分类
function handleCategoryClick(id: number) {
  currentCateId.value = id
  scrollTop.value = scrollTop.value === 0 ? 1 : 0 // 简单触发滚动重置，实际需计算dom位置
  // 实际项目中这里会使用 uni.createSelectorQuery() 获取对应 id 的 offsetTop
}

// 查看订单历史（需要登录）
const viewOrderHistory = withLoginCheck(() => {
  uni.showToast({
    title: '正在加载订单历史',
    icon: 'loading',
  })
})
</script>

<template>
  <view class="box-border h-screen flex flex-col bg-[#f6f6f6] text-[#333] font-sans">
    <!-- 顶部信息区域 -->
    <view class="pt-status-bar relative z-50 bg-white pb-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <!-- 堂食/外卖切换和操作按钮 -->
      <view class="mt-2 flex items-center justify-between px-4 py-2">
        <view class="flex items-baseline gap-4">
          <view class="relative flex flex-col items-center">
            <text class="text-[18px] text-black font-bold leading-none">堂食</text>
            <view class="mt-1 h-[3px] w-5 rounded-full bg-black" />
          </view>
          <text class="text-[16px] text-gray-400 font-medium leading-none transition-colors hover:text-gray-600">外卖</text>
        </view>

        <view class="flex items-center gap-3">
          <view class="h-8 w-8 flex items-center justify-center rounded-full bg-[#f5f5f5] transition active:bg-gray-200">
            <wd-icon name="search" size="18px" color="#333" />
          </view>
          <view class="h-8 w-8 flex items-center justify-center rounded-full bg-[#f5f5f5] transition active:bg-gray-200">
            <wd-icon name="location" size="18px" color="#333" />
          </view>
          <view class="h-8 w-8 flex items-center justify-center rounded-full bg-[#f5f5f5] transition active:bg-gray-200">
            <div class="flex gap-[2px]">
              <div class="h-1 w-1 rounded-full bg-black" />
              <div class="h-1 w-1 rounded-full bg-black" />
              <div class="h-1 w-1 rounded-full bg-black" />
            </div>
          </view>
        </view>
      </view>

      <!-- 店铺信息 -->
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
            <view class="rounded-[4px] bg-[#fff5e5] px-1.5 py-[1px] text-[#d48a38] font-medium">
              前方60杯制作中
            </view>
          </view>
        </view>
        <view class="flex flex-col items-center justify-center border-l border-gray-100 pl-3">
          <wd-icon name="user-group" size="22px" color="#BA9257" />
          <text class="mt-0.5 scale-90 text-[10px] text-[#BA9257] font-bold">好友拼单</text>
        </view>
      </view>

      <!-- 优惠活动 -->
      <view class="mt-3 px-4">
        <scroll-view scroll-x class="no-scrollbar w-full whitespace-nowrap" :show-scrollbar="false">
          <view class="inline-flex gap-2 pb-1">
            <view
              v-for="(tag, idx) in tags" :key="idx"
              class="border border-[#f2dcb8] rounded-[4px] bg-[#fffbf5] px-2 py-[2px] text-[10px] text-[#d48a38]"
            >
              {{ tag }}
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 中间内容区域 -->
    <view class="relative flex flex-1 overflow-hidden">
      <!-- 左侧分类导航 -->
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

            <view v-if="item.tag" class="absolute right-1 top-1 z-10 origin-center scale-75 rounded-[2px] bg-[#ff4d4f] px-[3px] py-[1px] text-[8px] text-white shadow-sm">
              {{ item.tag }}
            </view>

            <view class="mb-1.5 transition-transform duration-200" :class="currentCateId === item.id ? 'scale-110' : 'opacity-50 grayscale'">
              <wd-icon :name="item.icon" size="24px" :color="currentCateId === item.id ? '#333' : '#666'" />
            </view>

            <text
              class="text-center text-[11px] leading-tight"
              :class="currentCateId === item.id ? 'font-bold text-black' : 'text-gray-500'"
            >
              {{ item.name }}
            </text>
          </view>
        </view>
      </scroll-view>

      <!-- 右侧商品列表 -->
      <scroll-view scroll-y class="h-full flex-1 bg-white px-3" :scroll-top="scrollTop" :scroll-with-animation="true">
        <view class="pb-32 pt-3">
          <!-- Banner广告 -->
          <view class="relative mb-6 h-[140px] overflow-hidden rounded-xl shadow-sm">
            <view class="absolute inset-0 from-[#dcebd9] via-[#c8dcc4] to-[#a9c2a4] bg-gradient-to-br" />
            <view class="absolute inset-0 flex flex-col items-start justify-center p-4">
              <text class="mb-1 text-sm text-[#3e583b] font-bold tracking-widest font-serif">CHAGEE</text>
              <text class="mb-1 text-2xl text-[#4a6847] font-bold font-serif">送您新人专属礼</text>
              <view class="mt-2 rounded bg-white/80 px-2 py-0.5 text-xs text-[#3e583b] font-bold backdrop-blur-sm">
                首单立减 3 元
              </view>
              <button class="absolute bottom-4 right-4 flex items-center rounded-full bg-[#2c2c2c] px-3 py-1.5 text-[10px] text-[#e5cba8] font-medium">
                点击入会 <wd-icon name="arrow-right" size="10px" custom-class="ml-1" />
              </button>
            </view>
          </view>

          <!-- 商品列表 -->
          <view v-for="group in productGroups" :key="group.id" class="mb-8">
            <view class="sticky top-0 z-10 mb-3 bg-white py-1 text-[13px] text-gray-800 font-bold">
              {{ group.name }}
            </view>

            <view v-for="item in group.items" :key="item.id" class="mb-6 flex">
              <view class="relative h-[96px] w-[96px] shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <image :src="item.image" class="h-full w-full object-cover" mode="aspectFill" />
                <view v-if="item.badge" class="absolute left-0 top-0 rounded-br-md bg-[#ff9900] px-1.5 py-0.5 text-[9px] text-white font-bold shadow-sm">
                  {{ item.badge }}
                </view>
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

                  <view class="h-[26px] w-[26px] flex items-center justify-center rounded-full bg-[#BA9257] shadow-md transition-transform active:scale-95" @click="handleAddToCart">
                    <wd-icon name="add" size="18px" color="white" />
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 底部操作区域 -->
    <view class="bottom-safe-operate fixed left-3 right-3 h-10 flex animate-fade-in-up items-center justify-between rounded-full bg-[rgba(30,30,30,0.92)] px-4 text-white shadow-lg backdrop-blur-md">
      <text class="text-[11px] text-gray-300">营业时间: 09:00-23:30 期待您的光临</text>
      <view class="rounded-full bg-[#d4bfa3] px-3 py-1 text-[11px] text-[#2c2c2c] font-bold">
        预约下单
      </view>
    </view>

    <!-- 全局登录弹窗 -->
    <LoginPopup
      v-model="showLoginPopup"
    />
  </view>
</template>
