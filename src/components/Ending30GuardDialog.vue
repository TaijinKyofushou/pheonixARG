<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const showContent = ref(false)

onMounted(() => {
  if (props.visible) {
    // 延迟显示内容，营造打字效果
    setTimeout(() => {
      showContent.value = true
    }, 100)
  }
})

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="visible" class="guard-overlay" @click="handleCancel">
        <div class="guard-dialog" @click.stop>
          <div class="dialog-header">
            <span class="warning-icon">⚠</span>
            <span class="header-text">系统提示</span>
          </div>
          
          <div class="dialog-content">
            <Transition name="type-in">
              <p v-if="showContent" class="message">
                A的话还没说完……你真的要走吗？
              </p>
            </Transition>
          </div>
          
          <div class="dialog-actions">
            <button 
              type="button" 
              class="btn btn-cancel"
              @click="handleCancel"
            >
              继续听完
            </button>
            <button 
              type="button" 
              class="btn btn-confirm"
              @click="handleConfirm"
            >
              确认离开
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.guard-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.guard-dialog {
  background: linear-gradient(145deg, #0f0f12 0%, #1a1a20 100%);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 420px;
  width: 90%;
  box-shadow: 
    0 0 40px rgba(0, 212, 255, 0.15),
    inset 0 0 20px rgba(0, 212, 255, 0.05);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.warning-icon {
  font-size: 1.25rem;
  color: #f59e0b;
  animation: pulse-icon 2s ease-in-out infinite;
}

@keyframes pulse-icon {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.header-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Courier New', monospace;
}

.dialog-content {
  min-height: 3rem;
  margin-bottom: 1.5rem;
}

.message {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-family: 'Courier New', monospace;
}

.dialog-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.6rem 1.25rem;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Courier New', monospace;
  min-height: 40px;
}

.btn-cancel {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.7);
}

.btn-cancel:hover {
  border-color: rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.05);
}

.btn-confirm {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #ef4444;
}

.btn-confirm:hover {
  background: rgba(239, 68, 68, 0.3);
  border-color: rgba(239, 68, 68, 0.6);
}

/* 过渡动画 */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.type-in-enter-active {
  transition: all 0.5s ease;
}

.type-in-enter-from {
  opacity: 0;
  transform: translateY(10px);
  filter: blur(4px);
}

/* 移动端适配 */
@media (max-width: 480px) {
  .guard-dialog {
    padding: 1.25rem;
    width: 92%;
  }
  
  .dialog-actions {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }
  
  .btn {
    width: 100%;
    text-align: center;
  }
}
</style>
