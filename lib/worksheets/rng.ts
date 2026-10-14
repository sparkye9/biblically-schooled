/** Deterministic randomness: the same worksheet id always produces the same page. */

export function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export interface Rng {
  next(): number
  int(min: number, max: number): number
  pick<T>(arr: readonly T[]): T
  shuffle<T>(arr: readonly T[]): T[]
  sample<T>(arr: readonly T[], n: number): T[]
}

export function rng(seed: string | number): Rng {
  let a = typeof seed === 'number' ? seed >>> 0 : hashString(seed)
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const int = (min: number, max: number) => Math.floor(next() * (max - min + 1)) + min
  const shuffle = <T,>(arr: readonly T[]) => {
    const out = [...arr]
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1))
      ;[out[i], out[j]] = [out[j], out[i]]
    }
    return out
  }
  return {
    next,
    int,
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    shuffle,
    sample: (arr, n) => shuffle(arr).slice(0, Math.min(n, arr.length)),
  }
}

/** Pick `n` distinct integers from [min, max] (fewer if the range is smaller). */
export function distinctInts(r: Rng, min: number, max: number, n: number): number[] {
  const all: number[] = []
  for (let i = min; i <= max; i++) all.push(i)
  return r.sample(all, n)
}
