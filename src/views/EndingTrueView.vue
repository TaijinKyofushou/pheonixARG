<script setup lang="ts">
import { ref } from 'vue'
import type { FullPageNode } from '@/types/story'

defineProps<{
  node: FullPageNode
}>()

const choice = ref<'A' | 'B' | 'C' | null>(null)
const tone = ref<'很聪明' | '人很好' | '很亲切'>('很聪明')

const lines = ref<string[]>([])

function sendPreset() {
  lines.value = [
    '你：学长这是我的计组大作业',
    '你：计组期中大作业.pdf',
    'D：收到',
    '你：对了学长',
    '你：你认识___吗？',
  ]
}

function pickWho(who: 'A' | 'B' | 'C') {
  choice.value = who
  lines.value = [
    '你：学长这是我的计组大作业',
    '你：计组期中大作业.pdf',
    'D：收到',
    '你：对了学长',
    `你：你认识${who}吗？`,
    'D：没听过',
    `D：这名字听起来${tone.value}的样子`,
    '你：没事',
    '你：我就问一下',
    '你：谢谢学长',
  ]
}

sendPreset()
</script>

<template>
  <div class="wx">
    <header class="bar">
      <div class="back" aria-hidden="true">＜</div>
      <div class="title">
        <div class="name">计组助教D</div>
        <div class="sub">在线</div>
      </div>
      <div class="more" aria-hidden="true">⋯</div>
    </header>

    <main class="feed">
      <div v-for="(l, i) in lines" :key="i" class="bubble" :class="l.startsWith('D') ? 'them' : 'me'">
        {{ l }}
      </div>
    </main>

    <footer class="foot">
      <div class="row" v-if="!choice">
        <span class="lab">选择询问对象：</span>
        <button type="button" class="chip" @click="pickWho('A')">A</button>
        <button type="button" class="chip" @click="pickWho('B')">B</button>
        <button type="button" class="chip" @click="pickWho('C')">C</button>
      </div>
      <div class="row" v-else>
        <span class="lab">D 的形容词：</span>
        <select v-model="tone" class="sel" @change="pickWho(choice)">
          <option value="很聪明">很聪明</option>
          <option value="人很好">人很好</option>
          <option value="很亲切">很亲切</option>
        </select>
      </div>
      <button type="button" class="send" @click="sendPreset">发送预设开场</button>
    </footer>
  </div>
</template>

<style scoped>
.wx {
  min-height: 100vh;
  max-width: 520px;
  margin: 0 auto;
  background: #ededed;
  color: #111;
  display: flex;
  flex-direction: column;
}
.bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.75rem;
  background: #f7f7f7;
  border-bottom: 1px solid #d9d9d9;
}
.back,
.more {
  width: 28px;
  opacity: 0.35;
}
.title {
  flex: 1;
  text-align: center;
}
.name {
  font-weight: 700;
}
.sub {
  font-size: 0.75rem;
  opacity: 0.55;
}
.feed {
  flex: 1;
  padding: 0.75rem;
  overflow: auto;
}
.bubble {
  max-width: 86%;
  padding: 0.55rem 0.65rem;
  border-radius: 10px;
  margin: 0.45rem 0;
  line-height: 1.45;
  white-space: pre-wrap;
}
.me {
  margin-left: auto;
  background: #95ec69;
}
.them {
  margin-right: auto;
  background: #fff;
  border: 1px solid #e3e3e3;
}
.foot {
  border-top: 1px solid #d9d9d9;
  background: #f7f7f7;
  padding: 0.65rem 0.75rem 1rem;
  display: grid;
  gap: 0.55rem;
}
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: center;
  font-size: 0.9rem;
}
.lab {
  opacity: 0.75;
}
.chip {
  border: 1px solid #cfcfcf;
  background: #fff;
  border-radius: 999px;
  padding: 0.25rem 0.55rem;
  cursor: pointer;
}
.sel {
  padding: 0.35rem 0.5rem;
  border-radius: 8px;
  border: 1px solid #cfcfcf;
}
.send {
  border: 1px solid #cfcfcf;
  background: #fff;
  border-radius: 8px;
  padding: 0.45rem 0.65rem;
  cursor: pointer;
}
</style>
