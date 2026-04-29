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

// 将内容处理成适合竖排显示的格式
const processedContent = (props.node.content ?? '')
  .replace(/\n+/g, '\n')
  .trim()
</script>

<template>
  <div class="mystery-page">
    <!-- 背景图片 -->
    <div class="bg-image"></div>

    <!-- 噪点纹理覆盖层 -->
    <div class="noise-overlay"></div>

    <!-- 返回按钮 -->
    <button type="button" class="back-btn" @click="back">
      <span class="blood-drop"></span>
      <span class="back-text">返回</span>
    </button>

    <!-- 主内容区 -->
    <main class="scripture-container">
      <div class="vertical-text-wrapper">
        <div
          v-for="(paragraph, pIndex) in processedContent.split('\n')"
          :key="pIndex"
          class="text-column"
          :class="{ 'is-title': pIndex === 0 }"
        >
          {{ paragraph }}
        </div>
      </div>
    </main>

    <!-- 底部装饰线 -->
    <div class="bottom-ornament"></div>
  </div>
</template>

<style scoped>
/* 导入手写体字体 */
@import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Zhi+Mang+Xing&family=Liu+Jian+Mao+Cao&display=swap');
.mystery-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 背景图片层 */
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
  opacity: 0.7;
  z-index: 0;
}

/* 噪点纹理覆盖层 */
.noise-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0.08;
  background-image: url('@/assets/image_background.png');
  z-index: 1;
}

/* 返回按钮 - 符咒风格 */
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
  border-color: #8B0000;
  color: #a50000;
  text-shadow: 0 0 8px rgba(139, 0, 0, 0.6);
  box-shadow: 0 0 12px rgba(139, 0, 0, 0.2);
}

.blood-drop {
  width: 6px;
  height: 10px;
  background: linear-gradient(to bottom, #8B0000, #4a0000);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  transform: rotate(180deg);
  opacity: 0.8;
}

.back-text {
  writing-mode: horizontal-tb;
}

/* 主内容容器 */
.scripture-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 3rem 3rem;
  position: relative;
  z-index: 2;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

/* 竖排文字包装器 */
.vertical-text-wrapper {
  display: flex;
  flex-direction: row-reverse; /* 从右向左排列 */
  align-items: flex-start;
  justify-content: center;
  gap: 2.5rem;
  max-height: 85vh;
  min-width: max-content;
  writing-mode: horizontal-tb;
}

/* 单列文字 */
.text-column {
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-family: 'Ma Shan Zheng', 'STKaiti';
  font-size: 1.5rem;
  line-height: 1.8;
  color: #a00000;
  letter-spacing: 0.25em;
  text-shadow: 0 0 16px rgba(160, 0, 0, 0.8), 0 0 32px rgba(160, 0, 0, 0.4);
  letter-spacing: 0.4em;
  max-height: 80vh;
  overflow: visible;
  position: relative;
}

/* 标题样式 - 只有标题列有下划线 */
.text-column.is-title {
  font-size: 1.8rem;
  font-weight: 200;
  color: #a00000;
  text-shadow: 0 0 16px rgba(160, 0, 0, 0.8), 0 0 32px rgba(160, 0, 0, 0.4);
  letter-spacing: 0.3em;
  padding-left: 0.8rem;
  border-left: 1px solid rgba(160, 0, 0, 0.5);
}

/* 标题列下划线效果 - 纵向在左侧 */
.text-column.is-title::after {
  content: '';
  position: absolute;
  top: 50%;
  left: -2px;
  transform: translateY(-50%);
  width: 2px;
  height: 80%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(160, 0, 0, 0.8) 20%,
    rgba(160, 0, 0, 0.8) 80%,
    transparent
  );
}

/* 底部装饰 */
.bottom-ornament {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(139, 0, 0, 0.4),
    transparent
  );
  z-index: 2;
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .vertical-text-wrapper {
    gap: 2rem;
  }

  .text-column {
    font-size: 1.3rem;
    letter-spacing: 0.2em;
  }

  .text-column.is-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 900px) {
  .scripture-container {
    padding: 3.5rem 2rem 2rem;
  }

  .vertical-text-wrapper {
    gap: 1.5rem;
  }

  .text-column {
    font-size: 1.2rem;
    line-height: 2;
    letter-spacing: 0.15em;
  }

  .text-column.is-title {
    font-size: 1.35rem;
  }
}

@media (max-width: 600px) {
  .scripture-container {
    padding: 3rem 1rem 1.5rem;
    justify-content: flex-start;
  }

  .vertical-text-wrapper {
    gap: 1rem;
    padding-right: 0.25rem;
  }

  .text-column {
    font-size: 1.1rem;
    line-height: 1.9;
    letter-spacing: 0.12em;
  }

  .text-column.is-title {
    font-size: 1.25rem;
  }

  .back-btn {
    top: 1rem;
    left: 1rem;
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style>
