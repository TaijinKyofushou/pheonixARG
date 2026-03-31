import { describe, expect, it } from 'vitest'
import { PUZZLE_BLANK_凡人, PUZZLE_ROWS, isPuzzleStrictlyCorrect } from '@/content/puzzleAnswers'

describe('puzzleAnswers', () => {
  it('matches canonical answer strictly', () => {
    expect(
      isPuzzleStrictlyCorrect({
        fanren: PUZZLE_BLANK_凡人,
        rows: PUZZLE_ROWS.map((r) => ({ ...r })),
      }),
    ).toBe(true)
  })

  it('rejects wrong blank', () => {
    expect(
      isPuzzleStrictlyCorrect({
        fanren: '之',
        rows: PUZZLE_ROWS.map((r) => ({ ...r })),
      }),
    ).toBe(false)
  })
})
