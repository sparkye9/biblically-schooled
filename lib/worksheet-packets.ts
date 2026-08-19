import type { DayName } from './types'

/**
 * Maps curriculum data (child, week, day) to the real printable PDF that
 * backs it in /public/worksheets. Shared between the seed data (which
 * builds Resource entries for Print Center/Printables) and any lesson
 * card that needs to link straight to the actual worksheet.
 */

export const PACKET_DAY_FILE: Record<'monday' | 'tuesday' | 'thursday' | 'friday', string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  thursday: 'Thu',
  friday: 'Fri',
}

export const PACKET_CHILD_FOLDER: Record<string, string> = {
  'c-alijah': 'Alijah',
  'c-olori': 'Olori-Joy',
  'c-seraiah': 'Seraiah',
  'c-amelia': 'Amelia',
}

/** Highest week number that has real uploaded worksheet packets. */
export const MAX_PACKET_WEEK = 35

export function weekFolder(weekNumber: number) {
  return `week-${String(weekNumber).padStart(2, '0')}`
}

/**
 * The real PDF for a given child/week/day, or null if that combination
 * has no packet (Wednesday is a co-op/no-home-lessons day, and weeks
 * beyond MAX_PACKET_WEEK have no uploaded content yet).
 */
export function packetUrlFor(
  childId: string,
  weekNumber: number,
  day: DayName,
): string | null {
  if (weekNumber > MAX_PACKET_WEEK) return null
  const folder = PACKET_CHILD_FOLDER[childId]
  const dayFile = PACKET_DAY_FILE[day as keyof typeof PACKET_DAY_FILE]
  if (!folder || !dayFile) return null
  return `/worksheets/${weekFolder(weekNumber)}/${folder}/${dayFile}.pdf`
}

export function parentChecklistUrlFor(weekNumber: number): string | null {
  if (weekNumber > MAX_PACKET_WEEK) return null
  return `/worksheets/${weekFolder(weekNumber)}/Parent_Checklist.pdf`
}
