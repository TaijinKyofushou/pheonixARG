<script setup lang="ts">
import ChatRoomLayout from '@/components/chat/ChatRoomLayout.vue'
import MessageBlock from '@/components/chat/MessageBlock.vue'
import type { FullPageNode } from '@/types/story'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const props = defineProps<{
  node: FullPageNode
}>()

const router = useRouter()
const game = useGameStore()

function exit() {
  game.unlockTrueEnding31()
  router.push('/node/31')
}
</script>

<template>
  <ChatRoomLayout
    title="公共聊天室"
    subtitle="假结局"
    :composer-hint="null"
  >
    <template #actions>
      <button
        v-if="game.puzzleSolved"
        type="button"
        class="danger"
        @click="exit"
      >
        退出
      </button>
    </template>

    <template #sidebar>
      <p class="muted">（结局演出）</p>
    </template>

    <MessageBlock :raw="props.node.content ?? ''" />
  </ChatRoomLayout>
</template>

<style scoped>
.danger {
  border: 1px solid #ff2b2b;
  background: rgba(255, 40, 40, 0.18);
  color: #ffb4b4;
  border-radius: 10px;
  padding: 0.45rem 0.75rem;
  cursor: pointer;
  font-weight: 800;
}
.muted {
  margin: 0;
  opacity: 0.65;
  font-size: 0.9rem;
}
</style>
