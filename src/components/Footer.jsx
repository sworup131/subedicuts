import { businessHours } from '../data/businessHours.js'
import { reviewSummary } from '../data/reviews.js'
import { formatAddressSingleLine, site } from '../data/site.js'
import { formatBusinessHoursForFooter } from '../lib/formatHours.js'
import ScrollLink from './ScrollLink.jsx'

const footerLinkClass =
  'relative inline-block pb-0.5 text-sm text-barber-fg/70 transition-colors duration-200 hover:text-barber-fg after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-barber-accent/70 after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100'

const FOOTER_NAV = [
  { href: '#gallery', label: 'Gallery' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#booking', label: 'Book Now' },
]

const SOCIAL_ORDER = ['github', 'instagram', 'linkedin']

const SOCIAL_LABELS = {
  github: 'GitHub',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
}

function getOrderedSocialLinks(social) {
  return SOCIAL_ORDER.filter((network) => social?.[network]).map((network) => [
    network,
    social[network],
  ])
}

function FooterHeading({ children }) {
  return (
    <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-barber-fg/45">
      {children}
    </h2>
  )
}

export default function Footer() {
  const hoursLines = formatBusinessHoursForFooter(businessHours)
  const addressLine = formatAddressSingleLine(site.address)
  const socialLinks = getOrderedSocialLinks(site.social)
  const hasContact = Boolean(site.phone || site.email || addressLine)
  const hasSocial = socialLinks.length > 0
  const { googleReviewUrl } = reviewSummary

  return (
    <footer className="border-t border-white/[0.06] bg-barber-bg">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Brand */}
          <div className="flex flex-col sm:max-w-xs lg:max-w-none">
            <ScrollLink
              href="/"
              className="group inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-barber-accent"
            >
              <p className="font-barber-logo text-[2rem] leading-none tracking-[0.04em] text-barber-fg transition-colors group-hover:text-barber-accent sm:text-[2.25rem]">
                {site.name}
              </p>
            </ScrollLink>
            {site.footerLabel ? (
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-barber-accent/90">
                {site.footerLabel}
              </p>
            ) : null}
            <p className="mt-4 text-sm leading-relaxed text-barber-fg/55">{site.tagline}</p>
            <ScrollLink
              href="#booking"
              className="mt-6 inline-flex w-fit items-center justify-center rounded-sm border border-barber-accent/50 px-4 py-2 text-sm font-semibold tracking-wide text-barber-accent transition-[background-color,color,box-shadow] duration-200 hover:bg-barber-accent hover:text-barber-bg active:scale-[0.98]"
            >
              Book an appointment
            </ScrollLink>
          </div>

          {/* Quick links */}
          <div>
            <FooterHeading>Explore</FooterHeading>
            <nav className="mt-4" aria-label="Footer">
              <ul className="flex flex-col gap-3">
                {FOOTER_NAV.map(({ href, label }) => (
                  <li key={href}>
                    <ScrollLink href={href} className={footerLinkClass}>
                      {label}
                    </ScrollLink>
                  </li>
                ))}
                {googleReviewUrl ? (
                  <li>
                    <a
                      href={googleReviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={footerLinkClass}
                    >
                      Leave a Google review
                    </a>
                  </li>
                ) : null}
              </ul>
            </nav>
          </div>

          {/* Hours */}
          <div>
            <FooterHeading>Hours</FooterHeading>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm" role="list">
              {hoursLines.map(({ label, value }) => (
                <li key={label} className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-baseline gap-x-3">
                  <span className="text-barber-fg/55">{label}</span>
                  <span className="text-barber-fg/80">{value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <FooterHeading>Connect</FooterHeading>
            {hasContact ? (
              <ul className="mt-4 space-y-3 text-sm">
                {site.phone ? (
                  <li>
                    <a
                      href={`tel:${site.phone.replace(/\s/g, '')}`}
                      className="text-barber-fg/70 transition-colors hover:text-barber-accent"
                    >
                      {site.phone}
                    </a>
                  </li>
                ) : null}
                {site.email ? (
                  <li>
                    <a
                      href={`mailto:${site.email}`}
                      className="text-barber-fg/70 transition-colors hover:text-barber-accent"
                    >
                      {site.email}
                    </a>
                  </li>
                ) : null}
                {addressLine ? (
                  <li className="text-barber-fg/70">
                    {site.mapsUrl ? (
                      <a
                        href={site.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-barber-accent"
                      >
                        {addressLine}
                        <span className="mt-1 block text-xs text-barber-accent/80">Get directions</span>
                      </a>
                    ) : (
                      addressLine
                    )}
                  </li>
                ) : null}
              </ul>
            ) : null}

            {hasSocial ? (
              <ul
                className={`flex flex-col gap-2.5 text-sm ${hasContact ? 'mt-6' : 'mt-4'}`}
                aria-label="Social profiles"
              >
                {socialLinks.map(([network, url]) => (
                  <li key={network}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={footerLinkClass}
                    >
                      {SOCIAL_LABELS[network]}
                    </a>
                  </li>
                ))}
              </ul>
            ) : !hasContact ? (
              <p className="mt-4 text-sm text-barber-fg/50">Links coming soon.</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto max-w-2xl px-5 py-8 sm:px-8">
          <p className="text-center text-xs leading-relaxed text-barber-fg/45 sm:text-sm">
            {site.projectDisclaimer}
          </p>
        </div>
        <p className="border-t border-white/[0.06] px-5 py-5 text-center text-xs text-barber-fg/40 sm:px-8">
          © {new Date().getFullYear()} {site.name}
          {site.authorName ? ` · Built by ${site.authorName}` : null}
        </p>
      </div>
    </footer>
  )
}
