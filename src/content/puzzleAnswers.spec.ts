import { describe, expect, it } from 'vitest'
import {
  PUZZLE_ROWS,
  type PuzzleRow,
  isPuzzleStrictlyCorrect,
} from '@/content/puzzleAnswers'

describe('puzzleAnswers', () => {
  it('matches canonical answer strictly', () => {
    expect(
      isPuzzleStrictlyCorrect({
        rows: PUZZLE_ROWS.map((r) => ({ ...r })),
      }),
    ).toBe(true)
  })

  it('rejects wrong wisher on first row', () => {
    const rows: PuzzleRow[] = PUZZLE_ROWS.map((r) => ({ ...r }))
    rows[0] = { ...rows[0], wisher: '错名' }
    expect(isPuzzleStrictlyCorrect({ rows })).toBe(false)
  })
})
