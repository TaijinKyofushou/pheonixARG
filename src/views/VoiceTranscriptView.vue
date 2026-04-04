<script setup lang="ts">
import type { FullPageNode } from '@/types/story'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

defineProps<{
  node: FullPageNode
}>()

const router = useRouter()
const languageType = ref('chinese')
const outputPath = ref('original')

interface AudioFile {
  id: number
  name: string
  duration: string
  status: 'completed' | 'converting' | 'pending'
  result: string
}

const transcriptContent = `对话人1：我直说了，10年的那场火灾，是你救了D吧。
对话人2：你怎么知道的？
对话人1：我和D都许了愿，我们的因果衔接成环了。
对话人2：你在说什么？
对话人1：我去图书馆查了县志，查了关于凤凰、还愿、仪式的历史，结果还真的有记载。简单来说，我们都受到了愿望的反噬，那些愿望的代价因为形成了循环，会在我们身上不断叠加，直到其中一环消失。
对话人1：你一定也许了关于D的愿望，不然因果链无法闭环；而且这个愿望的代价一定非常沉重，所以你现在才会躺在这里。
对话人1：我想来想去，也只有你们小时候的那场火灾了——你许愿让他活下来，代价是你自己的虚弱。我说的对吗？
对话人2：……
对话人2：你知道吗，D跟我说他最近总能看到火场的幻觉，身上还有被灼烧的痛感。我许的那个愿望，它的效力正在不断流失，代价却在变本加厉地返还，再这样下去D真的会死的！如果像你说的那样，是因为我们的愿望形成了环，那只要这个环断掉不就好了？反正我的身体也在不断衰竭，没人知道是怎么回事的。
对话人2：——当然，只要你不要说出去。
对话人2：你自己也在承受代价吧？你的失忆状况不是越来越严重了？只要我死了，一切都能解决。
对话人1：你猜我为什么来这里？
对话人1：我有其他方法，你放心好了。你和D都会没事的。
`

const audioFiles = ref<AudioFile[]>([
  {
    id: 1,
    name: '2026年3月27日 下午4点31分.wav',
    duration: '00:08:16.355',
    status: 'pending',
    result: ''
  }
])

function back() {
  router.push('/node/23')
}

function startConvert() {
  audioFiles.value.forEach(file => {
    if (file.status === 'pending') {
      file.status = 'converting'
      setTimeout(() => {
        file.status = 'completed'
        file.result = transcriptContent
      }, 1500)
    }
  })
}

</script>

<template>
  <div class="voice-converter">
    <!-- 顶部标题栏 -->
    <header class="header">
      <div class="header-left">
        <div class="logo">
          <span class="logo-icon">🔷</span>
          <span class="logo-text">全能王文字语音转换器</span>
        </div>
      </div>
      <div class="header-right">
        <button class="window-btn minimize" @click="back">−</button>
        <button class="window-btn maximize">□</button>
        <button class="window-btn close" @click="back">×</button>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 文件列表表格 -->
      <div class="table-container">
        <table class="file-table">
          <thead>
            <tr>
              <th class="col-seq">序号</th>
              <th class="col-name">文件名</th>
              <th class="col-duration">时长</th>
              <th class="col-status">转换状态</th>
              <th class="col-result">输出结果</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="file in audioFiles" :key="file.id">
              <td class="col-seq">{{ file.id }}</td>
              <td class="col-name">
                <span class="file-icon">🎵</span>
                <span class="file-name">{{ file.name }}</span>
              </td>
              <td class="col-duration">{{ file.duration }}</td>
              <td class="col-status">
                <span class="status-badge" :class="file.status">
                  {{ file.status === 'completed' ? '转换完成' : file.status === 'converting' ? '转换中...' : '等待中' }}
                </span>
              </td>
              <td class="col-result">
                <div class="result-text" v-html="file.result.replace(/\n/g, '<br>')"></div>
              </td>
            </tr>
            <tr v-if="audioFiles.length === 0">
              <td colspan="5" class="empty-state">
                <div class="empty-content">
                  <span class="empty-icon">📁</span>
                  <p>暂无文件</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 设置区域 -->
      <div class="settings-panel">
        <div class="setting-row">
          <span class="setting-label">语音类型：</span>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" v-model="languageType" value="chinese" />
              <span class="radio-custom"></span>
              中文
            </label>
            <label class="radio-label">
              <input type="radio" v-model="languageType" value="english" />
              <span class="radio-custom"></span>
              English
            </label>
          </div>
        </div>
        <div class="setting-row">
          <span class="setting-label">输出路径：</span>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" v-model="outputPath" value="original" />
              <span class="radio-custom"></span>
              原目录
            </label>
            <label class="radio-label">
              <input type="radio" v-model="outputPath" value="custom" />
              <span class="radio-custom"></span>
              自定义
            </label>
          </div>
          <input
            type="text"
            class="path-input"
            value="C:\Users\Administrator\Documents\speech"
            readonly
          />
        </div>
      </div>

      <!-- 开始转换按钮 -->
      <div class="convert-section">
        <button class="convert-btn" @click="startConvert">开始转换</button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.voice-converter {
  min-height: 100vh;
  background: #f5f6f7;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  display: flex;
  flex-direction: column;
}

/* 顶部标题栏 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  background: linear-gradient(135deg, #4a90d9 0%, #357abd 100%);
  padding: 0 16px;
  color: white;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
}

.logo-icon {
  font-size: 18px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  font-size: 13px;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  background: #fff;
}

.avatar img {
  width: 100%;
  height: 100%;
}

.vip-badge {
  color: #ffd700;
  font-size: 12px;
}

.header-btn {
  padding: 4px 12px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.header-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.menu-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}

.menu-icon {
  font-size: 12px;
}

.window-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
}

.window-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.window-btn.close:hover {
  background: #e74c3c;
}

/* 工具栏 */
.toolbar {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid #e8e8e8;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  border-color: #4a90d9;
  color: #4a90d9;
}

.back-icon {
  font-size: 14px;
}

.tabs {
  display: flex;
  gap: 4px;
}

.tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border: 1px solid #d9d9d9;
  background: #fafafa;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.tab:first-child {
  border-radius: 4px 0 0 4px;
}

.tab:last-child {
  border-radius: 0 4px 4px 0;
}

.tab.active {
  background: #4a90d9;
  border-color: #4a90d9;
  color: white;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #4a90d9;
}

.tab-icon {
  font-size: 14px;
}

/* 主内容区 */
.main-content {
  flex: 1;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}

/* 表格容器 */
.table-container {
  flex: 1;
  background: white;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
  overflow: auto;
  min-height: 0;
}

.file-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.file-table th {
  background: #fafafa;
  padding: 12px;
  text-align: left;
  font-weight: 500;
  color: #333;
  border-bottom: 1px solid #e8e8e8;
  white-space: nowrap;
}

.file-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: top;
}

.file-table tbody tr:hover {
  background: #fafafa;
}

.col-seq {
  width: 60px;
  text-align: center;
  color: #999;
}

.col-name {
  min-width: 150px;
}

.col-duration {
  width: 100px;
  color: #666;
}

.col-status {
  width: 100px;
}

.col-result {
  flex: 1;
  min-width: 300px;
  width: 50%;
}

.col-result .download-all-btn {
  float: right;
  padding: 4px 12px;
  background: #4a90d9;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.col-result .download-all-btn:hover {
  background: #357abd;
}

.file-icon {
  margin-right: 6px;
  color: #4a90d9;
}

.file-name {
  color: #4a90d9;
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.completed {
  background: #52c41a;
  color: white;
}

.status-badge.converting {
  background: #faad14;
  color: white;
}

.status-badge.pending {
  background: #d9d9d9;
  color: #666;
}

.result-text {
  color: #333;
  line-height: 1.6;
  font-size: 14px;
  min-height: 200px;
  max-height: 280px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.empty-state {
  text-align: center;
  padding: 30px 20px;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
}

/* 设置面板 */
.settings-panel {
  background: white;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.setting-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.setting-label {
  font-size: 13px;
  color: #666;
  min-width: 80px;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
}

.radio-label input {
  display: none;
}

.radio-custom {
  width: 16px;
  height: 16px;
  border: 2px solid #d9d9d9;
  border-radius: 50%;
  position: relative;
  transition: all 0.2s;
}

.radio-label input:checked + .radio-custom {
  border-color: #4a90d9;
}

.radio-label input:checked + .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: #4a90d9;
  border-radius: 50%;
}

.path-input {
  flex: 1;
  min-width: 250px;
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
  background: #fafafa;
}

/* 转换按钮区 */
.convert-section {
  display: flex;
  justify-content: flex-end;
}

.convert-btn {
  padding: 12px 48px;
  background: #4a90d9;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(74, 144, 217, 0.3);
}

.convert-btn:hover {
  background: #357abd;
}

.convert-btn:active {
  transform: translateY(1px);
}
</style>
