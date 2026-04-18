import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import {
  CHAT_BLOCK_IDS,
  CHAT_KEYWORD_TO_BLOCK_ID,
  FORUM_KEYWORD_TO_NODE_ID,
  LINK_ID_TO_NODE_ID,
  VIEWED_SEGMENT_ACADEMIC_PAPER_34,
} from '@/content/unlockRules'
import { isPuzzleStrictlyCorrect } from '@/content/puzzleAnswers'

const STORAGE_KEY = 'pheonix-avg-game-v1'

export type ChatLoginUser = 'none' | 'april' | 'bell' | 'collide'

function loadPersisted(): Partial<PersistShape> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Partial<PersistShape>
  } catch {
    return null
  }
}

interface PersistShape {
  unlockedNodeIds: number[]
  chatBlockIds: number[]
  forumLoggedIn: boolean
  chatLoginUser?: ChatLoginUser
  viewedSegments: string[]
  puzzleSolved: boolean
  ending30SeenIntro: boolean
  /** 曾进入论坛真相帖 node26 后，论坛相关节点改道 node15 */
  forumHauntedAfter26?: boolean
}

export const useGameStore = defineStore('game', () => {
  /** 7：登录弹窗自开局可进入（自 /node/1 登录按钮） */
  const unlockedNodeIds = ref<Set<number>>(new Set([0, 1, 7]))
  const chatBlockIds = ref<Set<number>>(new Set([1]))
  const forumLoggedIn = ref(false)
  const chatLoginUser = ref<ChatLoginUser>('none')
  const viewedSegments = ref<Set<string>>(new Set())
  const puzzleSolved = ref(false)
  /** node 30：已与 A 对话完毕，可去 node 31 叙事 */
  const ending30ReadyFor31 = ref(false)
  const ending30SeenIntro = ref(false)
  /** 进入 node26 后，node10/11/12/13/14 路由改至 node15 */
  const forumHauntedAfter26 = ref(false)

  const hydrated = ref(false)

  function persist() {
    const p: PersistShape = {
      unlockedNodeIds: [...unlockedNodeIds.value],
      chatBlockIds: [...chatBlockIds.value],
      forumLoggedIn: forumLoggedIn.value,
      chatLoginUser: chatLoginUser.value,
      viewedSegments: [...viewedSegments.value],
      puzzleSolved: puzzleSolved.value,
      ending30SeenIntro: ending30SeenIntro.value,
      forumHauntedAfter26: forumHauntedAfter26.value,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
  }

  function hydrate() {
    const p = loadPersisted()
    if (!p) {
      hydrated.value = true
      maybeUnlockEnding30()
      return
    }
    if (p.unlockedNodeIds?.length) unlockedNodeIds.value = new Set(p.unlockedNodeIds)
    if (p.chatBlockIds?.length) chatBlockIds.value = new Set(p.chatBlockIds)
    if (typeof p.forumLoggedIn === 'boolean') forumLoggedIn.value = p.forumLoggedIn
    if (p.chatLoginUser && ['none', 'april', 'bell', 'collide'].includes(p.chatLoginUser)) {
      chatLoginUser.value = p.chatLoginUser
    }
    if (p.viewedSegments?.length) viewedSegments.value = new Set(p.viewedSegments)
    if (typeof p.puzzleSolved === 'boolean') puzzleSolved.value = p.puzzleSolved
    if (typeof p.ending30SeenIntro === 'boolean') ending30SeenIntro.value = p.ending30SeenIntro
    if (typeof p.forumHauntedAfter26 === 'boolean') forumHauntedAfter26.value = p.forumHauntedAfter26
    hydrated.value = true
    maybeUnlockEnding30()
  }

  watch(
    [
      unlockedNodeIds,
      chatBlockIds,
      forumLoggedIn,
      chatLoginUser,
      viewedSegments,
      puzzleSolved,
      ending30SeenIntro,
      forumHauntedAfter26,
    ],
    () => {
      if (!hydrated.value) return
      persist()
    },
    { deep: true },
  )

  function unlockNode(id: number) {
    if (!unlockedNodeIds.value.has(id)) {
      unlockedNodeIds.value = new Set(unlockedNodeIds.value).add(id)
    }
    if (id === 10) {
      if (!unlockedNodeIds.value.has(11)) {
        unlockedNodeIds.value = new Set(unlockedNodeIds.value).add(11)
      }
    }
    if (id === 17) {
      unlockedNodeIds.value = new Set(unlockedNodeIds.value).add(18)
    }
    if (id === 21) {
      unlockedNodeIds.value = new Set(unlockedNodeIds.value).add(22)
    }
    maybeUnlockEnding30()
  }

  function unlockChatBlock(blockId: number) {
    if (!CHAT_BLOCK_IDS.has(blockId) && blockId !== 1) return
    if (!chatBlockIds.value.has(blockId)) {
      chatBlockIds.value = new Set(chatBlockIds.value).add(blockId)
    }
    unlockNode(blockId)
    maybeUnlockEnding30()
  }

  function tryChatKeywordSearch(raw: string): boolean {
    const k = raw.trim()
    const id = CHAT_KEYWORD_TO_BLOCK_ID[k]
    if (!id) return false
    unlockChatBlock(id)
    return true
  }

  function tryForumKeywordSearch(raw: string): boolean {
    if (!forumLoggedIn.value) return false
    const k = raw.trim()
    const id = FORUM_KEYWORD_TO_NODE_ID[k]
    if (!id) return false
    unlockNode(id)
    return true
  }

  function openShareLink(linkId: number) {
    const nodeId = LINK_ID_TO_NODE_ID[linkId]
    if (nodeId == null) return
    unlockNode(nodeId)
  }

  function markSegment(segmentKey: string) {
    if (viewedSegments.value.has(segmentKey)) return
    viewedSegments.value = new Set(viewedSegments.value).add(segmentKey)
    maybeUnlockEnding30()
  }

  function loginForumDeposit(account: string, password: string): 'ok' | 'no_account' | 'bad_password' {
    const acc = account.trim().toLowerCase()
    if (acc !== 'deposit') return 'no_account'
    if (password !== 'Deposit') return 'bad_password'
    forumLoggedIn.value = true
    unlockNode(27)
    unlockNode(12)
    return 'ok'
  }

  /**
   * 聊天室登录：仅根据账号 + 密码校验（与当前从哪个登录页进入无关）。
   * 账号需完整匹配 april/bell/collide（deposit 仅可登录论坛）。
   */
  function loginChat(account: string, password: string): 'ok' | 'no_account' | 'bad_password' {
    const pwd = password.trim()
    const acc = account.trim().toLowerCase()
    // Deposit 只能登录论坛，不能登录聊天室
    if (acc === 'deposit') return 'no_account'
    // 检查是否是有效的账号（仅支持完整账号名）
    const isApril = acc === 'april'
    const isBell = acc === 'bell'
    const isCollide = acc === 'collide'
    if (!isApril && !isBell && !isCollide) return 'no_account'

    if (isApril) {
      if (pwd !== '66605088') return 'bad_password'
      chatLoginUser.value = 'april'
      unlockNode(8)
      return 'ok'
    }
    if (isCollide) {
      if (pwd !== '20100807') return 'bad_password'
      chatLoginUser.value = 'collide'
      unlockNode(19)
      return 'ok'
    }
    if (isBell) {
      if (pwd !== 'GUtoA7sX') return 'bad_password'
      chatLoginUser.value = 'bell'
      unlockNode(23)
      return 'ok'
    }
    return 'no_account'
  }

  function logoutChat() {
    chatLoginUser.value = 'none'
    if (hydrated.value) persist()
  }

  function submitPuzzle(input: Parameters<typeof isPuzzleStrictlyCorrect>[0]): boolean {
    const ok = isPuzzleStrictlyCorrect(input)
    if (ok) {
      puzzleSolved.value = true
      unlockNode(33)
    }
    return ok
  }

  function finishEnding30Messages() {
    ending30ReadyFor31.value = true
  }

  /** node 30 剧情后进入 node 31 叙事 */
  function unlockNarrative31() {
    unlockNode(31)
  }

  /** node 31 叙事进入 node 32 谜题 */
  function unlockPuzzle32() {
    unlockNode(32)
  }

  /** 假结局点击红色退出 → node 34 真结局 */
  function unlockTrueEnding34() {
    if (!puzzleSolved.value) return
    unlockNode(34)
  }

  const ending30Available = ref(false)

  function maybeUnlockEnding30() {
    const ok = viewedSegments.value.has(VIEWED_SEGMENT_ACADEMIC_PAPER_34)
    if (ok && !ending30Available.value) {
      ending30Available.value = true
      unlockNode(30)
    }
  }

  function resetProgress() {
    unlockedNodeIds.value = new Set([0, 1, 7])
    chatBlockIds.value = new Set([1])
    forumLoggedIn.value = false
    chatLoginUser.value = 'none'
    viewedSegments.value = new Set()
    puzzleSolved.value = false
    ending30ReadyFor31.value = false
    ending30SeenIntro.value = false
    ending30Available.value = false
    forumHauntedAfter26.value = false
    persist()
  }

  function markForumHauntedAfterNode26() {
    forumHauntedAfter26.value = true
  }

  const isUnlocked = (id: number) => unlockedNodeIds.value.has(id)

  hydrate()

  return {
    unlockedNodeIds: computed(() => unlockedNodeIds.value),
    chatBlockIds: computed(() => chatBlockIds.value),
    forumLoggedIn: computed(() => forumLoggedIn.value),
    chatLoginUser: computed(() => chatLoginUser.value),
    viewedSegments: computed(() => viewedSegments.value),
    puzzleSolved: computed(() => puzzleSolved.value),
    ending30Available: computed(() => ending30Available.value),
    ending30ReadyFor31: computed(() => ending30ReadyFor31.value),
    ending30SeenIntro: computed(() => ending30SeenIntro.value),
    forumHauntedAfter26: computed(() => forumHauntedAfter26.value),
    markForumHauntedAfterNode26,
    unlockNode,
    unlockChatBlock,
    tryChatKeywordSearch,
    tryForumKeywordSearch,
    openShareLink,
    markSegment,
    loginForumDeposit,
    loginChat,
    logoutChat,
    submitPuzzle,
    finishEnding30Messages,
    unlockNarrative31,
    unlockPuzzle32,
    unlockTrueEnding34,
    resetProgress,
    isUnlocked,
    maybeUnlockEnding30,
  }
})
