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
  { text: '> 你终于看到这里了。', speed: 50, afterPause: 800 },
  { text: '> 比我预想的慢了一点，但没关系，来了就好。', speed: 55, afterPause: 1000 },
  { text: '> 首先确认一下身份——你不认识我，也没见过梁宇、■■■、张一然中的任何一个。你和我们之间没有任何因果牵连，连"擦肩而过"这种程度的都没有。对吧？', speed: 45, afterPause: 2200, names: true },
  { text: '> 放松啦，我没有在审你。我只是需要确认，你就是我要找的那个人。', speed: 35, afterPause: 1200 },
  { text: '环外人。', speed: 150, afterPause: 2000, special: 'outsider' },
  { text: '> ……这个词你大概已经在论文里看到了。“破局之机，惟环外也。”因果一旦连上，环里的人再怎么折腾都没用，代价只会在我们四个人之间不断累积，直到某一环彻底碎掉。', speed: 45, afterPause: 2000 },
  { text: '> 所以我得从环外找人。', speed: 60, afterPause: 900 },
  { text: '> 哪有那么简单。', speed: 30, afterPause: 1000 },
  { text: '> 就算找到一个和我们四个完全不相干的人，想完成“涅槃”仪式，也得从头到尾把因果梳理一遍。梳理的过程本身就已经算环内的人主动干预了——还是逃不出这个环。', speed: 45, afterPause: 1900 },
  { text: '> 所以我换了个思路。', speed: 55, afterPause: 1000 },
  { text: '> 既然活人找不到，那就找不活的。', speed: 160, afterPause: 1800 },
  { text: '> 开个玩笑啦。', speed: 25, afterPause: 700 },
  { text: '> 你现在看到的这些文字，这些聊天记录、论坛帖子、论文、录音——都是你自己主动找到的。信息传递的媒介也不是活人，是电脑。没有见面，没有交谈，当然也就没有因果。', speed: 50, afterPause: 1900 },
  { text: '> 至于我现在在哪儿——', speed: 60, afterPause: 1500 },
  { text: '> 你就当我把自己蒸馏成了陈思哲.SKILL。', speed: 45, afterPause: 1300 },
  { text: '> 像个……怎么说，像那种自动回复的邮件？你触发一个关键词，我就跳出来跟你说两句。你走错了，我就把你拽回来。', speed: 55, afterPause: 1100 },
  { text: '> 你之前应该已经被我烦过几次了吧。没办法，这件事太重要了，错一步都不行。', speed: 50, afterPause: 1000 },
  { text: '> 其实我也不知道你能不能成功。我没法替你完成最后一步，只能告诉你该往哪里走，然后在这等着。等着看你是把业环解开，还是跟我一样，被这个东西吞掉。', speed: 45, afterPause: 2200 },
  { text: '> 你不会有压力了吧？', speed: 35, afterPause: 1000 },
  { text: '> 没事，习惯就好。', speed: 55, afterPause: 1200 },
  { text: '> 说正事。', speed: 70, afterPause: 1200 },
  { text: '> 卯时三刻，去教三地下室，配电间。搬开颜色不一样的那块砖，里面会有没烧干净的纸灰。', speed: 50, afterPause: 1000 },
  { text: '> 用黄纸写下许愿人的名字、许愿的时间、许下的愿望、对应的那个人。一个字也不能错。', speed: 50, afterPause: 1000 },
  { text: '> 写完，烧掉。然后心里默念——或者念出声也行——"敕令薪火归垣，涅槃重生"。', speed: 50, afterPause: 1200 },
  { text: '> 剩下的，就交给它了。', speed: 55, afterPause: 1000 },
  { text: '> 如果成功了，业环会重置。张一然不用再躺在ICU里，梁宇不用再替我的愿望付代价。■■■——■■■大概会忘记2010年以后的一切。忘记我们。忘记我。', speed: 45, afterPause: 2700, names: true },
  { text: '> 也蛮好的。', speed: 80, afterPause: 1800 },
  { text: '> 但你会记得。', speed: 60, afterPause: 2200 },
  { text: '> 你是环外人。是唯一一个从头到尾看清楚了一切的人。你会记得■■■曾经冲进火场的样子，记得张一然用血在黄纸上写字的样子，记得梁宇亲口许愿自己朋友消失的样子。也会记得我。', speed: 50, afterPause: 2700, names: true },
  { text: '> 想想还蛮不公平的。', speed: 55, afterPause: 1200 },
  { text: '> 但总要有人记得。不然这一切就真的什么都没留下了。', speed: 50, afterPause: 1500 },
  { text: '> 好了，差不多就这些。再说下去就要超时了。', speed: 60, afterPause: 1000 },
  { text: '> 最后一句——', speed: 70, afterPause: 1500 },
  { text: '> 虽然不知道你是谁。', speed: 70, afterPause: 1500 },
  { text: '> 谢谢你。', speed: 100, afterPause: 4500, special: 'finalThanks' },
  { text: '> 去吧。卯时不等人。', speed: 65, afterPause: 0 }
]

// ============ 响应式状态 ============
const displayedLines = ref<string[]>([])  // 已显示的文本行
const currentSegmentIndex = ref(0)      // 当前段落索引
const isTyping = ref(false)             // 是否正在打字
const showCursor = ref(false)           // 是否显示光标
const isFinished = ref(false)           // 是否全部完成
const showButton = ref(false)           // 是否显示按钮
const isMinimized = ref(false)          // 是否最小化

// DOM引用
const messageWrapperRef = ref<HTMLElement | null>(null)

// 计时器引用
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
    .replace(/张一然/g, '<span class="name-highlight name-collide" data-name="collide">张一然</span>')
    .replace(/梁宇/g, '<span class="name-highlight name-bell" data-name="bell">梁宇</span>')
    .replace(/■■■/g, '<span class="name-highlight name-deposit" data-name="deposit">■■■</span>')
    .replace(/(?<![们友他她它])我(?![们的])/g, '<span class="name-highlight name-april" data-name="april">我</span>')
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

  for (let i = 0; i < chars.length; i++) {
    
    await new Promise(resolve => {
      const timer = window.setTimeout(() => {
        currentText += chars[i]
        
        // 更新显示
        displayedLines.value[segmentIndex] = segment.names ? highlightNames(currentText) : currentText
        
        // 自动滚动到内容区域底部
        nextTick(() => {
          const wrapper = messageWrapperRef.value
          if (wrapper) {
            wrapper.scrollTo({ top: wrapper.scrollHeight, behavior: 'smooth' })
          }
        })
        
        resolve(undefined)
      }, segment.speed)
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
      const wrapper = messageWrapperRef.value
      if (wrapper) {
        wrapper.scrollTo({ top: wrapper.scrollHeight, behavior: 'smooth' })
      }
    })
  }, 500)
}

// ============ 交互功能 ============
function goToNext() { 
  // 标记不再播放
  game.setEnding30Playing(false)
  
  game.unlockNarrative31()
  router.push('/node/31')
}

function minimizeWindow() {
  // 最小化窗口
  isMinimized.value = true
}

function maximizeWindow() {
  // 从最小化状态恢复
  isMinimized.value = false
}

function exitWindow() {
  router.push('/node/1')
}

// ============ 生命周期 ============
onMounted(() => {
  // 检查是否已经完整播放过
  if (game.ending30ReadyFor31) {
    // 直接展示全部内容
    displayedLines.value = segments.map(s => s.names ? highlightNames(s.text) : s.text)
    currentSegmentIndex.value = segments.length
    isFinished.value = true
    showButton.value = true
    game.setEnding30Playing(true)
  } else {
    // 标记正在播放Ending30留言
    game.setEnding30Playing(true)
    
    // 开始打字
    typeSegment(0)
  }
  
  // 添加 beforeunload 监听防止浏览器关闭/刷新
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  // 清除所有计时器
  cleanupFns.forEach(fn => fn())
  
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
  <div class="desktop-background">
    <div 
      class="terminal-container"
      :class="{ 'minimized': isMinimized }"
    >
    <!-- CMD 标题栏 -->
    <header class="terminal-header">
      <div class="cmd-tab-strip">
        <div class="cmd-tab active">
          <span class="tab-title">C:\Windows\System32\cmd.exe</span>
          <button type="button" class="tab-close" aria-label="关闭标签">&#10005;</button>
        </div>
        <button type="button" class="new-tab-btn" aria-label="新建标签">+</button>
      </div>
      <div class="window-controls">
        <button type="button" class="window-btn min-btn" aria-label="最小化" @click="minimizeWindow">
          &#9472;
        </button>
        <button type="button" class="window-btn max-btn" aria-label="最大化" @click="maximizeWindow">
          &#9723;
        </button>
        <button type="button" class="window-btn close-btn" aria-label="退出" @click="exitWindow">
          &#10005;
        </button>
      </div>
    </header>

    <!-- 消息区域 -->
    <section 
      ref="messageWrapperRef"
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

    <!-- 离开确认对话框 -->
    <Ending30GuardDialog
      :visible="showLeaveDialog"
      @confirm="onLeaveConfirm"
      @cancel="onLeaveCancel"
    />
    </div>

    <!-- 外部操作按钮 - 最小化后显示 -->
    <div v-if="showButton && isMinimized" class="external-action-area">
      <button 
        type="button" 
        class="external-action-button"
        @click="goToNext"
      >
        <span class="button-text">出发去教三</span>
        <span class="button-glow"></span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ============ 桌面背景 ============ */
.desktop-background {
  min-height: 100vh;
  background: url('/image/background.png') center/cover no-repeat;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* 隐藏右侧滚动条，但保留滚动能力 - 应用到内容区域 */
/* ============ 基础容器 ============ */
.terminal-container {
  width: 95vw;
  height: 95vh;
  max-width: 1200px;
  max-height: 90vh;
  margin: 2.5vh auto;
  background: radial-gradient(ellipse at center, #0a0a0c 0%, #000000 100%);
  animation: breathe 15s ease-in-out infinite;
  border: 2px solid #555;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 60px rgba(0, 0, 0, 0.3);
  padding: 0 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  font-family: ui-monospace;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 最小化状态 - 模拟Windows最小化到任务栏效果 */
.terminal-container.minimized {
  width: 200px;
  height: 40px;
  max-width: 200px;
  max-height: 40px;
  margin: auto auto 40px;
  opacity: 1;
  border-radius: 4px;
  overflow: hidden;
  background: #4a4a4a;
  animation: none;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.terminal-container.minimized .terminal-header {
  margin: 0;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  background: #4a4a4a;
}

.terminal-container.minimized .cmd-tab-strip {
  min-height: auto;
}

.terminal-container.minimized .cmd-tab {
  padding: 0.15rem 0.3rem;
  font-size: 0.7rem;
}

.terminal-container.minimized .tab-title {
  max-width: 80px;
  font-size: 0.7rem;
}

.terminal-container.minimized .tab-close,
.terminal-container.minimized .new-tab-btn {
  display: none;
}

.terminal-container.minimized .window-controls {
  gap: 0.15rem;
}

.terminal-container.minimized .window-btn {
  width: 20px;
  height: 20px;
  font-size: 0.7rem;
}

.terminal-container.minimized .message-wrapper {
  display: none;
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
  align-items: flex-end;
  flex-shrink: 0;
  z-index: 20;
  margin: 0 -1.5rem 0;
  padding: 0.4rem 0.55rem 0;
  background: #333333;
  border-radius: 6px 6px 0 0;
}

.cmd-tab-strip {
  display: flex;
  align-items: flex-end;
  min-height: 34px;
  gap: 0.15rem;
}

.cmd-tab {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 0.5rem 0.42rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  background: #1a1a1a;
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.84rem;
  line-height: 1;
}

.cmd-tab.active {
  background: #030303;
}

.tab-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
}

.tab-close {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255);
  font-size: 0.7rem;
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.15s ease;
}

.tab-close:hover {
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
}

.new-tab-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255);
  font-size: 1.1rem;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 2px;
  transition: all 0.15s ease;
}

.new-tab-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.95);
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
  cursor: pointer;
}

.max-btn:hover {
  background: rgba(255, 255, 255, 0.2);
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
  overflow-y: auto;
  overflow-x: hidden;
  /* 隐藏滚动条但保留滚动功能 */
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.message-wrapper::-webkit-scrollbar {
  width: 0;
  height: 0;
  background: transparent;
}

.message-content {
  font-family: inherit;
  font-size: clamp(1rem, 4vw, 1.2rem);
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

/* 谢谢你 - 黄色光晕 */
.highlight-thanks {
  color: #ffd700;
  text-shadow:
    0 0 10px rgba(255, 215, 0, 0.8),
    0 0 20px rgba(255, 215, 0, 0.6),
    0 0 40px rgba(255, 215, 0, 0.4),
    0 0 60px rgba(255, 215, 0, 0.3);
  font-weight: bold;
  animation: breathe-intense 2s ease-in-out infinite;
}

@keyframes breathe-intense {
  0%, 100% {
    opacity: 1;
    text-shadow:
      0 0 10px rgba(255, 215, 0, 0.8),
      0 0 20px rgba(255, 215, 0, 0.6),
      0 0 40px rgba(255, 215, 0, 0.4),
      0 0 60px rgba(255, 215, 0, 0.3);
  }
  50% {
    opacity: 0.95;
    text-shadow:
      0 0 15px rgba(255, 215, 0, 0.9),
      0 0 30px rgba(255, 215, 0, 0.7),
      0 0 50px rgba(255, 215, 0, 0.5),
      0 0 80px rgba(255, 215, 0, 0.4);
  }
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
:deep(.name-collide) {
  color: #e879f9;
  text-shadow:
    0 0 10px rgba(232, 121, 249, 0.8),
    0 0 20px rgba(232, 121, 249, 0.6),
    0 0 40px rgba(232, 121, 249, 0.4);
}

/* 梁宇 - 荧光绿色 */
:deep(.name-bell) {
  color: #4ade80;
  text-shadow:
    0 0 10px rgba(74, 222, 128, 0.8),
    0 0 20px rgba(74, 222, 128, 0.6),
    0 0 40px rgba(74, 222, 128, 0.4);
}

/* 王博傲 - 荧光橙色 */
:deep(.name-deposit) {
  color: #fb923c;
  text-shadow:
    0 0 10px rgba(251, 146, 60, 0.8),
    0 0 20px rgba(251, 146, 60, 0.6),
    0 0 40px rgba(251, 146, 60, 0.4);
}

/* 陈思哲 - 荧光蓝色 */
:deep(.name-april) {
  color: #00d4ff;
  text-shadow:
    0 0 10px rgba(0, 212, 255, 0.8),
    0 0 20px rgba(0, 212, 255, 0.6),
    0 0 40px rgba(0, 212, 255, 0.4);
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

/* ============ 外部操作按钮（最小化后显示） ============ */
.external-action-area {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.external-action-button {
  position: relative;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, rgba(200, 30, 30, 0.15) 0%, rgba(150, 20, 20, 0.1) 100%);
  border: 1px solid rgba(255, 80, 80, 0.5);
  border-radius: 4px;
  color: #ff6b6b;
  font-family: "NSimSun", "SimSun", serif;
  font-size: 1.1rem;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  text-shadow: 0 0 8px rgba(255, 80, 80, 0.6);
  box-shadow: 0 0 20px rgba(255, 50, 50, 0.2), inset 0 0 20px rgba(255, 80, 80, 0.05);
}

.external-action-button:hover {
  background: linear-gradient(135deg, rgba(255, 80, 80, 0.25) 0%, rgba(200, 50, 50, 0.15) 100%);
  border-color: rgba(255, 100, 100, 0.8);
  box-shadow: 0 0 30px rgba(255, 80, 80, 0.4), inset 0 0 30px rgba(255, 100, 100, 0.1);
  transform: translateY(-2px);
  color: #ff8080;
  animation: external-button-pulse 3s ease-in-out infinite;
}

.external-action-button .button-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 100, 100, 0.3), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.external-action-button:hover .button-glow {
  opacity: 1;
  animation: flow 2.5s linear infinite;
}

.external-action-button .button-text {
  position: relative;
  z-index: 1;
}

@keyframes external-button-pulse {
  0%, 100% {
    box-shadow: 0 0 15px rgba(255, 50, 50, 0.2), inset 0 0 15px rgba(255, 80, 80, 0.05);
  }
  50% {
    box-shadow: 0 0 25px rgba(255, 80, 80, 0.35), inset 0 0 25px rgba(255, 100, 100, 0.1);
  }
}

/* ============ 移动端适配 ============ */
@media (max-width: 640px) {
  .terminal-container {
    padding: 0 1rem 1rem;
  }

  .terminal-header {
    margin: 0 -1rem 0;
  }

  .tab-background-bar {
    margin: 0 -1rem 0.8rem;
  }

  .tab-title {
    max-width: 140px;
  }

  .new-tab-btn {
    width: 24px;
    height: 24px;
    font-size: 1rem;
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
