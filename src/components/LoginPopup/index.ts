import type { App } from 'vue'
import LoginPopup from './LoginPopup.vue'

export { LoginPopup }

export function install(app: App) {
  app.component('LoginPopup', LoginPopup)
}

export default {
  install,
  component: LoginPopup,
}
