/** 0 = Sunday, 6 = Saturday. Times in 24h "HH:MM". null = closed */
export const businessHours = {
  0: null,
  1: null,
  2: { open: '10:00', close: '19:00' },
  3: { open: '10:00', close: '19:00' },
  4: { open: '10:00', close: '19:00' },
  5: { open: '10:00', close: '19:00' },
  6: { open: '10:00', close: '19:00' },
}

/** How far ahead clients can book */
export const bookingHorizonDays = 28

/** Minutes between slot start times */
export const slotIntervalMinutes = 15
