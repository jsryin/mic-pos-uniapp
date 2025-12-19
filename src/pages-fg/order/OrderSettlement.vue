<script lang="ts" setup>
import { computed, ref } from 'vue'

definePage({
  style: {
    navigationBarTitleText: '确认订单',
    navigationBarBackgroundColor: '#f5f5f5',
    disableScroll: true,
  },
})

// 从上一页获取的购物车数据（实际应该从路由参数或store获取）
const cartItems = ref([
  {
    id: 1,
    name: '伯牙绝弦',
    image: 'https://via.placeholder.com/80',
    calories: '≈ 268kcal/杯',
    specs: '大杯,茶香款,标准冰,标准糖',
    quantity: 1,
    price: 20,
  },
  {
    id: 2,
    name: '七里香',
    image: 'https://via.placeholder.com/80',
    calories: '≈ 162kcal/杯',
    specs: '大杯,标准冰,标准糖,无气泡,立即制作',
    quantity: 1,
    price: 18,
  },
])

// 优惠券选择
const couponDiscount = ref(9)

// 预约电话
const phoneNumber = ref('')

// 备注
const note = ref('')
const showNotePopup = ref(false)

// 计算总价
const totalQuantity = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const totalDiscount = computed(() => {
  return couponDiscount.value
})

const totalPrice = computed(() => {
  return subtotal.value - totalDiscount.value
})

// 返回上一页
function goBack() {
  uni.navigateBack()
}

// 跳转到门店详情
function goToStoreDetail() {
  uni.showToast({ title: '跳转到门店详情', icon: 'none' })
}

// 选择预约时间
function selectReservationTime() {
  uni.showToast({ title: '选择预约时间', icon: 'none' })
}

// 跳转到优惠券选择
function selectCoupon() {
  uni.showToast({ title: '选择优惠券', icon: 'none' })
}

// 输入备注
function inputNote() {
  showNotePopup.value = true
}

// 关闭备注弹窗
function closeNotePopup() {
  showNotePopup.value = false
}

// 确认备注
function confirmNote() {
  showNotePopup.value = false
}

// 提交订单
function submitOrder() {
  uni.showModal({
    title: '确认支付',
    content: `共${totalQuantity.value}件，合计¥${totalPrice.value.toFixed(1)}`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '支付成功', icon: 'success' })
      }
    },
  })
}
</script>

<template>
  <view class="order-page" :class="{ 'page-no-scroll': showNotePopup }">
    <!-- 可滚动内容区域 -->
    <view class="content-scrollable">
      <view class="inner-content">
        <!-- 门店信息和预约时间组合卡片 -->
        <view class="store-reservation-card">
          <!-- 门店信息 -->
          <view class="store-section" @click="goToStoreDetail">
            <view class="store-header">
              <view class="store-info">
                <view class="store-name">
                  广东深圳南山深圳湾生态科...
                </view>
                <view class="location-badge">
                  距您2.8km
                </view>
                <view class="location-button">
                  <text class="icon-location">📍</text>
                </view>
              </view>
              <text class="arrow-right">›</text>
            </view>
            <view class="store-address">
              <text class="icon-pin">📍</text>
              <text class="address-text">广东省深圳市南山区粤海街道高新南十道深...</text>
            </view>
            <view class="store-status">
              <text class="status-text">前方<text class="highlight">5</text>杯制作中</text>
            </view>
          </view>

          <!-- 分隔线 -->
          <view class="divider" />

          <!-- 预约时间 -->
          <view class="reservation-section" @click="selectReservationTime">
            <text class="reservation-label">预约时间</text>
            <view class="reservation-value">
              <text class="value-text">立即取餐</text>
              <text class="arrow-right">›</text>
            </view>
          </view>
        </view>

        <!-- 商品、优惠券、价格汇总组合卡片 -->
        <view class="order-detail-card">
          <!-- 商品列表 -->
          <view class="products-section">
            <view v-for="item in cartItems" :key="item.id" class="product-item">
              <image class="product-image" :src="item.image" mode="aspectFill" />
              <view class="product-info">
                <view class="product-header">
                  <text class="product-name">{{ item.name }}</text>
                  <text class="product-price">¥ {{ item.price }}</text>
                </view>
                <view class="product-calories">
                  {{ item.calories }}
                </view>
                <view class="product-specs">
                  {{ item.specs }}
                </view>
                <view class="product-quantity">
                  x{{ item.quantity }}
                </view>
              </view>
            </view>
          </view>

          <!-- 分隔线 -->
          <view class="divider" />

          <!-- 优惠券 -->
          <view v-if="couponDiscount > 0" class="coupon-section" @click="selectCoupon">
            <view class="coupon-left">
              <view class="coupon-icon">
                券
              </view>
              <text class="coupon-text">优惠券 优惠</text>
            </view>
            <view class="coupon-right">
              <text class="coupon-discount">- ¥ {{ couponDiscount }}</text>
              <text class="arrow-right">›</text>
            </view>
          </view>

          <!-- 分隔线 -->
          <view class="divider" />

          <!-- 价格汇总 -->
          <view class="price-summary">
            <view v-if="totalDiscount > 0" class="price-row">
              <text class="price-label">共优惠</text>
              <text class="price-value discount">¥ {{ totalDiscount }}</text>
            </view>
            <view class="price-row total">
              <text class="price-label">合计</text>
              <text class="price-value">¥ {{ subtotal.toFixed(1) }}</text>
            </view>
          </view>
        </view>

        <!-- 预留电话和备注组合卡片 -->
        <view class="phone-note-card">
          <!-- 预留电话 -->
          <view class="phone-section">
            <text class="phone-label">预留电话</text>
            <input v-model="phoneNumber" class="phone-input" type="number" placeholder="选填,便于订单异常时联系" :maxlength="11">
          </view>

          <!-- 分隔线 -->
          <view class="divider" />

          <!-- 备注 -->
          <view class="note-section" @click="inputNote">
            <text class="note-label">备注</text>
            <view class="note-right">
              <text :class="note ? 'note-text' : 'note-placeholder'">{{ note || '口味、偏好等要求' }}</text>
              <text class="arrow-right">›</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 备注弹窗 -->
    <view v-if="showNotePopup" class="note-popup-overlay" @touchmove.prevent @click="closeNotePopup">
      <view class="note-popup" @click.stop>
        <view class="note-popup-header">
          <text class="note-popup-title">备注</text>
        </view>
        <view class="note-popup-content">
          <view class="textarea-wrapper">
            <textarea
              v-model="note" class="note-textarea" placeholder="请输入口味、偏好等要求" :maxlength="30"
              :auto-height="false"
            />
            <view class="char-count">
              <text class="count-text">{{ note.length }}/30</text>
            </view>
          </view>
        </view>
        <view class="note-popup-footer">
          <view class="confirm-button" @click="confirmNote">
            确认
          </view>
        </view>
      </view>
    </view>

    <!-- 底部固定结算栏 -->
    <view class="bottom-fixed">
      <view class="bottom-bar">
        <view class="bottom-left">
          <view class="bottom-price-row">
            <text class="bottom-quantity">共{{ totalQuantity }}件</text>
            <text class="bottom-label">合计</text>
            <text class="bottom-price">¥ {{ totalPrice.toFixed(1) }}</text>
          </view>
          <view class="bottom-discount-row">
            <text class="bottom-discount-label">共优惠</text>
            <text class="bottom-discount-value">¥ {{ totalDiscount }}</text>
          </view>
        </view>
        <view class="submit-button" @click="submitOrder">
          提交支付
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import './styles/OrderSettlement.scss';
</style>
