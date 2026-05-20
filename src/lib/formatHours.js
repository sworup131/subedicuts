const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** @param {{ open: string, close: string } | null} a @param {{ open: string, close: string } | null} b */
function schedulesEqual(a, b) {
  if (a === null && b === null) return true
  if (a === null || b === null) return false
  return a.open === b.open && a.close === b.close
}

/** @param {string} hhmm 24h "HH:MM" */
function formatTime12h(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  if (m === 0) return `${hour12} ${period}`
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

/** @param {number[]} dayIndices */
function formatDayRange(dayIndices) {
  if (dayIndices.length === 1) return DAY_SHORT[dayIndices[0]]
  return `${DAY_SHORT[dayIndices[0]]}–${DAY_SHORT[dayIndices[dayIndices.length - 1]]}`
}

/**
 * Human-readable hours lines for footer display.
 * @param {Record<number, { open: string, close: string } | null>} hours
 * @returns {{ label: string, value: string }[]}
 */
export function formatBusinessHoursForFooter(hours) {
  const lines = []
  let i = 0

  while (i < 7) {
    const schedule = hours[i]
    const dayIndices = [i]
    let j = i + 1
    while (j < 7 && schedulesEqual(hours[j], schedule)) {
      dayIndices.push(j)
      j += 1
    }

    const label = formatDayRange(dayIndices)
    const value = schedule
      ? `${formatTime12h(schedule.open)} – ${formatTime12h(schedule.close)}`
      : 'Closed'

    lines.push({ label, value })
    i = j
  }

  return lines
}
