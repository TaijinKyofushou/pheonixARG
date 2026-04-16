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

const transcriptContent = `
对话人1：我直说了，10年的那场火灾，是你救了王博傲吧。
对话人2：（沉默两秒）你怎么知道的？
对话人1：我和王博傲都许了愿。凤凰还愿、爝火赓炁、业果循环……不管叫什么名字——我们的因果衔接成环了。
对话人2：……你在说什么？
对话人1：简单来说，我们都受到了许愿的反噬。愿望的代价因为形成了循环，会在我们身上不断叠加，直到其中一环消失。王博傲出现幻觉，我失忆越来越严重，梁宇差到离谱的考试运，而你——你已经躺在这里了。
对话人1：你一定也许了关于王博傲的愿望，不然因果链无法闭环。而且这个愿望一定非常沉重，不然你也不至于躺在医院里。
对话人1：我想来想去，也只有你们小时候的那场火灾了——王博傲本来没能活着出来，是你许愿让他活下去，代价是你自己的虚弱。我说的对吗？
对话人2：（长久的沉默）差不多。只有一点小瑕疵。
对话人2：该死的本来就是我。
对话人2：那天下午我父母不在家，王博傲来我家写作业。忘记为什么了，我在和他吵架，自己跑到了阳台上睡觉。我被呛醒的时候阳台的铝合金门已经被火烧的变形了，根本打不开，烟雾很大，我呛了几口就晕了。等我醒过来的时候……是王博傲在摇我。
对话人1：王博傲在摇你？
对话人2：对。他不知道怎么砸开的阳台门，自己也被烟呛得不行，眼睛都睁不开。我听到他喊我的名字，声音都哑了，我跟他说你有病啊赶紧走啊，但他哭着跟我讲对不起。
对话人2：天字第一号大傻逼。
对话人2：火警来的很及时，我听见我妈大呼小叫地在喊，听见警铃声，然后我就放心地撒手去睡了。但是当我醒过来的时候，救护车的担架上，被抬着的只有我，没有王博傲。
对话人2：我问还有一个人呢，就在我旁边的，和我差不多大的，消防员说火场坍塌了，人还在里面。
对话人1：……（呼吸声）
对话人2：我知道那个仪式，爝火赓炁。我爸是文学院教授，书房有几本民俗学的老书，还有不知道哪一届倒霉学生被毙掉的论文。我闲得无聊时翻到过。许愿的方法，许愿的代价，都写的一清二楚。
对话人2：不知道为什么我当时意外地冷静。教三地下室离我家大概十分钟的路，我趁人多眼杂从担架上溜下来，脑子里只有一个声音：他不能死。至少不能因为救我死掉。
对话人1：你们那个时候都还是小学生吧。没有谁有责任为了彼此承担这些后果。
对话人2：你懂什么。
对话人2：王博傲冲进来救我的时候一定没想过什么责任啊后果啊之类的，他从来不觉得自己在“付出”，只是理所当然地做了。他就是那种人。
对话人1：（倒水的声音）
对话人2：（喝一口水）我跑到教三地下室的时候大概是七点左右，借着太阳的最后一点余晖找到重明龛——就是后来被水泥封起来的配电室，木制牌位下面压着几张黄纸和火柴盒，不知道是谁放的，可能是以前来过的人。我拿了一张，咬破手指写了“王博傲活下来”。
对话人1：你用血写的？
对话人2：没有笔。我那时候已经顾不上疼了。写完之后我就把黄纸烧了，火苗窜起来的时候是直的，纸灰没散，聚成了一团。我知道成了。
对话人2：我本来准备走，但那火丝毫没有熄灭的意思，整个木质牌位连同重明龛全部烧了起来。我看着看着忽然觉得天旋地转，整个人摔在地上，动弹不得，眼睁睁看着那团火像是有生命一样，把整个重明龛吞噬殆尽。
对话人2：我再醒来就是在医院的病房里，已经是火灾的第二天了。王博傲坐在我旁边，一点伤也没有，看见我醒了哭得稀里哗啦的。床边的校报还刊登着他的英雄事迹：我校学生勇闯火海施救，虽未救出同学但勇气可嘉。
对话人1：所以这个愿望甚至改写了已经发生的事实？王博傲也什么都不记得吗？你就没想过告诉他？
对话人2：告诉他有什么用？让他知道“我本来可以毫发无伤，是我强行改了因果让你活下来，然后我自己变成了废物”？他会怎么想？他会觉得是他欠我的。
对话人1：所以你就让他一直因为没能救下你而愧疚？
对话人2：总比知道真相好。我不想让他背负“我欠你一条命”这种包袱。他不需要那种东西。
对话人1：（停顿）你有没有想过，他可能宁愿知道真相？
对话人2：（沉默）……我不知道。
对话人1：纸包不住火。王博傲最近一直出现幻觉——火场的幻觉。就算你不说，他的记忆也在逐渐恢复，总有一天他会想起来。
对话人1：这还不是重点，重点是这说明你最开始许的那个愿望，我们所有人许的愿望，效力都在不断流失，代价却变本加厉地返还。如果愿望彻底失效，王博傲搞不好会死掉。
对话人2：他不会死。就像你说的，我们的愿望形成了环，那只要这个环断掉不就好了？反正我的身体也在不断衰竭。只要我死了，因果链就断开了。
对话人2：没人知道是怎么回事的。你可以跟他们说，我是旧伤复发。
对话人1：（手指敲击床沿的声音）
对话人2：你自己也在承受代价吧？你的失忆越来越严重了，连我在哪个医院都要问两遍。只要我死了，一切都能解决。你的记忆能恢复正常，梁宇也不用再担心你。王博傲……王博傲会难过一阵子，但有你们陪着他，也不会让他难过太久。
对话人1：（突然笑了一下）你倒是替所有人都想好了。
对话人2：那你告诉我，还能怎么办？
对话人1：你猜我为什么来这里？
对话人2：……装什么呢，搞得你好像真有办法一样。
对话人1：哇噻，我信用有那么差吗？
对话人2：一直很烂。梁宇都看得出来你每次装没事骗他。
对话人1：（叹气）
对话人1：张一然，你听我说，我知道你不信我，但就这一次。你死了王博傲绝对不会好过的，不管他知不知道真相。
对话人1：你当年许愿的时候想的是“他活着就好”。现在他也是一样的——你活着就好。（小声）蠢得一脉相承。
对话人2：别以为我听不见……你打算怎么做？
对话人1：这个你不需要知道。你只需要活着，等我消息。
对话人2：多久？
对话人1：不会太久。相信我。
对话人2：……你最好说到做到。
`

const audioFiles = ref<AudioFile[]>([
  {
    id: 1,
    name: '2026年3月27日 下午4点31分.wav',
    duration: '00:23:16.355',
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
