<script lang="ts" setup>
import { ref } from 'vue'
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

// 表单ref
const form = ref()

// 表单数据模型
const model = ref({
  countryCode: '+86',
  phoneNumber: '',
  verificationCode: '',
})

// 条款同意选择
const termsChecked = ref(false)

// 是否加载中
const loading = ref(false)

// 错误提示信息
const errorMessage = ref('')

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

// 显示错误信息
function showError(message: string) {
  errorMessage.value = message
  setTimeout(() => {
    errorMessage.value = ''
  }, 3000)
}

// 重置表单
function resetForm() {
  model.value = {
    countryCode: '+86',
    phoneNumber: '',
    verificationCode: '',
  }
  termsChecked.value = false
  loading.value = false
  errorMessage.value = ''
}

// 表单验证规则
const phoneRules = [
  {
    required: true,
    message: '请输入手机号码',
    pattern: /^1[3-9]\d{9}$/,
  },
]

const verificationCodeRules = [
  {
    required: true,
    message: '请输入验证码',
    pattern: /^\d{6}$/,
  },
]

// 表单提交
async function handleSubmit() {
  try {
    // 表单验证
    await form.value.validate()

    if (!termsChecked.value) {
      showError('请勾选我已阅读并同意')
      return
    }

    loading.value = true

    // 这里可以调用实际的登录API
    // await tokenStore.login({
    //   countryCode: model.value.countryCode,
    //   phoneNumber: model.value.phoneNumber,
    //   verificationCode: model.value.verificationCode
    // })

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
    if (error !== false) { // 如果不是表单验证错误
      showError('登录失败，请重试')
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <wd-overlay
    :show="modelValue"
    :duration="300"
    :lock-scroll="true"
    :z-index="1000"
    @click="handleMaskClick"
  >
    <view class="wrapper">
      <view class="login-popup-content" @click.stop="">
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

          <!-- 表单区域 -->
          <view class="flex-1 overflow-y-auto p-6 space-y-6">
            <!-- 错误提示区域 -->
            <view v-if="errorMessage" class="error-message">
              <text class="error-text">{{ errorMessage }}</text>
            </view>

            <wd-form ref="form" :model="model">
              <!-- 手机号输入 -->
              <wd-input
                v-model="model.phoneNumber"
                prop="phoneNumber"
                type="tel"
                placeholder="手机号码"
                :rules="phoneRules"
                :border="true"
                size="large"
                clearable
              />

              <!-- 验证码输入 -->
              <wd-input
                v-model="model.verificationCode"
                prop="verificationCode"
                type="text"
                placeholder="验证码"
                :rules="verificationCodeRules"
                :border="true"
                size="large"
                clearable
              />

              <!-- 登录按钮 -->
              <view class="mt-8">
                <wd-button
                  type="primary"
                  size="large"
                  :loading="loading"
                  block
                  custom-class="login-button"
                  @click="handleSubmit"
                >
                  {{ loading ? '登录中...' : '登录' }}
                </wd-button>
              </view>
            </wd-form>

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
  </wd-overlay>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: flex-end;
  height: 100%;
}

.login-popup-content {
  width: 100%;
  height: 50vh;
  background-color: #fff;
  border-radius: 24rpx 24rpx 0 0;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

.space-y-6 > * + * {
  margin-top: 24rpx;
}

.gap-2 {
  gap: 8rpx;
}

.pb-1 {
  padding-bottom: 4rpx;
}

.text-sm {
  font-size: 28rpx;
}

.text-2xl {
  font-size: 40rpx;
}

.font-bold {
  font-weight: 700;
}

.font-semibold {
  font-weight: 600;
}

.text-gray-900 {
  color: #111827;
}

.text-blue-600 {
  color: #2563eb;
}

.text-gray-700 {
  color: #374151;
}

.bg-white {
  background-color: #ffffff;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.items-start {
  align-items: flex-start;
}

.cursor-pointer {
  cursor: pointer;
}

.mt-6 {
  margin-top: 24rpx;
}

.mt-8 {
  margin-top: 32rpx;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 错误提示样式 */
.error-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8rpx;
  padding: 16rpx 24rpx;
  margin-bottom: 24rpx;
}

.error-text {
  color: #dc2626;
  font-size: 28rpx;
  line-height: 1.4;
}

/* 自定义登录按钮样式 - 轻微圆角 */
:deep() {
  .login-button {
    border-radius: 8rpx !important;
  }
}
</style>
