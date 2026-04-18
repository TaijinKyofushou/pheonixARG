/** 路由级页面类型 */
export type PageKind =
  | 'home'
  | 'initialChat'
  | 'schoolNotice'
  | 'loginModal'
  | 'forum'
  | 'forumProfile'
  | 'forumLogin'
  | 'mysteryNote'
  | 'chatRoom'
  | 'medicalRecord'
  | 'voiceTranscript'
  | 'narrative'
  | 'endingPuzzle'
  | 'endingFake'
  | 'endingTrue'
  | 'ending30'
  | 'gazetteer'
  | 'academicPdf'

export interface StoryNodeBase {
  id: number
  role: 'fullPage' | 'chatBlock'
  /** 时间线展示 */
  timeline?: string
}

/** 仅作为初始聊天室中的消息块，不单独占路由 */
export interface ChatBlockNode extends StoryNodeBase {
  role: 'chatBlock'
  keyword?: string
  /** 页面正文（多行） */
  content: string
}

/** 论坛楼层回复（节点 10 等结构化怪谈帖） */
export interface ForumReplyDef {
  floor: number
  author: string
  lines: string[]
  /** 楼中楼回复文案 */
  subReply?: string
}

/** 论坛主帖结构化数据 */
export interface ForumThreadDef {
  /** 顶栏小标题，如「怪谈内容 1」 */
  threadKicker?: string
  board: string
  title: string
  author: string
  publishedAt: string
  /** 正文首段（引用区） */
  leadParagraphs: string[]
  /** 置顶热门回复（可空） */
  pinnedReplies?: ForumReplyDef[]
  /** 普通楼层 */
  replies: ForumReplyDef[]
  /** 无置顶时显示在回复区上方的标题，如「热门回复」 */
  repliesSectionTitle?: string
  /** 楼主最后回复 */
  opLastReply?: { paragraphs: string[] }
  /** 页底统计行 */
  footerStats: string
}

export interface FullPageNode extends StoryNodeBase {
  role: 'fullPage'
  kind: PageKind
  /** 登录弹窗等子类型 */
  loginVariant?: 'chatApril' | 'chatCollide' | 'chatBell' | 'forumDeposit'
  /** 论坛：是否需登录才能搜索 */
  forumRequiresLogin?: boolean
  /** 论坛：结构化主帖（与 content 并存时优先渲染） */
  forumThread?: ForumThreadDef
  /** 学校通告等：标题摘要 / 页面子类型文案 */
  gist?: string
  pageType?: string
  /** 页面正文（多行） */
  content?: string
}

export type StoryNode = ChatBlockNode | FullPageNode

/** 聊天室内一段独立时间轴与正文（可多段并存） */
export interface ChatTimelineSegment {
  timeline: string
  content: string
}

/** 聊天室会话面板（私聊） */
export interface ChatPanelDef {
  id: string
  label: string
  /** 单段对话；与 segments 二选一，优先 segments */
  content?: string
  timeline?: string
  /** 多时间轴分段，每段单独展示时间轴与下属对话 */
  segments?: ChatTimelineSegment[]
}

export interface ChatRoomLayoutDef {
  /** 兼容旧数据：未使用 mainSegments 时的单段文案 */
  mainContent?: string
  mainTimeline?: string
  /** 主频道中本房间叙事分段（如节点 23）；与公共解锁段拼接，优先于仅用 mainContent */
  mainSegments?: ChatTimelineSegment[]
  panels: ChatPanelDef[]
}
