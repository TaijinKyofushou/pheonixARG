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
