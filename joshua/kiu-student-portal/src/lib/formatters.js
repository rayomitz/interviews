/**
 * Shared formatting utilities.
 */

/** Format ISO date string → "Jan 1, 2025" (pass options to override defaults) */
export function formatDate(dateStr, options) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-UG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  })
}

/** Get initials from a full name — "Jane Doe" → "JD" */
export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

/** Capitalise first letter */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/** Convert snake_case/kebab-case to readable label */
export function labelify(str) {
  if (!str) return ''
  return str.replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Format a number as UGX currency */
export function formatUGX(amount) {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
  }).format(amount)
}