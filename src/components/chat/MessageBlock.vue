<script setup lang="ts">
import { computed } from 'vue'
import { splitContentWithLinks } from '@/content/storyNodes'

const props = defineProps<{
  raw: string
  defaultSpeaker?: string
}>()

const emit = defineEmits<{
  link: [linkId: number]
}>()

const lines = computed(() => {
  const t = props.raw.trim()
  if (!t) return []
  return t.split('\n').filter(Boolean)
})

function renderLine(line: string) {
  return splitContentWithLinks(line)
}
</script>

<template>
  <div class="block">
    <p v-for="(line, idx) in lines" :key="idx" class="line">
      <template v-for="(part, j) in renderLine(line)" :key="j">
        <span v-if="part.type === 'text'">{{ part.value }}</span>
        <span v-else-if="part.type === 'linkStyle'" class="link-style">{{ part.value }}</span>
        <button
          v-else-if="part.type === 'link'"
          type="button"
          class="link-btn"
          @click="emit('link', part.linkId)"
        >
          {{ part.value }}
        </button>
      </template>
    </p>
  </div>
</template>

<style scoped>
.block {
  margin-bottom: 0.75rem;
}
.line {
  margin: 0.15rem 0;
  white-space: pre-wrap;
  line-height: 1.45;
}
.link-btn {
  background: none;
  border: none;
  padding: 0;
  color: var(--color-link);
  text-decoration: underline;
  cursor: pointer;
  font: inherit;
}
.link-style {
  color: var(--color-link);
  text-decoration: underline;
  cursor: default;
  font: inherit;
}
</style>
