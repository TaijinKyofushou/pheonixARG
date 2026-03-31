import type { ChatLoginUser } from '@/stores/game'

export interface ContactDef {
  id: string
  label: string
}

/** 初始聊天室（/node/1）在已登录时的左侧联系人 */
export function getInitialRoomContacts(user: ChatLoginUser): ContactDef[] {
  if (user === 'none') return []
  if (user === 'april') {
    return [
      { id: 'main', label: '主频道' },
      { id: '8-ab', label: 'Bell' },
      { id: '8-ac', label: 'Collide' },
    ]
  }
  if (user === 'collide') {
    return [
      { id: 'main', label: '主频道' },
      { id: '19-cd', label: 'Deposit' },
      { id: '19-ca', label: 'April' },
    ]
  }
  if (user === 'bell') {
    return [
      { id: 'main', label: '主频道' },
      { id: '23-ba', label: 'April' },
      { id: '23-bd', label: 'Deposit' },
    ]
  }
  return []
}
