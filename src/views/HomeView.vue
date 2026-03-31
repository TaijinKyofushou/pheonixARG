<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const game = useGameStore()

function start() {
  router.push('/node/1')
}

function reset() {
  if (confirm('确定清空本地进度？')) game.resetProgress()
}
</script>

<template>
  <div class="wrap">
    <header class="hero">
      <h1 class="title">凤凰还愿</h1>
      <p class="sub">关键词搜索 · 账号登录 · 静态解密 AVG</p>
    </header>
    <section class="card">
      <p class="p">
        游戏须知：你扮演一名大学生，为提交计组作业而寻找助教与教授联系方式，误入一段被截获的聊天记录。通过搜索关键词、登录账号与点击链接，拼合 A、B、C、D
        四人的因果循环。
      </p>
      <div class="actions">
        <button type="button" class="primary" @click="start">进入聊天室</button>
        <button type="button" class="ghost" @click="reset">重置进度</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.wrap {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
}
.hero {
  margin-bottom: 1.25rem;
}
.title {
  margin: 0;
  font-size: 2rem;
  letter-spacing: 0.08em;
}
.sub {
  margin: 0.35rem 0 0;
  opacity: 0.8;
}
.card {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1rem 1.1rem;
  background: var(--color-panel);
}
.p {
  line-height: 1.65;
  margin: 0 0 1rem;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
.primary {
  padding: 0.55rem 0.9rem;
  border-radius: 8px;
  border: 1px solid var(--color-accent);
  background: var(--color-accent);
  color: #fff;
  cursor: pointer;
}
.ghost {
  padding: 0.55rem 0.9rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: inherit;
  cursor: pointer;
}
</style>
