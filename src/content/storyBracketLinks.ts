/**
 * 仅解析 `[[键]]` / `[[键|显示文案]]`：`键` 必须在表中，对应站内分享或外链。
 */
export type StoryBracketLinkTarget =
  | { kind: 'share'; linkId: number; defaultLabel?: string }
  | { kind: 'external'; href: string; defaultLabel?: string }

export type ResolvedBracketLink =
  | { kind: 'share'; linkId: number; label: string }
  | { kind: 'external'; href: string; label: string }

/** 键与剧情里 `[[键]]` 完全一致（trim 后） */
export const STORY_BRACKET_LINK_MAP: Record<string, StoryBracketLinkTarget> = {
  '学校通告': { kind: 'share', linkId: 1 },
  '四零四聊斋-今日热帖': { kind: 'share', linkId: 2 },
  '公告': { kind: 'share', linkId: 3 },
  '电子病历.pdf': { kind: 'share', linkId: 4 },
  '2026年3月27日下午4点31分.wav': { kind: 'share', linkId: 5 },
  '爝火赓炁仪式考(节选).pdf': { kind: 'share', linkId: 6 },
  '宛平地方志·卷七十四': { kind: 'share', linkId: 7 },
  '北京市海淀区北三环中路海淀文教园C座209': {
    kind: 'external',
    href: 'https://ditu.amap.com/place/B0L2TM33XS',
  },
  '才二十出头，就感觉自己很健忘怎么办？': {
    kind: 'external',
    href: 'https://www.zhihu.com/question/323828328',
  },
  '记忆力减退是什么原因造成的？如何补救呢？找到原因+科学补救，帮你找回清晰大脑': {
    kind: 'external',
    href: 'https://www.sohu.com/a/942524078_121358815',
  },
  '为什么记忆力会衰退？ 可能与这6个因素有关！': {
    kind: 'external',
    href: 'https://www.familydoctor.com.cn/encyclopedia/a/201810/2513215.html',
  },
  '幻觉的症状学特征、精神病理学分类、发生机制及临床意义': {
    kind: 'external',
    href: 'https://www.thepaper.cn/newsDetail_forward_30491209',
  },
  '全身突然起烧灼感要警惕': {
    kind: 'external',
    href: 'https://health.baidu.com/m/detail/ar_6500055889179291954',
  },
  '感觉发烧但是体温正常浑身难受': {
    kind: 'external',
    href: 'https://www.youlai.cn/jingbian/article/C0BE1CmYAal.html',
  },
  '北京预约挂号统一平台官网入口': {
    kind: 'external',
    href: 'https://bj.bendibao.com/zffw/2019828/262707.shtm',
  },
}

export function resolveBracketLink(
  ref: string,
  explicitLabel?: string,
): ResolvedBracketLink | null {
  const key = ref.trim()
  const m = STORY_BRACKET_LINK_MAP[key]
  if (!m) {
    if (import.meta.env.DEV) {
      console.warn(`[storyBracketLinks] 未配置：[[${key}]]`)
    }
    return null
  }
  const label =
    explicitLabel?.trim() || m.defaultLabel?.trim() || key
  return m.kind === 'share'
    ? { kind: 'share', linkId: m.linkId, label }
    : { kind: 'external', href: m.href, label }
}

/** `ref` 或 `ref|显示文案`（只认第一个 `|`） */
export function parseBracketInner(inner: string): { ref: string; label?: string } {
  const i = inner.indexOf('|')
  if (i === -1) return { ref: inner.trim() }
  return {
    ref: inner.slice(0, i).trim(),
    label: inner.slice(i + 1).trim() || undefined,
  }
}
