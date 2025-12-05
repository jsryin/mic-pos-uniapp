<script setup lang="ts">
import { computed, ref } from 'vue'

// --- Props & Emits ---
interface Props {
  visible: boolean
  productName?: string
  productImage?: string
  description?: string
  calories?: number
  lowGi?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  productName: '伯牙绝弦',
  productImage: 'https://img.zcool.cn/community/01f05e5d95689da801211d53386638.jpg@1280w_1l_2o_100sh.jpg',
  description: '经典风味，茶香如故',
  calories: 130,
  lowGi: true,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'close': []
  'confirm': [spec: { base: string, temp: string, sugar: string }]
}>()

// --- 类型定义 ---
interface OptionItem {
  id: string
  label: string
}

// --- 数据状态 ---
const drinkName = computed(() => props.productName)
const description = computed(() => props.description)

// 选项数据
const baseOptions: OptionItem[] = [{ id: 'tea', label: '茶香款' }]
const tempOptions: OptionItem[] = [
  { id: 'standard_ice', label: '标准冰' },
  { id: 'less_ice', label: '少冰' },
  { id: 'no_ice', label: '去冰' },
  { id: 'hot', label: '热' },
]
const sugarOptions: OptionItem[] = [
  { id: 'standard_sugar', label: '标准糖' },
  { id: 'half_sugar', label: '少糖' },
  { id: 'micro_sugar', label: '微糖' },
  { id: 'no_sugar', label: '不另外加糖' },
]

// 选中状态 (默认选中截图中的状态)
const selectedBase = ref<string>('tea')
const selectedTemp = ref<string>('') // 截图中温度似乎未高亮，故留空，实际开发可设默认值
const selectedSugar = ref<string>('standard_sugar')

// --- 计算属性 ---
const summaryText = computed(() => {
  const parts = []
  const base = baseOptions.find(o => o.id === selectedBase.value)
  const sugar = sugarOptions.find(o => o.id === selectedSugar.value)
  const temp = tempOptions.find(o => o.id === selectedTemp.value)

  if (base)
    parts.push(base.label)
  if (temp)
    parts.push(temp.label)
  if (sugar)
    parts.push(sugar.label)

  return parts.join(',')
})

// --- 方法 ---
function handleReset() {
  selectedBase.value = 'tea'
  selectedTemp.value = ''
  selectedSugar.value = 'standard_sugar'
}

function handleClose() {
  emit('update:visible', false)
  emit('close')
}

function handleSubmit() {
  const spec = {
    base: selectedBase.value,
    temp: selectedTemp.value,
    sugar: selectedSugar.value,
  }
  emit('confirm', spec)
  handleClose()
}

// 点击背景关闭
function handleBgClick() {
  handleClose()
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-end justify-center bg-black/50" @click="handleBgClick">
    <div class="animate-slide-up max-h-[85vh] w-full flex flex-col rounded-t-3xl bg-white font-sans" @click.stop>
      <div class="flex-1 overflow-y-auto pb-4">
        <div class="relative h-64 w-full overflow-hidden bg-[#C8D3C5]">
          <image
            :src="productImage"
            mode="aspectFill"
            class="h-full w-full object-cover"
          />

          <!-- 关闭按钮 -->
          <div class="absolute right-4 top-4 z-20 h-10 max-h-[40px] max-w-[40px] min-h-[40px] min-w-[40px] w-10 flex items-center justify-center overflow-hidden rounded-full bg-[#a0a99e]/50 backdrop-blur-sm" @click="handleClose">
            <div class="i-carbon-close flex-shrink-0 text-xl text-white" />
          </div>

          <div v-if="lowGi" class="absolute left-4 top-4 z-10 flex flex-col items-center rounded-b-lg bg-[#7CB342] px-2 pb-2 pt-1 text-xs text-white font-bold leading-tight shadow-sm">
            <span>低GI</span>
            <span class="text-lg">14</span>
          </div>

          <div v-if="calories" class="absolute bottom-4 right-4 h-16 w-16 flex flex-col items-center justify-center border-2 border-white/80 rounded-full text-white backdrop-blur-[2px]">
            <span class="text-xl font-bold leading-none">{{ calories }}</span>
            <span class="text-[10px] opacity-90">kcal</span>
          </div>
        </div>

        <div class="px-5 pt-6">
          <h1 class="mb-6 text-[15px] text-gray-900 font-bold">
            {{ drinkName }}
          </h1>

          <div class="mb-6">
            <div class="mb-3 text-sm text-gray-500">
              茶底
            </div>
            <div class="w-full flex flex-wrap gap-3">
              <div
                v-for="item in baseOptions"
                :key="item.id"
                class="inline-block cursor-pointer select-none rounded-[4px] px-6 py-2 text-sm transition-colors duration-200"
                :class="selectedBase === item.id ? 'bg-[#B2946A] text-white font-medium' : 'bg-[#F6F6F6] text-gray-700'"
                @click="selectedBase = item.id"
              >
                {{ item.label }}
              </div>
            </div>

            <div v-if="selectedBase === 'tea'" class="relative mt-3">
              <div class="absolute left-6 h-3 w-3 rotate-45 transform rounded-tl-[2px] bg-[#F6F6F6] -top-[6px]" />
              <div class="w-full rounded-md bg-[#F6F6F6] px-3 py-2 text-xs text-gray-600 leading-relaxed">
                {{ description }}
              </div>
            </div>
          </div>

          <div class="mb-6">
            <div class="mb-3 text-sm text-gray-500">
              温度
            </div>
            <div class="grid grid-cols-4 gap-3">
              <button
                v-for="item in tempOptions"
                :key="item.id"
                class="flex items-center justify-center rounded-[4px] border-none py-2 text-sm outline-none transition-colors duration-200"
                :class="selectedTemp === item.id ? 'bg-[#B2946A] text-white font-medium' : 'bg-[#F6F6F6] text-gray-700'"
                @click="selectedTemp = item.id"
              >
                {{ item.label }}
              </button>
            </div>
          </div>

          <div class="mb-6">
            <div class="mb-3 text-sm text-gray-500">
              甜度
            </div>
            <div class="grid grid-cols-4 gap-3">
              <button
                v-for="item in sugarOptions"
                :key="item.id"
                class="flex items-center justify-center whitespace-nowrap rounded-[4px] border-none py-2 text-sm outline-none transition-colors duration-200"
                :class="selectedSugar === item.id ? 'bg-[#B2946A] text-white font-medium' : 'bg-[#F6F6F6] text-gray-700'"
                @click="selectedSugar = item.id"
              >
                <span :class="item.label.length > 4 ? 'text-xs transform scale-90' : ''">
                  {{ item.label }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部按钮区域 -->
      <div class="sticky bottom-0 border-t border-gray-100 bg-white px-4 pb-6 pt-3 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] pb-safe">
        <div class="mb-3 px-1 text-xs text-gray-500">
          {{ summaryText }}
        </div>

        <div class="mb-4 flex items-center justify-between gap-3">
          <button
            class="h-9 flex flex-[0.4] items-center justify-center border border-gray-200 rounded-full bg-white text-[14px] text-gray-800 active:bg-gray-50"
            @click="handleReset"
          >
            恢复默认
          </button>

          <button
            class="h-9 flex flex-1 items-center justify-center rounded-full bg-[#B2946A] text-[14px] text-white font-medium shadow-sm active:opacity-90"
            @click="handleSubmit"
          >
            选好了
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 针对 Uniapp 特有的安全区适配 */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

/* 弹窗动画 */
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* 隐藏滚动条 (可选) */
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
</style>
