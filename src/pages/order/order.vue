<script lang="ts" setup>
import type { CartItem } from './components/ShoppingCart.vue'
import type { Category, ProductGroup } from '@/api/product'
import { onMounted, ref } from 'vue'
import { getCategories, getProductGroups } from '@/api/product'
import { ORDER_PAGE } from '@/router/config'
// 去结算不需要登录，已移除登录相关导入
import CategorySidebar from './components/CategorySidebar.vue'
import OrderHeader from './components/OrderHeader.vue'
import ProductList from './components/ProductList.vue'
import ProductSpecSelector from './components/ProductSpecSelector.vue'
import ShoppingCart from './components/ShoppingCart.vue'
import '@/pages/order/styles/order.scss'

definePage({
  style: {
    navigationBarTitleText: '%pages.order%',
    navigationStyle: 'custom',
    disableScroll: true, // 禁用页面默认滚动
  },
})

// 购物车状态
const cartItems = ref<CartItem[]>([])
const isCartExpanded = ref(false) // 控制展开状态

const tags = ['指定商品特价39.9元起', '2大杯减5元', '3大杯减8元', '4大杯减12元']
const currentCateId = ref(2)
const scrollIntoViewId = ref('')
const leftScrollIntoViewId = ref('')
const lastScrolledCategoryId = ref<number | null>(null) // 跟踪上次滚动的分类ID
const loading = ref(false)
const categories = ref<Category[]>([])
const productGroups = ref<ProductGroup[]>([])

// 规格选择相关状态
const showSpecSelector = ref(false)
const currentProduct = ref<any>(null)

// 是否正在通过点击改变滚动位置，避免循环触发
const isClickScrolling = ref(false)

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
  // 初始化跟踪的分类ID
  lastScrolledCategoryId.value = currentCateId.value
})

// --- Logic: Main Page ---

// 处理左侧分类点击
function handleCategoryClick(id: number) {
  // 防止点击同一个分类时重复触发
  if (currentCateId.value === id) {
    return
  }

  // 标记正在点击滚动，避免滚动监听干扰
  isClickScrolling.value = true
  currentCateId.value = id
  lastScrolledCategoryId.value = id // 更新跟踪的分类ID

  // 设置目标位置为分类空白行，这样第一个商品会自然显示在粘性标题下方
  // 这样避免了复杂的滚动计算，简单有效
  scrollIntoViewId.value = `category-head-${id}`

  // 滚动完成后重置状态
  setTimeout(() => {
    scrollIntoViewId.value = ''
    isClickScrolling.value = false
  }, 800)
}

// 防抖函数
function debounce(func: (...args: any[]) => void, delay: number) {
  let timeoutId: any
  return function (...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// 获取当前可见的分类（简化版本）
function getCurrentVisibleCategory() {
  const query = uni.createSelectorQuery()

  // 查询所有分类标题的位置
  categories.value.forEach((category) => {
    query.select(`#category-${category.id}`).boundingClientRect()
  })

  // 查询滚动容器的位置
  query.select('.scroll-content').boundingClientRect()

  query.exec((res: any[]) => {
    if (!res || res.length < categories.value.length + 1)
      return

    const containerRect = res[res.length - 1] // 最后一个结果是容器
    if (!containerRect)
      return

    // 找到第一个在视口中可见的分类标题
    let currentVisibleCategoryId = null
    const viewportTop = 50 // 视口顶部50px范围内
    let hasVisibleCategory = false

    for (let i = 0; i < categories.value.length; i++) {
      const categoryRect = res[i]
      if (!categoryRect)
        continue

      const category = categories.value[i]

      // 检查分类标题是否在视口顶部附近（考虑容器的相对位置）
      const relativeTop = categoryRect.top - containerRect.top

      // 如果分类标题在视口顶部附近
      if (relativeTop >= -20 && relativeTop <= viewportTop) {
        currentVisibleCategoryId = category.id
        hasVisibleCategory = true
        break
      }
    }

    // 如果没有找到合适的分类（比如在顶部横幅区域），选择第一个分类
    if (!hasVisibleCategory && categories.value.length > 0) {
      currentVisibleCategoryId = categories.value[0].id
    }

    // 更新当前分类
    if (currentVisibleCategoryId !== currentCateId.value) {
      currentCateId.value = currentVisibleCategoryId

      // 只有当分类真正变化且不是同一个分类时才滚动左侧
      if (!isClickScrolling.value && currentVisibleCategoryId !== lastScrolledCategoryId.value) {
        leftScrollIntoViewId.value = `left-category-${currentVisibleCategoryId}`
        lastScrolledCategoryId.value = currentVisibleCategoryId

        // 滚动完成后重置
        setTimeout(() => {
          leftScrollIntoViewId.value = ''
        }, 300)
      }
    }
  })
}

// 使用防抖的滚动监听
const handleRightScroll = debounce(() => {
  // 如果正在点击滚动，不触发滚动监听，避免循环
  if (isClickScrolling.value) {
    return
  }

  if (!categories.value.length || !productGroups.value.length) {
    return
  }

  getCurrentVisibleCategory()
}, 150) // 150ms 防抖

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

// 选择规格
function handleSelectSpec(product: any) {
  currentProduct.value = product
  showSpecSelector.value = true
}

// 规格选择确认
function handleSpecConfirm(spec: { base: string, temp: string, sugar: string }) {
  // 构建带规格的商品信息
  const specText = `${spec.base},${spec.temp},${spec.sugar}`
  const productName = `${currentProduct.value.title}(${specText})`

  // 添加到购物车
  const existingItem = cartItems.value.find(item =>
    item.id === currentProduct.value.id && item.desc === specText,
  )

  if (existingItem) {
    existingItem.quantity++
  }
  else {
    cartItems.value.push({
      id: currentProduct.value.id,
      name: productName,
      price: Number(currentProduct.value.price),
      quantity: 1,
      image: currentProduct.value.image,
      selected: true,
      desc: specText,
    })
  }

  uni.showToast({
    title: '已加入购物袋',
    icon: 'none',
    duration: 1500,
  })

  // 关闭弹窗
  showSpecSelector.value = false
  currentProduct.value = null
}

// 规格选择关闭
function handleSpecClose() {
  showSpecSelector.value = false
  currentProduct.value = null
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
  const newState = cartItems.value.length > 0 && cartItems.value.every(item => item.selected)
  cartItems.value.forEach(item => item.selected = !newState)
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

// 去结算（不需要登录）
function handleCheckout() {
  const totalQuantity = cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.value
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (totalQuantity === 0) {
    uni.showToast({ title: '购物车为空', icon: 'none' })
    return
  }

  // 跳转到结算页面
  uni.navigateTo({
    url: ORDER_PAGE,
  })
}
</script>

<template>
  <view class="order-page text-[#333] font-sans">
    <!-- 头部区域 -->
    <OrderHeader :tags="tags" />

    <!-- 内容区域，占据头部外的剩余空间 -->
    <view class="content-area">
      <!-- 左侧分类 -->
      <CategorySidebar
        :categories="categories"
        :current-cate-id="currentCateId"
        :left-scroll-into-view-id="leftScrollIntoViewId"
        @category-click="handleCategoryClick"
      />

      <!-- 右侧商品列表 -->
      <ProductList
        :product-groups="productGroups"
        :scroll-into-view-id="scrollIntoViewId"
        @scroll="handleRightScroll"
        @add-to-cart="handleAddToCart"
        @select-spec="handleSelectSpec"
      />
    </view>

    <!-- 购物车组件 -->
    <ShoppingCart
      :cart-items="cartItems"
      :is-cart-expanded="isCartExpanded"
      @toggle-cart="toggleCartPanel"
      @increase-quantity="increaseQuantity"
      @decrease-quantity="decreaseQuantity"
      @toggle-item-select="toggleItemSelect"
      @toggle-select-all="toggleSelectAll"
      @clear-cart="clearCart"
      @order="handleCheckout"
    />

    <!-- 规格选择弹窗 -->
    <ProductSpecSelector
      v-if="currentProduct"
      v-model:visible="showSpecSelector"
      :product-name="currentProduct.title"
      :product-image="currentProduct.image"
      :description="currentProduct.desc"
      :calories="currentProduct.calories"
      :low-gi="currentProduct.lowGI"
      @close="handleSpecClose"
      @confirm="handleSpecConfirm"
    />

    <!-- 登录弹窗已移除，结算不需要登录 -->
  </view>
</template>

<style lang="scss" scoped>
</style>
