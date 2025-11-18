<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useTokenStore } from '@/store/token'

interface Props {
  /** 是否显示登录弹窗 */
  modelValue: boolean
  /** 登录成功后的回调 */
  onSuccess?: () => void
  /** 关闭弹窗的回调 */
  onClose?: () => void
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const tokenStore = useTokenStore()

// 表单数据
const phoneNumber = ref('')
const referralCode = ref('')
const countryCodeIndex = ref(0)
const countryCodes = ref(['+86', '+1', '+44'])

// 条款同意选择
const termsChecked = ref(false)

// 是否加载中
const loading = ref(false)

// 表单验证状态
const isFormValid = computed(() => {
  return phoneNumber.value.trim().length > 0 && referralCode.value.trim().length > 0 && termsChecked.value
})

// 关闭弹窗
function handleClose() {
  emit('update:modelValue', false)
  emit('close')
  resetForm()
}

// 点击遮罩层关闭
function handleMaskClick() {
  handleClose()
}

// 重置表单
function resetForm() {
  phoneNumber.value = ''
  referralCode.value = ''
  countryCodeIndex.value = 0
  termsChecked.value = false
  loading.value = false
}

// 国家代码选择
function onCountryChange(value: number) {
  countryCodeIndex.value = value
}

// 手机号登录
async function handlePhoneLogin() {
  if (!isFormValid.value) {
    uni.showToast({
      title: '请填写手机号并同意条款',
      icon: 'none',
    })
    return
  }

  loading.value = true
  try {
    uni.showToast({
      title: '登录成功',
      icon: 'success',
    })

    handleClose()
    emit('success')
    props.onSuccess?.()
  }
  catch (error) {
    console.error('登录失败:', error)
  }
  finally {
    loading.value = false
  }
}

// 阻止内容区域点击事件冒泡
function handleContentClick(e: Event) {
  e.stopPropagation()
}
</script>

<template>
  <view
    v-if="modelValue"
    class="login-popup-overlay"
    @click="handleMaskClick"
  >
    <view
      class="login-popup-content"
      :class="{ 'slide-up': modelValue }"
      @click="handleContentClick"
    >
      <!-- 拖拽条 -->
      <view class="drag-indicator" />

      <!-- 弹窗容器 -->
      <view class="h-full w-full flex flex-col bg-white">
        <!-- 头部 -->
        <view class="flex items-center justify-between p-6">
          <view class="pb-1" style="border-bottom: 2px solid #ef4444;">
            <text class="text-2xl text-gray-900 font-bold">登录</text>
          </view>
          <text class="cursor-pointer text-2xl" @click="handleClose">✕</text>
        </view>

        <!-- 内容区域 -->
        <view class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- 国家代码选择 -->
          <view class="flex items-center gap-2">
            <wd-picker
              v-model="countryCodeIndex"
              :columns="countryCodes"
              @change="onCountryChange"
            />
            <wd-input
              v-model="phoneNumber"
              type="tel"
              placeholder="手机号码"
              class="flex-1"
              :border="true"
              size="large"
            />
          </view>

          <!-- 验证码输入框 -->
          <wd-input
            v-model="referralCode"
            type="text"
            placeholder="验证码"
            :border="true"
            size="large"
          />

          <!-- 登录按钮 -->
          <wd-button
            :type="isFormValid ? 'primary' : 'default'"
            size="large"
            :disabled="!isFormValid || loading"
            :loading="loading"
            block
            :class="{ 'custom-disabled': !isFormValid }"
            @click="handlePhoneLogin"
          >
            {{ loading ? '加载中...' : '登录' }}
          </wd-button>

          <!-- 条款勾选 -->
          <view class="mt-8">
            <view class="flex items-start gap-2">
              <wd-checkbox v-model="termsChecked" />
              <view class="text-sm text-gray-700">
                我已阅读并同意 <text class="text-blue-600 font-semibold">使用条款</text> 和 <text class="text-blue-600 font-semibold">隐私政策</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.login-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.login-popup-content {
  width: 100%;
  height: 50vh;
  background-color: #fff;
  border-radius: 24rpx 24rpx 0 0;
  position: relative;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.login-popup-content.slide-up {
  transform: translateY(0);
}

.drag-indicator {
  width: 80rpx;
  height: 8rpx;
  background-color: #e0e0e0;
  border-radius: 4rpx;
  margin: 16rpx auto 20rpx;
  flex-shrink: 0;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* UnoCSS 工具类补充样式 */
.w-full {
  width: 100%;
}

.h-full {
  height: 100%;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.flex-1 {
  flex: 1;
}

.overflow-y-auto {
  overflow-y: auto;
}

.p-6 {
  padding: 24rpx;
}

.space-y-6 > view + view {
  margin-top: 24rpx;
}

.gap-2 {
  gap: 8rpx;
}

.px-4 {
  padding-left: 16rpx;
  padding-right: 16rpx;
}

.py-3 {
  padding-top: 12rpx;
  padding-bottom: 12rpx;
}

.border {
  border: 1rpx solid #d1d5db;
}

.border-b {
  border-bottom: 1rpx solid #e5e7eb;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

.border-b-2 {
  border-bottom: 4rpx solid #ef4444;
}

.border-red-500 {
  border-color: #ef4444;
}

.pb-1 {
  padding-bottom: 4rpx;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.rounded-lg {
  border-radius: 12rpx;
}

.text-sm {
  font-size: 28rpx;
}

.text-xl {
  font-size: 32rpx;
}

.text-2xl {
  font-size: 40rpx;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}

.font-semibold {
  font-weight: 600;
}

.text-gray-500 {
  color: #6b7280;
}

.text-gray-600 {
  color: #4b5563;
}

.text-gray-700 {
  color: #374151;
}

.text-gray-900 {
  color: #111827;
}

.text-blue-600 {
  color: #2563eb;
}

.bg-gray-100 {
  background-color: #f3f4f6;
}

.bg-gray-200 {
  background-color: #e5e7eb;
}

.bg-white {
  background-color: #ffffff;
}

.justify-between {
  justify-content: space-between;
}

.justify-center {
  justify-content: center;
}

.items-center {
  align-items: center;
}

.items-start {
  align-items: flex-start;
}

.text-center {
  text-align: center;
}

.uppercase {
  text-transform: uppercase;
}

.tracking-wide {
  letter-spacing: 0.05em;
}

.cursor-pointer {
  cursor: pointer;
}

.mt-1 {
  margin-top: 4rpx;
}

.mt-8 {
  margin-top: 32rpx;
}

.space-y-4 > view + view {
  margin-top: 16rpx;
}

.focus\:outline-none:focus {
  outline: none;
}

.focus\:ring-2:focus {
  box-shadow: 0 0 0 4rpx rgba(59, 130, 246, 0.5);
}

.focus\:ring-blue-500:focus {
  --tw-ring-color: rgb(59 130 246);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 自定义按钮禁用样式 - 浅灰色 */
.custom-disabled {
  background-color: #9ca3af !important;
  border-color: #9ca3af !important;
  color: #ffffff !important;
}

.custom-disabled:not([disabled]) {
  opacity: 1;
}
</style>
