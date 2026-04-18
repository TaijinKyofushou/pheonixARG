<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FullPageNode } from '@/types/story'
import { useGameStore } from '@/stores/game'

const props = defineProps<{
  node: FullPageNode
  nodeId: number
}>()

const router = useRouter()
const game = useGameStore()

const account = ref('')
const password = ref('')
const err = ref('')

function back() {
  router.push('/node/1')
}

function forgot() {
  const acc = account.value.trim()
  if (!acc) {
    err.value = '请输入账号'
    return
  }
  const raw = acc.toLowerCase()
  if (raw === 'april') err.value = '密保：教务处电话'
  else if (raw === 'bell') err.value = '密保：统一密码'
  else if (raw === 'collide') err.value = '密保：那一天'
  else if (raw === 'deposit') err.value = '该账号仅支持论坛登录'
  else err.value = '账号不存在'
}

function submit() {
  err.value = ''
  const v = props.node.loginVariant
  if (!v || v === 'forumDeposit') {
    err.value = '配置错误'
    return
  }
  const r = game.loginChat(account.value, password.value)
  if (r === 'no_account') {
    err.value = '账号不存在'
    return
  }
  if (r === 'bad_password') {
    err.value = '密码错误'
    return
  }
  const acc = account.value.trim()
  const raw = acc.toLowerCase()
  if (raw === 'april') {router.push('/node/8'); alert('欢迎回来，April！')}
  else if (raw === 'collide') {router.push('/node/19'); alert('欢迎回来，Collide！')}
  else if (raw === 'bell') {router.push('/node/23'); alert('欢迎回来，Bell！')}
}
</script>

<template>
  <div class="mask">
    <div class="modal">
      <header class="top">
        <button type="button" class="x" @click="back">关闭</button>
        <h1 class="h">登录</h1>
        <p class="sub">请输入账号与 8 位密码</p>
      </header>
      <form class="form" @submit.prevent="submit">
        <label class="lab">
          <span>账号</span>
          <input v-model="account" class="inp" autocomplete="username" />
        </label>
        <label class="lab">
          <span>密码</span>
          <input v-model="password" class="inp" type="password" autocomplete="current-password" />
        </label>
        <p v-if="err" class="err">{{ err }}</p>
        <div class="row">
          <button type="button" class="link" @click="forgot">忘记密码</button>
          <button type="submit" class="btn">登录</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.mask {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1rem;
  background:
    radial-gradient(ellipse 130% 85% at 50% -10%, rgba(125, 211, 252, 0.5), transparent 52%),
    linear-gradient(168deg, #dbeafe 0%, #e0f2fe 42%, #f0f9ff 100%);
}
/* 浅色弹窗 + 天蓝点缀（与聊天室一致） */
.modal {
  width: min(520px, 100%);
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 1.1rem 1.15rem 1.15rem;
  background: #ffffff;
  color: #1a1a1a;
  box-shadow:
    0 16px 48px rgba(14, 116, 144, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.9) inset;
}
.top {
  position: relative;
  margin-bottom: 0.75rem;
  padding-right: 4rem;
}
.h {
  margin: 0.35rem 0 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #0c4a6e;
}
.sub {
  margin: 0.35rem 0 0;
  font-size: 0.9rem;
  color: #6b7280;
}
.x {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  border: 1px solid #bae6fd;
  background: #f0f9ff;
  color: #0c4a6e;
  border-radius: 8px;
  padding: 0.3rem 0.55rem;
  cursor: pointer;
}
.x:hover {
  border-color: #38bdf8;
  color: #0369a1;
  background: #e0f2fe;
}
.form {
  display: grid;
  gap: 0.65rem;
}
.lab {
  display: grid;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: #374151;
}
.inp {
  padding: 0.55rem 0.65rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #fafbfc;
  color: #111827;
  /* 浅色弹窗内强制浅色原生控件（密码可见性按钮等） */
  color-scheme: light;
}
.inp:hover {
  border-color: #93c5fd;
}
.inp:focus {
  outline: none;
  border-color: #38bdf8;
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
  background: #fff;
}
.err {
  margin: 0;
  color: #e11d48;
  font-size: 0.9rem;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}
.link {
  border: none;
  background: none;
  color: #0284c7;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-color: rgba(2, 132, 199, 0.35);
}
.link:hover {
  color: #0369a1;
}
.btn {
  padding: 0.55rem 1rem;
  border-radius: 8px;
  border: 1px solid #0ea5e9;
  background: linear-gradient(180deg, #38bdf8 0%, #0ea5e9 100%);
  color: #fff;
  cursor: pointer;
  font-weight: 600;
}
.btn:hover {
  background: linear-gradient(180deg, #7dd3fc 0%, #38bdf8 100%);
  border-color: #0284c7;
}
</style>
