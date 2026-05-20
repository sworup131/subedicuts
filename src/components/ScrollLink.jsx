import { scrollToHash, scrollToTop } from '../lib/scroll.js'

/**
 * In-page anchor link with eased smooth scrolling and sticky-header offset.
 */
export default function ScrollLink({ href, onClick, children, ...rest }) {
  const handleClick = (event) => {
    onClick?.(event)
    if (event.defaultPrevented) return

    if (!href || href === '/') {
      event.preventDefault()
      scrollToTop()
      return
    }

    if (!href.startsWith('#')) return

    event.preventDefault()
    scrollToHash(href)
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
