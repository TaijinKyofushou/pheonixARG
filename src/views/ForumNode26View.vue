<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ForumThreadDef, FullPageNode } from '@/types/story'
import SearchPanel from '@/components/chat/SearchPanel.vue'
import { flavourSearchHint } from '@/content/searchHints'
import { useGameStore } from '@/stores/game'

/**
 * 真相帖（node 26）：滚底 + 先滚动 → 底部浮动打字层打出「我也在看着你👁👁」后保留不消失 →
 * 再对主帖做原地替换：从文末向前（页底先被替换）。「正文内容」标题不参与替换。
 */

const FLOATING_TYPEWRITER_TEXT = '我也在看着你👁👁'
const REPLACE_PHRASE = [...FLOATING_TYPEWRITER_TEXT]

const REPLACE_TICK_MS = 32
const REPLACE_CHARS_PER_TICK = 2

interface MorphSeg {
  text: string
  st: number
}

interface MorphPinned {
  floor: MorphSeg
  author: MorphSeg
  lines: MorphSeg[]
}

interface MorphReply {
  floor: MorphSeg
  author: MorphSeg
  lines: MorphSeg[]
  subText?: MorphSeg
}

interface ForumMorph {
  totalChars: number
  kicker?: MorphSeg
  board: MorphSeg
  title: MorphSeg
  metaAuthor: MorphSeg
  metaPub: MorphSeg
  leads: MorphSeg[]
  hPin?: MorphSeg
  pinned: MorphPinned[]
  hReplies?: MorphSeg
  replies: MorphReply[]
  hOp?: MorphSeg
  opPs?: MorphSeg[]
  footer: MorphSeg
}

function buildForumMorph(t: ForumThreadDef): ForumMorph {
  let n = 0
  const bump = (s: string): MorphSeg => {
    const st = n
    n += [...s].length
    return { text: s, st }
  }

  const kicker = t.threadKicker ? bump(t.threadKicker) : undefined
  const board = bump(t.board)
  const title = bump(t.title)
  const metaAuthor = bump(t.author)
  const metaPub = bump(t.publishedAt)
  const leads = t.leadParagraphs.map((p) => bump(p))

  let hPin: MorphSeg | undefined
  const pinned: MorphPinned[] = []
  if (t.pinnedReplies?.length) {
    hPin = bump('热门回复')
    for (const r of t.pinnedReplies) {
      pinned.push({
        floor: bump(` #${r.floor}`),
        author: bump(r.author),
        lines: r.lines.map((l) => bump(l)),
      })
    }
  }

  let hReplies: MorphSeg | undefined
  const replies: MorphReply[] = []
  if (t.replies?.length) {
    if (t.repliesSectionTitle && !t.pinnedReplies?.length) {
      hReplies = bump(t.repliesSectionTitle)
    }
    for (const r of t.replies) {
      const subText = r.subReply ? bump(r.subReply) : undefined
      replies.push({
        floor: bump(` #${r.floor}`),
        author: bump(r.author),
        lines: r.lines.map((l) => bump(l)),
        subText,
      })
    }
  }

  let hOp: MorphSeg | undefined
  let opPs: MorphSeg[] | undefined
  if (t.opLastReply) {
    hOp = bump(`发帖人 ${t.author} 最后回复：`)
    opPs = t.opLastReply.paragraphs.map((p) => bump(p))
  }
  const footer = bump(t.footerStats)

  return {
    totalChars: n,
    kicker,
    board,
    title,
    metaAuthor,
    metaPub,
    leads,
    hPin,
    pinned,
    hReplies,
    replies,
    hOp,
    opPs,
    footer,
  }
}

function buildPlainMorph(node: FullPageNode): { totalChars: number; body: MorphSeg; timeline?: MorphSeg } | null {
  const c = node.content
  if (c == null || c.length === 0) return null
  let n = 0
  const bump = (s: string): MorphSeg => {
    const st = n
    n += [...s].length
    return { text: s, st }
  }
  const body = bump(c)
  const timeline = node.timeline?.length ? bump(node.timeline) : undefined
  return { totalChars: n, body, timeline }
}

const props = defineProps<{
  nodeId?: number
  node: FullPageNode
  forumVariant: 'guest' | 'd_posts' | 'truth'
}>()

const router = useRouter()
const game = useGameStore()

const MIN_SCROLL_Y = 80

const sentinelRef = ref<HTMLElement | null>(null)
const endReached = ref(false)
const floatingOverlayText = ref('')
const floatingOverlayDone = ref(false)
const replaceProgress = ref(0)
const hasMeaningfulScroll = ref(false)

let floatingTimer: number | null = null
let floatingDoneTimeout: number | null = null
let replaceTimer: number | null = null
let observer: IntersectionObserver | null = null

const morphThread = computed(() =>
  props.node.forumThread ? buildForumMorph(props.node.forumThread) : null,
)
const morphPlain = computed(() => (!props.node.forumThread ? buildPlainMorph(props.node) : null))

const replaceTotal = computed(
  () => morphThread.value?.totalChars ?? morphPlain.value?.totalChars ?? 0,
)

const isReplacing = computed(
  () =>
    floatingOverlayDone.value &&
    replaceProgress.value > 0 &&
    replaceProgress.value < replaceTotal.value,
)
const isFullyReplaced = computed(
  () =>
    floatingOverlayDone.value &&
    replaceTotal.value > 0 &&
    replaceProgress.value >= replaceTotal.value,
)
/** 触发后浮动框始终显示（打字结束后仍保留完整句） */
const showFloatingTypewriter = computed(() => endReached.value)

function morphText(original: string, segmentStart: number): string {
  const prog = replaceProgress.value
  const total = replaceTotal.value
  const ph = REPLACE_PHRASE
  if (total <= 0) return original
  return [...original]
    .map((ch, i) => {
      const g = segmentStart + i
      return g >= total - prog ? ph[g % ph.length]! : ch
    })
    .join('')
}

function isShortPage(): boolean {
  const el = document.documentElement
  return el.scrollHeight <= window.innerHeight + 48
}

function canArmBottomTrigger(): boolean {
  return hasMeaningfulScroll.value || isShortPage()
}

function clearFloatingTimer() {
  if (floatingTimer != null) {
    clearInterval(floatingTimer)
    floatingTimer = null
  }
}

function clearReplaceTimer() {
  if (replaceTimer != null) {
    clearInterval(replaceTimer)
    replaceTimer = null
  }
}

function disconnectObserver() {
  observer?.disconnect()
  observer = null
}

function onWindowScroll() {
  if (window.scrollY >= MIN_SCROLL_Y) {
    hasMeaningfulScroll.value = true
  }
}

function resetEffects() {
  window.removeEventListener('scroll', onWindowScroll, true)
  disconnectObserver()
  clearFloatingTimer()
  if (floatingDoneTimeout != null) {
    clearTimeout(floatingDoneTimeout)
    floatingDoneTimeout = null
  }
  clearReplaceTimer()
  endReached.value = false
  floatingOverlayText.value = ''
  floatingOverlayDone.value = false
  replaceProgress.value = 0
  hasMeaningfulScroll.value = false
}

function startFloatingTypewriter() {
  clearFloatingTimer()
  if (floatingDoneTimeout != null) {
    clearTimeout(floatingDoneTimeout)
    floatingDoneTimeout = null
  }
  floatingOverlayText.value = ''
  const runes = [...FLOATING_TYPEWRITER_TEXT]
  let i = 0
  floatingTimer = window.setInterval(() => {
    i += 1
    floatingOverlayText.value = runes.slice(0, i).join('')
    if (i >= runes.length) {
      clearFloatingTimer()
      floatingDoneTimeout = window.setTimeout(() => {
        floatingDoneTimeout = null
        floatingOverlayDone.value = true
        startInPlaceReplace()
      }, 400)
    }
  }, 95)
}

function startInPlaceReplace() {
  clearReplaceTimer()
  const total = replaceTotal.value
  if (total <= 0) return
  replaceProgress.value = 0
  replaceTimer = window.setInterval(() => {
    replaceProgress.value = Math.min(total, replaceProgress.value + REPLACE_CHARS_PER_TICK)
    if (replaceProgress.value >= total) clearReplaceTimer()
  }, REPLACE_TICK_MS)
}

function attachObserver() {
  disconnectObserver()
  const el = sentinelRef.value
  if (!el) return
  observer = new IntersectionObserver(
    (entries) => {
      const hit = entries.some((e) => e.isIntersecting)
      if (!hit || endReached.value) return
      if (!canArmBottomTrigger()) return
      endReached.value = true
      startFloatingTypewriter()
    },
    { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0 },
  )
  observer.observe(el)
}

function setupScrollGate() {
  window.addEventListener('scroll', onWindowScroll, { passive: true, capture: true })
  if (window.scrollY >= MIN_SCROLL_Y) {
    hasMeaningfulScroll.value = true
  }
}

onMounted(() => {
  game.markForumHauntedAfterNode26()
  setupScrollGate()
  void nextTick(() => attachObserver())
})

onUnmounted(() => {
  resetEffects()
})

function goLogin() {
  router.push('/node/11')
}

function back() {
  router.push('/node/1')
}

function onForumSearch(kw: string) {
  if (props.forumVariant === 'guest') {
    alert('未登录用户无法搜索！')
    return
  }
  const ok = game.tryForumKeywordSearch(kw)
  if (!ok) {
    const hint = flavourSearchHint(kw)
    alert(hint ?? '未找到匹配关键词！')
    return
  }
  alert('搜索到相关内容 1 条')
  const map: Record<string, string> = {
    薪火焚身: '/node/13',
    玄坛秘笺: '/node/14',
    爝火赓炁: '/node/15',
    重明龛: '/node/26',
  }
  const path = map[kw.trim()]
  if (path) router.push(path)
}
</script>

<template>
  <div class="wrap theme-forum">
    <header class="top">
      <button type="button" class="back" @click="back">返回</button>
      <div class="brand brand--node26">你还在看吗？</div>
      <div class="spacer" />
      <button v-if="forumVariant === 'guest'" type="button" class="login" @click="goLogin">登录</button>
      <span v-else class="pill">已登录：锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛</span>
    </header>

    <div class="layout">
      <main class="main">
        <article
          v-if="morphThread"
          class="thread"
          :class="{
            'thread--corrupting': isReplacing,
            'thread--corrupted': isFullyReplaced,
          }"
        >
          <p v-if="morphThread.kicker" class="thread-kicker">
            {{ morphText(morphThread.kicker.text, morphThread.kicker.st) }}
          </p>
          <p class="thread-board">
            <span class="label">版面：</span>{{ morphText(morphThread.board.text, morphThread.board.st) }}
          </p>
          <h1 class="thread-title">{{ morphText(morphThread.title.text, morphThread.title.st) }}</h1>
          <div class="thread-meta">
            <span><span class="label">发帖人：</span>{{ morphText(morphThread.metaAuthor.text, morphThread.metaAuthor.st) }}</span>
            <span><span class="label">发布时间：</span>{{ morphText(morphThread.metaPub.text, morphThread.metaPub.st) }}</span>
          </div>

          <section class="thread-section">
            <h2 class="section-h">正文内容</h2>
            <blockquote class="thread-lead">
              <p v-for="(seg, pi) in morphThread.leads" :key="'lead-' + pi" class="lead-p">
                {{ morphText(seg.text, seg.st) }}
              </p>
            </blockquote>
          </section>

          <section v-if="morphThread.pinned.length" class="thread-section">
            <h2 v-if="morphThread.hPin" class="section-h section-h--accent">
              {{ morphText(morphThread.hPin.text, morphThread.hPin.st) }}
            </h2>
            <div
              v-for="(r, ri) in morphThread.pinned"
              :key="'pin-' + ri"
              class="reply reply--pinned"
            >
              <div class="reply-head">
                <span class="floor">{{ morphText(r.floor.text, r.floor.st) }}</span>
                <span class="author">{{ morphText(r.author.text, r.author.st) }}</span>
              </div>
              <div class="reply-body">
                <p v-for="(ln, li) in r.lines" :key="'pinl-' + li" class="reply-line">
                  {{ morphText(ln.text, ln.st) }}
                </p>
              </div>
            </div>
          </section>

          <section v-if="morphThread.replies.length" class="thread-section">
            <h2
              v-if="morphThread.hReplies"
              class="section-h section-h--accent"
            >
              {{ morphText(morphThread.hReplies.text, morphThread.hReplies.st) }}
            </h2>
            <div
              v-for="(r, ri) in morphThread.replies"
              :key="'r-' + ri"
              class="reply"
            >
              <div class="reply-head">
                <span class="floor">{{ morphText(r.floor.text, r.floor.st) }}</span>
                <span class="author">{{ morphText(r.author.text, r.author.st) }}</span>
              </div>
              <div class="reply-body">
                <p v-for="(ln, li) in r.lines" :key="'rl-' + li" class="reply-line">
                  {{ morphText(ln.text, ln.st) }}
                </p>
                <div v-if="r.subText && node.forumThread" class="sub-reply">
                  <span class="sub-reply-label">回复 #{{ node.forumThread.replies[ri]!.floor }}：</span>
                  <span class="sub-reply-text">{{ morphText(r.subText.text, r.subText.st) }}</span>
                </div>
              </div>
            </div>
          </section>

          <section v-if="morphThread.hOp && morphThread.opPs?.length" class="thread-section op-last">
            <h2 class="section-h">
              {{ morphText(morphThread.hOp.text, morphThread.hOp.st) }}
            </h2>
            <blockquote class="op-quote">
              <p
                v-for="(seg, pi) in morphThread.opPs"
                :key="'op-' + pi"
                class="op-p"
              >
                {{ morphText(seg.text, seg.st) }}
              </p>
            </blockquote>
          </section>

          <footer class="thread-foot">{{ morphText(morphThread.footer.text, morphThread.footer.st) }}</footer>
          <div ref="sentinelRef" class="node26-sentinel" aria-hidden="true" />
        </article>

        <article
          v-else-if="morphPlain"
          class="post post--plain"
          :class="{
            'thread--corrupting': isReplacing,
            'thread--corrupted': isFullyReplaced,
          }"
        >
          <pre class="pre">{{ morphText(morphPlain.body.text, morphPlain.body.st) }}</pre>
          <p v-if="morphPlain.timeline" class="time">
            {{ morphText(morphPlain.timeline.text, morphPlain.timeline.st) }}
          </p>
          <div ref="sentinelRef" class="node26-sentinel" aria-hidden="true" />
        </article>
      </main>
      <SearchPanel
        class="side"
        :disabled="forumVariant === 'guest'"
        :hint="forumVariant === 'guest' ? '登录后可搜索帖子' : ''"
        @search="onForumSearch"
      />
    </div>

    <div
      v-if="showFloatingTypewriter"
      class="node26-typewriter"
      aria-live="polite"
    >
      <span class="node26-typewriter-text">{{ floatingOverlayText }}</span>
      <span
        v-if="!floatingOverlayDone"
        class="node26-typewriter-cursor"
        aria-hidden="true"
      >▍</span>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  min-height: 100vh;
  color: var(--color-fg);
  background:
    radial-gradient(ellipse 80% 50% at 50% 0%, rgba(80, 0, 0, 0.35), transparent 55%),
    linear-gradient(180deg, #020203 0%, #0a0506 40%, #050308 100%);
}

.top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem clamp(1rem, 3vw, 2rem);
  border-bottom: 2px solid var(--color-blood, #6b0a0a);
  background: linear-gradient(180deg, #140808 0%, #0a0505 100%);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.65);
}
.brand {
  font-weight: 800;
  letter-spacing: 0.18em;
  font-size: clamp(0.95rem, 1.1vw, 1.05rem);
  color: #ff5c5c;
  text-shadow: 0 0 20px rgba(180, 20, 20, 0.45);
}
.brand--node26 {
  letter-spacing: 0.12em;
  font-size: clamp(0.88rem, 1.05vw, 1rem);
  color: #ff7a7a;
  text-shadow:
    0 0 24px rgba(200, 30, 30, 0.55),
    0 0 48px rgba(120, 0, 0, 0.25);
}
.spacer {
  flex: 1;
}
.to-profile {
  margin-right: 0.35rem;
  border: 1px solid #5c1010;
  background: #120606;
  color: #e88888;
  border-radius: 6px;
  padding: 0.45rem 0.75rem;
  cursor: pointer;
  font-size: 0.88rem;
  transition:
    border-color 0.15s,
    color 0.15s;
}
.to-profile:hover {
  border-color: var(--color-accent);
  color: #ffb4b4;
}
.back,
.login {
  border: 1px solid #5c1010;
  background: #120606;
  color: #e88888;
  border-radius: 6px;
  padding: 0.45rem 0.75rem;
  cursor: pointer;
  font-size: 0.88rem;
  transition:
    border-color 0.15s,
    color 0.15s;
}
.back:hover,
.login:hover {
  border-color: var(--color-accent);
  color: #ffb4b4;
}
.pill {
  border: 1px solid #5c1010;
  border-radius: 999px;
  padding: 0.3rem 0.75rem;
  font-size: 0.82rem;
  color: #c98a8a;
  background: rgba(40, 8, 8, 0.5);
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) min(300px, 28vw);
  gap: clamp(0.75rem, 2vw, 1.5rem);
  padding: clamp(1rem, 2vw, 1.75rem) clamp(1rem, 3vw, 2.5rem) 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
  align-items: start;
  box-sizing: border-box;
}

.main {
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0;
  background: var(--color-panel);
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(90, 10, 10, 0.35),
    0 12px 40px rgba(0, 0, 0, 0.55);
}

.thread {
  padding: clamp(1.25rem, 2.5vw, 1.85rem) clamp(1.1rem, 2.5vw, 2rem) 1.75rem;
  color: #e0a0a0;
  transition:
    box-shadow 0.35s ease,
    border-color 0.35s ease;
}
.thread--corrupting {
  box-shadow: inset 0 0 60px rgba(80, 0, 0, 0.12);
}
.thread--corrupted {
  box-shadow: inset 0 0 80px rgba(100, 0, 0, 0.2);
}

.thread-kicker {
  margin: 0 0 0.55rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #b01010;
  text-transform: uppercase;
}
.thread-board {
  margin: 0 0 0.7rem;
  font-size: 0.86rem;
  color: #8a5555;
}
.thread-board .label {
  color: #5c3030;
}
.thread-title {
  margin: 0 0 0.9rem;
  font-size: clamp(1.15rem, 2.4vw, 1.45rem);
  font-weight: 700;
  line-height: 1.5;
  color: #7c0000;
  text-shadow: 0 0 40px rgba(120, 0, 0, 0.35);
}
.thread-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.85rem;
  margin: 0 0 1.35rem;
  padding-bottom: 1rem;
  font-size: 0.84rem;
  color: #8a6060;
  border-bottom: 3px solid #1a0a0a;
}
.thread-meta .label {
  color: #5c3838;
}

.thread-section {
  margin-bottom: 1.6rem;
}
.thread-section + .thread-section {
  padding-top: 1.25rem;
  border-top: 4px solid #1a1012;
}

.section-h {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.85rem;
  padding-left: 0.6rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: #9a5555;
  letter-spacing: 0.08em;
  border-left: 4px solid var(--color-accent);
}
.section-h--accent {
  color: #ff5a5a;
  border-left-color: #ff3030;
}
.thread-lead {
  margin: 0;
  padding: 1rem 1.15rem;
  border-radius: 0 2px 2px 0;
}
.lead-p {
  margin: 0 0 0.75rem;
  line-height: 1.85;
  font-size: clamp(0.92rem, 1.1vw, 1rem);
  color: #7c0000;
  text-align: justify;
  text-justify: inter-ideograph;
}
.lead-p:last-child {
  margin-bottom: 0;
}

.reply {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  grid-template-rows: auto auto;
  column-gap: 0.85rem;
  row-gap: 0.35rem;
  margin-bottom: 0;
  padding: 0.85rem 0;
  border-bottom: 1px solid #1f1012;
  border-radius: 0;
  background: transparent;
}
.reply:last-child {
  border-bottom: none;
}
.reply--pinned {
  padding: 0.85rem 0.65rem;
  margin-bottom: 0.5rem;
  border: 1px solid #3c1010;
  border-radius: 4px;
  background: rgba(50, 0, 0, 0.22);
}
.reply--pinned + .reply--pinned {
  margin-top: 0.5rem;
}
.reply::before {
  content: '';
  grid-column: 1;
  grid-row: 1 / span 2;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #4a1518, #1a0505);
  border: 1px solid #5c2020;
  box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.8);
  align-self: start;
}
.reply-head {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.4rem 0.85rem;
  margin: 0;
  padding: 0;
  border: none;
}
.reply-head .floor {
  font-size: 0.78rem;
  font-weight: 700;
  color: #6b3030;
}
.reply-head .author {
  font-size: 0.9rem;
  font-weight: 700;
  color: #9a5555;
}
.reply-body {
  grid-column: 2;
  grid-row: 2;
  font-size: 0.92rem;
  line-height: 1.75;
  color: #7c0000;
}
.reply-line {
  margin: 0 0 0.45rem;
  white-space: pre-wrap;
  word-break: break-word;
}
.reply-line:last-child {
  margin-bottom: 0;
}

.sub-reply {
  margin-top: 0.65rem;
  padding: 0.55rem 0.65rem 0.55rem 0.85rem;
  border-left: 3px solid #5c1518;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 0 4px 4px 0;
  font-size: 0.86rem;
  line-height: 1.65;
  color: #7c0000;
}
.sub-reply-label {
  color: #7c0000;
  font-weight: 600;
  margin-right: 0.25rem;
}

.op-last {
  margin-top: 1.5rem;
}
.op-quote {
  margin: 0.5rem 0 0;
  padding: 0.85rem 1rem;
  border: 1px dashed #4a1010;
  border-radius: 4px;
  background: rgba(25, 5, 5, 0.55);
}
.op-p {
  margin: 0;
  line-height: 1.8;
  font-size: 0.95rem;
  color: #7c0000;
}

.thread-foot {
  margin-top: 1.5rem;
  padding: 0.9rem 0.5rem 0;
  border-top: 2px solid #2a1012;
  font-size: 0.78rem;
  color: #6a4040;
  text-align: center;
  letter-spacing: 0.04em;
}

.post--plain {
  padding: clamp(1rem, 2vw, 1.5rem);
}
.pre {
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.75;
  font-family: inherit;
  color: #c9a0a0;
}
.time {
  opacity: 0.75;
  margin: 0.75rem 0 0;
  color: #7a5050;
}

.side {
  position: sticky;
  top: 0.75rem;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
    max-width: none;
    padding: 1rem;
  }
  .side {
    position: static;
  }
}

.node26-sentinel {
  height: 2px;
  margin-top: 2.5rem;
  pointer-events: none;
  opacity: 0;
}

.node26-typewriter {
  position: fixed;
  z-index: 200;
  left: 50%;
  bottom: clamp(12%, 18vh, 22%);
  transform: translateX(-50%);
  max-width: min(92vw, 28rem);
  padding: 0.65rem 1rem;
  border-radius: 6px;
  border: 1px solid rgba(120, 20, 20, 0.65);
  background: rgba(8, 2, 2, 0.92);
  box-shadow:
    0 0 40px rgba(80, 0, 0, 0.55),
    inset 0 0 20px rgba(40, 0, 0, 0.35);
  font-size: clamp(0.95rem, 2.4vw, 1.15rem);
  font-weight: 700;
  color: #ff4d4d;
  text-align: center;
  line-height: 1.45;
  text-shadow: 0 0 18px rgba(200, 40, 40, 0.65);
}

.node26-typewriter-text {
  white-space: pre-wrap;
  word-break: break-word;
}

.node26-typewriter-cursor {
  display: inline-block;
  margin-left: 0.12em;
  font-weight: 400;
  color: #ff9090;
  animation: node26-cursor-blink 0.85s step-end infinite;
}

@keyframes node26-cursor-blink {
  50% {
    opacity: 0;
  }
}
</style>
