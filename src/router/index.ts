import { createRouter, createWebHistory } from 'vue-router'
import { getFullPage } from '@/content/storyNodes'
import { useGameStore } from '@/stores/game'
import { CHAT_BLOCK_IDS } from '@/content/unlockRules'

/** 进入 node26 后，这些节点一律改道 node15（与 story 中论坛线对应） */
const FORUM_NODES_REDIRECT_TO_15_AFTER_26 = new Set([10, 11, 12, 13, 14, 27])

/** 地址栏硬闯：尚未解锁的章节（非假结局/真结局 33、34） */
const MSG_GUARD_LOCKED_CHAPTER = `我知道你很急，但是你先别急。

事情要一件一件来。你没弄清楚前面发生了什么，直接跳到这儿只会把自己绕进去。`

/** 地址栏硬闯：真结局 node 34 未解锁 */
const MSG_GUARD_TRUE_ENDING = `哇噻，这就想直接看结局了？

不是我不让你看，是方法不对。你得先把因果搞清楚——谁在什么时候许了什么愿，代价是什么，一环扣一环。

少一环，这结局你看了也白看。`

/** 地址栏硬闯：假结局 node 33 未解锁 */
const MSG_GUARD_FAKE_ENDING = `你就这么想走这条线？

那我告诉你，这条路通向的地方，没有人记得任何事。

包括你。

想清楚了再决定。`

/** 路由 id 在剧情数据中不存在（或非法数字） */
const MSG_GUARD_NO_SUCH_NODE = `你在找什么？

有些东西不是藏得深，是真的不存在。

别白费力气了，回到你能看到的地方去。`

function rejectToNode1(message: string, next: (raw?: unknown) => void) {
  alert(message)
  next({ path: '/node/1', replace: true })
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/node/0' },
    {
      path: '/node/:id',
      name: 'node',
      component: () => import('@/views/NodeShell.vue'),
      props: true,
    },
  ],
})

/** Ending30 离开守卫：播放留言时离开需确认 */
const MSG_GUARD_ENDING30_LEAVE = '我还没说完……你真的要走吗？'

/** 聊天块无独立路由：地址栏硬闯同章节未解锁提示，并合并回初始聊天室 */
router.beforeEach((to, from, next) => {
  if (to.name !== 'node') {
    next()
    return
  }
  const id = Number(to.params.id)
  if (Number.isNaN(id)) {
    rejectToNode1(MSG_GUARD_NO_SUCH_NODE, next)
    return
  }
  if (CHAT_BLOCK_IDS.has(id)) {
    rejectToNode1(MSG_GUARD_LOCKED_CHAPTER, next)
    return
  }
  if (!Number.isInteger(id) || getFullPage(id) == null) {
    rejectToNode1(MSG_GUARD_NO_SUCH_NODE, next)
    return
  }
  const game = useGameStore()
  
  // 获取 computed 的实际值
  const isPlaying = (game.ending30Playing as any).value ?? game.ending30Playing
  const isReady = (game.ending30ReadyFor31 as any).value ?? game.ending30ReadyFor31
  
  // Ending30 离开守卫：如果从 node/30 离开且正在播放留言
  if (from.path === '/node/30' && isPlaying && !isReady) {
    const confirmed = confirm(MSG_GUARD_ENDING30_LEAVE)
    if (confirmed) {
      game.setEnding30Playing(false)
      next()
    } else {
      next(false)
    }
    return
  }
  
  if (!game.isUnlocked(id)) {
    if (id === 34) {
      rejectToNode1(MSG_GUARD_TRUE_ENDING, next)
      return
    }
    if (id === 33) {
      rejectToNode1(MSG_GUARD_FAKE_ENDING, next)
      return
    }
    rejectToNode1(MSG_GUARD_LOCKED_CHAPTER, next)
    return
  }
  if (game.forumHauntedAfter26 && FORUM_NODES_REDIRECT_TO_15_AFTER_26.has(id)) {
    // 仅解锁 26、未搜「爝火赓炁」时 15 可能未进 unlocked；改道 403 页必须可进入
    game.unlockNode(15)
    next({ path: '/node/15', replace: true })
    return
  }
  next()
})

export { router }
