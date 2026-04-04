<script setup lang="ts">
import { computed } from 'vue'
import { getFullPage } from '@/content/storyNodes'
import { useGameStore } from '@/stores/game'
import HomeView from '@/views/HomeView.vue'
import InitialChatView from '@/views/InitialChatView.vue'
import SchoolNoticeView from '@/views/SchoolNoticeView.vue'
import LoginChatView from '@/views/LoginChatView.vue'
import LoginForumView from '@/views/LoginForumView.vue'
import ForumView from '@/views/ForumView.vue'
import ForumNode26View from '@/views/ForumNode26View.vue'
import ForumProfileView from '@/views/ForumProfileView.vue'
import MysteryNoteView from '@/views/MysteryNoteView.vue'
import ChatRoomView from '@/views/ChatRoomView.vue'
import MedicalRecordView from '@/views/MedicalRecordView.vue'
import VoiceTranscriptView from '@/views/VoiceTranscriptView.vue'
import Ending27View from '@/views/Ending27View.vue'
import NarrativeView from '@/views/NarrativeView.vue'
import EndingPuzzleView from '@/views/EndingPuzzleView.vue'
import EndingFakeView from '@/views/EndingFakeView.vue'
import EndingTrueView from '@/views/EndingTrueView.vue'
import ForbiddenWarningView from '@/views/ForbiddenWarningView.vue'

const props = defineProps<{
  id: string
}>()

const nid = computed(() => Number(props.id))
const game = useGameStore()

const node = computed(() => getFullPage(nid.value))

const comp = computed(() => {
  const n = node.value
  if (!n) return HomeView
  switch (n.kind) {
    case 'home':
      return HomeView
    case 'initialChat':
      return InitialChatView
    case 'schoolNotice':
      return SchoolNoticeView
    case 'loginModal':
      return LoginChatView
    case 'forumLogin':
      return LoginForumView
    case 'forum':
      return n.id === 26 ? ForumNode26View : ForumView
    case 'forumProfile':
      return ForumProfileView
    case 'mysteryNote':
      // node15 使用特殊的 403 Forbidden 风格页面
      if (n.id === 15) {
        return ForbiddenWarningView
      }
      return MysteryNoteView
    case 'chatRoom':
      return ChatRoomView
    case 'medicalRecord':
      return MedicalRecordView
    case 'voiceTranscript':
      return VoiceTranscriptView
    case 'ending27':
      return Ending27View
    case 'narrative':
      return NarrativeView
    case 'endingPuzzle':
      return EndingPuzzleView
    case 'endingFake':
      return EndingFakeView
    case 'endingTrue':
      return EndingTrueView
    default:
      return HomeView
  }
})

const forumVariant = computed(() => {
  const id = nid.value
  if (id === 10) return game.forumLoggedIn ? ('d_posts' as const) : ('guest' as const)
  if (id === 12 || id === 32) return 'd_posts' as const
  if (id === 26) return 'truth' as const
  return 'guest' as const
})
</script>

<template>
  <component
    :is="comp"
    v-if="node"
    :node-id="nid"
    :node="node"
    :forum-variant="forumVariant"
  />
  <HomeView v-else />
</template>
