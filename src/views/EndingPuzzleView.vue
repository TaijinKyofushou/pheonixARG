<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PUZZLE_ROWS } from '@/content/puzzleAnswers'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const game = useGameStore()

const fanren = ref('')
const rows = reactive(
  PUZZLE_ROWS.map(() => ({
    爝者: '',
    year: '',
    month: '',
    day: '',
    薪主: '',
  })),
)

const burning = ref(false)
const blackout = ref(false)
const err = ref('')

function ignite() {
  err.value = ''
  burning.value = true
  window.setTimeout(() => {
    burning.value = false
    blackout.value = true
  }, 900)
  window.setTimeout(() => {
    const ok = game.submitPuzzle({
      fanren: fanren.value,
      rows: rows.map((r) => ({ ...r })),
    })
    if (ok) {
      router.push('/node/33')
    } else {
      blackout.value = false
      err.value = '仪式文字与业果记录不一致（请严格逐字匹配）。'
    }
  }, 1200)
}
</script>

<template>
  <div class="wrap" :class="{ blackout }">
    <div class="paper" :class="{ burning }">
      <h1 class="h">黄符</h1>
      <p class="hint">一字不能差（严格匹配）。</p>

      <label class="row">
        <span class="lab">凡人</span>
        <input v-model="fanren" class="inp short" maxlength="8" />
        <span class="lab">人，干涉因果，禁锢业环。</span>
      </label>

      <div v-for="(r, idx) in rows" :key="idx" class="block">
        <div class="line">
          <span>爝者</span>
          <input v-model="r.爝者" class="inp tiny" maxlength="10" />
          <span>，</span>
          <input v-model="r.year" class="inp w4" maxlength="8" />
          <span>年</span>
          <input v-model="r.month" class="inp w2" maxlength="4" />
          <span>月</span>
          <input v-model="r.day" class="inp w2" maxlength="4" />
          <span>日许愿，其愿为</span>
          <span class="fix">{{ ['死而复生', '知足常乐', '学业有成', '存在抹除'][idx] }}</span>
          <span>，薪主</span>
          <input v-model="r.薪主" class="inp tiny" maxlength="10" />
          <span>。</span>
        </div>
      </div>

      <p class="tail">今尘埃已定，业果已成，敕令薪火归垣，涅槃重生。</p>

      <p v-if="err" class="err">{{ err }}</p>

      <button type="button" class="ignite" @click="ignite">点燃</button>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  min-height: 100vh;
  padding: 1rem;
  display: grid;
  place-items: center;
  background: radial-gradient(900px 500px at 50% 0%, #2a1212, #0a0a0c);
}
.wrap.blackout {
  background: #000;
}
.paper {
  width: min(920px, 100%);
  border: 1px solid #5a2222;
  border-radius: 14px;
  padding: 1rem;
  background: rgba(40, 10, 10, 0.35);
  color: #ff6a6a;
  font-family: 'KaiTi', 'STKaiti', 'SimSun', serif;
  transition: filter 0.8s ease, opacity 0.8s ease;
}
.paper.burning {
  filter: blur(1px) contrast(1.2);
  opacity: 0.05;
}
.h {
  margin: 0 0 0.5rem;
  color: #ff8f8f;
}
.hint {
  margin: 0 0 0.75rem;
  opacity: 0.85;
  font-size: 0.9rem;
}
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  margin: 0.5rem 0 0.75rem;
}
.block {
  margin: 0.65rem 0;
}
.line {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  align-items: center;
  line-height: 1.7;
}
.lab {
  opacity: 0.9;
}
.inp {
  border: none;
  border-bottom: 1px solid rgba(255, 100, 100, 0.55);
  background: transparent;
  color: inherit;
  padding: 0.1rem 0.2rem;
  font: inherit;
}
.inp.short {
  width: 3rem;
  text-align: center;
}
.inp.tiny {
  width: 2.25rem;
  text-align: center;
}
.inp.w4 {
  width: 3.25rem;
  text-align: center;
}
.inp.w2 {
  width: 2rem;
  text-align: center;
}
.fix {
  color: #ffb4b4;
}
.tail {
  margin: 0.85rem 0 0;
  line-height: 1.8;
}
.err {
  margin: 0.75rem 0 0;
  color: #ffb4b4;
  font-family: system-ui, sans-serif;
  font-size: 0.9rem;
}
.ignite {
  margin-top: 0.85rem;
  padding: 0.65rem 0.95rem;
  border-radius: 10px;
  border: 1px solid #ff4b4b;
  background: rgba(120, 20, 20, 0.35);
  color: inherit;
  cursor: pointer;
  font-family: system-ui, sans-serif;
}
</style>
