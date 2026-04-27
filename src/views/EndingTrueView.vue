<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { FullPageNode } from '@/types/story'

defineProps<{
  node: FullPageNode
}>()

const router = useRouter()

type ChatRole = 'me' | 'them'

/** 每条对话：展示文案 + 相对上一条出现后的间隔（ms） */
interface ChatStep {
  role: ChatRole
  text: string
  delayMs: number
}

interface DReplyStep {
  text: string
  /** 当前回复距离上一条消息出现的间隔（ms） */
  delayMs: number
}

type DReplyConfig = string | readonly DReplyStep[]

const WHO_OPTIONS = [
  {
    id: 'april' as const,
    label: '你认识陈思哲吗？',
    playerLine: '你认识陈思哲吗？',
    dReply: [
      { text: '陈思哲', delayMs: 2000 },
      { text: '没听过', delayMs: 2700 },
      { text: '但你这么问了', delayMs: 1500 },
      { text: '我是不是应该认识？', delayMs: 1700 },
      { text: '念出来还挺熟悉的', delayMs: 2300 },
      { text: '好像确实在哪说过', delayMs: 1500 },
      { text: '算了', delayMs: 2300 },
      { text: '想不起来了', delayMs: 1700 },
    ],
  },
  {
    id: 'bell' as const,
    label: '你认识梁宇吗？',
    playerLine: '你认识梁宇吗？',
    dReply: [
      { text: '不认识', delayMs: 1500 },
      { text: '你有事找他吗？', delayMs: 1700 },
      { text: '直接去问应该就行', delayMs: 1200 },
      { text: '我是不认识', delayMs: 1300 },
      { text: '但你想让我帮忙联系也行', delayMs: 1500 },
      { text: '感觉可以认识一下', delayMs: 1400 },
    ],
  },
  {
    id: 'collide' as const,
    label: '你认识张一然吗？',
    playerLine: '你认识张一然吗？',
    dReply: [
      { text: '谁', delayMs: 3000 },
      { text: '不知道', delayMs: 2700 },
      { text: '可能在哪见过吧', delayMs: 2300 },
      { text: '不对', delayMs: 1500 },
      { text: '应该没有', delayMs: 1700 },
      { text: '找他有什么事吗', delayMs: 2000 },
    ],
  },
] as const satisfies readonly {
  id: string
  label: string
  playerLine: string
  dReply: DReplyConfig
}[]

type WhoId = (typeof WHO_OPTIONS)[number]['id']

/** 开场到「对了学长」为止，之后由玩家三选一 */
const OPENING_STEPS: ChatStep[] = [
  { role: 'me', text: '学长我计组大作业发你邮箱了', delayMs: 400 },
  { role: 'them', text: '收到', delayMs: 1700 },
  { role: 'me', text: '对了学长', delayMs: 2000 },
]

function toDReplySteps(dReply: DReplyConfig): ChatStep[] {
  if (typeof dReply === 'string') {
    return [{ role: 'them', text: dReply, delayMs: 200 }]
  }
  return dReply.map((item) => ({ role: 'them' as const, text: item.text, delayMs: item.delayMs }))
}

function closingSteps(dReply: DReplyConfig): ChatStep[] {
  return [
    ...toDReplySteps(dReply),
    { role: 'me', text: '没事', delayMs: 3500 },
    { role: 'me', text: '我就问一下', delayMs: 1700 },
    { role: 'me', text: '谢谢学长', delayMs: 1300 },
    { role: 'them', text: '客气', delayMs: 1100 },
  ]
}

const visible = ref<{ role: ChatRole; text: string }[]>([])
const showWhoChoices = ref(false)
/** 已从列表点选、待点击「发送」写入聊天记录 */
const pendingWho = ref<WhoId | null>(null)
const composeText = ref('')
const isPlaying = ref(false)
const feedEl = ref<HTMLElement | null>(null)
const showEndingAchievedModal = ref(false)

let timerIds: ReturnType<typeof setTimeout>[] = []
let pendingAchievedModal: ReturnType<typeof setTimeout> | null = null

function scrollFeedToBottom() {
  nextTick(() => {
    requestAnimationFrame(() => {
      const el = feedEl.value
      if (!el) return
      el.scrollTop = el.scrollHeight
    })
  })
}

function clearTimers() {
  timerIds.forEach((id) => clearTimeout(id))
  timerIds = []
}

function pushLine(role: ChatRole, text: string) {
  visible.value = [...visible.value, { role, text }]
}

/**
 * 按每条 delayMs：本条在上一条已显示后再等待 delayMs 出现。
 * 返回 Promise，在全部排程结束时 resolve（不等待最后一条的「停留」）。
 */
function playSteps(steps: ChatStep[]): Promise<void> {
  return new Promise((resolve) => {
    let elapsed = 0
    if (steps.length === 0) {
      resolve()
      return
    }
    steps.forEach((step, i) => {
      elapsed += step.delayMs
      const id = setTimeout(() => {
        pushLine(step.role, step.text)
        if (i === steps.length - 1) resolve()
      }, elapsed)
      timerIds.push(id)
    })
  })
}

async function runOpening() {
  clearTimers()
  visible.value = []
  showWhoChoices.value = false
  pendingWho.value = null
  composeText.value = ''
  isPlaying.value = true
  await playSteps(OPENING_STEPS)
  isPlaying.value = false
  showWhoChoices.value = true
}

function selectWhoOption(who: WhoId) {
  if (isPlaying.value || pendingWho.value) return
  const opt = WHO_OPTIONS.find((o) => o.id === who)
  if (!opt) return
  pendingWho.value = who
  composeText.value = opt.playerLine
}

async function sendComposed() {
  const who = pendingWho.value
  if (!who || isPlaying.value) return
  const text = composeText.value.trim()
  if (!text) return

  const opt = WHO_OPTIONS.find((o) => o.id === who)
  if (!opt) return

  pendingWho.value = null
  composeText.value = ''
  showWhoChoices.value = false
  pushLine('me', text)

  isPlaying.value = true
  await playSteps(closingSteps(opt.dReply))
  isPlaying.value = false
  if (pendingAchievedModal != null) {
    clearTimeout(pendingAchievedModal)
    pendingAchievedModal = null
  }
  pendingAchievedModal = setTimeout(() => {
    pendingAchievedModal = null
    showEndingAchievedModal.value = true
  }, 2000)
}

watch(composeText, (v) => {
  if (pendingWho.value !== null && !v.trim()) {
    pendingWho.value = null
  }
})

watch(
  () => visible.value.length,
  () => {
    scrollFeedToBottom()
  },
)

onMounted(() => {
  void runOpening()
})

function dismissAchievedModalToHome() {
  showEndingAchievedModal.value = false
  router.replace('/node/0')
}

onBeforeUnmount(() => {
  clearTimers()
  if (pendingAchievedModal != null) {
    clearTimeout(pendingAchievedModal)
    pendingAchievedModal = null
  }
})
</script>

<template>
  <div class="wx">
    <header class="bar">
      <div class="back" aria-hidden="true">＜</div>
      <div class="title">
        <div class="name">计组助教王博傲</div>
      </div>
      <div class="more" aria-hidden="true">⋯</div>
    </header>

    <main ref="feedEl" class="feed">
      <div
        v-for="(row, i) in visible"
        :key="i"
        class="bubble-wrap"
        :class="row.role === 'them' ? 'them-wrap' : 'me-wrap'"
      >
        <div class="bubble" :class="row.role === 'them' ? 'bubble--them' : 'bubble--me'">
          {{ row.text }}
        </div>
      </div>
    </main>

    <footer class="foot">
      <div class="input-bar">
        <span class="input-bar__emoji" aria-hidden="true">😊</span>
        <input
          v-model="composeText"
          class="input-bar__field"
          :class="{ 'input-bar__field--ph': !pendingWho && !composeText }"
          type="text"
          autocomplete="off"
          :readonly="!pendingWho"
          :placeholder="pendingWho ? '' : '按住 说话'"
        />
        <button
          type="button"
          class="input-bar__send"
          :disabled="!pendingWho || !composeText.trim() || isPlaying"
          @click="sendComposed"
        >
          发送
        </button>
      </div>
      <div v-if="showWhoChoices && !pendingWho" class="choice-panel">
        <div class="choice-list">
          <button
            v-for="o in WHO_OPTIONS"
            :key="o.id"
            type="button"
            class="choice-btn"
            :disabled="isPlaying"
            @click="selectWhoOption(o.id)"
          >
            {{ o.label }}
          </button>
        </div>
      </div>
    </footer>

    <Teleport to="body">
      <Transition name="ending-achieved">
        <div
          v-if="showEndingAchievedModal"
          class="achieved-overlay achieved-overlay--true"
          role="dialog"
          aria-modal="true"
          aria-labelledby="achieved-true-title"
          aria-describedby="achieved-true-hint"
          @click="dismissAchievedModalToHome"
        >
          <div class="achieved-overlay__stack">
            <div class="achieved-overlay__frame">
              <p id="achieved-true-title" class="achieved-overlay__title achieved-overlay__title--true">
                达成结局：余烬
              </p>
              <div class="achieved-overlay__rule" aria-hidden="true" />
            </div>
            <p id="achieved-true-hint" class="achieved-overlay__hint achieved-overlay__hint--true">
              点击任意处返回主页
            </p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.wx {
  height: 100vh;
  height: 100dvh;
  max-height: 100vh;
  max-height: 100dvh;
  max-width: 520px;
  margin: 0 auto;
  overflow: hidden;
  background: #f3f3f3;
  color: #111;
  display: flex;
  flex-direction: column;
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    'PingFang SC',
    'Microsoft YaHei',
    sans-serif;
}
.bar {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.6rem;
  padding-top: calc(0.5rem + env(safe-area-inset-top, 0px));
  background: #ededed;
  border-bottom: 1px solid #d6d6d6;
}
.back,
.more {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  color: #1a1a1a;
  opacity: 0.88;
  flex-shrink: 0;
}
.title {
  flex: 1;
  text-align: center;
  min-width: 0;
}
.name {
  font-weight: 600;
  font-size: 1rem;
  color: #000;
  letter-spacing: 0.02em;
}
.feed {
  flex: 1;
  min-height: 0;
  padding: 0.75rem 0.65rem;
  padding-bottom: 0.5rem;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  gap: 1.05rem;
  background: #f3f3f3;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.feed::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
.bubble-wrap {
  display: flex;
  width: 100%;
  padding: 0 0.2rem;
}
.me-wrap {
  justify-content: flex-end;
}
.them-wrap {
  justify-content: flex-start;
}
.bubble {
  position: relative;
  width: fit-content;
  max-width: min(78vw, 360px);
  padding: 0.65rem 0.75rem;
  border-radius: 7px;
  line-height: 1.5;
  font-size: 1rem;
  color: #000;
  white-space: pre-wrap;
  word-break: break-word;
  box-sizing: border-box;
}
/* 右侧己方：浅绿 + 朝右小三角 */
.bubble--me {
  margin-right: 6px;
  background: #95ec69;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
}
.bubble--me::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 13px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 0 5px 7px;
  border-color: transparent transparent transparent #95ec69;
}
/* 左侧对方：白底 + 朝左小三角 */
.bubble--them {
  margin-left: 6px;
  background: #fff;
  border: 1px solid #e7e7e7;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.04);
}
.bubble--them::after {
  content: '';
  position: absolute;
  left: -6px;
  top: 13px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 7px 5px 0;
  border-color: transparent #fff transparent transparent;
}
.foot {
  flex-shrink: 0;
  background: #f3f3f3;
  padding-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  gap: 0;
}
.input-bar {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.65rem;
  background: #f7f7f7;
  border-top: 1px solid #dcdcdc;
}
.input-bar__emoji {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  opacity: 0.85;
}
.input-bar__field {
  flex: 1;
  min-width: 0;
  height: 38px;
  border-radius: 6px;
  background: #fff;
  border: 1px solid #e5e5e5;
  padding: 0 0.65rem;
  font-size: 0.95rem;
  color: #000;
  box-sizing: border-box;
}
.input-bar__field--ph {
  text-align: center;
}
.input-bar__field::placeholder {
  color: #888;
}
.input-bar__field:read-only {
  color: #888;
}
.input-bar__send {
  flex-shrink: 0;
  min-width: 3.25rem;
  height: 34px;
  padding: 0 0.65rem;
  border: none;
  border-radius: 4px;
  background: #07c160;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
}
.input-bar__send:disabled {
  background: #9bdbb5;
  color: rgba(255, 255, 255, 0.85);
  cursor: not-allowed;
}
.choice-panel {
  background: #fff;
  padding: 0.65rem 0.75rem 0.85rem;
  border-top: 1px solid #ebebeb;
}
.choice-list {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.choice-btn {
  width: 100%;
  text-align: center;
  border: none;
  background: #eeeeee;
  border-radius: 4px;
  padding: 0.72rem 0.75rem;
  cursor: pointer;
  font-size: 0.95rem;
  line-height: 1.45;
  color: #000;
}
.choice-btn:active:not(:disabled) {
  filter: brightness(0.97);
}
.choice-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

/* 全屏结局弹窗 */
.achieved-overlay--true {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  box-sizing: border-box;
  cursor: pointer;
  background: radial-gradient(ellipse 100% 70% at 50% 45%, rgba(185, 28, 28, 0.06), transparent 60%),
    #faf7f2;
}
.achieved-overlay__frame {
  position: relative;
  max-width: 20rem;
  padding: 2.25rem 2rem 1.85rem;
  text-align: center;
  border: 2px solid #b91c1c;
  outline: 1px solid rgba(185, 28, 28, 0.35);
  outline-offset: 6px;
  background: linear-gradient(180deg, #fffefb 0%, #faf5eb 100%);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
}
.achieved-overlay__stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5rem;
  max-width: min(20rem, calc(100vw - 3rem));
}
.achieved-overlay__title--true {
  margin: 0;
  font-family: 'STSong', 'SimSun', 'Songti SC', 'Noto Serif SC', serif;
  font-size: clamp(1.2rem, 4.5vw, 1.55rem);
  font-weight: 700;
  letter-spacing: 0.35em;
  color: #991b1b;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.9);
}
.achieved-overlay__rule {
  width: 4rem;
  height: 2px;
  margin: 1rem auto 0;
  background: linear-gradient(90deg, transparent, #b91c1c, transparent);
  opacity: 0.6;
}
.achieved-overlay__hint--true {
  margin: 0;
  font-family: ui-monospace;
  width: 100%;
  text-align: center;
  font-size: 0.8rem;
  letter-spacing: 0.5em;
  color: #7f1d1d;
  transform-origin: center;
  animation: ending-hint-breathe-true 3.2s ease-in-out infinite;
}

@keyframes ending-hint-breathe-true {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.96);
  }
  50% {
    opacity: 0.4;
    transform: scale(1);
  }
}
</style>
