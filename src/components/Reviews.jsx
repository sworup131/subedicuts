import { reviewSummary, reviews } from '../data/reviews.js'
import ScrollReveal from './ScrollReveal.jsx'

function StarRating({ rating, label }) {
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={label ?? `${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < rating ? 'text-barber-accent' : 'text-barber-fg/20'}
          aria-hidden
        >
          ★
        </span>
      ))}
    </div>
  )
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function ClientAvatar({ name, photo }) {
  return (
    <div
      className="relative size-11 shrink-0 overflow-hidden rounded-full border border-white/15 bg-white/[0.06] sm:size-12"
      aria-hidden={!photo}
    >
      {photo ? (
        <img
          src={photo}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-barber-logo text-sm tracking-wide text-barber-accent sm:text-base">
          {getInitials(name)}
        </span>
      )}
    </div>
  )
}

function ReviewCard({ name, service, rating, quote, photo }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <StarRating rating={rating} />
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-barber-fg/80 sm:text-[0.9375rem]">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <footer className="mt-5 flex items-center gap-3 border-t border-white/[0.06] pt-4">
        <ClientAvatar name={name} photo={photo} />
        <div className="min-w-0">
          <p className="font-semibold text-barber-fg">{name}</p>
          <p className="mt-0.5 truncate text-xs text-barber-fg/50">{service}</p>
        </div>
      </footer>
    </article>
  )
}

export default function Reviews() {
  const { averageRating, totalCount, googleReviewUrl } = reviewSummary
  const fullStars = Math.floor(averageRating)

  return (
    <section id="reviews" className="border-b border-white/[0.06] bg-barber-bg px-5 pt-8 pb-16 sm:px-8 sm:pt-10 sm:pb-20">
      <ScrollReveal className="mx-auto max-w-7xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-barber-accent sm:text-xs">
          Testimonials
        </p>
        <h2 className="mt-3 font-barber-logo text-[clamp(2.5rem,6vw,4rem)] leading-none tracking-[0.04em] text-barber-fg">
          Reviews
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-barber-fg/65 sm:text-base">
          What clients say about Subedi CUTs — fades, beards, and cuts done right.
        </p>

        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <p className="font-barber-logo text-4xl leading-none text-barber-fg sm:text-5xl">
              {averageRating.toFixed(1)}
            </p>
            <div>
              <StarRating rating={fullStars} label={`${averageRating} out of 5 stars average`} />
              <p className="mt-1.5 text-sm text-barber-fg/55">Based on {totalCount} reviews</p>
            </div>
          </div>
          {googleReviewUrl ? (
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-barber-accent/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-barber-accent transition-colors hover:bg-barber-accent/10 sm:text-[0.8125rem]"
            >
              Leave a review on Google
            </a>
          ) : null}
        </div>

        <ul className="mt-10 grid list-none grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6" role="list">
          {reviews.map((review, index) => (
            <li key={review.id} className="list-none">
              <ScrollReveal delay={index * 90} className="h-full">
                <ReviewCard
                  name={review.name}
                  service={review.service}
                  rating={review.rating}
                  quote={review.quote}
                  photo={review.photo}
                />
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </ScrollReveal>
    </section>
  )
}
