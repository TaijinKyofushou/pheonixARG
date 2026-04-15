import { splitContentWithLinks, type StoryContentPart } from '@/content/storyNodes'
import type { ChatLoginUser } from '@/stores/game'

export type BubblePart = StoryContentPart

/** 气泡配色 */
export type SpeakerRoleKey = 'april' | 'bell' | 'collide' | 'deposit' | 'fileTransfer' | 'other'

export interface BubbleRow {
  speaker: string
  parts: BubblePart[]
  side: 'left' | 'right'
  roleKey: SpeakerRoleKey
}

/**
 * 将发言者归一为 april/bell/collide/deposit/other。
 * 仅支持完整名称匹配，不兼容单字母别名。
 */
export function normalizeSpeakerRole(speaker: string): SpeakerRoleKey {
  const t = speaker.trim()
  if (!t) return 'other'
  if (t === '文件传输助手') return 'fileTransfer'
  // 移除问号后做完整匹配
  const s = t.replace(/？/g, '').toLowerCase()
  if (s === 'april') return 'april'
  if (s === 'bell') return 'bell'
  if (s === 'collide') return 'collide'
  if (s === 'deposit') return 'deposit'
  return 'other'
}

/**
 * 未登录：全部左侧。
 * 已登录：当前账号发言在右侧，其余左侧。
 */
export function bubbleSideForSpeaker(speaker: string, loginUser: ChatLoginUser): 'left' | 'right' {
  if (loginUser === 'none') return 'left'
  const role = normalizeSpeakerRole(speaker)
  if (role === 'other') return 'left'
  // 将 loginUser 转为小写后比较（ChatLoginUser 是大写，SpeakerRoleKey 是小写）
  if (role === loginUser.toLowerCase()) return 'right'
  return 'left'
}

export function parseContentToBubbleRows(raw: string, loginUser: ChatLoginUser): BubbleRow[] {
  const lines = raw.trim().split('\n').filter(Boolean)
  const rows: BubbleRow[] = []
  for (const line of lines) {
    const sepCn = line.indexOf('：')
    const sepEn = line.indexOf(':')
    let sep = -1
    if (sepCn >= 0 && sepEn >= 0) sep = Math.min(sepCn, sepEn)
    else sep = Math.max(sepCn, sepEn)

    let speaker = '…'
    let rest = line
    if (sep >= 0) {
      speaker = line.slice(0, sep).trim()
      rest = line.slice(sep + 1)
    }
    const roleKey = normalizeSpeakerRole(speaker)
    rows.push({
      speaker,
      parts: splitContentWithLinks(rest),
      side: bubbleSideForSpeaker(speaker, loginUser),
      roleKey,
    })
  }
  return rows
}
