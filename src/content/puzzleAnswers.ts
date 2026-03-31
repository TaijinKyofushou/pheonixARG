/**
 * 第29页结局谜题——严格逐字匹配（与 CSV 剧情一致）
 * 模板：凡人_人 … 爝者_，_年_月_日许愿 … 薪主_。
 */
export const PUZZLE_BLANK_凡人 = '非'

export const PUZZLE_ROWS = [
  {
    爝者: 'Collide',
    year: '2010',
    month: '8',
    day: '7',
    薪主: 'Deposit',
  },
  {
    爝者: 'Deposit',
    year: '2025',
    month: '12',
    day: '31',
    薪主: 'April',
  },
  {
    爝者: 'April',
    year: '2026',
    month: '2',
    day: '10',
    薪主: 'Bell',
  },
  {
    爝者: 'April',
    year: '2026',
    month: '4',
    day: '6',
    薪主: 'Deposit',
  },
] as const

type PuzzleRow = {
  爝者: string
  year: string
  month: string
  day: string
  薪主: string
}

/** 拼接后与完整句子比对（严格） */
export function buildFullPuzzleText(p: { fanren: string; rows: readonly PuzzleRow[] }): string {
  const L = (s: string) => s.trim()
  const r = p.rows
  return [
    `凡人${L(p.fanren)}人，干涉因果，禁锢业环。`,
    `爝者${L(r[0].爝者)}，${L(r[0].year)}年${L(r[0].month)}月${L(r[0].day)}日许愿，其愿为死而复生，薪主${L(r[0].薪主)}。`,
    `爝者${L(r[1].爝者)}，${L(r[1].year)}年${L(r[1].month)}月${L(r[1].day)}日许愿，其愿为知足常乐，薪主${L(r[1].薪主)}。`,
    `爝者${L(r[2].爝者)}，${L(r[2].year)}年${L(r[2].month)}月${L(r[2].day)}日许愿，其愿为金榜题名，薪主${L(r[2].薪主)}。`,
    `爝者${L(r[3].爝者)}，${L(r[3].year)}年${L(r[3].month)}月${L(r[3].day)}日许愿，其愿为存在抹除，薪主${L(r[3].薪主)}。`,
    `今尘埃已定，业果已成，敕令薪火归垣，涅槃重生。`,
  ].join('\n')
}

export function isPuzzleStrictlyCorrect(input: { fanren: string; rows: PuzzleRow[] }): boolean {
  const expected = buildFullPuzzleText({
    fanren: PUZZLE_BLANK_凡人,
    rows: PUZZLE_ROWS as readonly PuzzleRow[],
  })
  const got = buildFullPuzzleText({
    fanren: input.fanren,
    rows: input.rows,
  })
  return got === expected
}
