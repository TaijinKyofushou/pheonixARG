import { createRouter, createWebHistory } from 'vue-router'
import { CHAT_BLOCK_IDS } from '@/content/unlockRules'

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

/** 仅将「无独立页面」的聊天块 id 合并到初始聊天室，不做解锁校验 */
router.beforeEach((to, _from, next) => {
  if (to.name !== 'node') {
    next()
    return
  }
  const id = Number(to.params.id)
  if (Number.isNaN(id)) {
    next('/node/0')
    return
  }
  if (CHAT_BLOCK_IDS.has(id)) {
    next({ path: '/node/1', replace: true })
    return
  }
  next()
})

export { router }
