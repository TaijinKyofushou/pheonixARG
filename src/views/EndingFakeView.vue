<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ChatBubbleThread from '@/components/chat/ChatBubbleThread.vue'
import ChatRoomLayout from '@/components/chat/ChatRoomLayout.vue'
import type { FullPageNode } from '@/types/story'
import { useChatShareLink } from '@/composables/useChatShareLink'
import { useGameStore } from '@/stores/game'

/** 假结局对话：每条 `revealAfterMs` 为「上一条已显示后，再隔多少毫秒显示本条」；首条为进入页面后的首帧延迟 */
const FAKE_ENDING_SCRIPT = [
{ text: 'Collide：来瓦', revealAfterMs: 800 },
{ text: 'Bell：上号', revealAfterMs: 1000 },
{ text: 'April：来了', revealAfterMs: 600 },
{ text: 'Collide：等一下', revealAfterMs: 3500 },
{ text: 'Collide：还有人没到', revealAfterMs: 5000 },
{ text: 'Bell：谁啊', revealAfterMs: 1200 },
{ text: 'April：？', revealAfterMs: 400 },
{ text: 'Collide：……', revealAfterMs: 6000 },
{ text: 'April：valorant什么时候出的四排', revealAfterMs: 3000 },
{ text: 'Collide：奇怪', revealAfterMs: 1200 },
{ text: 'Collide：那我开了', revealAfterMs: 4500 },
] as const satisfies ReadonlyArray<{ text: string; revealAfterMs: number }>

const props = defineProps<{
  node: FullPageNode
  nodeId?: number
}>()

const router = useRouter()
const game = useGameStore()
const { followShareLink } = useChatShareLink()

/** 逐条揭示：从 0 条到全部行 */
const revealedLineCount = ref(0)
let pendingReveal: number | null = null

function scheduleRevealFrom(index: number) {
  if (index >= FAKE_ENDING_SCRIPT.length) {
    pendingReveal = null
    return
  }
  const { revealAfterMs } = FAKE_ENDING_SCRIPT[index]
  pendingReveal = window.setTimeout(() => {
    pendingReveal = null
    revealedLineCount.value = index + 1
    scheduleRevealFrom(index + 1)
  }, revealAfterMs)
}

onMounted(() => {
  if (!FAKE_ENDING_SCRIPT.length) return
  scheduleRevealFrom(0)
})

onUnmounted(() => {
  if (pendingReveal != null) {
    window.clearTimeout(pendingReveal)
    pendingReveal = null
  }
})

const feedSegments = computed(() => {
  if (revealedLineCount.value <= 0) return []
  const raw = FAKE_ENDING_SCRIPT.slice(0, revealedLineCount.value)
    .map((x) => x.text)
    .join('\n')
  return [{ timeline: (props.node.timeline ?? '').trim(), raw }]
})

function onLink(linkId: number) {
  followShareLink(linkId)
}

function exit() {
  game.unlockTrueEnding34()
  router.push('/node/34')
}
</script>

<template>
  <ChatRoomLayout
    title="聊天室"
    :subtitle="node.timeline ?? ''"
    composer-hint="此聊天室已关闭，无法发送消息！"
  >
    <template #actions>
      <button type="button" class="btn-fake btn-login" disabled>登录</button>
      <button
        v-if="game.puzzleSolved"
        type="button"
        class="danger"
        @click="exit"
      >
        退出
      </button>
    </template>

    <template #search>
      <div class="bar">
        <input
          class="input"
          type="search"
          placeholder="搜索关键词…"
          disabled
          aria-disabled="true"
        />
        <button type="button" class="btn" disabled aria-disabled="true">
          搜索
        </button>
      </div>
    </template>

    <template #sidebar>
      <div class="sb-head">联系人</div>
      <div class="sb-empty">登录后查看联系人</div>
    </template>

    <template #pane-head>主频道 · 聚是一坨 (3)</template>

    <ChatBubbleThread :segments="feedSegments" @link="onLink" />
  </ChatRoomLayout>
</template>

<style scoped>
.sb-head {
  padding: 0.65rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
  letter-spacing: 0.06em;
}
.sb-empty {
  padding: 1rem 0.85rem;
  font-size: 0.85rem;
  color: #9ca3af;
  line-height: 1.45;
}
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
  background: #f9fafb;
  color: #9ca3af;
  font-size: 0.88rem;
  color-scheme: light;
  cursor: not-allowed;
}
.input::placeholder {
  color: #9ca3af;
  opacity: 1;
}
.btn {
  flex-shrink: 0;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  border: 1px solid #bae6fd;
  background: #e0f2fe;
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: not-allowed;
}
.btn-fake.btn-login {
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #f3f4f6;
  color: #9ca3af;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: not-allowed;
}
.danger {
  border: 1px solid #ff2b2b;
  background: rgba(255, 40, 40, 0.18);
  color: #b91c1c;
  border-radius: 999px;
  padding: 0.45rem 0.85rem;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.85rem;
}
.danger:hover {
  filter: brightness(1.03);
}
</style>
