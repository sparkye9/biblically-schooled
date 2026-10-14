import type { ShapeName } from '../curriculum/math'
import type { Grade } from '../curriculum/types'

export type Coin = 'penny' | 'nickel' | 'dime' | 'quarter'
export const COIN_VALUE: Record<Coin, number> = { penny: 1, nickel: 5, dime: 10, quarter: 25 }

export type Block =
  | { type: 'trace'; rows: string[]; size: 'xl' | 'lg' | 'md'; label?: string }
  | { type: 'lines'; count: number; label?: string }
  | { type: 'draw'; label: string; height: 'sm' | 'md' | 'lg' }
  | { type: 'letter-grid'; target: string; letters: string[] }
  | { type: 'match'; left: Cell[]; right: Cell[]; pairs: [number, number][] }
  | { type: 'picture-choice'; prompt: string; items: { picture: string; choices: string[]; answer: string }[] }
  | { type: 'picture-write'; prompt: string; items: { picture: string; answer: string; boxes?: number }[] }
  | { type: 'count'; write: boolean; items: { icon: string; count: number; choices?: number[] }[] }
  | { type: 'shape-find'; target: ShapeName; shapes: { shape: ShapeName; scale: number; rotate: number }[] }
  | { type: 'shape-table'; rows: { shape: ShapeName; sides: number; corners: number }[] }
  | { type: 'pattern'; rows: { seq: string[]; answer: string; choices: string[] }[] }
  | { type: 'compare-groups'; ask: 'more' | 'fewer'; items: { icon: string; left: number; right: number }[] }
  | { type: 'compare-numbers'; symbols: boolean; items: { left: number; right: number }[] }
  | { type: 'size-compare'; ask: string; items: { a: SizeThing; b: SizeThing; answer: 'a' | 'b' }[] }
  | { type: 'ten-frame'; ask: 'how-many' | 'to-ten'; items: { filled: number }[] }
  | { type: 'number-bond'; items: { whole: number; a: number; b: number; hide: 'whole' | 'a' | 'b' }[] }
  | { type: 'picture-equation'; items: { icon: string; a: number; b: number; op: '+' | '-' }[] }
  | { type: 'equations'; columns: 2 | 3; items: { terms: (number | null)[]; ops: ('+' | '-' | '=')[]; answer: number }[] }
  | { type: 'true-false'; items: { left: Expr; right: Expr }[] }
  | { type: 'fact-family'; items: { a: number; b: number; whole: number }[] }
  | { type: 'word-problems'; showPictures: boolean; items: { text: string; icon: string; answer: number; a: number; b: number; op: '+' | '-' | 'compare' }[] }
  | { type: 'number-line'; max: number; items: { start: number; jump: number; op: '+' | '-' }[] }
  | { type: 'base-ten'; items: { tens: number; ones: number }[] }
  | { type: 'ten-more-less'; items: number[] }
  | { type: 'hundred-chart'; start: number; count: number; blanks: number[] }
  | { type: 'skip-count'; by: number; rows: { values: number[]; blanks: number[] }[] }
  | { type: 'clocks'; items: { h: number; m: 0 | 30 }[] }
  | { type: 'coins'; items: { coins: Coin[] }[] }
  | { type: 'measure'; items: { icon: string; units: number }[] }
  | { type: 'graph'; categories: { icon: string; label: string; count: number }[]; questions: { q: string; a: string }[] }
  | { type: 'fractions'; items: { shape: 'circle' | 'rect'; parts: 2 | 4; equal: boolean }[] }
  | { type: 'sort'; cut: boolean; columns: string[]; items: { picture: string; column: number }[] }
  | { type: 'ordinal'; icons: string[]; prompts: { text: string; answer: number }[] }
  | { type: 'one-more'; less: boolean; items: { icon: string; n: number }[] }
  | { type: 'word-list'; words: string[] }
  | { type: 'word-sort'; columns: [string, string]; words: { word: string; column: 0 | 1 }[] }
  | { type: 'sentences'; prompt: string; items: { text: string; answer?: string; choices?: string[] }[] }
  | { type: 'passage'; title: string; text: string; questions: { q: string; a: string }[] }
  | { type: 'verse'; ref: string; text: string; mode: 'trace' | 'copy' }
  | { type: 'talk'; questions: string[] }
  | { type: 'feelings'; prompts: string[] }
  | { type: 'syllables'; items: { picture: string; syllables: number }[] }

export type Cell = { text?: string; picture?: string }
export type Expr = { a: number; op?: '+' | '-'; b?: number }
export type SizeThing = { icon: string; scale: number; bar?: 'tall' | 'long'; units?: number }

export interface WorksheetSpec {
  id: string
  week: number
  day: number
  grade: Grade
  subject: 'bible' | 'literacy' | 'math' | 'family'
  title: string
  skill: string
  objective: string
  instructions: string
  blocks: Block[]
  answerKey: string[]
  /** Activity type label used to show variety (Tracing, Matching, Cut & paste…). */
  activity: string
  /** Needs scissors/glue. */
  cutAndPaste?: boolean
  /** Placeholder replaced with the student's name at print time. */
  personalized?: boolean
}

export const NAME_PLACEHOLDER = '{{NAME}}'
