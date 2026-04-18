<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  search: [keyword: string]
}>()

const q = ref('')

function submit() {
  emit('search', q.value)
}
</script>

<template>
  <form class="bar" @submit.prevent="submit">
    <input
      v-model="q"
      class="input"
      type="search"
      placeholder="搜索关键词…"
      autocomplete="off"
    />
    <button type="submit" class="btn">搜索</button>
  </form>
</template>

<style scoped>
.bar {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  width: 100%;
}
.input {
  flex: 1;
  min-width: 0;
  padding: 0.45rem 0.65rem;
  border-radius: 999px;
  border: 1px solid #bae6fd;
  background: #fff;
  color: #111827;
  caret-color: #0ea5e9;
  font-size: 0.88rem;
  /* 与浅色背景一致，避免系统按深色主题绘制搜索清除按钮 */
  color-scheme: light;
}
/* WebKit：自定义清除图标，避免与浅色底对比度不足 */
.input::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
  width: 1rem;
  height: 1rem;
  margin-right: 2px;
  cursor: pointer;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M18 6L6 18M6 6l12 12'/%3E%3C/svg%3E")
    no-repeat 50% 50%;
  background-size: 1rem 1rem;
}
.input::-webkit-search-cancel-button:hover {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23334155' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M18 6L6 18M6 6l12 12'/%3E%3C/svg%3E");
}
.input::placeholder {
  color: #9ca3af;
  opacity: 1;
}
.btn {
  flex-shrink: 0;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  border: 1px solid #0ea5e9;
  background: linear-gradient(180deg, #38bdf8 0%, #0ea5e9 100%);
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}
.btn:hover {
  filter: brightness(1.06);
}
</style>
