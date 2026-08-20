import type { Assignment, Child, Lesson } from './types'

export interface AssignedLesson {
  assignment: Assignment
  lesson: Lesson
}

export function assignedLessonsFor(
  childId: string,
  assignments: Assignment[],
  lessons: Lesson[],
  filter?: { week?: number; day?: string },
): AssignedLesson[] {
  return assignments
    .filter((a) => a.childId === childId)
    .map((a) => ({ assignment: a, lesson: lessons.find((l) => l.id === a.lessonId)! }))
    .filter((x) => x.lesson)
    .filter((x) =>
      filter?.week != null ? x.lesson.weekNumber === filter.week : true,
    )
    .filter((x) => (filter?.day ? x.lesson.day === filter.day : true))
}

export function coreComplete(items: AssignedLesson[]): boolean {
  const core = items.filter((i) =>
    ['math', 'literacy', 'bible'].includes(i.lesson.subject),
  )
  return core.length > 0 && core.every((i) => i.assignment.status === 'done')
}

export function countDone(items: AssignedLesson[]) {
  return {
    done: items.filter((i) => i.assignment.status === 'done').length,
    total: items.length,
  }
}

export function sortByActivity(items: AssignedLesson[]): AssignedLesson[] {
  const order = { 'mom-time': 0, independent: 1, 'hands-on': 2, optional: 3 }
  return [...items].sort((a, b) => {
    // Bible/devotion time always opens the day; everything else can move around.
    const aBible = a.lesson.subject === 'bible' ? 0 : 1
    const bBible = b.lesson.subject === 'bible' ? 0 : 1
    if (aBible !== bBible) return aBible - bBible
    return order[a.lesson.activityType] - order[b.lesson.activityType]
  })
}

/** Day-length filter: which lessons to keep */
export function filterByDayLength(
  items: AssignedLesson[],
  mode: 'essential' | '30' | '60' | 'full',
): { keep: AssignedLesson[]; laterOn: AssignedLesson[] } {
  if (mode === 'full') return { keep: items, laterOn: [] }
  const priority = (s: string) =>
    s === 'math' ? 0 : s === 'literacy' ? 1 : s === 'bible' ? 2 : 3
  const sorted = [...items].sort(
    (a, b) => priority(a.lesson.subject) - priority(b.lesson.subject),
  )
  if (mode === 'essential') {
    return {
      keep: sorted.filter((i) => i.lesson.essential),
      laterOn: sorted.filter((i) => !i.lesson.essential),
    }
  }
  const limit = mode === '30' ? 3 : 5
  const core = sorted.filter((i) =>
    ['math', 'literacy', 'bible'].includes(i.lesson.subject),
  )
  const keep = sorted.slice(0, Math.max(limit, core.length))
  const keepIds = new Set(keep.map((k) => k.assignment.id))
  return { keep, laterOn: sorted.filter((i) => !keepIds.has(i.assignment.id)) }
}

export function childrenInView(children: Child[], view: string) {
  return view === 'shared' ? children : children.filter((c) => c.householdId === view)
}
