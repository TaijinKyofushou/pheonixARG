<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FullPageNode } from '@/types/story'
import { useGameStore } from '@/stores/game'

defineProps<{
  node: FullPageNode
}>()

const router = useRouter()
const game = useGameStore()

const account = ref('')
const password = ref('')
const err = ref('')

function back() {
  router.push('/node/10')
}

function submit() {
  err.value = ''
  const r = game.loginForumDeposit(account.value, password.value)
  if (r === 'no_account') {
    err.value = '账号不存在！'
    return
  }
  if (r === 'bad_password') {
    err.value = '密码错误'
    return
  }
  else alert('登录成功！正在进入个人主页……')
  router.push('/node/27')
}
</script>

<template>
  <div class="mask theme-forum">
    <div class="modal">
      <header class="top">
        <h1 class="h">论坛登录</h1>
        <div class="actions">
          <button type="button" class="x" @click="back">返回</button>
        </div>
      </header>
      <form class="form" @submit.prevent="submit">
        <label class="lab">
          <span>账号</span>
          <input v-model="account" class="inp" />
        </label>
        <label class="lab">
          <span>密码</span>
          <input v-model="password" class="inp" type="password" />
        </label>
        <p v-if="err" class="err">{{ err }}</p>
        <button type="submit" class="btn">登录</button>
      </form>
      <p class="small">初始密码为账号，请及时修改！</p>
    </div>
  </div>
</template>

<style scoped>
.mask {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: radial-gradient(900px 500px at 50% 0%, #241313, #0a0a0c);
}
.modal {
  width: min(520px, 100%);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1rem 1.1rem;
  background: var(--color-panel);
}
.h {
  margin: 0;
  color: #7c0000;
}
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}
.actions {
  display: flex;
  align-items: center;
}
.x {
  border: 1px solid var(--color-border);
  background: transparent;
  color: inherit;
  border-radius: 8px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}
.form {
  display: grid;
  gap: 0.65rem;
}
.lab {
  display: grid;
  gap: 0.35rem;
  font-size: 0.9rem;
}
.inp {
  padding: 0.55rem 0.6rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: #0f0f14;
  color: inherit;
  color-scheme: dark;
}
.err {
  margin: 0;
  color: #ff8a8a;
  font-size: 0.9rem;
}
.btn {
  padding: 0.55rem 0.85rem;
  border-radius: 8px;
  border: 1px solid var(--color-accent);
  background: var(--color-accent);
  color: #fff;
  cursor: pointer;
}
.small {
  margin: 0.75rem 0 0;
  opacity: 0.75;
  font-size: 0.85rem;
}
</style>
