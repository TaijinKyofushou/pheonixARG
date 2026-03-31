import { useGameStore } from '@/stores/game'

/** 统一封装解锁入口，供组件调用 */
export function useUnlockEngine() {
  const game = useGameStore()

  return {
    game,
    tryChatKeyword: (kw: string) => game.tryChatKeywordSearch(kw),
    tryForumKeyword: (kw: string) => game.tryForumKeywordSearch(kw),
    openLink: (linkId: number) => game.openShareLink(linkId),
    unlock: (nodeId: number) => game.unlockNode(nodeId),
    markSegment: (key: string) => game.markSegment(key),
  }
}
