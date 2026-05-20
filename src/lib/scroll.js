const HEADER_SELECTOR = '#site-header'

/** @returns {boolean} */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function getHeaderOffset(extra = 8) {
  const header = document.querySelector(HEADER_SELECTOR)
  return (header?.getBoundingClientRect().height ?? 64) + extra
}

/** @param {number} t 0–1 */
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

/**
 * Smooth scroll with easing (custom) or native smooth scroll.
 * @param {number} targetY
 * @param {{ duration?: number }} [options]
 */
export function scrollToY(targetY, { duration = 950 } = {}) {
  const startY = window.scrollY
  const distance = targetY - startY

  if (Math.abs(distance) < 2) return

  if (prefersReducedMotion()) {
    window.scrollTo({ top: targetY, behavior: 'auto' })
    return
  }

  const startTime = performance.now()

  function step(now) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    window.scrollTo(0, startY + distance * easeInOutCubic(progress))
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

/** @param {HTMLElement} element */
export function scrollToElement(element, options) {
  const top = element.getBoundingClientRect().top + window.scrollY - getHeaderOffset()
  scrollToY(top, options)
}

export function scrollToTop(options) {
  scrollToY(0, options)
}

/** @param {string} hash e.g. "#gallery" */
export function scrollToHash(hash, options) {
  const id = hash.replace(/^#/, '')
  if (!id) {
    scrollToTop(options)
    return
  }
  const element = document.getElementById(id)
  if (element) scrollToElement(element, options)
}
