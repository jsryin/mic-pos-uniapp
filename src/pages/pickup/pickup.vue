<script setup lang="ts">
import { ref } from 'vue'

// --- 类型定义 ---
interface HistoryItem { name: string, image: string }
interface HistoryOrder { id: string, storeName: string, type: '堂食' | '外带', status: string, totalPrice: number, totalCount: number, items: HistoryItem[] }
interface OrderItem { id: number, name: string, desc: string, tags: string, price: number, count: number, image: string }
interface OrderGroup { user: string, avatar: string, items: OrderItem[], subtotal: number }

// --- 页面配置 ---
definePage({
  style: {
    navigationBarTitleText: '订单',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black',
  },
})

// --- 状态管理 ---
const activeTab = ref(0) // 默认切换回 0 (今日订单) 方便查看修正

// --- 模拟数据 ---

// 1. 历史订单数据列表
const historyList = ref<HistoryOrder[]>([
  {
    id: 'h1',
    storeName: '广东深圳宝安大悦城店',
    type: '堂食',
    status: '已完成',
    totalPrice: 31,
    totalCount: 2,
    items: [
      { name: '伯牙绝弦', image: 'https://via.placeholder.com/150x150/35495e/ffffff?text=Tea1' },
      { name: '青青糯山', image: 'https://via.placeholder.com/150x150/9CA3AF/ffffff?text=Tea2' },
    ],
  },
  {
    id: 'h2',
    storeName: '深圳南山科技园店',
    type: '外带',
    status: '已完成',
    totalPrice: 18,
    totalCount: 1,
    items: [
      { name: '寻香山茶', image: 'https://via.placeholder.com/150x150/BFA582/ffffff?text=Tea3' },
    ],
  },
  {
    id: 'h3',
    storeName: '广州天河城店',
    type: '堂食',
    status: '已取消',
    totalPrice: 45,
    totalCount: 3,
    items: [
      { name: '白雾红尘', image: 'https://via.placeholder.com/150x150/555555/ffffff?text=Tea4' },
      { name: '伯牙绝弦', image: 'https://via.placeholder.com/150x150/35495e/ffffff?text=Tea1' },
      { name: '青青糯山', image: 'https://via.placeholder.com/150x150/9CA3AF/ffffff?text=Tea2' },
    ],
  },
])

// 2. 今日订单数据
const todayGroups = ref<OrderGroup[]>([
  {
    user: '（我）A1',
    avatar: 'https://api.iconify.design/carbon:user-avatar-filled.svg?color=%23888888',
    subtotal: 15,
    items: [
      {
        id: 1,
        name: '青青糯山',
        desc: '热量≈215kcal/杯',
        tags: '中杯.少冰.少糖',
        price: 15,
        count: 1,
        image: 'https://via.placeholder.com/150x150/35495e/ffffff?text=Tea',
      },
    ],
  },
  {
    user: 'A0',
    avatar: 'https://api.iconify.design/carbon:user-avatar-filled.svg?color=%23888888',
    subtotal: 16,
    items: [
      {
        id: 2,
        name: '伯牙绝弦',
        desc: '热量≈220kcal/杯',
        tags: '中杯.花香款.标准冰.标准糖',
        price: 16,
        count: 1,
        image: 'https://via.placeholder.com/150x150/9CA3AF/ffffff?text=Tea',
      },
    ],
  },
])

// --- 方法 ---
function copyOrderNo() {
  uni.setClipboardData({ data: 'D90084682618023985152', success: () => uni.showToast({ title: '复制成功', icon: 'none' }) })
}
</script>

<template>
  <view class="min-h-screen bg-[#F5F6F7] text-[#333] font-sans">
    <view class="sticky top-0 z-50 bg-[#F5F6F7] px-4 pb-2 pt-2">
      <view class="flex items-center justify-center text-sm space-x-8">
        <view
          class="relative py-3 font-medium transition-all"
          :class="activeTab === 0 ? 'text-[#BFA582] font-bold' : 'text-gray-500'"
          @click="activeTab = 0"
        >
          今日订单
          <view v-if="activeTab === 0" class="absolute bottom-1 left-1/2 h-[3px] w-6 rounded-full bg-[#BFA582] -translate-x-1/2" />
        </view>
        <view
          class="relative py-3 font-medium transition-all"
          :class="activeTab === 1 ? 'text-[#BFA582] font-bold' : 'text-gray-500'"
          @click="activeTab = 1"
        >
          历史订单
          <view v-if="activeTab === 1" class="absolute bottom-1 left-1/2 h-[3px] w-6 rounded-full bg-[#BFA582] -translate-x-1/2" />
        </view>
      </view>
    </view>

    <view class="px-3 pb-10">
      <template v-if="activeTab === 0">
        <view class="mb-3 rounded-2xl bg-white p-6 text-center shadow-sm">
          <view class="text-lg font-bold">
            制作中
          </view>
          <view class="my-2 text-5xl font-bold tracking-wider font-mono">
            T0314
          </view>
          <view class="text-xs text-gray-500">
            取单号
          </view>
          <view class="mt-2 text-xs text-gray-400">
            本店为自取餐厅，请留意叫号屏
          </view>
          <view class="grid grid-cols-3 mt-5 gap-3">
            <button class="btn-action">
              取消订单
            </button>
            <button class="btn-action">
              微信群收款
            </button>
            <button class="btn-action">
              分享账单
            </button>
          </view>
        </view>

        <view class="mb-3 rounded-2xl bg-white px-4 py-6 shadow-sm">
          <view class="relative flex items-center justify-between px-8">
            <view class="absolute left-10 right-10 top-4 h-[1px] border-t border-gray-300 border-dashed -z-1" />
            <view class="flex flex-col items-center gap-1 bg-white px-2">
              <view class="i-carbon-document text-2xl text-gray-300" />
              <text class="text-xs text-gray-400">已下单</text>
            </view>
            <view class="flex flex-col items-center gap-1 bg-white px-2">
              <view class="h-8 w-8 flex items-center justify-center rounded-full bg-[#FAF5E6]">
                <view class="i-carbon-restaurant text-xl text-[#BFA582]" />
              </view>
              <text class="text-xs text-[#BFA582] font-bold">制作中</text>
            </view>
            <view class="flex flex-col items-center gap-1 bg-white px-2">
              <view class="i-carbon-shopping-bag text-2xl text-gray-300" />
              <text class="text-xs text-gray-400">请取餐</text>
            </view>
          </view>
          <view class="mt-4 text-center text-xs text-gray-600 font-medium">
            前方<text class="mx-1 text-base text-green-600 font-bold">5</text>杯制作中
          </view>
        </view>

        <view class="mb-0 flex items-center rounded-t-xl bg-[#FFFBF0] px-4 py-3 text-xs text-[#E6A23C]">
          <view class="i-carbon-information mr-1" />
          请按编号【A1】取餐
        </view>

        <view class="mb-3 rounded-b-2xl bg-white p-4 shadow-sm">
          <view class="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
            <text class="text-sm font-bold">广东深圳宝安大悦城店</text>
            <view class="flex gap-3 text-gray-600">
              <view class="i-carbon-phone text-lg" />
              <view class="i-carbon-location text-lg" />
            </view>
          </view>
          <view v-for="(group, idx) in todayGroups" :key="idx" class="mb-4">
            <view v-if="idx === 0" class="mb-3 text-xs text-gray-500">
              我的点单
            </view>
            <view v-else class="mb-3 text-xs text-gray-500">
              好友点单
            </view>

            <view class="mb-2 flex items-center gap-2">
              <image :src="group.avatar" class="h-5 w-5 rounded-full bg-gray-200" />
              <text class="text-sm font-medium">{{ group.user }}</text>
            </view>
            <view v-for="item in group.items" :key="item.id" class="mb-4 flex gap-3">
              <image :src="item.image" mode="aspectFill" class="h-16 w-16 shrink-0 rounded bg-gray-100" />
              <view class="flex flex-1 flex-col justify-between py-1">
                <view class="flex justify-between">
                  <text class="text-gray-800 font-bold">{{ item.name }}</text>
                  <text class="font-bold">¥ {{ item.price }}</text>
                </view>
                <view class="text-[10px] text-[#BFA582]">
                  {{ item.desc }}
                </view>
                <view class="flex justify-between text-[10px] text-gray-400">
                  <text>{{ item.tags }}</text>
                  <text>x{{ item.count }}</text>
                </view>
              </view>
            </view>
          </view>
          <view class="flex justify-end pt-2 text-sm">
            共 ¥ <text class="ml-1 text-lg font-medium">31</text>
          </view>
        </view>

        <view class="mb-3 rounded-2xl bg-white p-4 shadow-sm">
          <view class="mb-3 text-sm font-bold">
            用餐信息
          </view>
          <view class="mb-2 flex justify-between text-xs">
            <text class="text-gray-500">用餐方式</text>
            <text class="font-medium">堂食</text>
          </view>
          <view class="flex justify-between text-xs">
            <text class="text-gray-500">取餐时间</text>
            <text class="font-medium">立即取餐</text>
          </view>
        </view>

        <view class="mb-8 rounded-2xl bg-white p-4 shadow-sm">
          <view class="mb-3 text-sm font-bold">
            订单信息
          </view>

          <view class="mb-2 flex justify-between text-xs">
            <text class="text-gray-500">订单编号</text>
            <view class="flex items-center gap-2">
              <text class="text-gray-800 font-mono">D90084682618023985152</text>
              <text class="border rounded px-1 text-[10px] text-gray-500" @click="copyOrderNo">复制</text>
            </view>
          </view>

          <view class="mb-2 flex justify-between text-xs">
            <text class="text-gray-500">下单时间</text>
            <text class="text-gray-800 font-mono">2025-11-22 15:02:47</text>
          </view>

          <view class="mb-2 flex justify-between text-xs">
            <text class="text-gray-500">支付方式</text>
            <text class="text-gray-800">微信支付</text>
          </view>

          <view class="flex justify-between text-xs">
            <text class="text-gray-500">备注信息</text>
            <text class="text-gray-800">无</text>
          </view>
        </view>

        <view class="pb-6 text-center text-xs text-gray-400">
          如有疑问，请<text class="underline">联系店员或致电门店</text>
        </view>
      </template>

      <template v-if="activeTab === 1">
        <view v-for="order in historyList" :key="order.id" class="mb-3 rounded-xl bg-white p-4 shadow-sm">
          <view class="mb-4 flex items-center justify-between">
            <view class="flex items-center gap-2 overflow-hidden">
              <view class="flex shrink-0 items-center justify-center border border-[#C6AFA0] rounded px-1 py-[1px] text-[10px] text-[#A68F80]">
                {{ order.type }}
              </view>
              <text class="truncate text-sm text-gray-800 font-bold">{{ order.storeName }}</text>
              <view class="i-carbon-chevron-right text-gray-400" />
            </view>
            <text class="shrink-0 text-sm text-[#A68F80] font-medium">{{ order.status }}</text>
          </view>

          <view class="mb-4 flex items-start justify-between">
            <view class="flex flex-1 gap-3 overflow-hidden pr-2">
              <view v-for="(item, i) in order.items" :key="i" class="flex flex-col items-center gap-1">
                <image :src="item.image" mode="aspectFill" class="h-14 w-14 rounded-md bg-gray-100" />
                <text class="w-14 truncate text-center text-[10px] text-gray-500">{{ item.name }}</text>
              </view>
            </view>

            <view class="flex shrink-0 flex-col items-end justify-center pt-2">
              <text class="text-lg text-gray-900 font-bold">¥ {{ order.totalPrice }}</text>
              <text class="text-xs text-gray-400">共{{ order.totalCount }}件</text>
            </view>
          </view>

          <view class="flex justify-end gap-2">
            <button class="btn-history">
              微信群收款
            </button>
            <button class="btn-history">
              分享账单
            </button>
            <button class="btn-history">
              申请开票
            </button>
          </view>
        </view>

        <view class="mt-6 pb-6 text-center text-xs text-gray-400">
          到底了，仅展示近一年订单
        </view>
      </template>
    </view>
  </view>
</template>

<style scoped>
/* 通用按钮样式复用 */
.btn-action {
  @apply flex items-center justify-center rounded border border-gray-200 bg-white py-2 text-xs text-gray-600;
}
.btn-action::after {
  border: none;
}

/* 历史订单按钮样式 */
.btn-history {
  @apply m-0 flex items-center justify-center rounded border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs text-gray-700;
  line-height: 1.5;
}
.btn-history::after {
  border: none;
}

/* 隐藏横向滚动条 (针对历史订单图片列表) */
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
</style>
