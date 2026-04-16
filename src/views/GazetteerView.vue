<script setup lang="ts">
import { computed } from 'vue'
import type { FullPageNode } from '@/types/story'
import { useRouter } from 'vue-router'

const props = defineProps<{
  node: FullPageNode
}>()

const router = useRouter()

const blocks = computed(() => {
  const raw = (props.node.content ?? '').trim()
  return raw.split(/\n{2,}/).map((s) => s.replace(/\n/g, '').trim()).filter(Boolean)
})

const title = computed(() => blocks.value[0] ?? '')
const bodyParagraphs = computed(() => blocks.value.slice(1))

function back() {
  if (window.history.length > 1) {
    router.back()
    return
  }
  router.push('/node/1')
}
</script>

<template>
  <div class="gazetteer">
    <div class="paper">
      <header class="masthead">
        <p v-if="node.gist" class="kicker">{{ node.gist }}</p>
        <p v-if="node.timeline" class="era">{{ node.timeline }}</p>
      </header>

      <h1 class="book-title">{{ title }}</h1>

      <div class="rule" aria-hidden="true" />

      <article class="body">
        <p v-for="(para, i) in bodyParagraphs" :key="i" class="para">
          {{ para }}
        </p>
      </article>

      <footer class="footer-ornament" aria-hidden="true">
        <span class="seal">破局之机，惟环外也</span>
      </footer>
    </div>

    <button type="button" class="back" @click="back">返回</button>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Liu+Jian+Mao+Cao&family=Noto+Serif+SC:wght@400;600;700&display=swap');

.gazetteer {
  --ink: #1a1510;
  --ink-soft: #3d3428;
  --paper: #e8dcc4;
  --paper-deep: #d4c4a8;
  --vermilion: #8b2e2e;
  --border: rgba(61, 52, 40, 0.35);

  min-height: 100vh;
  padding: 1.5rem 1rem 4rem;
  background: linear-gradient(160deg, #2a241c 0%, #1a1612 45%, #0f0d0b 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  font-family: 'Noto Serif SC', 'Songti SC', 'SimSun', serif;
  color: var(--ink);
}

.paper {
  width: min(42rem, 100%);
  padding: 2rem 1.75rem 2.5rem;
  background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 0%,
      transparent 8%,
      transparent 92%,
      rgba(0, 0, 0, 0.04) 100%
    ),
    linear-gradient(180deg, var(--paper) 0%, var(--paper-deep) 100%);
  box-shadow:
    0 0 0 1px var(--border),
    0 0 0 6px rgba(232, 220, 196, 0.25),
    0 18px 48px rgba(0, 0, 0, 0.45);
  border-radius: 2px;
  position: relative;
}

.paper::before {
  content: '';
  position: absolute;
  inset: 10px;
  border: 1px solid rgba(61, 52, 40, 0.2);
  border-radius: 1px;
  pointer-events: none;
}

.masthead {
  text-align: center;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
}

.kicker {
  margin: 0;
  font-size: 0.8rem;
  letter-spacing: 0.35em;
  color: var(--ink-soft);
}

.era {
  margin: 0.35rem 0 0;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--vermilion);
  opacity: 0.9;
}

.book-title {
  margin: 1rem 0 0.75rem;
  text-align: center;
  font-size: clamp(1.35rem, 4vw, 1.75rem);
  font-weight: 700;
  letter-spacing: 0.28em;
  line-height: 1.5;
  position: relative;
  z-index: 1;
}

.rule {
  height: 1px;
  margin: 0 auto 1.25rem;
  width: min(12rem, 60%);
  background: linear-gradient(90deg, transparent, var(--vermilion), transparent);
  opacity: 0.55;
  position: relative;
  z-index: 1;
}

.body {
  position: relative;
  z-index: 1;
}

.para {
  margin: 0 0 1.05rem;
  font-size: 0.98rem;
  line-height: 2.05;
  text-align: justify;
  text-indent: 2em;
  letter-spacing: 0.04em;
}

.para:last-child {
  margin-bottom: 0;
}

.footer-ornament {
  margin-top: 0rem;
  padding: 0.2rem 0 2rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-height: 3rem;
  overflow: visible;
  position: relative;
  z-index: 1;
}

.seal {
  display: inline-block;
  white-space: nowrap;
  font-family: 'Liu Jian Mao Cao', 'STKaiti', cursive;
  font-size: clamp(1.15rem, 3.2vw, 1.55rem);
  font-weight: 400;
  letter-spacing: 0.12em;
  line-height: 1;
  color: var(--vermilion);
  opacity: 0.88;
  border-bottom: 1px solid rgba(139, 46, 46, 0.35);
  padding-bottom: 0.15em;
  transform: rotate(-11deg);
  transform-origin: 100% 50%;
}

.back {
  margin-top: 1.25rem;
  padding: 0.5rem 1.1rem;
  border: 1px solid rgba(232, 220, 196, 0.35);
  border-radius: 6px;
  background: rgba(30, 26, 22, 0.6);
  color: rgba(232, 220, 196, 0.92);
  font-family: inherit;
  font-size: 0.9rem;
  letter-spacing: 0.12em;
  cursor: pointer;
}

.back:hover {
  background: rgba(45, 38, 32, 0.75);
}
</style>
