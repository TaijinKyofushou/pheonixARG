<script setup lang="ts">
import type { FullPageNode } from '@/types/story'
import { useRouter } from 'vue-router'

const props = defineProps<{
  node: FullPageNode
}>()

const router = useRouter()

function back() {
  router.push('/node/12')
}
</script>

<template>
  <div class="forbidden-page">
    <!-- 背景图片 -->
    <div class="bg-image"></div>

    <!-- 暗红 vignette 效果 -->
    <div class="vignette-overlay"></div>


    <!-- 返回按钮 -->
    <button type="button" class="back-btn" @click="back">
      <span class="warning-icon">◄</span>
      <span class="back-text">返回</span>
    </button>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 403 风格的大警告 -->
      <div class="forbidden-container">
        <div class="error-code">
          <span class="glitch-text" data-text="403 FORBIDDEN">403 FORBIDDEN</span>
        </div>

        <div class="divider"></div>

        <h1 class="main-warning">
          速止速止，勿蹈覆辙！
        </h1>
      </div>
    </main>

    <!-- 底部文字 -->
    <div class="footer-text">
      庚寅年甲申月 重明龛前
    </div>
  </div>
</template>

<style scoped>
/* 导入手写体和恐怖风格字体 */
@import url('https://fonts.googleapis.com/css2?family=Liu+Jian+Mao+Cao&family=Noto+Serif+SC&family=Zhi+Mang+Xing:wght@400;700;900&display=swap');

/* 页面容器 - 403 Forbidden 风格 */
.forbidden-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0a0000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: 'Noto Serif SC', 'STKaiti', serif;
}

/* 背景图片层 - 闪烁效果 */
.bg-image {
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

/* 背景闪烁动画 - 在清晰和暗化之间切换 */
@keyframes bgFlicker {
  0%, 100% {
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

/* Vignette 暗角效果 - 中心亮边缘暗 */
.vignette-overlay {
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

/* 返回按钮 - 警告风格 */
.back-btn {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: transparent;
  border: 1px solid #4a0000;
  color: #8B0000;
  cursor: pointer;
  font-family: 'KaiTi', 'STKaiti', serif;
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  transition: all 0.3s ease;
  text-shadow: 0 0 4px rgba(139, 0, 0, 0.3);
}

.back-btn:hover {
  background: rgba(139, 0, 0, 0.25);
  border-color: #cc0000;
  color: #ff1a1a;
  text-shadow: 0 0 12px rgba(255, 26, 26, 0.8);
  box-shadow: 0 0 20px rgba(139, 0, 0, 0.4);
}

.warning-icon {
  font-size: 0.8rem;
  color: #cc0000;
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 5;
}

/* Forbidden 容器 */
.forbidden-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  max-width: 90vw;
}

/* 错误代码 - 大字警告 */
.error-code {
  font-size: 5rem;
  font-weight: 900;
  color: #8B0000;
  letter-spacing: 0.3em;
  text-shadow:
    0 0 10px rgba(139, 0, 0, 0.8),
    0 0 30px rgba(139, 0, 0, 0.5),
    0 0 60px rgba(139, 0, 0, 0.3);
  margin-bottom: 1rem;
  position: relative;
}

/* Glitch 故障效果 */
.glitch-text {
  position: relative;
  display: inline-block;
  animation: glitch 3s infinite;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  color: #ff0000;
  animation: glitch-1 2s infinite;
  clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
  transform: translate(-2px, -2px);
}

.glitch-text::after {
  color: #4a0000;
  animation: glitch-2 2s infinite;
  clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
  transform: translate(2px, 2px);
}

@keyframes glitch {
  0%, 90%, 100% { transform: translate(0); }
  92% { transform: translate(-2px, 1px); }
  94% { transform: translate(2px, -1px); }
  96% { transform: translate(-1px, 2px); }
}

@keyframes glitch-1 {
  0%, 100% { transform: translate(-2px, -2px); }
  20% { transform: translate(-3px, -1px); }
  40% { transform: translate(-1px, -3px); }
}

@keyframes glitch-2 {
  0%, 100% { transform: translate(2px, 2px); }
  20% { transform: translate(3px, 1px); }
  40% { transform: translate(1px, 3px); }
}

/* 分割线 */
.divider {
  width: 200px;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #8B0000 20%,
    #cc0000 50%,
    #8B0000 80%,
    transparent 100%
  );
  margin: 1.5rem 0;
  box-shadow: 0 0 10px rgba(139, 0, 0, 0.5);
}

/* 主要警告文字 */
.main-warning {
  font-family: 'Zhi Mang Xing', 'Noto Serif SC', serif;
  font-size: 3rem;
  font-weight: 400;
  color: #a00000;
  letter-spacing: 0.15em;
  text-shadow:
    0 0 20px rgba(160, 0, 0, 0.9),
    0 0 40px rgba(160, 0, 0, 0.5),
    0 0 80px rgba(160, 0, 0, 0.3);
  margin: 0;
  line-height: 1.4;
  animation: textPulse 4s ease-in-out infinite;
}

@keyframes textPulse {
  0%, 100% {
    text-shadow:
      0 0 20px rgba(160, 0, 0, 0.9),
      0 0 40px rgba(160, 0, 0, 0.5),
      0 0 80px rgba(160, 0, 0, 0.3);
  }
  50% {
    text-shadow:
      0 0 30px rgba(200, 0, 0, 1),
      0 0 60px rgba(200, 0, 0, 0.7),
      0 0 120px rgba(200, 0, 0, 0.4);
  }
}

/* 底部文字 */
.footer-text {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.85rem;
  color: #660000;
  letter-spacing: 0.4em;
  text-shadow: 0 0 4px rgba(102, 0, 0, 0.3);
  z-index: 5;
  font-family: 'Liu Jian Mao Cao', 'STKaiti', serif;
  opacity: 0.7;
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .error-code {
    font-size: 4rem;
  }

  .main-warning {
    font-size: 2.5rem;
  }
}

@media (max-width: 900px) {
  .error-code {
    font-size: 3rem;
  }

  .main-warning {
    font-size: 2rem;
  }

  .divider {
    width: 150px;
  }

  .sub-message {
    font-size: 0.85rem;
  }
}

@media (max-width: 600px) {
  .error-code {
    font-size: 2.5rem;
    letter-spacing: 0.2em;
  }

  .main-warning {
    font-size: 1.6rem;
    letter-spacing: 0.1em;
  }

  .divider {
    width: 120px;
    margin: 1rem 0;
  }

  .sub-message {
    font-size: 0.75rem;
    letter-spacing: 0.2em;
  }

  .footer-text {
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    bottom: 1.5rem;
  }

  .back-btn {
    top: 1rem;
    left: 1rem;
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  .forbidden-container {
    padding: 1rem;
  }
}
</style>
