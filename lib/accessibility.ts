/** Accessibility utilities and ARIA helpers */

export const ariaLabels = {
  close: 'Close dialog',
  menu: 'Open menu',
  delete: 'Delete item',
  edit: 'Edit item',
  save: 'Save changes',
  cancel: 'Cancel',
  next: 'Next',
  previous: 'Previous',
  toggleMenu: 'Toggle navigation menu',
  selectAll: 'Select all items',
  clearAll: 'Clear all items',
  toggleDarkMode: 'Toggle dark mode',
}

export const roleDescriptions = {
  navigation: 'Main navigation',
  sidebar: 'Sidebar navigation',
  topbar: 'Top bar',
  main: 'Main content',
  footer: 'Footer',
}

export interface AccessibleProps {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-expanded'?: boolean
  'aria-selected'?: boolean
  'aria-checked'?: boolean | 'mixed'
  'aria-disabled'?: boolean
}

export function createAriaLabel(action: string, target?: string): string {
  if (target) return `${action} ${target}`
  return action
}

export function createAriaDescription(text: string): string {
  return text
}
