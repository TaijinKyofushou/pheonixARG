<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import ChatBubbleThread from '@/components/chat/ChatBubbleThread.vue'
import ChatRoomLayout from '@/components/chat/ChatRoomLayout.vue'
import ChatSearchBar from '@/components/chat/ChatSearchBar.vue'
import {
  chatRoomLayouts,
  getInitialChatBlockData,
  INITIAL_CHAT_BLOCK_ORDER,
  layoutMainChannelNarrativeSegments,
  panelToFeedSegments,
} from '@/content/storyNodes'
import type { FullPageNode } from '@/types/story'
import { useChatShareLink } from '@/composables/useChatShareLink'
import { useGameStore } from '@/stores/game'

const props = defineProps<{
  node: FullPageNode
  nodeId: number
}>()

const router = useRouter()
const game = useGameStore()
const { followShareLink } = useChatShareLink()

const panel = ref<'main' | string>('main')

const layout = computed(() => chatRoomLayouts[props.nodeId])

/** 与 /node/1 主频道一致的公共解锁段（搜索在此解锁） */
const visiblePublicBlocks = computed(() =>
  INITIAL_CHAT_BLOCK_ORDER.filter((id) => game.chatBlockIds.has(id)),
)

const contacts = computed(() => {
  const lay = layout.value
  if (!lay) return []
  const list = [{ id: 'main', label: '主频道' }]
  for (const p of lay.panels) {
    list.push({ id: p.id, label: p.label })
  }
  return list
})

function onSearch(kw: string) {
  const ok = game.tryChatKeywordSearch(kw)
  if (ok) {
    panel.value = 'main'
    alert('搜索到匹配聊天记录，已切换到主频道。')
  } else {
    alert('未找到匹配关键词！')
  }
}

function onLink(linkId: number) {
  followShareLink(linkId)
}

function selectContact(id: string) {
  panel.value = id
  if (id !== 'main') {
    game.markSegment(id)
  }
}

function logout() {
  game.logoutChat()
  router.push('/node/1')
}

const feedSegments = computed(() => {
  const lay = layout.value
  if (!lay) return []
  if (panel.value === 'main') {
    const publicSegs = visiblePublicBlocks.value.map((bid) => {
      const { timeline, content } = getInitialChatBlockData(bid)
      return { timeline: timeline.trim(), raw: content }
    })
    /** 公共解锁段 + 本房间主叙事（如节点 23 的 mainSegments）；节点 8 等未配置则不追加 */
    return [...publicSegs, ...layoutMainChannelNarrativeSegments(lay)]
  }
  const p = lay.panels.find((x) => x.id === panel.value)
  if (!p) return []
  return panelToFeedSegments(p)
})

const paneHead = computed(() => {
  if (panel.value === 'main') return `主频道`
  return contacts.value.find((c) => c.id === panel.value)?.label ?? '私聊'
})
</script>

<template>
  <ChatRoomLayout
    v-if="layout"
    title="聊天室"
    :subtitle="node.timeline ?? ''"
    composer-hint="此聊天室已关闭，无法发送消息！"
  >
    <template #actions>
      <button type="button" class="btn-out" @click="logout">退出登录</button>
    </template>

    <template #search>
      <ChatSearchBar @search="onSearch" />
    </template>

    <template #sidebar>
      <div class="sb-head">联系人</div>
      <button
        v-for="c in contacts"
        :key="c.id"
        type="button"
        class="contact"
        :class="{ active: panel === c.id }"
        @click="selectContact(c.id)"
      >
        <div class="contact-av" :class="{ on: panel === c.id }">
          {{ c.label.slice(0, 1) }}
        </div>
        <div class="contact-meta">
          <span class="contact-name">{{ c.label }}</span>
        </div>
      </button>
    </template>

    <template #pane-head>{{ paneHead }}</template>

    <ChatBubbleThread :segments="feedSegments" @link="onLink" />
  </ChatRoomLayout>

  <div v-else class="missing">未找到聊天室布局配置（node {{ nodeId }}）</div>
</template>

<style scoped>
.sb-head {
  padding: 0.65rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
  letter-spacing: 0.06em;
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
}
.contact:hover {
  background: rgba(14, 165, 233, 0.08);
}
.contact.active {
  background: #0ea5e9;
  color: #fff;
}
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
}
.contact-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
}
.tip {
  margin: 0.65rem 0.75rem;
  font-size: 0.75rem;
  color: #9ca3af;
  line-height: 1.35;
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
.missing {
  padding: 1rem;
  color: #fff;
}
</style>
