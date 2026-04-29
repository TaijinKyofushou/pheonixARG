/**
 * 第29页结局谜题
 * 模板：爝者_，_年_月_日许愿 … 薪主_。
 * 例外：日期字段按数值比较，允许前导 0（如 2 与 02 视为相同）。
 */

export const PUZZLE_ROWS = [
  {
    wisher: '张一然',
    year: '2010',
    month: '8',
    day: '7',
    wishReceiver: '王博傲',
  },
  {
    wisher: '王博傲',
    year: '2025',
    month: '12',
    day: '31',
    wishReceiver: '陈思哲',
  },
  {
    wisher: '陈思哲',
    year: '2026',
    month: '2',
    day: '8',
    wishReceiver: '梁宇',
  },
  {
    wisher: '梁宇',
    year: '2026',
    month: '4',
    day: '5',
    wishReceiver: '张一然',
  },
] as const

export type PuzzleRow = {
  wisher: string
  year: string
  month: string
  day: string
  wishReceiver: string
}

/** 拼接后与完整句子比对（严格） */
export function buildFullPuzzleText(p: { rows: readonly PuzzleRow[] }): string {
  const L = (s: string) => s.trim()
  const D = (s: string) => {
    const t = s.trim()
    if (!/^\d+$/.test(t)) return t
    return String(Number(t))
  }
  const r = p.rows
  return [
    `爝者${L(r[0].wisher)}，${D(r[0].year)}年${D(r[0].month)}月${D(r[0].day)}日许愿，其愿为死而复生，薪主${L(r[0].wishReceiver)}。`,
    `爝者${L(r[1].wisher)}，${D(r[1].year)}年${D(r[1].month)}月${D(r[1].day)}日许愿，其愿为平安喜乐，薪主${L(r[1].wishReceiver)}。`,
    `爝者${L(r[2].wisher)}，${D(r[2].year)}年${D(r[2].month)}月${D(r[2].day)}日许愿，其愿为学业有成，薪主${L(r[2].wishReceiver)}。`,
    `爝者${L(r[3].wisher)}，${D(r[3].year)}年${D(r[3].month)}月${D(r[3].day)}日许愿，其愿为因果抹除，薪主${L(r[3].wishReceiver)}。`,
    `今尘埃已定，业果已成，敕令薪火归垣，涅槃重生。`,
  ].join('\n')
}

export function isPuzzleStrictlyCorrect(input: { rows: PuzzleRow[] }): boolean {
  const expected = buildFullPuzzleText({
    rows: PUZZLE_ROWS as readonly PuzzleRow[],
  })
  const got = buildFullPuzzleText({
    rows: input.rows,
  })
  return got === expected
}
