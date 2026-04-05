<script setup lang="ts">
import { computed } from 'vue'
import type { FullPageNode } from '@/types/story'
import { useRouter } from 'vue-router'

const props = defineProps<{
  node: FullPageNode
}>()

const router = useRouter()

const articleTitle = computed(() => {
  const g = props.node.gist?.trim()
  return g && g.length > 0 ? g : props.node.pageType || '学校通告'
})

const paragraphs = computed(() =>
  (props.node.content ?? '')
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean),
)

/** 伪浏览量，随节点 id 变化 */
const viewCount = computed(() => 120 + (props.node.id * 47) % 380)

function back() {
  router.push('/node/1')
}
</script>

<template>
  <div class="wrap">
    <div class="top-accent" aria-hidden="true" />

    <header class="hdr">
      <button type="button" class="back" @click="back">返回</button>
      <div class="brand">教务公告</div>
    </header>

    <div class="shell">
      <nav class="crumb" aria-label="面包屑">
        <span class="crumb-link">首页</span>
        <span class="crumb-sep" aria-hidden="true">&gt;&gt;</span>
        <span class="crumb-here">正文</span>
      </nav>

      <article class="paper">
        <h1 class="article-title">{{ articleTitle }}</h1>
        <p v-if="node.timeline" class="meta">
          <time :datetime="node.timeline">{{ node.timeline }}</time>
          <span class="meta-dot" aria-hidden="true">·</span>
          <span>浏览数：{{ viewCount }}次</span>
        </p>
        <div class="rule" role="presentation" />

        <div class="body">
          <p v-for="(para, i) in paragraphs" :key="i" class="para">
            {{ para }}
          </p>
        </div>
      </article>
    </div>

    <footer class="foot">
      <span class="foot-inner">教务处电话：<strong class="accent">66605088</strong></span>
    </footer>
  </div>
</template>

<style scoped>
.wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  color: #1a1a1a;
}

/* 顶缘深红窄条，替代原大块留白横幅 */
.top-accent {
  flex-shrink: 0;
  height: 8px;
  background: #7f1d1d;
}

.hdr {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 1.25rem;
  border-bottom: 1px solid #ece8e8;
  background: #ffffff;
}
.brand {
  font-weight: 700;
  letter-spacing: 0.12em;
  font-size: 0.95rem;
  color: #374151;
}
.back {
  border: 1px solid #d4c8c9;
  background: #faf8f8;
  color: #374151;
  border-radius: 8px;
  padding: 0.35rem 0.65rem;
  cursor: pointer;
  font-size: 0.88rem;
}
.back:hover {
  border-color: #8b2323;
  color: #6b1d1d;
  background: #fff8f8;
}

.shell {
  flex: 1;
  width: 100%;
  max-width: 920px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem 2.5rem;
  box-sizing: border-box;
}

.crumb {
  font-size: 0.82rem;
  color: #8b9099;
  margin-bottom: 1.5rem;
}
.crumb-link {
  border: none;
  background: none;
  padding: 0;
  color: #7f1d1d;
  font: inherit;
  text-decoration: none;
}
.crumb-sep {
  margin: 0 0.35rem;
  color: #c4b8ba;
}
.crumb-here {
  color: #6b7280;
}

.paper {
  padding: 0.25rem 0 1rem;
}

.article-title {
  margin: 0 0 1rem;
  text-align: center;
  font-size: clamp(1.15rem, 2.8vw, 1.45rem);
  font-weight: 700;
  line-height: 1.45;
  color: #111827;
  letter-spacing: 0.02em;
}

.meta {
  margin: 0 0 1.25rem;
  text-align: center;
  font-size: 0.88rem;
  color: #4b5563;
}

.meta-dot {
  margin: 0 0.35rem;
  color: #9ca3af;
}

/* 标题与正文之间的深红分隔线 */
.rule {
  height: 2px;
  margin: 0 auto 1.75rem;
  max-width: 100%;
  background: #7f1d1d;
  border: none;
  border-radius: 1px;
}

.body {
  font-size: 1rem;
  line-height: 2;
  color: #1a1a1a;
}

.para {
  margin: 0 0 1.35rem;
  text-align: justify;
  text-justify: inter-ideograph;
  text-indent: 2em;
}
.para:last-child {
  margin-bottom: 0;
}

.foot {
  margin-top: auto;
  padding: 1rem 1.25rem 1.35rem;
  border-top: 1px solid #ece8e8;
  background: #fafafa;
  text-align: center;
  font-size: 0.88rem;
  color: #4b5563;
}
.foot-inner {
  display: inline-block;
}
.accent {
  color: #7f1d1d;
  font-weight: 700;
  letter-spacing: 0.06em;
}

@media (max-width: 560px) {
  .shell {
    padding: 1rem 1rem 2rem;
  }
  .article-title {
    font-size: 1.05rem;
  }
}
</style>
