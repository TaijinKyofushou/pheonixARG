<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { FullPageNode } from '@/types/story'
import SearchPanel from '@/components/chat/SearchPanel.vue'
import { flavourSearchHint } from '@/content/searchHints'
import { useGameStore } from '@/stores/game'

const props = defineProps<{
  nodeId?: number
  node: FullPageNode
  forumVariant: 'guest' | 'd_posts' | 'truth'
}>()

const router = useRouter()
const game = useGameStore()

/** 主帖（10）、「我的发帖」（12）在论坛账号 D 已登录时显示入口（node 26 使用 ForumNode26View） */
const showForumProfileButton = computed(() => {
  const id = props.nodeId
  if (id !== 10 && id !== 12) return false
  return game.forumLoggedIn
})

/** 与 store 中 tryForumKeywordSearch 一致：仅已登录可搜索 */
const forumSearchDisabled = computed(() => !game.forumLoggedIn)

function goLogin() {
  router.push('/node/11')
}

function back() {
  router.push('/node/1')
}

function goProfile() {
  router.push('/node/27')
}

function onForumSearch(kw: string) {
  if (!game.forumLoggedIn) {
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
      <div class="brand">四零四聊斋</div>
      <div class="spacer" />
      <button v-if="showForumProfileButton" type="button" class="to-profile" @click="goProfile">
        主页
      </button>
      <button v-if="forumVariant === 'guest'" type="button" class="login" @click="goLogin">登录</button>
      <span v-else class="pill">已登录：Deposit</span>
    </header>

    <div class="layout">
      <main class="main">
        <article v-if="node.forumThread" class="thread">
          <p v-if="node.forumThread.threadKicker" class="thread-kicker">{{ node.forumThread.threadKicker }}</p>
          <p class="thread-board">
            <span class="label">版面：</span>{{ node.forumThread.board }}
          </p>
          <h1 class="thread-title">{{ node.forumThread.title }}</h1>
          <div class="thread-meta">
            <span><span class="label">发帖人：</span>{{ node.forumThread.author }}</span>
            <span><span class="label">发布时间：</span>{{ node.forumThread.publishedAt }}</span>
          </div>

          <section class="thread-section">
            <h2 class="section-h">正文内容</h2>
            <blockquote class="thread-lead">
              <p v-for="(para, pi) in node.forumThread.leadParagraphs" :key="pi" class="lead-p">
                {{ para }}
              </p>
            </blockquote>
          </section>

          <section v-if="node.forumThread.pinnedReplies?.length" class="thread-section">
            <h2 class="section-h section-h--accent">热门回复</h2>
            <div
              v-for="r in node.forumThread.pinnedReplies"
              :key="'pin-' + r.floor"
              class="reply reply--pinned"
            >
              <div class="reply-head">
                <span class="floor"> #{{ r.floor }}</span>
                <span class="author">{{ r.author }}</span>
              </div>
              <div class="reply-body">
                <p v-for="(line, li) in r.lines" :key="li" class="reply-line">
                  {{ line }}
                </p>
              </div>
            </div>
          </section>

          <section v-if="node.forumThread.replies?.length" class="thread-section">
            <h2
              v-if="node.forumThread.repliesSectionTitle && !node.forumThread.pinnedReplies?.length"
              class="section-h section-h--accent"
            >
              {{ node.forumThread.repliesSectionTitle }}
            </h2>
            <div
              v-for="r in node.forumThread.replies"
              :key="'r-' + r.floor"
              class="reply"
            >
              <div class="reply-head">
                <span class="floor"> #{{ r.floor }}</span>
                <span class="author">{{ r.author }}</span>
              </div>
              <div class="reply-body">
                <p v-for="(line, li) in r.lines" :key="li" class="reply-line">
                  {{ line }}
                </p>
                <div v-if="r.subReply" class="sub-reply">
                  <span class="sub-reply-label">回复 #{{ r.floor }}：</span>
                  <span class="sub-reply-text">{{ r.subReply }}</span>
                </div>
              </div>
            </div>
          </section>

          <section v-if="node.forumThread.opLastReply" class="thread-section op-last">
            <h2 class="section-h">
              发帖人 {{ node.forumThread.author }} 最后回复：
            </h2>
            <blockquote class="op-quote">
              <p
                v-for="(para, pi) in node.forumThread.opLastReply.paragraphs"
                :key="pi"
                class="op-p"
              >
                {{ para }}
              </p>
            </blockquote>
          </section>

          <footer class="thread-foot">{{ node.forumThread.footerStats }}</footer>
        </article>

        <article v-else class="post post--plain">
          <pre class="pre">{{ node.content }}</pre>
          <p v-if="node.timeline" class="time">{{ node.timeline }}</p>
        </article>
      </main>
      <SearchPanel
        class="side"
        :disabled="forumSearchDisabled"
        :hint="forumSearchDisabled ? '登录后可搜索帖子' : ''"
        @search="onForumSearch"
      />
    </div>
  </div>
</template>

<style scoped>
/* 黑底红字 · 横屏主内容区加宽 · 字体见 themes.css `.theme-forum` */
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

/* —— 主帖 —— */
.thread {
  padding: clamp(1.25rem, 2.5vw, 1.85rem) clamp(1.1rem, 2.5vw, 2rem) 1.75rem;
  color: #e0a0a0;
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

/* —— 楼层：仿评论列表，左侧圆形占位（血色暗斑） —— */
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
</style>
