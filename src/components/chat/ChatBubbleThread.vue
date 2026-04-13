<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { parseContentToBubbleRows, type SpeakerRoleKey } from '@/utils/chatParse'
import { useGameStore } from '@/stores/game'

const props = withDefaults(
  defineProps<{
    /** 每段对话带时间轴文案 */
    segments: Array<{ timeline: string; raw: string }>
    /** 为 true 时，下一次因 segments 变化触发的自动滚底将跳过（如搜索解锁新对话） */
    suppressNextSegmentScroll?: boolean
  }>(),
  { suppressNextSegmentScroll: false },
)

const emit = defineEmits<{
  link: [linkId: number]
  'consumed-suppress-segment-scroll': []
}>()

const { chatLoginUser } = storeToRefs(useGameStore())

const prepared = computed(() =>
  props.segments
    .filter((s) => s.raw.trim())
    .map((s) => ({
      timeline: s.timeline.trim(),
      rows: parseContentToBubbleRows(s.raw, chatLoginUser.value),
    })),
)

function avatarLetter(speaker: string): string {
  const s = speaker.trim()
  if (!s) return '?'
  return s.replace(/？/g, '?').slice(0, 1).toUpperCase()
}

/** 问号和不匹配用户使用 other 样式 */
function bubbleClass(role: SpeakerRoleKey): string {
  if (role === 'other') return 'bubble--other'
  return `bubble--${role}`
}

function avatarClass(role: SpeakerRoleKey): string {
  if (role === 'other') return 'avatar--other'
  return `avatar--${role}`
}

/** 问号用户或不匹配用户不显示头像 */
function shouldShowAvatar(role: SpeakerRoleKey): boolean {
  return role !== 'other'
}

/** 行内日期分段后的时间轴（如 2026/3/27）用更小灰色字展示 */
function isDateOnlyTimeline(t: string): boolean {
  return /^\d{4}\/\d{1,2}\/\d{1,2}$/.test(t.trim())
}

const threadRoot = ref<HTMLElement | null>(null)

function getFeedEl(): HTMLElement | null {
  const el = threadRoot.value?.closest('.im-feed')
  return el instanceof HTMLElement ? el : null
}

function scrollFeedToEnd(): void {
  const feed = getFeedEl()
  if (!feed) return
  feed.scrollTop = feed.scrollHeight
}

const segmentLayoutKey = () =>
  props.segments.map((s) => s.raw.length + s.timeline).join('|')

/**
 * 在 DOM 更新后同步设置 scrollTop，避免 requestAnimationFrame 排到绘制之后
 * 造成「先看到顶部再跳到底」的闪烁。
 */
onMounted(() => {
  nextTick(() => {
    nextTick(() => {
      scrollFeedToEnd()
    })
  })
})

watch(
  segmentLayoutKey,
  () => {
    if (props.suppressNextSegmentScroll) {
      emit('consumed-suppress-segment-scroll')
      return
    }
    scrollFeedToEnd()
    nextTick(scrollFeedToEnd)
  },
  { flush: 'post' },
)
</script>

<template>
  <div ref="threadRoot" class="thread">
    <template v-for="(seg, si) in prepared" :key="si">
      <div v-if="seg.timeline" class="time-divider">
        <span class="time-line" />
        <span
          class="time-label"
          :class="{ 'time-label--date': isDateOnlyTimeline(seg.timeline) }"
        >{{ seg.timeline }}</span>
        <span class="time-line" />
      </div>
      <div
        v-for="(row, ri) in seg.rows"
        :key="`${si}-${ri}`"
        class="row"
        :class="row.side === 'right' ? 'row--out' : 'row--in'"
      >
        <div
          v-if="row.side === 'left' && shouldShowAvatar(row.roleKey)"
          class="avatar"
          :class="avatarClass(row.roleKey)"
        >
          {{ avatarLetter(row.speaker) }}
        </div>
        <div v-else-if="row.side === 'left'" class="avatar-placeholder" />
        <div class="bubble-wrap">
          <div class="name">{{ row.speaker }}</div>
          <div class="bubble" :class="bubbleClass(row.roleKey)">
            <template v-for="(part, pi) in row.parts" :key="pi">
              <span v-if="part.type === 'text'">{{ part.value }}</span>
              <span v-else-if="part.type === 'linkStyle'" class="link-style">{{ part.value }}</span>
              <button
                v-else-if="part.type === 'link'"
                type="button"
                class="link"
                @click="emit('link', part.linkId)"
              >
                {{ part.value }}
              </button>
            </template>
          </div>
        </div>
        <div
          v-if="row.side === 'right' && shouldShowAvatar(row.roleKey)"
          class="avatar avatar--right"
          :class="avatarClass(row.roleKey)"
        >
          {{ avatarLetter(row.speaker) }}
        </div>
        <div v-else-if="row.side === 'right'" class="avatar-placeholder avatar--right" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.thread {
  padding: 0.25rem 0 1rem;
}
.time-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  margin: 1rem 0 0.85rem;
  color: #7a7f88;
  font-size: 0.78rem;
}
.time-line {
  width: 40px;
  height: 1px;
  background: #d4d8de;
  flex-shrink: 0;
}
.time-label {
  white-space: nowrap;
}
.time-label--date {
  font-size: 0.7rem;
  color: #6b7078;
}
.row {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  margin-bottom: 0.65rem;
  max-width: 100%;
}
.row--in {
  justify-content: flex-start;
}
.row--out {
  justify-content: flex-end;
}
.avatar {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: #141414;
  border: 1px solid rgba(20, 20, 20, 0.08);
}
.avatar--april {
  background: #b4c2d4;
}
.avatar--bell {
  background: #b5c4b8;
}
.avatar--collide {
  background: #c4b8c8;
}
.avatar--deposit {
  background: #d4c4a8;
}
.avatar--other {
  background: #e8e8e8;
}
.avatar--right {
  order: 2;
}
.avatar-placeholder {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
}
.avatar-placeholder.avatar--right {
  order: 2;
}
.bubble-wrap {
  min-width: 0;
  max-width: min(72%, 520px);
}
.row--out .bubble-wrap {
  text-align: right;
}
.name {
  font-size: 0.72rem;
  color: #5a5d62;
  margin-bottom: 0.2rem;
  padding: 0 0.15rem;
}
.row--out .name {
  text-align: right;
}
.bubble {
  display: inline-block;
  text-align: left;
  padding: 0.5rem 0.65rem;
  border-radius: 12px;
  font-size: 0.92rem;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
  color: #141414;
  border: 1px solid rgba(20, 20, 20, 0.06);
}
.row--in .bubble {
  border-bottom-left-radius: 4px;
}
.row--out .bubble {
  border-bottom-right-radius: 4px;
}
.bubble--april {
  background: #d4dde8;
}
.bubble--bell {
  background: #d4ddd6;
}
.bubble--collide {
  background: #ded8e2;
}
.bubble--deposit {
  background: #e8ddcf;
}
.bubble--other {
  background: #f4f4f4
}
.link {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  color: #0b57d0;
  text-decoration: underline;
  text-decoration-color: #0b57d0;
  text-underline-offset: 1px;
  text-decoration-thickness: 1px;
}
.link-style {
  color: #0b57d0;
  text-decoration: underline;
  text-decoration-color: #0b57d0;
  text-underline-offset: 1px;
  text-decoration-thickness: 1px;
  cursor: default;
}
</style>
