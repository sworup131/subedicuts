import logo from '../assets/logo.png'
import ScrollLink from './ScrollLink.jsx'

export default function Navbar() {
  const navLinkClass =
    "relative inline-block pb-1 text-sm font-medium tracking-wide text-barber-fg/80 transition-colors duration-200 hover:text-barber-fg after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-barber-accent/70 after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 sm:text-[0.9375rem]"

  return (
    <header id="site-header" className="sticky top-0 z-50 border-b border-white/[0.06] bg-barber-bg">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-5 py-1.5 sm:px-8 sm:py-2"
        aria-label="Primary"
      >
        <ScrollLink
          href="/"
          className="ml-2 shrink-0 opacity-100 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-barber-accent sm:ml-4 md:ml-6 lg:ml-8"
        >
          <img
            src={logo}
            alt="Subedi CUTs"
            className="h-9 w-auto max-w-[min(240px,48vw)] object-contain object-left sm:h-10 md:h-11 lg:h-12"
            decoding="async"
          />
        </ScrollLink>

        <ul className="flex items-center gap-6 sm:gap-10">
          <li>
            <ScrollLink href="#gallery" className={navLinkClass}>
              Gallery
            </ScrollLink>
          </li>
          <li>
            <ScrollLink href="#reviews" className={navLinkClass}>
              Reviews
            </ScrollLink>
          </li>
          <li className="sm:pl-1">
            <ScrollLink
              href="#booking"
              className="inline-flex items-center justify-center rounded-sm bg-barber-accent px-4 py-1.5 text-sm font-semibold tracking-wide text-barber-bg shadow-[0_0_0_1px_rgba(212,175,55,0.35)] transition-[background-color,box-shadow,transform] duration-200 hover:bg-barber-accent-hover hover:shadow-[0_0_24px_rgba(212,175,55,0.25)] active:scale-[0.98] sm:px-5 sm:text-[0.9375rem]"
            >
              Book Now
            </ScrollLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
