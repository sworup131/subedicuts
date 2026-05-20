import { useEffect, useState } from 'react'
import ScrollReveal from './ScrollReveal.jsx'
import { services } from '../data/services.js'
import { isSupabaseConfigured } from '../lib/supabase.js'
import {
  createBooking,
  fetchBookingsForDate,
  filterAvailableSlots,
  formatBookingSummary,
  formatDateISO,
  formatDateLabel,
  getBookableDates,
} from '../lib/bookingApi.js'
import { validateBookingContact } from '../lib/validateBooking.js'

const STEPS = ['service', 'datetime', 'details', 'confirm']

function StepIndicator({ currentIndex }) {
  const labels = ['Service', 'Date & time', 'Your details', 'Confirm']
  return (
    <ol className="mb-10 flex flex-wrap gap-2 sm:gap-3" aria-label="Booking progress">
      {labels.map((label, i) => (
        <li
          key={label}
          className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider sm:text-[11px] ${
            i === currentIndex
              ? 'bg-barber-accent text-barber-bg'
              : i < currentIndex
                ? 'border border-barber-accent/40 text-barber-accent'
                : 'border border-white/10 text-barber-fg/40'
          }`}
        >
          {label}
        </li>
      ))}
    </ol>
  )
}

export default function Booking() {
  const [step, setStep] = useState(0)
  const [service, setService] = useState(null)
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [slots, setSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [confirmed, setConfirmed] = useState(null)

  const bookableDates = getBookableDates()
  const stepId = STEPS[step]

  useEffect(() => {
    if (!service || !date || stepId !== 'datetime') return

    let cancelled = false
    setSlotsLoading(true)
    setTime(null)

    async function loadSlots() {
      try {
        const existing = isSupabaseConfigured ? await fetchBookingsForDate(date) : []
        if (!cancelled) {
          setSlots(filterAvailableSlots(date, service, existing))
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setSlots([])
          setError(err.message ?? 'Could not load available times.')
        }
      } finally {
        if (!cancelled) setSlotsLoading(false)
      }
    }

    loadSlots()
    return () => {
      cancelled = true
    }
  }, [service, date, stepId])

  function goBack() {
    setError(null)
    if (confirmed) return
    setStep((s) => Math.max(0, s - 1))
  }

  function goNext() {
    setError(null)
    setStep((s) => Math.min(STEPS.length - 1, s + 1))
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    try {
      const result = await createBooking({
        service,
        date,
        time,
        name,
        email,
        phone,
      })
      setConfirmed({
        ...formatBookingSummary(service, date, time),
        id: result.id,
      })
    } catch (err) {
      setError(err.message ?? 'Booking failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmed) {
    return (
      <section id="booking" className="border-b border-white/[0.06] bg-barber-bg px-5 py-16 sm:px-8 sm:py-20">
        <ScrollReveal className="mx-auto max-w-lg text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-barber-accent sm:text-xs">
            Confirmed
          </p>
          <h2 className="mt-3 font-barber-logo text-[clamp(2rem,6vw,3.5rem)] leading-none tracking-[0.04em] text-barber-fg">
            You&apos;re booked
          </h2>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left text-sm text-barber-fg/80">
            <p>
              <span className="text-barber-fg/50">Service</span>
              <br />
              <span className="font-semibold text-barber-fg">{confirmed.serviceName}</span>
            </p>
            <p className="mt-4">
              <span className="text-barber-fg/50">When</span>
              <br />
              <span className="font-semibold text-barber-fg">
                {confirmed.dateLabel} · {confirmed.timeLabel}
              </span>
            </p>
            <p className="mt-4">
              <span className="text-barber-fg/50">Total</span>
              <br />
              <span className="font-semibold text-barber-accent">${confirmed.price}</span>
            </p>
          </div>
          <p className="mt-6 text-sm text-barber-fg/55">
            A confirmation will be sent to <span className="text-barber-fg/80">{email}</span> once email
            notifications are connected.
          </p>
          <button
            type="button"
            onClick={() => {
              setConfirmed(null)
              setStep(0)
              setService(null)
              setDate(null)
              setTime(null)
              setName('')
              setEmail('')
              setPhone('')
            }}
            className="mt-8 rounded-full bg-barber-accent px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-barber-bg transition-colors hover:bg-barber-accent-hover"
          >
            Book another
          </button>
        </ScrollReveal>
      </section>
    )
  }

  return (
    <section id="booking" className="border-b border-white/[0.06] bg-barber-bg px-5 py-16 sm:px-8 sm:py-20">
      <ScrollReveal className="mx-auto max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-barber-accent sm:text-xs">
          Appointments
        </p>
        <h2 className="mt-3 font-barber-logo text-[clamp(2.5rem,6vw,4rem)] leading-none tracking-[0.04em] text-barber-fg">
          Booking
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-barber-fg/65 sm:text-base">
          Choose a service, pick a time, and reserve your chair at Subedi CUTs.
        </p>

        {!isSupabaseConfigured && (
          <p className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200/90">
            Booking storage is not connected yet. Copy <code className="text-barber-fg/90">.env.example</code>{' '}
            to <code className="text-barber-fg/90">.env</code>, add your Supabase keys, and run{' '}
            <code className="text-barber-fg/90">supabase/schema.sql</code> in your project dashboard. You can
            still preview the booking flow below.
          </p>
        )}

        <StepIndicator currentIndex={step} />

        {error && (
          <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        {stepId === 'service' && (
          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setService(s)
                  setDate(null)
                  setTime(null)
                  goNext()
                }}
                className={`rounded-2xl border p-5 text-left transition-colors ${
                  service?.id === s.id
                    ? 'border-barber-accent bg-barber-accent/10'
                    : 'border-white/10 bg-white/[0.04] hover:border-white/20'
                }`}
              >
                <p className="font-semibold text-barber-fg">{s.name}</p>
                <p className="mt-1 text-xs text-barber-fg/55">{s.description}</p>
                <p className="mt-3 text-sm text-barber-accent">
                  ${s.price} · {s.durationMinutes} min
                </p>
              </button>
            ))}
          </div>
        )}

        {stepId === 'datetime' && service && (
          <div className="space-y-8">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-barber-fg/50">Date</p>
              <div className="flex flex-wrap gap-2">
                {bookableDates.map((d) => {
                  const iso = formatDateISO(d)
                  const selected = date && formatDateISO(date) === iso
                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => setDate(d)}
                      className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                        selected
                          ? 'bg-barber-accent text-barber-bg'
                          : 'border border-white/10 text-barber-fg/80 hover:border-white/25'
                      }`}
                    >
                      {formatDateLabel(d)}
                    </button>
                  )
                })}
              </div>
            </div>

            {date && (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-barber-fg/50">Time</p>
                {slotsLoading ? (
                  <p className="text-sm text-barber-fg/50">Loading times…</p>
                ) : slots.length === 0 ? (
                  <p className="text-sm text-barber-fg/50">No open slots this day. Pick another date.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots.map((slot) => (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() => setTime(slot.value)}
                        className={`rounded-lg py-2.5 text-xs font-medium transition-colors ${
                          time === slot.value
                            ? 'bg-barber-accent text-barber-bg'
                            : 'border border-white/10 text-barber-fg/80 hover:border-white/25'
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={goBack}
                className="rounded-full border border-white/15 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-barber-fg/80"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!date || !time}
                onClick={goNext}
                className="rounded-full bg-barber-accent px-8 py-3 text-xs font-semibold uppercase tracking-wider text-barber-bg disabled:opacity-40"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {stepId === 'details' && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              const contactError = validateBookingContact({ name, email, phone })
              if (contactError) {
                setError(contactError)
                return
              }
              setError(null)
              goNext()
            }}
          >
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-barber-fg/50">Name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-barber-fg outline-none focus:border-barber-accent/50"
                autoComplete="name"
                maxLength={120}
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-barber-fg/50">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-barber-fg outline-none focus:border-barber-accent/50"
                autoComplete="email"
                maxLength={254}
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-barber-fg/50">Phone</span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-barber-fg outline-none focus:border-barber-accent/50"
                autoComplete="tel"
                maxLength={30}
              />
            </label>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={goBack}
                className="rounded-full border border-white/15 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-barber-fg/80"
              >
                Back
              </button>
              <button
                type="submit"
                className="rounded-full bg-barber-accent px-8 py-3 text-xs font-semibold uppercase tracking-wider text-barber-bg"
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {stepId === 'confirm' && service && date && time && (
          <div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-sm">
              {(() => {
                const summary = formatBookingSummary(service, date, time)
                return (
                  <>
                    <p className="text-barber-fg/50">Service</p>
                    <p className="font-semibold text-barber-fg">{summary.serviceName}</p>
                    <p className="mt-4 text-barber-fg/50">When</p>
                    <p className="font-semibold text-barber-fg">
                      {summary.dateLabel} · {summary.timeLabel}
                    </p>
                    <p className="mt-4 text-barber-fg/50">Contact</p>
                    <p className="text-barber-fg">{name}</p>
                    <p className="text-barber-fg/70">{email}</p>
                    <p className="text-barber-fg/70">{phone}</p>
                    <p className="mt-4 text-barber-fg/50">Total</p>
                    <p className="text-lg font-semibold text-barber-accent">${summary.price}</p>
                  </>
                )
              })()}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={goBack}
                disabled={submitting}
                className="rounded-full border border-white/15 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-barber-fg/80"
              >
                Back
              </button>
              <button
                type="button"
                disabled={submitting || !isSupabaseConfigured}
                onClick={handleSubmit}
                className="rounded-full bg-barber-accent px-8 py-3 text-xs font-semibold uppercase tracking-wider text-barber-bg disabled:opacity-40"
              >
                {submitting ? 'Booking…' : 'Confirm booking'}
              </button>
            </div>
          </div>
        )}
      </ScrollReveal>
    </section>
  )
}
