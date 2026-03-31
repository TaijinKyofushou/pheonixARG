<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  placeholder?: string
  disabled?: boolean
  hint?: string
}>()

const emit = defineEmits<{
  search: [keyword: string]
}>()

const q = ref('')

function onSubmit() {
  if (props.disabled) return
  emit('search', q.value)
}
</script>

<template>
  <aside class="search">
    <h3 class="h">历史帖子</h3>
    <p v-if="hint" class="hint">{{ hint }}</p>
    <form class="row" @submit.prevent="onSubmit">
      <input
        v-model="q"
        class="input"
        type="text"
        :placeholder="placeholder ?? '输入关键词'"
        :disabled="disabled"
      />
      <button class="btn" type="submit" :disabled="disabled">搜索</button>
    </form>
  </aside>
</template>

<style scoped>
.search {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.75rem;
  background: var(--color-panel);
}
.h {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
}
.hint {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  opacity: 0.85;
}
.row {
  display: flex;
  gap: 0.5rem;
}
.input {
  flex: 1;
  min-width: 0;
  padding: 0.45rem 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: inherit;
}
.btn {
  padding: 0.45rem 0.65rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-accent-soft);
  color: var(--color-fg);
  cursor: pointer;
}
.btn:hover:not(:disabled) {
  border-color: var(--color-accent);
  color: var(--color-link);
}
</style>
