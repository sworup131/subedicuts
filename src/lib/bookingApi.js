import { bookingHorizonDays, businessHours, slotIntervalMinutes } from '../data/businessHours.js'
import { isSupabaseConfigured, supabase } from './supabase.js'
import { validateBookingContact, validateBookingSlot } from './validateBooking.js'

function parseTime(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

function formatTime24(totalMinutes) {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function formatTime12(totalMinutes) {
  const h24 = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  const period = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}

export function getBookableDates() {
  const dates = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < bookingHorizonDays; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const hours = businessHours[d.getDay()]
    if (hours) dates.push(d)
  }
  return dates
}

export function formatDateLabel(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** @param {Date} date @param {{ durationMinutes: number }} service */
export function generateTimeSlots(date, service) {
  const hours = businessHours[date.getDay()]
  if (!hours) return []

  const openMin = parseTime(hours.open)
  const closeMin = parseTime(hours.close)
  const duration = service.durationMinutes
  const slots = []

  for (let start = openMin; start + duration <= closeMin; start += slotIntervalMinutes) {
    slots.push({
      startMinutes: start,
      label: formatTime12(start),
      value: formatTime24(start),
    })
  }
  return slots
}

function toTimestamp(date, timeHHMM) {
  const [h, m] = timeHHMM.split(':').map(Number)
  const d = new Date(date)
  d.setHours(h, m, 0, 0)
  return d
}

/** @param {Date} date */
export async function fetchBookingsForDate(date) {
  if (!isSupabaseConfigured || !supabase) return []

  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(date)
  dayEnd.setHours(23, 59, 59, 999)

  const { data, error } = await supabase
    .from('bookings')
    .select('starts_at, ends_at')
    .gte('starts_at', dayStart.toISOString())
    .lte('starts_at', dayEnd.toISOString())

  if (error) throw error
  return data ?? []
}

/** @param {Date} date @param {{ durationMinutes: number }} service @param {Array<{starts_at: string, ends_at: string}>} existing */
export function filterAvailableSlots(date, service, existing) {
  const slots = generateTimeSlots(date, service)
  const bookedRanges = existing.map((b) => ({
    start: new Date(b.starts_at).getTime(),
    end: new Date(b.ends_at).getTime(),
  }))

  return slots.filter((slot) => {
    const start = toTimestamp(date, slot.value)
    const end = new Date(start.getTime() + service.durationMinutes * 60 * 1000)
    const startMs = start.getTime()
    const endMs = end.getTime()

    return !bookedRanges.some((b) => startMs < b.end && endMs > b.start)
  })
}

/** @param {{ service: object, date: Date, time: string, name: string, email: string, phone: string }} booking */
export async function createBooking({ service, date, time, name, email, phone }) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
  }

  const contactError = validateBookingContact({ name, email, phone })
  if (contactError) throw new Error(contactError)

  const startsAt = toTimestamp(date, time)
  const slotError = validateBookingSlot(service, startsAt)
  if (slotError) throw new Error(slotError)

  const endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60 * 1000)

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      service_id: service.id,
      service_name: service.name,
      duration_minutes: service.durationMinutes,
      price: service.price,
      client_name: name.trim(),
      client_email: email.trim(),
      client_phone: phone.trim(),
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
    })
    .select('id, starts_at, ends_at')
    .single()

  if (error) throw error
  return data
}

export function formatBookingSummary(service, date, time) {
  const startsAt = toTimestamp(date, time)
  return {
    serviceName: service.name,
    dateLabel: formatDateLabel(date),
    timeLabel: formatTime12(parseTime(time)),
    price: service.price,
    startsAt,
  }
}
