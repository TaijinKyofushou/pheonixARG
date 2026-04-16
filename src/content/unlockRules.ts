/** 初始聊天室关键词 -> 解锁的聊天块节点 id */
export const CHAT_KEYWORD_TO_BLOCK_ID: Record<string, number> = {
  黄文礼: 2,
  张杨: 3,
  美赛: 4,
  教三地下室: 5,
  凤凰还愿: 9,
  重明龛: 16,
  北医三院: 20,
  '破局之机，惟环外也': 25,
}

/** 论坛内搜索（登录 D 后）-> 解锁的神秘笔记 id */
export const FORUM_KEYWORD_TO_NODE_ID: Record<string, number> = {
  薪火焚身: 13,
  玄坛秘笺: 14,
  爝火赓炁: 15,
  重明龛: 26,
}

/** 消息中的分享链接 n -> 跳转的节点 id */
export const LINK_ID_TO_NODE_ID: Record<number, number> = {
  1: 6,
  2: 10,
  3: 17,
  4: 21,
  5: 24,
  6: 26,
  7: 33,
}

/** 仅聊天块 id，合并到 /node/1 展示 */
export const CHAT_BLOCK_IDS = new Set([2, 3, 4, 5, 9, 16, 20, 25])

/** 需要私聊面板已读才视为「页面27前」完成的节点 */
export const CHAT_ROOM_SEGMENT_KEYS: Record<number, string[]> = {
  8: ['8-ab', '8-ac'],
  19: ['19-cd', '19-ca'],
  23: ['23-ba', '23-bd'],
  27: ['fileTransfer'],
}

/** 结局27前必须完成的节点 id（0..26） */
export const REQUIRED_IDS_BEFORE_ENDING_27: number[] = Array.from(
  { length: 27 },
  (_, i) => i,
)
