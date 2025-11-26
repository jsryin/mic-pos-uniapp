<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getMockStats, mockController } from '@/utils'

const isMockEnabled = ref(false)
const debugMode = ref(false)
const mockStats = ref<any>({})

onMounted(() => {
  loadMockConfig()
})

function loadMockConfig() {
  isMockEnabled.value = mockController.getConfig().enabled
  debugMode.value = mockController.getConfig().debug
  mockStats.value = getMockStats()
}

function toggleMock() {
  const newState = mockController.toggle()
  isMockEnabled.value = newState
  loadMockConfig()

  uni.showToast({
    title: newState ? 'Mock已启用' : 'Mock已禁用',
    icon: 'success',
  })
}

function toggleDebug() {
  if (debugMode.value) {
    mockController.disableDebug()
  }
  else {
    mockController.enableDebug()
  }
  loadMockConfig()

  uni.showToast({
    title: debugMode.value ? '调试已关闭' : '调试已开启',
    icon: 'success',
  })
}

function exportConfig() {
  const config = mockController.exportConfig()
  uni.setClipboardData({
    data: config,
    success: () => {
      uni.showToast({ title: '配置已复制到剪贴板', icon: 'success' })
    },
  })
}

function importConfig() {
  uni.showModal({
    title: '导入Mock配置',
    editable: true,
    placeholderText: '请粘贴配置JSON',
    success: (res) => {
      if (res.confirm && res.content) {
        const success = mockController.importConfig(res.content)
        if (success) {
          uni.showToast({ title: '导入成功', icon: 'success' })
          loadMockConfig()
        }
        else {
          uni.showToast({ title: '导入失败，请检查JSON格式', icon: 'error' })
        }
      }
    },
  })
}

function resetConfig() {
  uni.showModal({
    title: '重置Mock配置',
    content: '确定要重置所有Mock配置吗？此操作不可恢复。',
    success: (res) => {
      if (res.confirm) {
        mockController.clearRules()
        loadMockConfig()
        uni.showToast({ title: '配置已重置', icon: 'success' })
      }
    },
  })
}
</script>

<template>
  <view class="mock-controller">
    <view class="header">
      <text class="title">Mock控制器</text>
      <view class="stats">
        <text class="stat-item">总计: {{ mockStats.totalRules }}</text>
        <text class="stat-item">启用: {{ mockStats.enabledRules }}</text>
        <text class="stat-item">禁用: {{ mockStats.disabledRules }}</text>
      </view>
    </view>

    <view class="section">
      <view class="section-title">
        基础控制
      </view>
      <view class="control-grid">
        <view class="control-item">
          <text class="control-label">全局Mock</text>
          <wd-switch
            v-model="isMockEnabled"
            size="small"
            @change="toggleMock"
          />
        </view>
        <view class="control-item">
          <text class="control-label">调试模式</text>
          <wd-switch
            v-model="debugMode"
            size="small"
            @change="toggleDebug"
          />
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">
        配置管理
      </view>
      <view class="button-grid">
        <wd-button type="primary" size="small" @click="exportConfig">
          导出配置
        </wd-button>
        <wd-button type="success" size="small" @click="importConfig">
          导入配置
        </wd-button>
        <wd-button type="warning" size="small" @click="resetConfig">
          重置配置
        </wd-button>
      </view>
    </view>

    <view v-if="mockStats.totalRules > 0" class="section">
      <view class="section-title">
        规则分布
      </view>
      <view class="rule-distribution">
        <view class="distribution-item">
          <view class="progress-bar">
            <view
              class="progress-fill enabled"
              :style="{ width: `${mockStats.enabledRules / mockStats.totalRules * 100}%` }"
            />
          </view>
          <text class="distribution-label">启用规则: {{ mockStats.enabledRules }}</text>
        </view>
        <view class="distribution-item">
          <view class="progress-bar">
            <view
              class="progress-fill disabled"
              :style="{ width: `${mockStats.disabledRules / mockStats.totalRules * 100}%` }"
            />
          </view>
          <text class="distribution-label">禁用规则: {{ mockStats.disabledRules }}</text>
        </view>
      </view>
    </view>

    <view class="tips">
      <view class="tip-title">
        💡 使用提示
      </view>
      <view class="tip-item">
        • Mock功能仅在开发环境生效
      </view>
      <view class="tip-item">
        • 可以通过 console.mockController 访问控制器
      </view>
      <view class="tip-item">
        • 支持导出/导入配置，方便团队共享
      </view>
      <view class="tip-item">
        • 开启调试模式查看详细日志
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.mock-controller {
  padding: 30rpx;
  background: #fff;
  border-radius: 12rpx;
  margin: 20rpx;

  .header {
    margin-bottom: 30rpx;

    .title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
      display: block;
    }

    .stats {
      display: flex;
      gap: 20rpx;

      .stat-item {
        font-size: 24rpx;
        color: #666;
        padding: 8rpx 16rpx;
        background: #f5f5f5;
        border-radius: 20rpx;
      }
    }
  }

  .section {
    margin-bottom: 40rpx;

    .section-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
      position: relative;
      padding-left: 20rpx;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 8rpx;
        height: 24rpx;
        background: #007aff;
        border-radius: 4rpx;
      }
    }
  }

  .control-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20rpx;

    .control-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24rpx;
      background: #f8f9fa;
      border-radius: 8rpx;

      .control-label {
        font-size: 28rpx;
        color: #333;
      }
    }
  }

  .button-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15rpx;
  }

  .rule-distribution {
    .distribution-item {
      margin-bottom: 20rpx;

      .progress-bar {
        height: 12rpx;
        background: #f0f0f0;
        border-radius: 6rpx;
        overflow: hidden;
        margin-bottom: 10rpx;

        .progress-fill {
          height: 100%;
          border-radius: 6rpx;
          transition: width 0.3s ease;

          &.enabled {
            background: #52c41a;
          }

          &.disabled {
            background: #ff4d4f;
          }
        }
      }

      .distribution-label {
        font-size: 24rpx;
        color: #666;
      }
    }
  }

  .tips {
    background: #f0f7ff;
    border: 1px solid #d4e8fc;
    border-radius: 8rpx;
    padding: 20rpx;

    .tip-title {
      font-size: 26rpx;
      font-weight: bold;
      color: #007aff;
      margin-bottom: 15rpx;
    }

    .tip-item {
      font-size: 24rpx;
      color: #666;
      line-height: 1.6;
      margin-bottom: 8rpx;
    }
  }
}
</style>
