import { bookingHorizonDays } from '../data/businessHours.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** @param {{ name: string, email: string, phone: string }} fields */
export function validateBookingContact({ name, email, phone }) {
  const trimmedName = name.trim()
  const trimmedEmail = email.trim()
  const trimmedPhone = phone.trim()

  if (!trimmedName || trimmedName.length > 120) {
    return 'Please enter your name (max 120 characters).'
  }
  if (!trimmedEmail || trimmedEmail.length > 254 || !EMAIL_RE.test(trimmedEmail)) {
    return 'Please enter a valid email address.'
  }
  if (!trimmedPhone || trimmedPhone.length < 7 || trimmedPhone.length > 30) {
    return 'Please enter a valid phone number.'
  }
  return null
}

/** @param {{ durationMinutes: number, price: number }} service @param {Date} startsAt */
export function validateBookingSlot(service, startsAt) {
  if (service.durationMinutes < 15 || service.durationMinutes > 180) {
    return 'Invalid service duration.'
  }
  if (service.price < 0 || service.price > 500) {
    return 'Invalid service price.'
  }

  const now = Date.now()
  const startMs = startsAt.getTime()
  const minStart = now - 12 * 60 * 60 * 1000
  const maxStart = now + bookingHorizonDays * 24 * 60 * 60 * 1000

  if (startMs < minStart || startMs > maxStart) {
    return 'Please choose a date within the booking window.'
  }
  return null
}
