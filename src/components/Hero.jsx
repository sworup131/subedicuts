import ScrollLink from './ScrollLink.jsx'
import ScrollReveal from './ScrollReveal.jsx'

export default function Hero() {
  return (
    <section className="flex min-h-[85svh] flex-col items-center justify-center bg-barber-bg px-6 py-20 text-center sm:px-10 sm:py-24">
      <ScrollReveal className="mx-auto flex w-full max-w-4xl flex-col items-center">
        <ScrollLink
          href="#booking"
          className="group inline-flex items-center gap-3 rounded-full border border-barber-accent bg-transparent px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-barber-fg transition-colors hover:bg-white/[0.04] sm:text-xs sm:tracking-[0.28em]"
        >
          <span className="text-barber-fg/95">Now booking · Subedi CUTs</span>
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-barber-accent text-barber-bg transition-transform group-hover:translate-x-0.5"
            aria-hidden
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="-mr-px">
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </ScrollLink>

        <h1 className="mt-12 max-w-[18ch] font-barber-logo text-[clamp(2.75rem,9vw,5.25rem)] leading-[0.92] tracking-[0.02em] text-barber-fg sm:mt-14 sm:max-w-none">
          THE ESSENTIAL CUT FOR EVERY CLIENT
        </h1>

        <p className="mt-8 max-w-xl text-base leading-relaxed text-barber-fg/65 sm:text-lg sm:leading-relaxed">
          The only experience built for clients at any level — whether it&apos;s just you in the chair or a
          full crew behind the blades.
        </p>
      </ScrollReveal>
    </section>
  )
}
