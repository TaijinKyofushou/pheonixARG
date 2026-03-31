<script setup lang="ts">
import type { FullPageNode } from '@/types/story'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

defineProps<{
  node: FullPageNode
}>()

const router = useRouter()
const game = useGameStore()

function go() {
  game.unlockPuzzle29()
  router.push('/node/29')
}
</script>

<template>
  <div class="wrap theme-forum">
    <article class="paper">
      <h1 class="h">酉时三刻</h1>
      <p class="p">
        你出发去教三地下室，果然发现了一个狭窄的配电室和一块颜色明显不一样的砖块。搬开砖块，里面露出灰色的余烬。你拿出黄色符纸，开始书写。
      </p>
      <button type="button" class="btn" @click="go">开始书写</button>
    </article>
  </div>
</template>

<style scoped>
.wrap {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: radial-gradient(900px 500px at 50% 0%, #2a1212, #0a0a0c);
}
.paper {
  width: min(820px, 100%);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 1.1rem;
  background: rgba(15, 15, 18, 0.85);
}
.h {
  margin: 0 0 0.75rem;
  letter-spacing: 0.12em;
}
.p {
  margin: 0 0 1rem;
  line-height: 1.85;
  white-space: pre-wrap;
}
.btn {
  padding: 0.65rem 0.95rem;
  border-radius: 10px;
  border: 1px solid var(--color-accent);
  background: rgba(201, 75, 75, 0.18);
  color: inherit;
  cursor: pointer;
}
</style>
