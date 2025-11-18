import { ref } from 'vue'

// 全局登录弹窗状态
const showLoginPopup = ref(false)
const loginSuccessCallback = ref<(() => void) | null>(null)
const closeCallback = ref<(() => void) | null>(null)

/**
 * 使用登录弹窗的组合式函数
 */
export function useLoginPopup() {
  /**
   * 显示登录弹窗
   * @param onSuccess 登录成功后的回调函数
   * @param onClose 关闭弹窗的回调函数
   */
  const showLogin = (onSuccess?: () => void, onClose?: () => void) => {
    if (onSuccess) {
      loginSuccessCallback.value = onSuccess
    }
    if (onClose) {
      closeCallback.value = onClose
    }
    showLoginPopup.value = true
  }

  /**
   * 隐藏登录弹窗
   */
  const hideLogin = () => {
    showLoginPopup.value = false
    // 执行关闭回调
    if (closeCallback.value) {
      closeCallback.value()
      closeCallback.value = null
    }
    loginSuccessCallback.value = null
  }

  /**
   * 处理登录成功
   */
  const handleLoginSuccess = () => {
    // 执行成功回调
    if (loginSuccessCallback.value) {
      loginSuccessCallback.value()
      loginSuccessCallback.value = null
    }
    closeCallback.value = null
    showLoginPopup.value = false
  }

  return {
    showLoginPopup,
    showLogin,
    hideLogin,
    handleLoginSuccess,
  }
}

/**
 * 登录检查装饰器
 * 当需要登录的操作执行前，检查是否已登录，未登录则弹出登录窗口
 * @param callback 需要登录的操作回调
 * @param onSuccess 登录成功后是否自动执行原操作
 */
export function withLoginCheck(
  callback: () => void,
  onSuccess: boolean = true,
) {
  return async () => {
    const { useTokenStore } = await import('@/store/token')
    const tokenStore = useTokenStore()

    if (tokenStore.hasLogin) {
      // 已登录，直接执行回调
      callback()
    }
    else {
      // 未登录，显示登录弹窗
      const { showLogin } = useLoginPopup()
      showLogin(
        onSuccess ? callback : undefined,
        () => {
          // 关闭弹窗时的回调，可以显示提示
          uni.showToast({
            title: '登录已取消',
            icon: 'none',
          })
        },
      )
    }
  }
}
