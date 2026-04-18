<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { FullPageNode } from '@/types/story'
import SearchPanel from '@/components/chat/SearchPanel.vue'
import { flavourSearchHint } from '@/content/searchHints'
import { useGameStore } from '@/stores/game'
import { getFullPage } from '@/content/storyNodes'

const props = defineProps<{
  node: FullPageNode
  forumVariant: 'guest' | 'd_posts' | 'truth'
}>()

const router = useRouter()
const game = useGameStore()

onMounted(() => {
  if (!game.forumLoggedIn) {
    router.replace('/node/11')
  }
})

function backToForum() {
  router.push('/node/10')
}

function openMyPostThread() {
  router.push('/node/12')
}

const myPostThread = computed(() => getFullPage(12)?.forumThread)

const myPostReplyCount = computed(() => {
  const th = myPostThread.value
  if (!th) return null
  const m = th.footerStats?.match(/共有\s*(\d+)\s*条回复/)
  if (m) return m[1]
  return String((th.pinnedReplies?.length ?? 0) + th.replies.length)
})

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
  }
  const path = map[kw.trim()]
  if (path) router.push(path)
}
</script>

<template>
  <div class="wrap theme-forum">
    <header class="top">
      <button type="button" class="back" @click="backToForum">返回论坛</button>
      <div class="brand">四零四聊斋</div>
      <div class="spacer" />
      <span class="pill">已登录：Deposit</span>
    </header>

    <div class="layout">
      <main class="main">
        <article class="profile">
          <p class="kicker">个人中心</p>
          <h1 class="title">Deposit</h1>
          <div class="password-warn" role="alert">
            <span class="password-warn-icon" aria-hidden="true">⚠</span>
            <p class="password-warn-text">请及时修改初始密码！</p>
          </div>
          <p v-if="node.content" class="intro">{{ node.content }}</p>

          <section class="actions">
            <h2 class="section-h">我的发帖</h2>
            <button
              v-if="myPostThread"
              type="button"
              class="post-row"
              @click="openMyPostThread"
            >
              <div class="post-row-top">
                <span class="post-board">{{ myPostThread.board }}</span>
              </div>
              <p class="post-title">{{ myPostThread.title }}</p>
              <div class="post-row-meta">
                <span class="meta-item">
                  <span class="meta-label">发帖时间</span>
                  {{ myPostThread.publishedAt }}
                </span>
                <span class="meta-sep">·</span>
                <span class="meta-item">
                  <span class="meta-label">回复</span>
                  <template v-if="myPostReplyCount != null">{{ myPostReplyCount }} 条</template>
                  <template v-else>—</template>
                </span>
              </div>
            </button>
            <p v-else class="post-empty">暂无主题帖</p>
          </section>
        </article>
      </main>
      <SearchPanel
        class="side"
        :disabled="forumVariant === 'guest'"
        :hint="forumVariant === 'guest' ? '登录后可搜索帖子' : ''"
        @search="onForumSearch"
      />
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
.spacer {
  flex: 1;
}
.back {
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
.back:hover {
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

.profile {
  padding: clamp(1.25rem, 2.5vw, 1.85rem) clamp(1.1rem, 2.5vw, 2rem) 1.75rem;
  color: #e0a0a0;
}
.kicker {
  margin: 0 0 0.55rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #b01010;
  text-transform: uppercase;
}
.title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.35rem, 2.8vw, 1.65rem);
  font-weight: 700;
  color: #7c0000;
  text-shadow: 0 0 40px rgba(120, 0, 0, 0.35);
}
.password-warn {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  margin: 0 0 1.25rem;
  padding: 0.65rem 0.9rem;
  border: 1px solid rgba(200, 90, 90, 0.5);
  border-radius: 6px;
  background: rgba(160, 40, 40, 0.22);
  box-shadow:
    inset 0 1px 0 rgba(255, 140, 140, 0.12),
    0 0 18px rgba(120, 20, 20, 0.2);
}
.password-warn-icon {
  flex-shrink: 0;
  font-size: 1.05rem;
  line-height: 1.45;
  color: #ff6b6b;
  text-shadow: 0 0 12px rgba(255, 80, 80, 0.45);
}
.password-warn-text {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.5;
  color: #d4a0a0;
}
.intro {
  margin: 0 0 1rem;
  line-height: 1.85;
  font-size: 0.95rem;
  color: #7c0000;
  text-align: justify;
  text-justify: inter-ideograph;
}
.time {
  margin: 0 0 1.5rem;
  font-size: 0.82rem;
  color: #6a4040;
}

.actions {
  padding-top: 1.25rem;
  border-top: 4px solid #1a1012;
}
.section-h {
  margin: 0 0 1rem;
  padding-left: 0.6rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: #9a5555;
  letter-spacing: 0.08em;
  border-left: 4px solid var(--color-accent);
}
.post-row {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0.9rem 1rem;
  text-align: left;
  border: 1px solid #3c1010;
  border-radius: 6px;
  background: rgba(35, 6, 6, 0.45);
  color: inherit;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s,
    box-shadow 0.15s;
}
.post-row:hover {
  border-color: var(--color-accent);
  background: rgba(55, 10, 10, 0.55);
  box-shadow: 0 0 20px rgba(120, 20, 20, 0.25);
}
.post-row:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
.post-row-top {
  margin-bottom: 0.35rem;
}
.post-board {
  font-size: 0.78rem;
  color: #8a5555;
}
.post-title {
  margin: 0 0 0.65rem;
  font-size: 0.98rem;
  font-weight: 700;
  line-height: 1.45;
  color: #7c0000;
}
.post-row-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.5rem;
  font-size: 0.82rem;
  color: #8a6060;
}
.meta-label {
  margin-right: 0.25rem;
  color: #5c3838;
  font-weight: 600;
}
.meta-sep {
  opacity: 0.4;
  user-select: none;
}
.post-empty {
  margin: 0;
  padding: 0.75rem 0;
  font-size: 0.86rem;
  color: #6a5050;
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
