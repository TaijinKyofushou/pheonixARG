<script setup lang="ts">
import { computed, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PUZZLE_ROWS } from '@/content/puzzleAnswers'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const game = useGameStore()

const rows = reactive(
  PUZZLE_ROWS.map(() => ({
    wisher: '',
    year: '',
    month: '',
    day: '',
    wishReceiver: '',
  })),
)

const burning = ref(false)
const blackout = ref(false)
const ashCount = ref(88)

/** 原型.html：径向燃烧遮罩 */
const burnRadius = ref(0)
const burnOverlayOpacity = ref(0)
const burnGradient = computed(
  () =>
    `radial-gradient(circle at 85% 90%, #ff6a00 ${burnRadius.value}px, #2a0000 100%)`,
)

type BurnEmber = { id: number; left: string; top: string }
const burnEmbers = ref<BurnEmber[]>([])
let burnIntervalId: number | null = null
let burnEmberSeq = 0

function clearBurnInterval() {
  if (burnIntervalId != null) {
    window.clearInterval(burnIntervalId)
    burnIntervalId = null
  }
}

function startBurnSpread() {
  clearBurnInterval()
  burnRadius.value = 0
  burnOverlayOpacity.value = 0
  const maxRadius = 260
  const step = 12
  burnIntervalId = window.setInterval(() => {
    burnRadius.value += step
    burnOverlayOpacity.value = Math.min(burnRadius.value / maxRadius, 0.85)
    if (burnRadius.value >= maxRadius) {
      clearBurnInterval()
      burnOverlayOpacity.value = 0.95
    }
  }, 50) as unknown as number
}

function spawnBurnEmbers() {
  burnEmbers.value = []
  for (let i = 0; i < 40; i++) {
    window.setTimeout(() => {
      const id = ++burnEmberSeq
      burnEmbers.value = [
        ...burnEmbers.value,
        {
          id,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        },
      ]
      window.setTimeout(() => {
        burnEmbers.value = burnEmbers.value.filter((e) => e.id !== id)
      }, 800)
    }, i * 30)
  }
}

onUnmounted(() => {
  clearBurnInterval()
})

const allCompleted = computed(() =>
  rows.every((r) =>
    [r.wisher, r.year, r.month, r.day, r.wishReceiver].every((v) => v.trim().length > 0),
  ),
)

const PARTICLE_COUNT = 110
const ashParticles = Array.from({ length: PARTICLE_COUNT }, (_, idx) => {
  const seed = (idx * 73) % 97
  const jitter = (n: number) => ((seed * n + idx * 17) % 31) / 100
  return {
    left: `${((seed * 13 + idx * 9) % 100).toFixed(2)}%`,
    top: `${((seed * 7 + idx * 11) % 100).toFixed(2)}%`,
    size: `${0.9 + jitter(3) * 4.2}px`,
    delay: `${-(idx % 11) * 0.31}s`,
    duration: `${4.2 + (idx % 14) * 0.55}s`,
    blur: `${0.15 + (seed % 5) * 0.22}px`,
    isSpeck: idx % 5 === 0,
  }
})

function ignite() {
  if (!allCompleted.value || burning.value) {
    return
  }
  game.submitPuzzle({
    rows: rows.map((r) => ({ ...r })),
  })

  burning.value = true
  ashCount.value = PARTICLE_COUNT
  startBurnSpread()
  spawnBurnEmbers()

  window.setTimeout(() => {
    blackout.value = true
  }, 2000)

  window.setTimeout(() => {
    router.push('/node/33')
  }, 2700)
}
</script>

<template>
  <div class="wrap" :class="{ blackout, burning }">
    <div class="bg-image" aria-hidden="true" />
    <div class="vignette-overlay" aria-hidden="true" />
    <div class="wrap-foreground">
    <div class="paper" :class="{ burning }">
      <div class="paper-noise" aria-hidden="true" />
      <header class="banner">太上老君急急如律令</header>

      <div class="rails-body">
        <div class="rail rail-l" aria-hidden="true">敕令薪火归垣</div>

        <div class="mid">

          <div v-for="(r, idx) in rows" :key="idx" class="block">
            <p class="t-line">
              <span>爝者</span>
              <input v-model="r.wisher" class="inp name" maxlength="15" />
              <span>，</span>
              <input v-model="r.year" class="inp w4" maxlength="8" />
              <span>年</span>
              <input v-model="r.month" class="inp w2" maxlength="4" />
              <span>月</span>
              <input v-model="r.day" class="inp w2" maxlength="4" />
              <span>日</span>
              <span>许愿，其愿为</span>
              <span class="wish">{{ ['死而复生', '平安喜乐', '学业有成', '因果抹除'][idx] }}</span>
              <span>，</span>
              <span>薪主</span>
              <input v-model="r.wishReceiver" class="inp name" maxlength="10" />
              <span>。</span>
            </p>
          </div>
        </div>

        <div class="rail rail-r" aria-hidden="true">敕令薪火归垣</div>
      </div>

      <p class="tail">今尘埃已定，业果已成，敕令薪火归垣，涅槃重生。</p>

      <div
        v-show="burning"
        class="burn-overlay"
        aria-hidden="true"
        :style="{
          opacity: burnOverlayOpacity,
          background: burnGradient,
        }"
      />
      <div class="burn-ember-layer" aria-hidden="true">
        <div
          v-for="e in burnEmbers"
          :key="e.id"
          class="burn-ember"
          :style="{ left: e.left, top: e.top }"
        />
      </div>

      <div class="ash-layer" aria-hidden="true">
        <span
          v-for="(p, idx) in ashParticles.slice(0, ashCount)"
          :key="idx"
          class="ash"
          :class="{ 'ash--speck': p.isSpeck }"
          :style="{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            filter: `blur(${p.blur})`,
          }"
        />
      </div>
    </div>
    </div>

    <Teleport to="body">
      <Transition name="seal-fade">
        <div
          v-if="allCompleted && !burning"
          class="seal-layer"
          aria-live="polite"
        >
          <div
            role="button"
            tabindex="0"
            class="seal-glass"
            aria-label="点燃"
            @click="ignite"
            @keydown.enter.prevent="ignite"
            @keydown.space.prevent="ignite"
          >
            <span class="seal-label">点燃</span>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Liu+Jian+Mao+Cao&family=Noto+Serif+SC&family=Zhi+Mang+Xing:wght@400;700;900&display=swap');

.wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0a0000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.4rem;
  transition: opacity 0.7s ease, filter 0.3s ease;
}
.wrap .bg-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('@/assets/image_background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 1;
  z-index: 0;
  filter: brightness(1) contrast(1);
  animation: bgFlicker 4s ease-in-out infinite;
}
.wrap .vignette-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    transparent 30%,
    rgba(60, 0, 0, 0.4) 70%,
    rgba(20, 0, 0, 0.8) 100%
  );
}
.wrap-foreground {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-height: 100%;
}
@keyframes bgFlicker {
  0%,
  100% {
    filter: brightness(1) contrast(1);
  }
  45% {
    filter: brightness(1) contrast(1);
  }
  50% {
    filter: brightness(0.6) contrast(1.2) sepia(0.3) hue-rotate(-10deg);
  }
  55% {
    filter: brightness(1) contrast(1);
  }
  70% {
    filter: brightness(0.7) contrast(1.1);
  }
  75% {
    filter: brightness(1) contrast(1);
  }
}
.wrap.blackout {
  opacity: 0;
}
.wrap.burning {
  animation: screen-flicker 0.16s steps(2, end) infinite;
}
.paper {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  transform-origin: center center;
  width: min(325px, 100%);
  border-radius: 0;
  padding: 1.35rem 0.55rem 1.5rem;
  color: #8b1d04;
  font-family: 'KaiTi', 'STKaiti', 'SimSun', 'Noto Serif SC', serif;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.48);
  background:
    radial-gradient(ellipse 120% 85% at 50% 50%, rgba(255, 248, 210, 0.14) 0%, transparent 58%),
    radial-gradient(circle at 12% 18%, rgba(200, 150, 70, 0.08) 0, transparent 32%),
    radial-gradient(circle at 88% 72%, rgba(190, 130, 55, 0.07) 0, transparent 30%),
    repeating-linear-gradient(
      92deg,
      rgba(120, 82, 30, 0.045) 0 1px,
      transparent 1px 5px
    ),
    repeating-linear-gradient(
      -88deg,
      rgba(90, 58, 22, 0.035) 0 1px,
      transparent 1px 6px
    ),
    repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.042) 0 1px,
      rgba(40, 28, 10, 0.022) 1px 2px,
      transparent 2px 5px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(70, 48, 18, 0.032) 0 1px,
      transparent 1px 4px
    ),
    linear-gradient(180deg, #ffdf7a 0%, #ffd24a 42%, #f2b535 100%);
  transform: translateY(20px) scale(1.25);
  opacity: 0;
  animation: paper-enter 0.8s ease forwards;
  transition: filter 0.5s ease, opacity 0.7s ease;
}
.paper > :not(.ash-layer):not(.paper-noise):not(.burn-overlay):not(.burn-ember-layer) {
  position: relative;
  z-index: 2;
}
.paper-noise {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  border-radius: inherit;
  opacity: 0.42;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px 180px;
}
.paper::before {
  content: '';
  position: absolute;
  inset: -14px;
  pointer-events: none;
  border-radius: 0;
  box-shadow:
    inset 0 0 22px rgba(90, 38, 12, 0.42),
    inset 0 0 52px rgba(62, 28, 10, 0.32),
    inset 0 0 120px rgba(40, 18, 8, 0.2),
    inset 0 0 180px rgba(28, 12, 6, 0.12);
  background:
    radial-gradient(ellipse 78% 58% at 0% 0%, rgba(52, 22, 8, 0.68) 0%, rgba(52, 22, 8, 0.28) 42%, transparent 72%),
    radial-gradient(ellipse 78% 58% at 100% 0%, rgba(52, 22, 8, 0.66) 0%, rgba(52, 22, 8, 0.26) 42%, transparent 72%),
    radial-gradient(ellipse 78% 58% at 0% 100%, rgba(52, 22, 8, 0.64) 0%, rgba(52, 22, 8, 0.26) 42%, transparent 72%),
    radial-gradient(ellipse 78% 58% at 100% 100%, rgba(52, 22, 8, 0.68) 0%, rgba(52, 22, 8, 0.28) 42%, transparent 72%),
    radial-gradient(ellipse 95% 88% at 50% 50%, transparent 38%, rgba(110, 48, 18, 0.16) 72%, rgba(62, 26, 10, 0.28) 100%);
  mix-blend-mode: multiply;
  opacity: 0.78;
}
.paper::after {
  content: '';
  position: absolute;
  inset: clamp(9px, 2.4vw, 14px);
  border: 3px solid #8b1d04;
  pointer-events: none;
  z-index: 1;
  border-radius: 0;
  box-sizing: border-box;
}
.paper.burning {
  overflow: visible;
  filter: saturate(0.68) contrast(1.15);
}
.burn-overlay {
  position: absolute;
  inset: 0;
  z-index: 11;
  pointer-events: none;
  border-radius: inherit;
  mix-blend-mode: multiply;
  transition: opacity 0.05s linear;
  background: radial-gradient(circle, #ff8c00, #4a0000);
}
.burn-ember-layer {
  position: absolute;
  inset: 0;
  z-index: 13;
  pointer-events: none;
  border-radius: inherit;
  overflow: visible;
}
.burn-ember {
  position: absolute;
  width: 4px;
  height: 4px;
  margin-left: -2px;
  margin-top: -2px;
  border-radius: 50%;
  background: #ffa500;
  filter: blur(1px);
  box-shadow: 0 0 6px rgba(255, 200, 100, 0.9);
}
.paper.burning::before {
  animation: edge-burn 2s ease forwards;
}
.banner {
  margin: 0 0 0.75rem;
  text-align: center;
  font-family: 'Liu Jian Mao Cao', 'Noto Serif SC', 'Zhi Mang Xing', serif;
  font-size: clamp(1.05rem, 1.5vw, 1.5rem);
  font-weight: 400;
  letter-spacing: 0em;
  color: #8b1d04;
}
.hint {
  margin: 0.35rem 0 0.85rem;
  text-align: center;
  color: rgba(139, 29, 4, 0.72);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
}
.rails-body {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.15rem 0.28rem;
  min-height: 0;
}
.rail {
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-family: 'Liu Jian Mao Cao', 'Noto Serif SC', 'Zhi Mang Xing', serif;
  font-size: clamp(0.78rem, 1.2vw, 2.5rem);
  letter-spacing: 0.8em;
  line-height: 1.65;
  color: #8b1d04;
  padding: 0.02rem 0;
  user-select: none;
}
.rail-l {
  justify-self: end;
  padding-left: 10px;
}
.rail-r {
  justify-self: start;
  padding-right: 10px;
}
.mid {
  text-align: left;
  font-size: clamp(0.82rem, 2.8vw, 0.95rem);
  line-height: 1.15;
  min-width: 0;
}
.block {
  margin: 0.35rem 0 0.55rem;
}
.block:last-of-type {
  margin-bottom: 0.4rem;
}
.t-line {
  margin: 0.04rem 1px;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: 0.08rem 0.15rem;
}
.inp {
  border: none;
  background: transparent;
  color: #8b1d04;
  padding: 0.06rem 0.15rem 0.02rem;
  font: inherit;
}
.inp:focus,
.inp:focus-visible {
  outline: none;
}
.inp.name {
  width: 3.25rem;
  text-align: center;
}
.inp.w4 {
  width: 2.25rem;
  text-align: center;
}
.inp.w2 {
  width: 1.5rem;
  text-align: center;
}
.wish {
  color: #b01008;
  font-weight: 700;
}
.tail {
  margin: 0.45rem 0.5rem 0;
  padding: 0 1rem;
  line-height: 1.95;
  color: #8b1d04;
  font-family: 'Liu Jian Mao Cao', 'Noto Serif SC', 'Zhi Mang Xing', serif;
  font-size: clamp(0.8rem, 1vw, 1rem);
  letter-spacing: 0.04em;
  text-align: center;
}
.seal-layer {
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: grid;
  place-items: center;
  pointer-events: none;
}
.seal-glass {
  pointer-events: auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 6.5rem;
  padding: 0.72rem 1.5rem;
  border-radius: 999px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.42);
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.22) 0%,
    rgba(255, 240, 220, 0.08) 45%,
    rgba(255, 200, 170, 0.12) 100%
  );
  backdrop-filter: blur(18px) saturate(1.35);
  -webkit-backdrop-filter: blur(18px) saturate(1.35);
  box-shadow:
    0 0 0 1px rgba(255, 220, 200, 0.2) inset,
    0 8px 32px rgba(0, 0, 0, 0.28),
    0 0 28px rgba(255, 140, 90, 0.45),
    0 0 56px rgba(255, 90, 60, 0.28),
    0 0 96px rgba(255, 60, 40, 0.15);
  outline: none;
  transition:
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.28s ease,
    background 0.28s ease,
    box-shadow 0.32s ease;
}
@media (hover: hover) {
  .seal-glass:hover {
    transform: scale(1.02) translateY(-1.5px);
    border-color: rgba(255, 255, 255, 0.62);
    background: linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.32) 0%,
      rgba(255, 248, 230, 0.16) 45%,
      rgba(255, 210, 175, 0.2) 100%
    );
    box-shadow:
      0 0 0 1px rgba(255, 240, 220, 0.38) inset,
      0 14px 44px rgba(0, 0, 0, 0.32),
      0 0 42px rgba(255, 180, 120, 0.75),
      0 0 88px rgba(255, 120, 75, 0.5),
      0 0 120px rgba(255, 80, 50, 0.28);
  }
  .seal-glass:hover .seal-label {
    color: #c41410;
    text-shadow:
      0 0 16px rgba(255, 220, 160, 0.95),
      0 0 36px rgba(255, 140, 90, 0.65),
      0 0 52px rgba(255, 90, 55, 0.4),
      0 1px 3px rgba(40, 10, 8, 0.45);
  }
}
.seal-glass:focus-visible {
  box-shadow:
    0 0 0 2px rgba(255, 255, 255, 0.65),
    0 0 0 1px rgba(255, 220, 200, 0.2) inset,
    0 8px 32px rgba(0, 0, 0, 0.28),
    0 0 36px rgba(255, 140, 90, 0.55),
    0 0 72px rgba(255, 90, 60, 0.35);
}
.seal-label {
  font-family: 'Kaiti';
  font-size: clamp(1.15rem, 4.2vw, 1.45rem);
  font-weight: 700;
  letter-spacing: 0.35em;
  text-indent: 0.35em;
  color: #b01008;
  text-shadow:
    0 0 12px rgba(255, 200, 140, 0.85),
    0 0 28px rgba(255, 120, 80, 0.45),
    0 1px 2px rgba(60, 20, 10, 0.5);
  transition: color 0.28s ease, text-shadow 0.32s ease;
}
.seal-fade-enter-active,
.seal-fade-leave-active {
  transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
.seal-fade-enter-from,
.seal-fade-leave-to {
  opacity: 0;
}
.seal-fade-enter-from .seal-glass,
.seal-fade-leave-to .seal-glass {
  transform: scale(0.88) translateY(12px);
}
.seal-fade-enter-active .seal-glass,
.seal-fade-leave-active .seal-glass {
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
.seal-fade-enter-to .seal-glass,
.seal-fade-leave-from .seal-glass {
  transform: scale(1) translateY(0);
}
.ash-layer {
  position: absolute;
  inset: -6% -4% -4%;
  pointer-events: none;
  z-index: 14;
  overflow: hidden;
}
.ash {
  position: absolute;
  border-radius: 999px;
  background: radial-gradient(
    circle at 35% 35%,
    rgba(255, 236, 200, 0.55) 0,
    rgba(120, 92, 58, 0.55) 38%,
    rgba(62, 48, 36, 0.75) 100%
  );
  opacity: 0.52;
  animation-name: dust-drift-a;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  mix-blend-mode: normal;
  box-shadow:
    0 0 1px rgba(255, 248, 230, 0.55),
    0 0 5px rgba(255, 220, 170, 0.65),
    0 0 12px rgba(255, 190, 120, 0.4);
}
.ash:nth-child(even) {
  animation-name: dust-drift-b;
}
.ash--speck {
  border-radius: 2px;
  transform: rotate(12deg);
  opacity: 0.62;
  background: rgba(72, 54, 34, 0.55);
  box-shadow:
    0 0 2px rgba(255, 235, 210, 0.5),
    0 0 8px rgba(255, 200, 150, 0.55),
    0 0 14px rgba(255, 170, 110, 0.35);
}
.paper.burning .ash {
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 200, 120, 0.45) 0,
    rgba(80, 52, 30, 0.75) 45%,
    rgba(28, 18, 12, 0.92) 100%
  );
  opacity: 0.92;
  mix-blend-mode: normal;
  box-shadow:
    0 0 2px rgba(255, 230, 200, 0.75),
    0 0 8px rgba(255, 160, 90, 0.85),
    0 0 18px rgba(255, 120, 60, 0.55),
    0 0 28px rgba(255, 90, 40, 0.28);
}
.paper.burning .ash:nth-child(even) {
  animation-name: dust-churn-b;
}
.paper.burning .ash:nth-child(odd) {
  animation-name: dust-churn-a;
}

@keyframes paper-enter {
  from {
    transform: translateY(20px) scale(1.25);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1.25);
    opacity: 1;
  }
}

@keyframes edge-burn {
  0% {
    opacity: 0.82;
    box-shadow:
      inset 0 0 36px rgba(92, 40, 14, 0.5),
      inset 0 0 90px rgba(58, 24, 10, 0.36),
      inset 0 0 160px rgba(34, 14, 6, 0.22);
  }
  40% {
    opacity: 0.9;
    box-shadow:
      inset 0 0 58px rgba(72, 28, 10, 0.64),
      inset 0 0 140px rgba(44, 18, 8, 0.5),
      inset 0 0 240px rgba(24, 10, 4, 0.36);
  }
  100% {
    opacity: 0.98;
    box-shadow:
      inset 0 0 90px rgba(62, 22, 8, 0.76),
      inset 0 0 200px rgba(38, 14, 6, 0.72),
      inset 0 0 320px rgba(18, 8, 4, 0.62),
      inset 0 0 400px rgba(8, 3, 2, 0.48);
  }
}

@keyframes dust-drift-a {
  0% {
    transform: translate3d(0, 6px, 0) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: translate3d(10px, -34px, 0) scale(1.18);
    opacity: 0.88;
  }
  100% {
    transform: translate3d(-12px, -78px, 0) scale(0.9);
    opacity: 0.38;
  }
}

@keyframes dust-drift-b {
  0% {
    transform: translate3d(0, 10px, 0) scale(1.05);
    opacity: 0.48;
  }
  50% {
    transform: translate3d(-14px, -40px, 0) scale(0.92);
    opacity: 0.82;
  }
  100% {
    transform: translate3d(14px, -86px, 0) scale(1.12);
    opacity: 0.42;
  }
}

@keyframes dust-churn-a {
  0% {
    transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
    opacity: 0.75;
  }
  35% {
    transform: translate3d(16px, -48px, 0) scale(1.35) rotate(8deg);
    opacity: 1;
  }
  100% {
    transform: translate3d(-22px, -120px, 0) scale(0.75) rotate(-12deg);
    opacity: 0.55;
  }
}

@keyframes dust-churn-b {
  0% {
    transform: translate3d(0, 4px, 0) scale(1.08) rotate(0deg);
    opacity: 0.7;
  }
  40% {
    transform: translate3d(-18px, -52px, 0) scale(1.42) rotate(-10deg);
    opacity: 1;
  }
  100% {
    transform: translate3d(20px, -130px, 0) scale(0.78) rotate(14deg);
    opacity: 0.5;
  }
}

@keyframes screen-flicker {
  0% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.08);
  }
  100% {
    filter: brightness(0.96);
  }
}

@media (max-width: 640px) {
  .paper {
    width: min(100%, 440px);
    padding: 1.1rem 0.4rem 1.25rem;
  }
  .rail {
    letter-spacing: 0.18em;
    font-size: 0.74rem;
  }
  .tail {
    margin-inline: -0.75rem;
    padding-inline: 0.3rem;
  }
}
</style>
