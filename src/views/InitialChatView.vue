<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import ChatBubbleThread from '@/components/chat/ChatBubbleThread.vue'
import ChatRoomLayout from '@/components/chat/ChatRoomLayout.vue'
import ChatSearchBar from '@/components/chat/ChatSearchBar.vue'
import { getInitialRoomContacts } from '@/content/chatContacts'
import {
  chatRoomLayouts,
  getInitialChatBlockData,
  INITIAL_CHAT_BLOCK_ORDER,
  panelToFeedSegments,
} from '@/content/storyNodes'
import { useChatShareLink } from '@/composables/useChatShareLink'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const game = useGameStore()
const { chatLoginUser } = storeToRefs(game)
const { followShareLink } = useChatShareLink()

const selectedContactId = ref('main')
/** 搜索解锁新对话时保持当前滚动位置，不自动滚到底 */
const suppressNextSegmentScroll = ref(false)

const contacts = computed(() => getInitialRoomContacts(chatLoginUser.value))

watch(
  contacts,
  (list) => {
    if (!list.length) {
      selectedContactId.value = 'main'
      return
    }
    if (!list.some((c) => c.id === selectedContactId.value)) {
      selectedContactId.value = 'main'
    }
  },
  { immediate: true },
)

const visibleBlocks = computed(() =>
  INITIAL_CHAT_BLOCK_ORDER.filter((id) => game.chatBlockIds.has(id)),
)

watch(chatLoginUser, (u, prev) => {
  if (u === 'none') {
    selectedContactId.value = 'main'
    return
  }
  if (prev === 'none') {
    selectedContactId.value = 'main'
  }
})

function layoutNodeFromContactId(id: string): number | null {
  if (id === 'main') return null
  const m = id.match(/^(\d+)-/)
  return m ? Number(m[1]) : null
}

const feedSegments = computed(() => {
  if (selectedContactId.value === 'main') {
    return visibleBlocks.value.map((bid) => {
      const { timeline, content } = getInitialChatBlockData(bid)
      return {
        timeline: timeline.trim(),
        raw: content,
      }
    })
  }
  const nid = layoutNodeFromContactId(selectedContactId.value)
  if (nid == null) return []
  const layout = chatRoomLayouts[nid]
  const panel = layout?.panels.find((p) => p.id === selectedContactId.value)
  if (!panel) return []
  return panelToFeedSegments(panel)
})

const paneHead = computed(() => {
  if (selectedContactId.value === 'main') return '主频道 · 公共聊天'
  return contacts.value.find((c) => c.id === selectedContactId.value)?.label ?? '私聊'
})

function onSearch(kw: string) {
  const ok = game.tryChatKeywordSearch(kw)
  if (ok) {
    suppressNextSegmentScroll.value = true
    selectedContactId.value = 'main'
    alert('搜索到1条聊天记录')
  } else {
    alert('未找到匹配关键词！')
  }
}

function onLink(linkId: number) {
  followShareLink(linkId)
}

function goLogin() {
  router.push('/node/7')
}

function onLogout() {
  game.logoutChat()
}

function selectContact(id: string) {
  selectedContactId.value = id
  const nid = layoutNodeFromContactId(id)
  if (nid && id !== 'main') {
    game.markSegment(id)
  }
}
</script>

<template>
  <ChatRoomLayout
    title="公共聊天室"
    composer-hint="此聊天室已关闭，无法发送消息！"
  >
    <template #actions>
      <button
        v-if="chatLoginUser === 'none'"
        type="button"
        class="btn-login"
        @click="goLogin"
      >
        登录
      </button>
      <button v-else type="button" class="btn-out" @click="onLogout">退出登录</button>
    </template>

    <template #search>
      <ChatSearchBar @search="onSearch" />
    </template>

    <template #sidebar>
      <div class="sb-head">联系人</div>
      <div v-if="!contacts.length" class="sb-empty">
        登录后查看联系人
      </div>
      <button
        v-for="c in contacts"
        :key="c.id"
        type="button"
        class="contact"
        :class="{ active: selectedContactId === c.id }"
        @click="selectContact(c.id)"
      >
        <div
          class="contact-av"
          :class="{ on: selectedContactId === c.id }"
        >
          {{ c.label.slice(0, 1) }}
        </div>
        <div class="contact-meta">
          <span class="contact-name">{{ c.label }}</span>
        </div>
      </button>
    </template>

    <template #pane-head>{{ paneHead }}</template>

    <ChatBubbleThread
      :segments="feedSegments"
      :suppress-next-segment-scroll="suppressNextSegmentScroll"
      @consumed-suppress-segment-scroll="suppressNextSegmentScroll = false"
      @link="onLink"
    />
  </ChatRoomLayout>

  <teleport to="body">
    <button
      v-if="game.ending27Available"
      type="button"
      class="toast"
      @click="router.push('/node/27')"
    >
      您收到一条新消息
    </button>
  </teleport>
</template>

<style scoped>
.sb-head {
  padding: 0.65rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.sb-empty {
  padding: 1rem 0.85rem;
  font-size: 0.85rem;
  color: #9ca3af;
  line-height: 1.45;
}
.contact {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: none;
  border-bottom: 1px solid #edf0f4;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}
.contact:hover {
  background: rgba(30, 159, 255, 0.06);
}
.contact.active {
  background: #1e9fff;
  color: #fff;
}
.contact.active .contact-preview,
.contact.active .contact-name {
  color: #fff;
}
.contact-av {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 0.95rem;
  color: #4b5563;
  flex-shrink: 0;
}
.contact-av.on {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}
.contact-meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.contact-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
}
.contact-preview {
  font-size: 0.75rem;
  color: #9ca3af;
}
.btn-login {
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #fff;
  color: #374151;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
}
.btn-login:hover {
  background: #f3f4f6;
}
.btn-out {
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #fff;
  color: #374151;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
}
.btn-out:hover {
  background: #f3f4f6;
}
.toast {
  position: fixed;
  left: 16px;
  bottom: 16px;
  z-index: 50;
  padding: 0.65rem 0.85rem;
  border-radius: 999px;
  border: 1px solid #1e9fff;
  background: rgba(30, 159, 255, 0.12);
  color: #0b3d6b;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}
</style>
