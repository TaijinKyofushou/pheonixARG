import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import {
  CHAT_BLOCK_IDS,
  CHAT_KEYWORD_TO_BLOCK_ID,
  CHAT_ROOM_SEGMENT_KEYS,
  FORUM_KEYWORD_TO_NODE_ID,
  LINK_ID_TO_NODE_ID,
  REQUIRED_IDS_BEFORE_ENDING_27,
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
  ending27SeenIntro: boolean
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
  /** 结局27：已与 A 对话完毕，可去地下室 */
  const ending27ReadyFor28 = ref(false)
  const ending27SeenIntro = ref(false)
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
      ending27SeenIntro: ending27SeenIntro.value,
      forumHauntedAfter26: forumHauntedAfter26.value,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
  }

  function hydrate() {
    const p = loadPersisted()
    if (!p) {
      hydrated.value = true
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
    if (typeof p.ending27SeenIntro === 'boolean') ending27SeenIntro.value = p.ending27SeenIntro
    if (typeof p.forumHauntedAfter26 === 'boolean') forumHauntedAfter26.value = p.forumHauntedAfter26
    hydrated.value = true
  }

  watch(
    [
      unlockedNodeIds,
      chatBlockIds,
      forumLoggedIn,
      chatLoginUser,
      viewedSegments,
      puzzleSolved,
      ending27SeenIntro,
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
    maybeUnlockEnding27()
  }

  function unlockChatBlock(blockId: number) {
    if (!CHAT_BLOCK_IDS.has(blockId) && blockId !== 1) return
    if (!chatBlockIds.value.has(blockId)) {
      chatBlockIds.value = new Set(chatBlockIds.value).add(blockId)
    }
    unlockNode(blockId)
    maybeUnlockEnding27()
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
    maybeUnlockEnding27()
  }

  function loginForumDeposit(account: string, password: string): 'ok' | 'no_account' | 'bad_password' {
    const acc = account.trim().toLowerCase()
    if (acc !== 'deposit') return 'no_account'
    if (password !== 'Deposit') return 'bad_password'
    forumLoggedIn.value = true
    unlockNode(32)
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
      unlockNode(30)
    }
    return ok
  }

  function finishEnding27Messages() {
    ending27ReadyFor28.value = true
  }

  /** 在结局27中选择「去教三地下室」 */
  function unlockNarrative28() {
    unlockNode(28)
  }

  /** 叙事页进入谜题 */
  function unlockPuzzle29() {
    unlockNode(29)
  }

  /** 假结局点击红色退出 → 真结局 */
  function unlockTrueEnding31() {
    if (!puzzleSolved.value) return
    unlockNode(31)
  }

  const ending27Available = ref(false)

  function maybeUnlockEnding27() {
    const ok =
      REQUIRED_IDS_BEFORE_ENDING_27.every((id) => unlockedNodeIds.value.has(id)) &&
      Object.entries(CHAT_ROOM_SEGMENT_KEYS).every(([nid, keys]) => {
        const n = Number(nid)
        if (!unlockedNodeIds.value.has(n)) return true
        return keys.every((k) => viewedSegments.value.has(k))
      })
    if (ok && !ending27Available.value) {
      ending27Available.value = true
      unlockNode(27)
    }
  }

  function resetProgress() {
    unlockedNodeIds.value = new Set([0, 1, 7])
    chatBlockIds.value = new Set([1])
    forumLoggedIn.value = false
    chatLoginUser.value = 'none'
    viewedSegments.value = new Set()
    puzzleSolved.value = false
    ending27ReadyFor28.value = false
    ending27SeenIntro.value = false
    ending27Available.value = false
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
    ending27Available: computed(() => ending27Available.value),
    ending27ReadyFor28: computed(() => ending27ReadyFor28.value),
    ending27SeenIntro: computed(() => ending27SeenIntro.value),
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
    finishEnding27Messages,
    unlockNarrative28,
    unlockPuzzle29,
    unlockTrueEnding31,
    resetProgress,
    isUnlocked,
    maybeUnlockEnding27,
  }
})
