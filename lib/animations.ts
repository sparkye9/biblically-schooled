/** Animation and transition utilities for UI polish */

export const transitions = {
  fast: 'transition-all duration-200',
  normal: 'transition-all duration-300',
  slow: 'transition-all duration-500',
  instant: 'transition-none',
}

export const animations = {
  fadeIn: 'animate-in fade-in duration-300',
  fadeOut: 'animate-out fade-out duration-300',
  slideIn: 'animate-in slide-in-from-bottom-2 duration-300',
  slideOut: 'animate-out slide-out-to-bottom-2 duration-300',
  scaleIn: 'animate-in zoom-in-95 duration-300',
  spin: 'animate-spin',
  pulse: 'animate-pulse',
}

export const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary'

export function createTransitionClass(property: 'all' | 'colors' | 'opacity' | 'transform' = 'all', duration: 'fast' | 'normal' | 'slow' = 'normal') {
  const durationMap = {
    fast: 'duration-200',
    normal: 'duration-300',
    slow: 'duration-500',
  }
  return `transition-${property} ${durationMap[duration]}`
}
