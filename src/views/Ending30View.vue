<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import type { FullPageNode } from '@/types/story'
import { useGameStore } from '@/stores/game'
import Ending30GuardDialog from '@/components/Ending30GuardDialog.vue'

defineProps<{
  node: FullPageNode
}>()

const router = useRouter()
const game = useGameStore()

// ============ 类型定义 ============
interface Segment {
  text: string
  speed: number
  afterPause: number
  unstable?: boolean
  special?: 'outsider' | 'finalThanks'
  names?: boolean
}

// ============ 文本分段数据 ============
const segments: Segment[] = [
  { text: '> 你终于看到这里了。', speed: 70, afterPause: 200 },
  { text: '> 比我预计的慢了一点，但没关系，来了就好。', speed: 70, afterPause: 400 },
  { text: '> 先确认一下身份——你不认识我，也没见过梁宇、王博傲、张一然中的任何一个。你和我们之间没有任何因果牵连，连"擦肩而过"这种程度的都没有。对吧？', speed: 60, afterPause: 500, names: true },
  { text: '> 别紧张，我不是在审你。我只是需要确认，你就是我要找的那个人。', speed: 70, afterPause: 300 },
  { text: '环外人。', speed: 100, afterPause: 600, special: 'outsider' },
  { text: '> ……这个词你大概已经在论文里看到了。破局之机，惟环外也。写那篇论文的人自己也没验证过，但他推演得没错——业环闭合之后，环里的人再怎么折腾都是白费力气。代价只会在我们四个人之间来回弹，弹到所有人都碎掉为止。', speed: 55, afterPause: 500 },
  { text: '> 所以我得从环外找人。', speed: 70, afterPause: 300, unstable: true },
  { text: '> 说得轻巧。一个和四个人都没有任何因果的人，怎么找？就算有，人家凭什么信我？凭什么帮我？', speed: 65, afterPause: 400 },
  { text: '> 所以我换了个思路。', speed: 70, afterPause: 250 },
  { text: '> 既然活人找不到，那就找不活的。', speed: 80, afterPause: 400 },
  { text: '> 哈哈，开玩笑的。也不全是。', speed: 70, afterPause: 350 },
  { text: '> 你现在看到的这些文字，这些聊天记录、论坛帖子、病历单、录音——都是我已经走过一遍的路。我把它们留在这里，像一个……怎么说，像那种自动回复的邮件？你触发一个关键词，我就跳出来跟你说两句。你走错一步，我就把你拽回来。像个烦人的导航。', speed: 55, afterPause: 450 },
  { text: '> 你之前应该已经被我烦过几次了吧。抱歉啊，不是故意要当你妈的。只是这件事太重要了，错一步都不行。', speed: 60, afterPause: 400 },
  { text: '> 至于我现在在哪儿——', speed: 70, afterPause: 500, unstable: true },
  { text: '> 你就当我把自己上传了。或者卡在加载界面了。反正出不去，但也还没完全消失。刚好够把这条路铺完，把你引到这里。', speed: 60, afterPause: 450 },
  { text: '> 所以我其实不知道你能不能成功。我没法替你完成最后那一步，只能告诉你该往哪儿走，然后在这儿等着。等着看你是把业环解开，还是跟我一样，被这个东西吞掉。', speed: 55, afterPause: 500 },
  { text: '> 压力大吗？没事，习惯了就好。', speed: 70, afterPause: 300 },
  { text: '> 说正事。', speed: 80, afterPause: 400 },
  { text: '> 酉时三刻，去教三地下室。配电间，颜色不一样的那块砖。搬开，里面有灰烬。', speed: 60, afterPause: 450 },
  { text: '> 用黄纸写一份东西。内容我已经帮你整理好了，你照着填，一个字不能错。', speed: 60, afterPause: 400 },
  { text: '> 四个爝者的名字、许愿的时间、许下的愿望、薪主的名字。顺序是因果传递的顺序。别弄反了。', speed: 55, afterPause: 500 },
  { text: '> 写完，烧掉。然后心里默念——或者念出声也行——"敕令薪火归垣，涅槃重生"。', speed: 60, afterPause: 450 },
  { text: '> 剩下的，就交给它了。', speed: 70, afterPause: 350 },
  { text: '> 如果成功了，业环会重置。张一然不用再躺在ICU里，梁宇不用再替我的愿望付代价，王博傲——王博傲大概会忘记这一切。忘记我们。忘记我。', speed: 55, afterPause: 600, names: true },
  { text: '> 也挺好的。', speed: 80, afterPause: 400 },
  { text: '> 但你会记得。', speed: 80, afterPause: 500 },
  { text: '> 你是环外人。你是唯一一个从头到尾看清楚了一切的人。你会记得王博傲冲进火场的样子，记得张一然拿血写黄纸的样子，记得梁宇犹豫了三次才把那个愿望说出口的样子。', speed: 55, afterPause: 600, names: true },
  { text: '> 也会记得我。', speed: 80, afterPause: 500 },
  { text: '> 想想还挺不公平的。你连我是谁都不知道，却要替我记着这些。', speed: 65, afterPause: 400 },
  { text: '> 但总得有人记得。不然这一切就真的什么都没留下了。', speed: 65, afterPause: 450 },
  { text: '> 好了，差不多就这些。再说下去就有点丢人了。', speed: 70, afterPause: 350 },
  { text: '> 最后一句——', speed: 80, afterPause: 500 },
  { text: '> 不管你是谁。', speed: 100, afterPause: 400 },
  { text: '谢谢你。', speed: 90, afterPause: 3000, special: 'finalThanks' },
  { text: '> 去吧。酉时不等人。', speed: 80, afterPause: 0 }
]

// ============ 响应式状态 ============
const displayedLines = ref<string[]>([])  // 已显示的文本行
const currentSegmentIndex = ref(0)      // 当前段落索引
const isTyping = ref(false)             // 是否正在打字
const showCursor = ref(false)           // 是否显示光标
const isFinished = ref(false)           // 是否全部完成
const showButton = ref(false)           // 是否显示按钮
const showEasterEgg = ref(false)        // 是否显示彩蛋

// 计时器引用
let easterEggTimer: number | null = null
let cleanupFns: (() => void)[] = []

// 离开守卫状态
const showLeaveDialog = ref(false)
let leaveResolve: ((value: boolean) => void) | null = null

// ============ 打字机核心逻辑 ============
/**
 * 处理文本中的名字高亮
 */
function highlightNames(text: string): string {
  return text
    .replace(/张一然/g, '<span class="name-highlight name-zhang" data-name="zhang">张一然</span>')
    .replace(/梁宇/g, '<span class="name-highlight name-liang" data-name="liang">梁宇</span>')
    .replace(/王博傲/g, '<span class="name-highlight name-wang" data-name="wang">王博傲</span>')
}

/**
 * 打字单个段落
 */
async function typeSegment(segmentIndex: number): Promise<void> {
  if (segmentIndex >= segments.length) {
    // 全部完成
    finishTyping()
    return
  }

  const segment = segments[segmentIndex]
  isTyping.value = true
  showCursor.value = false

  let currentText = ''
  const chars = segment.text.split('')
  const unstableDelays = segment.unstable
    ? Array.from({ length: Math.floor(Math.random() * 2) + 2 }, () => Math.floor(Math.random() * chars.length))
    : []

  for (let i = 0; i < chars.length; i++) {
    // 检查是否需要额外卡顿
    const extraDelay = unstableDelays.includes(i) ? Math.random() * 150 + 150 : 0
    
    await new Promise(resolve => {
      const timer = window.setTimeout(() => {
        currentText += chars[i]
        
        // 更新显示
        displayedLines.value[segmentIndex] = segment.names ? highlightNames(currentText) : currentText
        
        // 自动滚动到页面底部
        nextTick(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        })
        
        resolve(undefined)
      }, segment.speed + extraDelay)
      cleanupFns.push(() => window.clearTimeout(timer))
    })
  }

  // 段落结束，显示光标并暂停
  isTyping.value = false
  showCursor.value = true

  // 等待 afterPause
  await new Promise(resolve => {
    const timer = window.setTimeout(() => {
      showCursor.value = false
      currentSegmentIndex.value = segmentIndex + 1
      resolve(undefined)
    }, segment.afterPause)
    cleanupFns.push(() => window.clearTimeout(timer))
  })

  // 继续下一段
  typeSegment(segmentIndex + 1)
}

/**
 * 完成打字
 */
function finishTyping() {
  isFinished.value = true
  showCursor.value = false
  
  // 延迟显示按钮
  window.setTimeout(() => {
    showButton.value = true
    game.finishEnding30Messages()
    // 按钮出现后再次滚动到底部，确保 CTA 完整可见
    nextTick(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    })
    
    // 启动彩蛋定时器（30秒）
    startEasterEggTimer()
  }, 500)
}

// ============ 彩蛋功能 ============
function startEasterEggTimer() {
  easterEggTimer = window.setTimeout(() => {
    if (!isFinished.value || !showButton.value) return
    showEasterEgg.value = true
    
    // 3秒后消失
    window.setTimeout(() => {
      showEasterEgg.value = false
    }, 3000)
  }, 30000)
}

// ============ 交互功能 ============
function goToNext() {
  // 清除彩蛋定时器
  if (easterEggTimer) {
    window.clearTimeout(easterEggTimer)
    easterEggTimer = null
  }
  
  // 标记不再播放
  game.setEnding30Playing(false)
  
  game.unlockNarrative31()
  router.push('/node/31')
}

function minimizeWindow() {
  router.push('/node/1')
}

function exitWindow() {
  router.push('/node/1')
}

// ============ 生命周期 ============
onMounted(() => {
  // 标记正在播放Ending30留言
  game.setEnding30Playing(true)
  
  // 开始打字
  typeSegment(0)
  
  // 添加 beforeunload 监听防止浏览器关闭/刷新
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  // 清除所有计时器
  cleanupFns.forEach(fn => fn())
  if (easterEggTimer) window.clearTimeout(easterEggTimer)
  
  // 标记不再播放
  game.setEnding30Playing(false)
  
  // 移除 beforeunload 监听
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

// beforeunload 处理函数
function handleBeforeUnload(e: BeforeUnloadEvent) {
  // 如果还在播放中，提示用户
  if (!showButton.value) {
    e.preventDefault()
    e.returnValue = ''
    return ''
  }
}

// ============ 离开守卫 ============
onBeforeRouteLeave((_to, _from, next) => {
  // 如果已经播放完毕（按钮已显示），允许离开
  if (showButton.value) {
    next()
    return
  }
  
  // 显示确认对话框
  showLeaveDialog.value = true
  
  // 等待用户决定
  new Promise<boolean>((resolve) => {
    leaveResolve = resolve
  }).then((confirmed) => {
    if (confirmed) {
      // 用户确认离开，清理资源
      cleanupFns.forEach(fn => fn())
      if (easterEggTimer) window.clearTimeout(easterEggTimer)
      game.setEnding30Playing(false)
      next()
    } else {
      // 用户取消，留在当前页面
      next(false)
    }
    showLeaveDialog.value = false
    leaveResolve = null
  })
})

function onLeaveConfirm() {
  if (leaveResolve) {
    leaveResolve(true)
  }
}

function onLeaveCancel() {
  if (leaveResolve) {
    leaveResolve(false)
  }
}
</script>

<template>
  <div class="terminal-container">
    <!-- CMD 标题栏 -->
    <header class="terminal-header">
      <div class="cmd-tab-strip">
        <div class="cmd-tab active">C:\Windows\System32\cmd.exe</div>
      </div>
      <div class="window-controls">
        <button type="button" class="window-btn min-btn" aria-label="最小化" @click="minimizeWindow">
          &#9472;
        </button>
        <button type="button" class="window-btn max-btn" aria-label="最大化" tabindex="-1">
          &#9723;
        </button>
        <button type="button" class="window-btn close-btn" aria-label="退出" @click="exitWindow">
          &#10005;
        </button>
      </div>
    </header>

    <!-- 消息区域 -->
    <section 
      class="message-wrapper" 
      :class="{
        'final-breathe': isFinished && !showButton
      }"
      aria-live="polite"
    >
      <div class="message-content">
        <div
          v-for="(line, index) in displayedLines"
          :key="index"
          class="typed-line"
          :class="{
            'highlight-outsider': segments[index]?.special === 'outsider',
            'highlight-thanks': segments[index]?.special === 'finalThanks',
            'line-active': index === currentSegmentIndex - 1 && showCursor
          }"
          v-html="line"
        ></div>
        
        <!-- 打字光标 -->
        <span 
          v-if="showCursor" 
          class="cursor"
          :class="{ 'cursor-blink': showCursor }"
        >_</span>
      </div>
    </section>

    <!-- 操作按钮 -->
    <div v-if="showButton" class="action-area">
      <div v-if="showEasterEgg" class="easter-egg">
        还在看？……我其实已经不在线了。别等，去做。
      </div>
      
      <button 
        type="button" 
        class="action-button"
        :class="{ 'button-visible': showButton }"
        @click="goToNext"
      >
        <span class="button-text">出发去教三</span>
        <span class="button-glow"></span>
      </button>
    </div>

    <!-- 离开确认对话框 -->
    <Ending30GuardDialog
      :visible="showLeaveDialog"
      @confirm="onLeaveConfirm"
      @cancel="onLeaveCancel"
    />
  </div>
</template>

<style scoped>
/* 隐藏右侧滚动条，但保留滚动能力 */
:global(html),
:global(body) {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

:global(html::-webkit-scrollbar),
:global(body::-webkit-scrollbar) {
  width: 0;
  height: 0;
  background: transparent;
}

/* ============ 基础容器 ============ */
.terminal-container {
  min-height: 100vh;
  background: radial-gradient(ellipse at center, #0a0a0c 0%, #000000 100%);
  animation: breathe 15s ease-in-out infinite;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
  font-family: "NSimSun", "SimSun", serif;
}

@keyframes breathe {
  0%, 100% { 
    opacity: 1;
    background-size: 100% 100%;
  }
  50% { 
    opacity: 0.96;
    background-size: 102% 102%;
  }
}

/* ============ 头部 ============ */
.terminal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 20;
  margin: -1.5rem -1.5rem 1.2rem;
  padding: 0.4rem 0.55rem 0.3rem;
  background: #333333;
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
}

.cmd-tab-strip {
  display: flex;
  align-items: flex-end;
  min-height: 34px;
}

.cmd-tab {
  padding: 0.45rem 0.9rem 0.42rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  background: #1a1a1a;
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.84rem;
  line-height: 1;
}

.cmd-tab.active {
  background: #111;
}

.window-controls {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.window-btn {
  width: 42px;
  height: 30px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.88);
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s ease;
}

.window-btn:hover {
  background: rgba(255, 255, 255, 0.12);
}

.max-btn {
  cursor: default;
}

.max-btn:hover {
  background: rgba(255, 255, 255, 0.12);
}

.close-btn:hover {
  background: #c42b1c;
}

/* ============ 消息区域 ============ */
.message-wrapper {
  flex: 1;
  max-width: none;
  margin: 0;
  width: 100%;
  padding: 0.6rem 0.35rem 1rem 0.2rem;
  will-change: transform;
}

.message-content {
  font-family: inherit;
  font-size: clamp(1rem, 4vw, 1.25rem);
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.1);
  text-align: left;
}

/* ============ 逐行文字 ============ */
.typed-line {
  margin: 0.75rem 0;
  min-height: 1.8em;
  position: relative;
  will-change: opacity, transform;
}

/* 环外人高亮 - 红色 + 超夸张故障效果 */
.highlight-outsider {
  color: #ff1a1a;
  text-shadow:
    0 0 10px rgba(255, 26, 26, 0.8),
    0 0 20px rgba(255, 26, 26, 0.6),
    0 0 40px rgba(255, 26, 26, 0.4);
  animation: glitch-intense 0.15s ease-in-out 5;
  font-weight: bold;
  letter-spacing: 0.05em;
}

@keyframes glitch-intense {
  0% {
    text-shadow:
      0 0 10px rgba(255, 26, 26, 0.8),
      0 0 20px rgba(255, 26, 26, 0.6),
      0 0 40px rgba(255, 26, 26, 0.4);
    filter: hue-rotate(0deg);
  }
  10% { 
    transform: translate(-3px, 2px) skew(-2deg); 
    text-shadow: -4px 0 rgba(255, 0, 0, 1), 4px 0 rgba(0, 255, 255, 0.8);
    filter: hue-rotate(90deg) brightness(1.3);
  }
  20% { 
    transform: translate(3px, -2px) skew(2deg); 
    text-shadow: 4px 0 rgba(255, 0, 0, 1), -4px 0 rgba(0, 255, 0, 0.8);
    filter: hue-rotate(-90deg) contrast(1.5);
  }
  30% { 
    transform: translate(-2px, -1px) skew(-1deg); 
    text-shadow: -3px 0 rgba(0, 255, 255, 0.9), 3px 0 rgba(255, 0, 0, 0.9);
    clip-path: inset(10% 0 60% 0);
  }
  40% { 
    transform: translate(2px, 3px) skew(1deg); 
    text-shadow: 3px 0 rgba(255, 255, 0, 0.9), -3px 0 rgba(0, 0, 255, 0.9);
    filter: hue-rotate(180deg) saturate(2);
    clip-path: inset(40% 0 20% 0);
  }
  50% { 
    transform: translate(-1px, 1px) skew(-2deg); 
    text-shadow: -5px 0 rgba(255, 0, 100, 1), 5px 0 rgba(0, 255, 200, 0.8);
    clip-path: inset(0 0 0 0);
  }
  60% {
    transform: translate(1px, -3px) skew(2deg);
    text-shadow: 2px 2px rgba(255, 0, 0, 0.9), -2px -2px rgba(0, 255, 255, 0.9);
    filter: brightness(1.5);
  }
  70% {
    transform: translate(-3px, 0) skew(-1deg);
    text-shadow: -2px 0 rgba(0, 255, 0, 0.9), 2px 0 rgba(255, 0, 255, 0.9);
  }
  80% {
    transform: translate(0, 2px) skew(1deg);
    text-shadow: 0 -2px rgba(255, 255, 0, 0.9), 0 2px rgba(0, 0, 255, 0.9);
    clip-path: inset(30% 0 50% 0);
  }
  90% {
    transform: translate(2px, -1px) skew(0deg);
    text-shadow: 3px 0 rgba(255, 0, 0, 0.8), -3px 0 rgba(0, 255, 255, 0.8);
    clip-path: inset(0 0 0 0);
  }
}

/* 最后感谢特殊效果 - 超夸张发光 */
.highlight-thanks {
  color: #ffec8b;
  text-shadow:
    0 0 10px rgba(255, 236, 139, 1),
    0 0 20px rgba(255, 236, 139, 0.9),
    0 0 40px rgba(255, 236, 139, 0.8),
    0 0 80px rgba(255, 236, 139, 0.6),
    0 0 120px rgba(255, 215, 0, 0.4);
  animation: breathe-intense 2s ease-in-out infinite;
  font-weight: bold;
}

@keyframes breathe-intense {
  0%, 100% { 
    opacity: 1;
    text-shadow:
      0 0 10px rgba(255, 236, 139, 1),
      0 0 20px rgba(255, 236, 139, 0.9),
      0 0 40px rgba(255, 236, 139, 0.8),
      0 0 80px rgba(255, 236, 139, 0.6),
      0 0 120px rgba(255, 215, 0, 0.4);
  }
  25% {
    text-shadow:
      0 0 15px rgba(255, 236, 139, 1),
      0 0 30px rgba(255, 236, 139, 0.95),
      0 0 60px rgba(255, 236, 139, 0.85),
      0 0 100px rgba(255, 236, 139, 0.7),
      0 0 150px rgba(255, 215, 0, 0.5);
  }
  50% { 
    opacity: 0.95;
    text-shadow:
      0 0 20px rgba(255, 236, 139, 1),
      0 0 40px rgba(255, 236, 139, 1),
      0 0 80px rgba(255, 236, 139, 0.9),
      0 0 140px rgba(255, 236, 139, 0.75),
      0 0 200px rgba(255, 215, 0, 0.6);
  }
  75% {
    text-shadow:
      0 0 15px rgba(255, 236, 139, 1),
      0 0 30px rgba(255, 236, 139, 0.95),
      0 0 60px rgba(255, 236, 139, 0.85),
      0 0 100px rgba(255, 236, 139, 0.7),
      0 0 150px rgba(255, 215, 0, 0.5);
  }
}

/* ============ 名字高亮 - 荧光色版本 ============ */
:deep(.name-highlight) {
  font-weight: bold;
  transition: text-shadow 0.3s ease;
}

/* 张一然 - 荧光紫色 */
:deep(.name-zhang) {
  color: #e879f9;
  text-shadow:
    0 0 10px rgba(232, 121, 249, 0.8),
    0 0 20px rgba(232, 121, 249, 0.6),
    0 0 40px rgba(232, 121, 249, 0.4);
}

/* 梁宇 - 荧光绿色 */
:deep(.name-liang) {
  color: #4ade80;
  text-shadow:
    0 0 10px rgba(74, 222, 128, 0.8),
    0 0 20px rgba(74, 222, 128, 0.6),
    0 0 40px rgba(74, 222, 128, 0.4);
}

/* 王博傲 - 荧光橙色 */
:deep(.name-wang) {
  color: #fb923c;
  text-shadow:
    0 0 10px rgba(251, 146, 60, 0.8),
    0 0 20px rgba(251, 146, 60, 0.6),
    0 0 40px rgba(251, 146, 60, 0.4);
}

/* ============ 光标 ============ */
.cursor {
  display: inline-block;
  color: #00d4ff;
  font-weight: bold;
  margin-left: 2px;
}

.cursor-blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}


/* 最终呼吸效果 */
.final-breathe .message-content {
  animation: finalBreathe 4s ease-in-out infinite;
}

@keyframes finalBreathe {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}

/* ============ 操作区域 ============ */
.action-area {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem 0;
}

/* ============ 彩蛋提示 ============ */
.easter-egg {
  position: absolute;
  top: -1rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
  animation: easterEggShake 0.5s ease-in-out;
  text-align: center;
  max-width: 90%;
}

@keyframes easterEggShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

/* ============ 操作按钮 ============ */
.action-button {
  position: relative;
  padding: 1rem 2.5rem;
  min-height: 48px;
  border: 1px solid rgba(0, 212, 255, 0.4);
  border-radius: 8px;
  background: rgba(0, 212, 255, 0.08);
  color: #00d4ff;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  overflow: hidden;
  opacity: 0;
  transform: scale(0.9);
  filter: blur(8px);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  animation: pulse 2s ease-in-out infinite;
}

.action-button.button-visible {
  opacity: 1;
  transform: scale(1);
  filter: blur(0);
}

.action-button:hover {
  border-color: rgba(0, 212, 255, 0.8);
  background: rgba(0, 212, 255, 0.15);
  transform: scale(1.02);
}

.action-button:hover .button-glow {
  animation: flow 0.8s linear;
}

.button-text {
  position: relative;
  z-index: 1;
}

.button-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 212, 255, 0.3),
    transparent
  );
}

@keyframes pulse {
  0% { 
    box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.4);
  }
  70% { 
    box-shadow: 0 0 0 10px rgba(0, 212, 255, 0);
  }
  100% { 
    box-shadow: 0 0 0 0 rgba(0, 212, 255, 0);
  }
}

@keyframes flow {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* ============ 移动端适配 ============ */
@media (max-width: 640px) {
  .terminal-container {
    padding: 1rem;
  }

  .terminal-header {
    margin: -1rem -1rem 1rem;
  }
  
  .message-content {
    font-size: clamp(0.95rem, 5vw, 1.1rem);
    line-height: 1.7;
  }
  
  .typed-line {
    margin: 0.6rem 0;
  }
  
  .action-button {
    width: 100%;
    max-width: 280px;
    padding: 1rem 1.5rem;
  }
  
  .cmd-tab {
    max-width: 62vw;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/* ============ 减少动画偏好 ============ */
@media (prefers-reduced-motion: reduce) {
  .terminal-container,
  .cursor-blink,
  .highlight-outsider,
  .highlight-thanks,
  .action-button {
    animation: none !important;
  }
  
  .action-button {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
}

/* ============ 低端设备优化 ============ */
@media (pointer: coarse) and (max-width: 768px) {
  .terminal-container {
    /* 低端机减少视觉效果 */
    animation-duration: 30s;
  }
}
</style>
