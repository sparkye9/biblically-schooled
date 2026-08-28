import type { Worksheet } from './types'

/**
 * Complete worksheet metadata for all 36 weeks
 * Worksheets follow a progression model:
 * - Monday/Introduce: Visual intro, minimal writing
 * - Tuesday/Guided: Modeled activity, child participates
 * - Wednesday/Independent: Child completes mostly alone
 * - Thursday/Apply: Real-world application
 * - Friday/Review: Mixed practice, preparation for next week
 */

function generateWorksheets(): Worksheet[] {
  const worksheets: Worksheet[] = []
  const weeks = Array.from({ length: 36 }, (_, i) => i + 1)
  const gradeBands = ['pre-k', 'k', '1st'] as const
  const subjects = ['literacy', 'math'] as const
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const

  weeks.forEach((weekNum) => {
    gradeBands.forEach((gradeBand) => {
      subjects.forEach((subject) => {
        // Generate 2 worksheets per subject per grade band per week (one regular, one challenge on Friday)
        const lessonDays = subject === 'literacy' ? days : ['monday'] // Math gets one per week, literacy gets 5

        if (subject === 'literacy') {
          lessonDays.forEach((day, dayIndex) => {
            const titles = [
              'Introduce: Visual & Audio',
              'Guided: Modeled Practice',
              'Independent: Solo Work',
              'Apply: Real World',
              'Review: Mixed Practice',
            ]

            worksheets.push({
              id: `ws-w${weekNum}-${day}-${gradeBand}-${subject}`,
              title: titles[dayIndex],
              subject,
              skill: `Week ${weekNum} ${subject} skill`,
              weekNumber: weekNum,
              day,
              gradeBand,
              isChallenge: false,
              fileUrl: `/worksheets/week-${String(weekNum).padStart(2, '0')}/${gradeBand}/${days[dayIndex].charAt(0).toUpperCase() + days[dayIndex].slice(1)}_${subject}.html`,
              description: `${gradeBand} ${subject} worksheet for week ${weekNum}`,
            })
          })

          // Add challenge literacy worksheet on Friday
          worksheets.push({
            id: `ws-w${weekNum}-fri-${gradeBand}-${subject}-challenge`,
            title: '⭐ Challenge: Advanced Activity',
            subject,
            skill: `Week ${weekNum} challenge`,
            weekNumber: weekNum,
            day: 'friday',
            gradeBand,
            isChallenge: true,
            fileUrl: `/worksheets/week-${String(weekNum).padStart(2, '0')}/${gradeBand}/Challenge_${subject}.html`,
            description: `Optional challenge worksheet for week ${weekNum}`,
          })
        } else {
          // Math - one per week
          worksheets.push({
            id: `ws-w${weekNum}-mon-${gradeBand}-${subject}`,
            title: 'Math Activity & Practice',
            subject,
            skill: `Week ${weekNum} math skill`,
            weekNumber: weekNum,
            day: 'monday',
            gradeBand,
            isChallenge: false,
            fileUrl: `/worksheets/week-${String(weekNum).padStart(2, '0')}/${gradeBand}/Math.html`,
            description: `${gradeBand} math worksheet for week ${weekNum}`,
          })

          // Add challenge math worksheet
          worksheets.push({
            id: `ws-w${weekNum}-fri-${gradeBand}-${subject}-challenge`,
            title: '⭐ Challenge: Problem Solving',
            subject,
            skill: `Week ${weekNum} math challenge`,
            weekNumber: weekNum,
            day: 'friday',
            gradeBand,
            isChallenge: true,
            fileUrl: `/worksheets/week-${String(weekNum).padStart(2, '0')}/${gradeBand}/Challenge_Math.html`,
            description: `Optional math challenge for week ${weekNum}`,
          })
        }
      })
    })
  })

  return worksheets
}

export const worksheets: Worksheet[] = generateWorksheets()

export function getWeeklyWorksheets(
  weekNumber: number,
  gradeBand: string,
  includeChallenge: boolean = true,
): Worksheet[] {
  return worksheets.filter(
    (ws) =>
      ws.weekNumber === weekNumber &&
      ws.gradeBand === gradeBand &&
      (includeChallenge || !ws.isChallenge),
  )
}

export function getChallengeWorksheets(
  weekNumber: number,
  gradeBand: string,
): Worksheet[] {
  return worksheets.filter(
    (ws) =>
      ws.weekNumber === weekNumber &&
      ws.gradeBand === gradeBand &&
      ws.isChallenge,
  )
}
