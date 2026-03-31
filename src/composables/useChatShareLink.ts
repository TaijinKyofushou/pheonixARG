import { useRouter } from 'vue-router'
import { LINK_ID_TO_NODE_ID } from '@/content/unlockRules'
import { useGameStore } from '@/stores/game'

/** 点击消息中的「分享链接 n」：解锁对应节点并跳转路由 */
export function useChatShareLink() {
  const router = useRouter()
  const game = useGameStore()

  function followShareLink(linkId: number) {
    game.openShareLink(linkId)
    const nodeId = LINK_ID_TO_NODE_ID[linkId]
    if (nodeId != null) {
      router.push(`/node/${nodeId}`)
    }
  }

  return { followShareLink }
}
