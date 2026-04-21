<template>
  <div class="narrative-container">
    <!-- 背景层系统（从远到近） -->
    <div class="bg-gradient"></div>
    <div class="concrete-texture"></div>
    <div class="damp-moisture"></div>
    <div class="ember-glow"></div>
    <div class="phoenix-undertow"></div>

    <!-- 手电筒光束（跟随鼠标，仅桌面端） -->
    <div class="flashlight" :style="{ left: mouseX + 'px', top: mouseY + 'px' }"></div>

    <!-- 主内容区：纯文字叙事 -->
    <main class="narrative-text">
      <p
        v-for="(paragraph, index) in paragraphs"
        :key="index"
        :ref="el => setParagraphRef(el, index)"
        class="narrative-paragraph"
      >{{ paragraph }}</p>
    </main>

    <!-- 末段浮现后可继续下滑的区域 -->
    <div ref="tailSpacerRef" class="narrative-tail-spacer" aria-hidden="true" />

    <!-- 末段已读且继续下滑后：视口中央 CTA -->
    <Transition name="narrative-cta">
      <div
        v-if="showStartButton"
        key="narrative-cta"
        class="narrative-cta-layer"
        aria-live="polite"
      >
        <button type="button" class="narrative-cta-glass" @click="goToNode32">
          开始书写
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'

// 文案
const paragraphs = ref([
  '教三的侧门没锁。半蒙半昧的天光透过玻璃门斜映在瓷砖上，反射出微弱的青白。',
  '走廊里的声控灯坏了大半，走几步，头顶的灯管就闪一下，电流声水一样地滑过墙皮，像有什么东西在耳侧呼吸。',
  '楼梯间的防火门格外沉重。年久失修的合页发出一声尖锐的拖长音，又在撤手的瞬间猛然闭合，把最后一点光线隔绝在了身后。',
  '手机的光束贴着台阶往下照，一级又一级，好像永无尽头。木质楼梯扶手的漆面已经斑驳，露出略微潮湿的粗糙纹理，好像能摸到一层薄薄的水汽——地下室特有的那种潮湿，顺着指尖一路渗透到脊椎里。',
  '配电间的门是铁质的，虚虚地掩着，锈迹纵横交错。把手上挂着同样锈蚀的形同虚设的铁锁。',
  '推开这扇门并没有耗费太大力气。室内比走廊更窄，左右两臂几乎能同时碰到墙壁。空气中浮动着淡淡的气味——不是霉味，更像是草木燃烧后残余的焦苦味道，很淡，淡到让人觉得或许是某种错觉。',
  '手电筒的光在墙面上扫过。',
  '大部分砖块是青灰色的，长年受潮，表面结了一层白色的硝。只有与视线平齐的那块不一样——颜色略深，边缘的砂浆有明显的磨损痕迹，像是被拆下来又塞回去过。',
  '砖块如预想中那样松动许多，几乎没费什么力气就抽了出来。墙洞里漆黑一片，手机灯光照进去，先看见灰尘莹莹飞舞。',
  '一层灰白色的余烬，很细、很轻，好像保留着纸张燃烧后卷曲的形状，一片叠着一片，不知道在这里陈列了多久。',
  '手指触到灰烬的那一刻，竟然感觉到一阵微弱的温度。',
  '不是烫。甚至算不上暖，只比这间地下室的空气高了一点点，像是灰烬深处还有什么尚未熄灭的东西。',
  '你从口袋里拿出那张黄纸。',
  '符纸的质地比普通纸张更脆，边缘裁得不算整齐，对折过的地方有一道浅浅的折痕。你把它展开铺在膝盖上，又从包里翻出笔。',
  '配电间里只有呼吸声。楼上某处管道里偶尔传来一声水锤响。',
  '但你隐约觉得有什么东西正在看着你——那注视并非恶意，更像是一种等待。似乎它也已经等了很久。',
])

// 滚动检测：严格按段顺序浮现；页首/页尾回退
const paragraphRefs = ref([])
const setParagraphRef = (el, index) => {
  if (el) paragraphRefs.value[index] = el
}

const tailSpacerRef = ref(null)
const showStartButton = ref(false)

const router = useRouter()

const goToNode32 = () => {
  router.push('/node/32')
}

// 鼠标坐标（手电筒效果）
const mouseX = ref(-100)
const mouseY = ref(-100)

const SCROLLBAR_HIDE_CLASS = 'narrative-no-scrollbar'

onMounted(() => {
  document.documentElement.classList.add(SCROLLBAR_HIDE_CLASS)
  document.body.classList.add(SCROLLBAR_HIDE_CLASS)

  const vh = () => window.innerHeight
  const scrollRoot = () =>
    document.scrollingElement ?? document.documentElement

  const allParagraphsVisible = () => {
    const n = paragraphs.value.length
    for (let i = 0; i < n; i++) {
      const el = paragraphRefs.value[i]
      if (!el || !el.classList.contains('visible')) return false
    }
    return n > 0
  }

  const updateCtaVisibility = () => {
    if (!allParagraphsVisible()) {
      showStartButton.value = false
      return
    }
    const spacer = tailSpacerRef.value
    if (!spacer) return
    const h = vh()
    const st = spacer.getBoundingClientRect().top
    showStartButton.value = st < h * 0.55
  }

  // 一次滚动帧内最多新浮现一段，保证「一段一段」
  let raf = 0
  const updateParagraphVisibility = () => {
    const h = vh()
    const bandTop = h * 0.35
    const bandBottom = h * 0.65
    const y = window.scrollY
    const root = scrollRoot()
    const maxY = Math.max(0, root.scrollHeight - h)
    const nearTop = y < h * 0.35
    const nearBottom = y > maxY - h * 0.35

    const n = paragraphs.value.length
    for (let i = 0; i < n; i++) {
      const el = paragraphRefs.value[i]
      if (!el || el.classList.contains('visible')) continue

      if (i > 0) {
        const prev = paragraphRefs.value[i - 1]
        if (!prev || !prev.classList.contains('visible')) break
      }

      const rect = el.getBoundingClientRect()
      const crossesCenterBand = rect.bottom > bandTop && rect.top < bandBottom
      const topFallback =
        i === 0 &&
        nearTop &&
        rect.top < h * 0.62 &&
        rect.bottom > h * 0.06 &&
        rect.bottom <= h * 0.52
      const bottomFallback =
        nearBottom && rect.top < h * 0.92 && rect.bottom > h * 0.18

      if (crossesCenterBand || topFallback || bottomFallback) {
        el.classList.add('visible')
        break
      }
      break
    }

    updateCtaVisibility()
  }

  const scheduleUpdate = () => {
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      updateParagraphVisibility()
    })
  }

  nextTick(() => {
    updateParagraphVisibility()
    requestAnimationFrame(() => updateParagraphVisibility())
  })

  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  window.addEventListener('resize', scheduleUpdate)

  // 手电筒鼠标追踪（仅桌面端）
  const handleMouseMove = (e) => {
    mouseX.value = e.clientX
    mouseY.value = e.clientY
  }
  window.addEventListener('mousemove', handleMouseMove)

  // 清理
  onBeforeUnmount(() => {
    document.documentElement.classList.remove(SCROLLBAR_HIDE_CLASS)
    document.body.classList.remove(SCROLLBAR_HIDE_CLASS)
    window.removeEventListener('scroll', scheduleUpdate)
    window.removeEventListener('resize', scheduleUpdate)
    window.removeEventListener('mousemove', handleMouseMove)
    if (raf) cancelAnimationFrame(raf)
  })
})
</script>

<style scoped>
/* ---------- CSS 变量（丰富色相版） ---------- */
.narrative-container {
  /* 基底 */
  --bg-base: #0F1114;

  /* 混凝土青灰 */
  --concrete: #2A2F35;

  /* 潮湿青绿 */
  --damp-green: #2A3A38;

  /* 余烬橙黄 */
  --ember: #5E4B3C;
  --ember-bright: #7A5A44;

  /* 凤凰暗红 */
  --phoenix-red: #4A2F32;

  /* 文字 */
  --text-primary: #C5C8CC;
  --text-muted: #7F858C;

  /* 手电筒冷光 */
  --flashlight-core: rgba(170, 205, 198, 0.16);
  --flashlight-mid: rgba(120, 165, 158, 0.1);
  --flashlight-edge: rgba(82, 118, 112, 0.05);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.narrative-container {
  position: relative;
  min-height: 100vh;
  background: var(--bg-base, #0F1114);
  overflow-x: hidden;
  isolation: isolate;
  font-family: 'Georgia', 'Times New Roman', '宋体', serif;
  color: var(--text-primary, #C5C8CC);
  line-height: 1.8;
}

/* ---------- 背景多层系统 ---------- */

/* 1. 基底径向渐变（模拟微弱光线） */
.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(125% 92% at 16% 10%, rgba(36, 48, 66, 0.48) 0%, rgba(18, 23, 31, 0.18) 42%, transparent 72%),
    radial-gradient(92% 74% at 84% 82%, rgba(88, 40, 42, 0.26) 0%, rgba(58, 28, 31, 0.14) 48%, transparent 78%),
    radial-gradient(130% 95% at 50% -10%, rgba(0, 0, 0, 0.36) 0%, transparent 55%),
    linear-gradient(180deg, #090B10 0%, #0B0E13 42%, #080A0E 100%);
  z-index: 0;
}

/* 2. 混凝土纹理（极细噪点） */
.concrete-texture {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 420 420' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFine'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.28' numOctaves='5' seed='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFine)' opacity='0.3'/%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 420 420' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseCoarse'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.26' numOctaves='3' seed='11' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseCoarse)' opacity='0.06'/%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 420 420' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseStain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.075' numOctaves='2' seed='23' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseStain)' opacity='0.05'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 220px 220px, 360px 360px, 620px 620px;
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: soft-light;
  opacity: 1;
  filter: contrast(120%) brightness(90%);
}

/* 3. 潮湿青绿水汽（左下+右下边缘） */
.damp-moisture {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse 86% 56% at 8% 96%, rgba(28, 70, 66, 0.28) 0%, rgba(28, 70, 66, 0.14) 44%, rgba(28, 70, 66, 0) 80%),
    radial-gradient(ellipse 82% 52% at 92% 94%, rgba(24, 66, 62, 0.2) 0%, rgba(24, 66, 62, 0.1) 46%, rgba(24, 66, 62, 0) 82%);
  pointer-events: none;
  z-index: 2;
}

/* 4. 余烬光晕（底部中心，缓慢呼吸） */
.ember-glow {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: auto;
  height: auto;
  background:
    radial-gradient(ellipse 86% 42% at 50% 108%, rgba(128, 72, 50, 0.24) 0%, rgba(74, 47, 40, 0.14) 40%, rgba(74, 47, 40, 0) 82%);
  pointer-events: none;
  z-index: 3;
  animation: faintPulse 60s infinite alternate;
}

/* 5. 凤凰暗红涅槃光带（极隐晦） */
.phoenix-undertow {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: auto;
  height: auto;
  background:
    linear-gradient(to top, rgba(46, 26, 31, 0.44) 0%, rgba(46, 26, 31, 0.2) 22%, rgba(46, 26, 31, 0.08) 38%, transparent 72%);
  pointer-events: none;
  z-index: 4;
}

@keyframes faintPulse {
  0% { opacity: 0.4; transform: scaleY(0.98); }
  100% { opacity: 0.8; transform: scaleY(1); }
}

/* 手电筒光束（跟随鼠标，冷色调） */
.flashlight {
  position: fixed;
  width: 560px;
  height: 560px;
  background:
    radial-gradient(circle at 50% 50%, var(--flashlight-core) 0%, var(--flashlight-mid) 26%, rgba(95, 140, 132, 0.06) 46%, rgba(0, 0, 0, 0) 78%),
    radial-gradient(circle at 50% 50%, rgba(220, 245, 240, 0.09) 0%, var(--flashlight-edge) 34%, rgba(0, 0, 0, 0) 82%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 80;
  mix-blend-mode: screen;
  filter: blur(6px);
  transition: left 0.09s cubic-bezier(0.22, 1, 0.36, 1), top 0.09s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: left, top;
}

/* 正文容器 */
.narrative-text {
  max-width: 720px;
  margin: 0 auto;
  padding: 15vh 5vw 20vh;
  position: relative;
  z-index: 20;
}

/* 段落入场动画 */
.narrative-paragraph {
  margin-bottom: 1.5em;
  font-size: clamp(1rem, 4.5vw, 1.3rem);
  font-weight: 400;
  letter-spacing: 0.01em;
  opacity: 0;
  filter: blur(2px);
  transform: translateY(18px) scale(0.995);
  transition:
    opacity 1s cubic-bezier(0.22, 1, 0.36, 1),
    transform 1.1s cubic-bezier(0.22, 1, 0.36, 1),
    filter 1s ease-out;
  will-change: opacity, transform, filter;
}

.narrative-paragraph.visible {
  opacity: 1;
  filter: blur(0);
  transform: translateY(0) scale(1);
}

/* 正文结束后可继续下滑的留白 */
.narrative-tail-spacer {
  position: relative;
  z-index: 20;
  min-height: 52vh;
  pointer-events: none;
}

/* 视口中央：毛玻璃 CTA */
.narrative-cta-layer {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.narrative-cta-glass {
  pointer-events: auto;
  margin: 0;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  padding: 1rem 2.5rem;
  font-family: inherit;
  font-size: clamp(0.95rem, 2.8vw, 1.08rem);
  font-weight: 500;
  letter-spacing: 0.18em;
  color: rgba(210, 214, 220, 0.92);
  background: rgba(18, 22, 28, 0.28);
  backdrop-filter: blur(16px) saturate(130%);
  -webkit-backdrop-filter: blur(16px) saturate(130%);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  transition:
    background 0.28s ease,
    border-color 0.28s ease,
    transform 0.28s ease,
    box-shadow 0.28s ease;
}

.narrative-cta-glass:hover {
  background: rgba(26, 32, 40, 0.42);
  border-color: rgba(255, 255, 255, 0.22);
  transform: translateY(-2px);
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.narrative-cta-glass:active {
  transform: translateY(0);
}

.narrative-cta-enter-active,
.narrative-cta-leave-active {
  transition: opacity 0.55s ease;
}

.narrative-cta-enter-active .narrative-cta-glass,
.narrative-cta-leave-active .narrative-cta-glass {
  transition:
    opacity 0.55s ease,
    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

.narrative-cta-enter-from,
.narrative-cta-leave-to {
  opacity: 0;
}

.narrative-cta-enter-from .narrative-cta-glass,
.narrative-cta-leave-to .narrative-cta-glass {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

/* 选中文字时的凤凰暗红背景 */
::selection {
  background: rgba(74, 47, 50, 0.3);
  color: var(--text-primary);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .narrative-text {
    padding: 10vh 6vw 15vh;
  }
  .narrative-paragraph {
    font-size: 1rem;
    line-height: 1.7;
  }
  .flashlight {
    display: none; /* 移动端关闭手电筒跟随 */
  }
}

</style>

<!-- 视口滚动条在 html/body 上，需全局隐藏；离开本页时移除 class -->
<style>
html.narrative-no-scrollbar,
body.narrative-no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

html.narrative-no-scrollbar::-webkit-scrollbar,
body.narrative-no-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}
</style>