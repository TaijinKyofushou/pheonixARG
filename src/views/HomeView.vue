<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const game = useGameStore()
const showTipsModal = ref(false)

function start() {
  router.push('/node/1')
}

function reset() {
  if (confirm('确定清空本地进度？')) game.resetProgress()
}

function openTips() {
  showTipsModal.value = true
}

function closeTips() {
  showTipsModal.value = false
}
</script>

<template>
  <div class="wrap">
    <header class="hero">
      <h1 class="title">北京市某高校大学生清明失踪事件</h1>
      <!-- <p class="sub">Author: 青天浩渺白日灼灼</p> -->
    </header>

    <section class="card">
      <p class="p">
        终于，你在DDL前四个小时敲完了计组大作业的最后一行注释。
      </p>
      <p class="p">
        屏幕右下角的时间显示03:47，寝室里只有笔记本的风扇声在嗡嗡作响。你把压缩包拖进邮箱，在收件人那一栏敲下“deposit@stu.edu.cn”——这是开学时教务系统里写的助教邮箱。
      </p>
      <p class="p">
        点击发送。
      </p>
      <p class="p">
        “收件人地址不存在，请核对后重试。”
      </p>
      <p class="p">
        你愣了一下，又发了一遍。同样的红字。
      </p>
      <p class="p">
        切回教务系统，找到课程主页。助教那一栏是空的。你翻了课程群、翻了表白墙、翻了所有可能存在助教联系方式的地方，结果是统一的空白。
      </p>
      <p class="p">
        这门课没有助教。
      </p>
      <p class="p">
        屋漏偏逢连夜雨，交不上作业计组绝对会挂掉。你一咬牙，决定实在不行就去加任课教授黄文礼的微信。但鼠标滑过学校聊天室入口的时候，你停了一下。
      </p>
      <p class="p">
        聊天室是学校内部的老系统，已经很久没人维护了。听说只要破解了搜索功能，就能查到所有注册学生的公开信息和发言记录——当然也包括可能存在的计组助教。
        你试了几次，用简单的注入绕过了搜索限制。简直轻松到了诡异的地步。
      </p>
      <p class="p">总而言之，为了交上计组大作业，为了你的绩点，你决心在早八之前，在聊天室中找到神秘消失的助教！</p>
    </section>

    <section class="card">
      <h2 class="section-title">游戏须知</h2>
      <p class="p">
        本游戏为ARG文字解谜游戏，你需要在聊天室中寻找合适的关键词进行搜索，解锁对话，还原故事真相。
      </p>
      <p class="p">
        注意，游戏中可能有轻度的恐怖要素和惊吓环节。
      </p>
      <p class="p">
        游戏流程大致为：登录聊天室 → 阅读内容 → 搜索关键词 → 解锁新页面。没有需要局外搜索的线索，没有需要查看源码的谜题，也没有需要破解的加密内容。
      </p>
      <p class="p">
        有些页面可能只会出现一次，因此强烈建议使用excel或备忘录记录关键信息，避免遗漏线索。
      </p>
      <p class="p">游戏可解锁内容共34页+15个彩蛋，预计游戏时间1小时。希望你玩得开心！</p>
      <p class="p">tips：刚进入页面不知道搜什么？试试搜一下计组教授或助教的名字吧！</p>
      <div class="actions">
        <div class="actions-left">
          <button type="button" class="primary" @click="start">进入聊天室</button>
          <button type="button" class="ghost" @click="reset">重置进度</button>
        </div>
        <button type="button" class="tips-btn" @click="openTips">提示</button>
      </div>
    </section>

    <div v-if="showTipsModal" class="tips-mask" @click.self="closeTips">
      <section class="tips-modal">
        <header class="tips-head">
          <h2 class="section-title">提示</h2>
          <button type="button" class="ghost" @click="closeTips">关闭</button>
        </header>
        <div class="tips-body">
          <p class="p">1：计组教授的名字是什么  <span class="keyword">黄文礼</span></p>
          <p class="p">2：出现了一个名字  <span class="keyword">杨立凡</span></p>
          <p class="p">3：Bell的竞赛结果怎么样了 <span class="keyword">美赛</span></p>
          <p class="p">4：出现了特定地址 <span class="keyword">教三地下室</span></p>
          <p class="p">5：试过登录了吗 <span class="keyword">右上角登录April的账号</span></p>
          <p class="p">6：忘记密码可以查看密保 <span class="keyword">66605088</span></p>
          <p class="p">8：特殊的名词出现了 <span class="keyword">凤凰还愿</span></p>
          <p class="p">9：论坛也可以登录 <span class="keyword">右上角点击登录</span></p>
          <p class="p">10：是不是有一个人一直没出现 <span class="keyword">账号：Deposit 密码：Deposit</span></p>
          <p class="p">11：“我”的发帖里症状原因是什么 <span class="keyword">薪火焚身</span></p>
          <p class="p">12：难道你不想再看一章吗 <span class="keyword">玄坛秘笺</span></p>
          <p class="p">13：出现了拗口的专有名词 <span class="keyword">爝火赓炁</span></p>
          <p class="p">14：（较难）最下方有一行小字 <span class="keyword">重明龛</span></p>
          <p class="p">15：在聊天室搜索过吗 <span class="keyword">重明龛</span></p>
          <p class="p">16：对某人很特殊的日期 <span class="keyword">登录Collide账号，密码为20100807</span></p>
          <p class="p">17：Collide在哪里 <span class="keyword">北医三院</span></p>
          <p class="p">18：（较难）电子病历是用谁的账号打开的  <span class="keyword">Bell的所有账号都是同一个密码</span> <span class="keyword">网页url可以看到登录信息</span> <span class="keyword">GUtoA7sX</span></p>
          <p class="p">19：县志上不知谁作了批注 <span class="keyword">破局之机，惟环外也</span></p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
}
.hero {
  margin-bottom: 1.25rem;
}
.title {
  margin: 0;
  font-size: 2rem;
  letter-spacing: 0.08em;
}
.sub {
  margin: 0.35rem 0 0;
  opacity: 0.8;
}
.card {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1rem 1.1rem;
  background: var(--color-panel);
  margin-bottom: 1rem;
}
.section-title {
  margin: 0 0 0.8rem;
  font-size: 1.1rem;
  letter-spacing: 0.04em;
}
.p {
  line-height: 1.65;
  margin: 0 0 1rem;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.8rem;
}
.actions-left {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
.primary {
  padding: 0.55rem 0.9rem;
  border-radius: 8px;
  border: 1px solid var(--color-accent);
  background: var(--color-accent);
  color: #fff;
  cursor: pointer;
}
.ghost {
  padding: 0.55rem 0.9rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: inherit;
  cursor: pointer;
}
.tips-btn {
  margin-left: auto;
  padding: 0.55rem 0.95rem;
  border-radius: 8px;
  border: 1px solid #86d1af;
  background: rgb(39, 44, 49);
  color: #86d1af;;
  cursor: pointer;
}
.tips-btn:hover {
  border-color: #64b98f;
  background: rgb(32, 36, 41);
}
.tips-mask {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 1rem;
}
.tips-modal {
  width: min(720px, 100%);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1rem 1.1rem;
  background: var(--color-panel);
}
.tips-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
}
.tips-body {
  min-height: 180px;
  max-height: min(62vh, 520px);
  overflow-y: auto;
  border: 1px dashed var(--color-border);
  border-radius: 8px;
  margin-top: 0.8rem;
  padding: 0.8rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.24) transparent;
}
.tips-body::-webkit-scrollbar {
  width: 8px;
}
.tips-body::-webkit-scrollbar-track {
  background: transparent;
}
.tips-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.24);
  border-radius: 999px;
}
.tips-body::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.38);
}
.keyword {
  display: inline-block;
  padding: 0 0.2em;
  border-radius: 4px;
  background: #000;
  color: #000;
}
</style>
