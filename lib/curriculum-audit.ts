import type { Lesson, Assignment, Child } from './types'

export interface AuditFinding {
  severity: 'critical' | 'warning' | 'info'
  category: string
  message: string
  details?: string
  affectedItems?: {
    lessonIds?: string[]
    weeks?: number[]
    children?: string[]
    days?: string[]
  }
}

export interface CurriculumAuditResult {
  timestamp: string
  totalLessons: number
  totalAssignments: number
  findings: AuditFinding[]
  summary: {
    critical: number
    warnings: number
    info: number
  }
}

/**
 * Normalize lesson content for duplicate detection.
 * This creates a fingerprint of the actual lesson content (not IDs).
 */
function normalizeLessonContent(lesson: Lesson): string {
  const parts = [
    lesson.title.toLowerCase().trim(),
    lesson.subject,
    lesson.gradeBand,
    lesson.weekNumber,
    lesson.day,
    (lesson.teach || []).join('|').toLowerCase(),
    (lesson.youNeed || []).join('|').toLowerCase(),
    (lesson.ask || []).join('|').toLowerCase(),
    (lesson.watchFor || '').toLowerCase(),
  ]
  return parts.filter(Boolean).join('::')
}

/**
 * Audit the entire curriculum for integrity issues.
 */
export function auditCurriculum(lessons: Lesson[], assignments: Assignment[], children: Child[]): CurriculumAuditResult {
  const findings: AuditFinding[] = []
  const childMap = new Map(children.map((c) => [c.id, c]))

  // Build maps for efficient lookup
  const lessonsByChildWeekSubject = new Map<string, Lesson[]>()
  const contentFingerprints = new Map<string, Lesson[]>()
  const lessonMap = new Map(lessons.map((l) => [l.id, l]))

  // Index lessons for analysis
  for (const lesson of lessons) {
    // Skip shared lessons (Bible, Art) for most checks
    if (lesson.subject === 'bible' || lesson.subject === 'art') continue

    const key = `${lesson.gradeBand}-${lesson.weekNumber}-${lesson.subject}`
    if (!lessonsByChildWeekSubject.has(key)) {
      lessonsByChildWeekSubject.set(key, [])
    }
    lessonsByChildWeekSubject.get(key)!.push(lesson)

    // Track content fingerprints for duplicate detection
    const fingerprint = normalizeLessonContent(lesson)
    if (!contentFingerprints.has(fingerprint)) {
      contentFingerprints.set(fingerprint, [])
    }
    contentFingerprints.get(fingerprint)!.push(lesson)
  }

  // 1. DETECT DUPLICATE CONTENT
  for (const [fingerprint, dupeGroup] of contentFingerprints) {
    if (dupeGroup.length > 1) {
      // Check if these are intentional (review, practice lessons)
      const isIntentionalDuplicate = dupeGroup.some(
        (l) =>
          l.title.toLowerCase().includes('review') ||
          l.title.toLowerCase().includes('practice') ||
          l.title.toLowerCase().includes('mastery'),
      )

      if (!isIntentionalDuplicate) {
        // Check if they're in the same week/subject/gradeBand
        const sameWeekSubject = dupeGroup.every((l) => dupeGroup[0].weekNumber === l.weekNumber && dupeGroup[0].subject === l.subject)

        if (sameWeekSubject) {
          findings.push({
            severity: 'critical',
            category: 'duplicate-content',
            message: `Duplicate lesson content found in Week ${dupeGroup[0].weekNumber} - ${dupeGroup[0].subject}`,
            details: `"${dupeGroup[0].title}" appears ${dupeGroup.length} times with identical content. Review if this is intentional.`,
            affectedItems: {
              lessonIds: dupeGroup.map((l) => l.id),
              weeks: [...new Set(dupeGroup.map((l) => l.weekNumber))],
            },
          })
        } else {
          findings.push({
            severity: 'warning',
            category: 'repeated-content-across-weeks',
            message: `Repeated lesson content across different weeks`,
            details: `"${dupeGroup[0].title}" appears in weeks: ${[...new Set(dupeGroup.map((l) => l.weekNumber))].join(', ')}`,
            affectedItems: {
              lessonIds: dupeGroup.map((l) => l.id),
              weeks: [...new Set(dupeGroup.map((l) => l.weekNumber))],
            },
          })
        }
      }
    }
  }

  // 2. DETECT MISSING ASSIGNMENTS
  const assignmentsByLessonId = new Map<string, Assignment[]>()
  for (const assignment of assignments) {
    if (!assignmentsByLessonId.has(assignment.lessonId)) {
      assignmentsByLessonId.set(assignment.lessonId, [])
    }
    assignmentsByLessonId.get(assignment.lessonId)!.push(assignment)
  }

  for (const lesson of lessons) {
    if (!assignmentsByLessonId.has(lesson.id)) {
      findings.push({
        severity: 'critical',
        category: 'orphaned-lesson',
        message: `Lesson has no assignments: "${lesson.title}"`,
        details: `Week ${lesson.weekNumber}, ${lesson.subject}, ${lesson.gradeBand}`,
        affectedItems: {
          lessonIds: [lesson.id],
          weeks: [lesson.weekNumber],
        },
      })
    }
  }

  // 3. DETECT INCORRECT GRADE BAND ASSIGNMENTS
  for (const lesson of lessons) {
    const assignedChildren = assignments
      .filter((a) => a.lessonId === lesson.id)
      .map((a) => childMap.get(a.childId))
      .filter((c) => c !== undefined) as Child[]

    for (const child of assignedChildren) {
      if (child.gradeBand !== lesson.gradeBand) {
        findings.push({
          severity: 'critical',
          category: 'grade-band-mismatch',
          message: `Lesson assigned to wrong grade band`,
          details: `"${lesson.title}" (${lesson.gradeBand}) assigned to ${child.name} (${child.gradeBand})`,
          affectedItems: {
            lessonIds: [lesson.id],
            children: [child.id],
          },
        })
      }
    }
  }

  // 4. DETECT MISSING WEDNESDAY LESSONS (should be co-op or none)
  const wednesdayLessons = lessons.filter((l) => l.day === 'wednesday' && l.subject !== 'bible' && l.subject !== 'art')
  if (wednesdayLessons.length > 0) {
    findings.push({
      severity: 'warning',
      category: 'wednesday-assignments',
      message: `Found ${wednesdayLessons.length} non-co-op lessons on Wednesday`,
      details: 'Wednesday should typically be co-op day with no regular academic lessons.',
      affectedItems: {
        lessonIds: wednesdayLessons.map((l) => l.id),
        weeks: [...new Set(wednesdayLessons.map((l) => l.weekNumber))],
      },
    })
  }

  // 5. DETECT CURRICULUM PROGRESSION ISSUES
  const weeksByGradeBandSubject = new Map<string, number[]>()
  for (const lesson of lessons) {
    if (lesson.subject === 'bible' || lesson.subject === 'art') continue
    const key = `${lesson.gradeBand}-${lesson.subject}`
    if (!weeksByGradeBandSubject.has(key)) {
      weeksByGradeBandSubject.set(key, [])
    }
    const weeks = weeksByGradeBandSubject.get(key)!
    if (!weeks.includes(lesson.weekNumber)) {
      weeks.push(lesson.weekNumber)
    }
  }

  for (const [key, weeks] of weeksByGradeBandSubject) {
    // Check each week has all required days (Mon, Tue, Thu, Fri for most subjects)
    const requiredDays = ['monday', 'tuesday', 'thursday', 'friday']
    const [gradeBand, subject] = key.split('-')

    for (const week of weeks) {
      for (const day of requiredDays) {
        const exists = lessons.some(
          (l) =>
            l.gradeBand === gradeBand &&
            l.subject === subject &&
            l.weekNumber === week &&
            l.day === day &&
            l.subject !== 'library',
        )
        if (!exists && subject !== 'library') {
          findings.push({
            severity: 'warning',
            category: 'missing-lesson',
            message: `Missing ${subject} lesson for ${gradeBand} - Week ${week} ${day}`,
            affectedItems: {
              weeks: [week],
              days: [day],
            },
          })
        }
      }
    }
  }

  // 6. DETECT EMPTY CORE COMPLETE BUG
  // (This is in selectors, but we can flag it here if we find related patterns)

  // 7. DETECT WORKSHEETS/PRINTABLES
  const printableLessons = lessons.filter((l) => l.printable === true)
  if (printableLessons.length === 0) {
    findings.push({
      severity: 'warning',
      category: 'no-printables',
      message: 'No lessons marked as printable',
      details: 'Verify if worksheets are properly configured.',
    })
  }

  // 8. DETECT INTERACTIVE MISMATCHES
  for (const lesson of lessons) {
    if (lesson.interactive === 'math-manipulatives' && lesson.subject !== 'math') {
      findings.push({
        severity: 'warning',
        category: 'interactive-mismatch',
        message: `Math interactive assigned to non-math subject`,
        details: `"${lesson.title}" is ${lesson.subject} but marked math-manipulatives`,
        affectedItems: {
          lessonIds: [lesson.id],
        },
      })
    }
    if (lesson.interactive === 'phonics' && lesson.subject !== 'literacy') {
      findings.push({
        severity: 'warning',
        category: 'interactive-mismatch',
        message: `Phonics interactive assigned to non-literacy subject`,
        details: `"${lesson.title}" is ${lesson.subject} but marked phonics`,
        affectedItems: {
          lessonIds: [lesson.id],
        },
      })
    }
  }

  // 9. DETECT SERAIAH/AMELIA CURRICULUM DRIFT
  const seriahLessons = lessons.filter((l) => l.gradeBand === 'pre-k')
  const seriahAssignments = assignments.filter((a) => {
    const child = childMap.get(a.childId)
    return child?.id === 'c-seraiah' || child?.id === 'c-amelia'
  })

  if (seriahAssignments.length > 0 && seriahLessons.length > 0) {
    // Check if both Seraiah and Amelia have assignments for the same lessons
    const childAssignmentsByLesson = new Map<string, Set<string>>()
    for (const assignment of seriahAssignments) {
      if (!childAssignmentsByLesson.has(assignment.lessonId)) {
        childAssignmentsByLesson.set(assignment.lessonId, new Set())
      }
      childAssignmentsByLesson.get(assignment.lessonId)!.add(assignment.childId)
    }

    for (const [lessonId, childIds] of childAssignmentsByLesson) {
      if (childIds.size === 1) {
        findings.push({
          severity: 'warning',
          category: 'seraiah-amelia-divergence',
          message: `Seraiah and Amelia have diverged curriculum`,
          details: `Only one child assigned to lesson "${lessonMap.get(lessonId)?.title}"`,
          affectedItems: {
            lessonIds: [lessonId],
            children: [...childIds],
          },
        })
      }
    }
  }

  // Summarize
  return {
    timestamp: new Date().toISOString(),
    totalLessons: lessons.length,
    totalAssignments: assignments.length,
    findings: findings.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 }
      return severityOrder[a.severity] - severityOrder[b.severity]
    }),
    summary: {
      critical: findings.filter((f) => f.severity === 'critical').length,
      warnings: findings.filter((f) => f.severity === 'warning').length,
      info: findings.filter((f) => f.severity === 'info').length,
    },
  }
}
