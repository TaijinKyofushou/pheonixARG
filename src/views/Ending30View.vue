<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FullPageNode } from '@/types/story'
import { useGameStore } from '@/stores/game'

defineProps<{
  node: FullPageNode
}>()

const router = useRouter()
const game = useGameStore()

const allLines = ref<string[]>([])
const shown = ref(0)
const showTransfer = ref(false)
const showCta = ref(false)

onMounted(() => {
  const raw = `A：相信你已经知道了一切的来龙去脉
A：很抱歉把你卷进来
A：只有在因果环之外的人，才能干涉因果，扭转结局
A：酉时三刻，按照我发你的内容去写，一字不能差，然后完成仪式
A：这样就能救下所有人
A：最后，不管你是谁
A：谢谢你`
  allLines.value = raw.split('\n').filter(Boolean)
  shown.value = 0
  const timer = window.setInterval(() => {
    shown.value += 1
    if (shown.value >= allLines.value.length) {
      window.clearInterval(timer)
      window.setTimeout(() => {
        showTransfer.value = true
      }, 400)
      window.setTimeout(() => {
        showTransfer.value = false
        showCta.value = true
        game.finishEnding30Messages()
      }, 1700)
    }
  }, 650)
})

function go() {
  game.unlockNarrative31()
  router.push('/node/31')
}
</script>

<template>
  <div class="wrap">
    <header class="top">
      <button type="button" class="back" @click="router.push('/node/1')">返回</button>
      <div class="t">来自 A 的消息</div>
    </header>

    <section class="feed" aria-live="polite">
      <p v-for="i in shown" :key="i" class="line">{{ allLines[i - 1] }}</p>
    </section>

    <div v-if="showTransfer" class="modal" role="status">文件传输中…</div>

    <div v-if="showCta" class="cta">
      <button type="button" class="btn" @click="go">去教三地下室</button>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  max-width: 760px;
  margin: 0 auto;
  padding: 1rem;
  min-height: 100vh;
}
.top {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 0.75rem;
}
.back {
  border: 1px solid var(--color-border);
  background: var(--color-panel);
  color: inherit;
  border-radius: 8px;
  padding: 0.4rem 0.65rem;
  cursor: pointer;
}
.t {
  font-weight: 700;
}
.feed {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 0.9rem;
  background: var(--color-panel);
  min-height: 240px;
}
.line {
  margin: 0.35rem 0;
  line-height: 1.55;
}
.modal {
  margin-top: 0.75rem;
  padding: 0.65rem 0.75rem;
  border-radius: 10px;
  border: 1px dashed var(--color-border);
}
.cta {
  margin-top: 0.9rem;
  display: flex;
  justify-content: center;
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
