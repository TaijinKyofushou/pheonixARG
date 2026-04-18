import { splitContentWithLinks, type StoryContentPart } from '@/content/storyNodes'
import type { ChatLoginUser } from '@/stores/game'

export type BubblePart = StoryContentPart

/** 气泡配色 */
export type SpeakerRoleKey = 'april' | 'bell' | 'collide' | 'deposit' | 'fileTransfer' | 'other'

export interface BubbleRow {
  /** 默认气泡；`system` 为居中灰色系统提示（源码行以 ———— 开头；展示保留整行含首尾 ————） */
  kind?: 'bubble' | 'system'
  speaker: string
  parts: BubblePart[]
  side: 'left' | 'right'
  roleKey: SpeakerRoleKey
}

/** 剧情里标记系统/撤回提示：行首四个 U+2014 */
const SYSTEM_LINE_PREFIX = '————'

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

/** 剧情中故意展示的乱码身份：侧边栏用空白头像，不按 id 推断主题色。 */
export const SIDEBAR_BLANK_AVATAR_LABEL = '锘垮舰绁炰勘鐏紝涓栦笉瀛樼剦锛'

export function isSidebarBlankAvatarLabel(label: string): boolean {
  return label === SIDEBAR_BLANK_AVATAR_LABEL
}

/**
 * 侧边栏私聊头像主题：优先按联系人名称识别；名称异常时用语义 id 尾缀 -a/-b/-c/-d（April/Bell/Collide/Deposit）。
 */
export function sidebarContactThemeRole(id: string, label: string): SpeakerRoleKey | 'main' | null {
  if (id === 'main') return 'main'
  if (isSidebarBlankAvatarLabel(label)) return null
  if (id === 'fileTransfer' || label === '文件传输助手') return 'fileTransfer'
  const fromLabel = normalizeSpeakerRole(label)
  if (fromLabel !== 'other') return fromLabel
  const m = id.match(/-([abcd])$/i)
  if (!m) return null
  const map = { a: 'april', b: 'bell', c: 'collide', d: 'deposit' } as const
  return map[m[1].toLowerCase() as keyof typeof map]
}

/** 用于 contact-av 的修饰 class；主频道无主题色。 */
export function sidebarContactAvatarClass(id: string, label: string): string | null {
  if (isSidebarBlankAvatarLabel(label)) return 'contact-av--blank'
  const role = sidebarContactThemeRole(id, label)
  if (!role || role === 'main') return null
  if (role === 'fileTransfer') return 'contact-av--file-transfer'
  return `contact-av--${role}`
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
    if (line.startsWith(SYSTEM_LINE_PREFIX)) {
      rows.push({
        kind: 'system',
        speaker: '',
        parts: splitContentWithLinks(line),
        side: 'left',
        roleKey: 'other',
      })
      continue
    }
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
