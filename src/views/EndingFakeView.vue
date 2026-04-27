<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
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
{ text: 'Collide：等一下', revealAfterMs: 2500 },
{ text: 'Collide：是不是还有谁没上线', revealAfterMs: 3500 },
{ text: 'Bell：谁啊', revealAfterMs: 1200 },
{ text: 'April：？', revealAfterMs: 800 },
{ text: 'April：valorant什么时候可以四排了', revealAfterMs: 2000 },
{ text: 'Collide：……', revealAfterMs: 2500 },
{ text: 'Collide：应该是昨晚没睡好', revealAfterMs: 2000 },
{ text: 'April：这句话最好不要在你马枪的时候说出来', revealAfterMs: 2300 },
{ text: 'Bell：没事，这把我C', revealAfterMs: 2300 },
{ text: 'Collide：……我开了', revealAfterMs: 2500 },
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
const showEndingAchievedModal = ref(false)
let pendingReveal: number | null = null
let pendingAchievedModal: number | null = null

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

watch(revealedLineCount, (c) => {
  if (c !== FAKE_ENDING_SCRIPT.length) return
  if (pendingAchievedModal != null) {
    window.clearTimeout(pendingAchievedModal)
    pendingAchievedModal = null
  }
  pendingAchievedModal = window.setTimeout(() => {
    pendingAchievedModal = null
    showEndingAchievedModal.value = true
  }, 2000)
})

onUnmounted(() => {
  if (pendingReveal != null) {
    window.clearTimeout(pendingReveal)
    pendingReveal = null
  }
  if (pendingAchievedModal != null) {
    window.clearTimeout(pendingAchievedModal)
    pendingAchievedModal = null
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

function dismissAchievedModalToHome() {
  showEndingAchievedModal.value = false
  router.replace('/node/0')
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

  <Teleport to="body">
    <Transition name="ending-achieved">
      <div
        v-if="showEndingAchievedModal && !game.puzzleSolved"
        class="achieved-overlay achieved-overlay--fake"
        role="dialog"
        aria-modal="true"
        aria-labelledby="achieved-fake-title"
        aria-describedby="achieved-fake-hint"
        @click="dismissAchievedModalToHome"
      >
        <div class="achieved-overlay__stack">
          <div class="achieved-overlay__inner">
            <div class="achieved-overlay__grid" aria-hidden="true" />
            <p id="achieved-fake-title" class="achieved-overlay__title achieved-overlay__title--fake">
              达成结局：四排
            </p>
          </div>
          <p id="achieved-fake-hint" class="achieved-overlay__hint achieved-overlay__hint--fake">
            点击任意处返回主页
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
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

/* 结局弹窗浮现：渐显 + 轻微上浮 */
.ending-achieved-enter-active {
  transition:
    opacity 0.55s cubic-bezier(0.33, 1, 0.68, 1),
    transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.ending-achieved-leave-active {
  transition:
    opacity 0.28s ease-out,
    transform 0.28s ease-out;
}
.ending-achieved-enter-from,
.ending-achieved-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}
.ending-achieved-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 全屏结局弹窗：黑底科技蓝（Teleport 至 body，仍受 scoped 约束） */
.achieved-overlay--fake {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  box-sizing: border-box;
  cursor: pointer;
  background:
    radial-gradient(ellipse 120% 80% at 50% 40%, rgba(14, 165, 233, 0.12), transparent 55%),
    #030712;
}
.achieved-overlay__inner {
  position: relative;
  text-align: center;
  max-width: 22rem;
  padding: 2rem 1.75rem;
  border: 1px solid rgba(56, 189, 248, 0.45);
  border-radius: 4px;
  background: rgba(15, 23, 42, 0.65);
  box-shadow:
    0 0 0 1px rgba(14, 165, 233, 0.15),
    0 0 40px rgba(56, 189, 248, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
}
.achieved-overlay__stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5rem;
  max-width: min(22rem, calc(100vw - 3rem));
}
.achieved-overlay__grid {
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0.14;
  background-image:
    linear-gradient(rgba(56, 189, 248, 0.35) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 189, 248, 0.35) 1px, transparent 1px);
  background-size: 18px 18px;
  mask-image: radial-gradient(ellipse 90% 70% at 50% 50%, black 20%, transparent 75%);
}
.achieved-overlay__title--fake {
  position: relative;
  margin: 0;
  font-family: ui-monospace, 'Cascadia Code', 'Segoe UI Mono', monospace;
  font-size: clamp(1.15rem, 4.2vw, 1.45rem);
  font-weight: 700;
  letter-spacing: 0.28em;
  color: #38bdf8;
  text-shadow:
    0 0 20px rgba(56, 189, 248, 0.85),
    0 0 42px rgba(14, 165, 233, 0.45);
}
.achieved-overlay__hint--fake {
  margin: 0;
  font-family: ui-monospace;
  width: 100%;
  text-align: center;
  font-size: 0.8rem;
  letter-spacing: 0.5em;
  color: rgba(125, 211, 252, 0.95);
  transform-origin: center;
  animation: ending-hint-breathe-fake 3s ease-in-out infinite;
}

@keyframes ending-hint-breathe-fake {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.96);
  }
  50% {
    opacity: 0.2;
    transform: scale(1);
  }
}
</style>
