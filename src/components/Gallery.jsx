import { useEffect, useRef, useState } from 'react'
import { galleryLeftImages, galleryRightImages } from '../data/galleryImages.js'
import ScrollLink from './ScrollLink.jsx'
import ScrollReveal from './ScrollReveal.jsx'

const LEFT_SCROLL_END = -85
const RIGHT_SCROLL_END = -60

const LEFT_SLOT_SIZES = [
  'w-[min(42vw,16.5rem)] aspect-[3/4]',
  'ml-auto w-[min(32vw,12rem)] aspect-[4/5]',
  'w-[min(38vw,14rem)] aspect-[3/4]',
  'w-[min(28vw,10rem)] aspect-square',
]

const RIGHT_SLOT_SIZES = [
  'w-[min(44vw,18rem)] aspect-[3/4]',
  'ml-auto w-[min(34vw,13rem)] aspect-[4/5]',
  'w-[min(36vw,11.5rem)] aspect-square',
]

function GallerySlot({ image, sizeClass = 'w-[min(40vw,15rem)] aspect-[3/4]' }) {
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-2xl bg-white/[0.04] ${sizeClass}`}>
      {image?.src ? (
        <img
          src={image.src}
          alt={image.alt ?? ''}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center border border-dashed border-white/12 p-4">
          <span className="text-center text-[10px] font-medium uppercase tracking-wider text-barber-fg/30">
            Photo soon
          </span>
        </div>
      )}
    </div>
  )
}

export default function Gallery() {
  const sectionRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const updateProgress = () => {
      const rect = section.getBoundingClientRect()
      const scrollable = section.offsetHeight - window.innerHeight
      if (scrollable <= 0) {
        setScrollProgress(0)
        return
      }
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable))
      setScrollProgress(progress)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  const leftY = scrollProgress * LEFT_SCROLL_END
  const rightY = scrollProgress * RIGHT_SCROLL_END

  const leftSlots = galleryLeftImages
  const rightSlots = galleryRightImages

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative z-[2] h-[200vh] bg-barber-bg"
      aria-label="Gallery"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Center — pinned headline + CTA (like SQUIRE GET squire) */}
        <ScrollReveal className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <h2 className="font-barber-logo text-[clamp(2.5rem,10vw,4.75rem)] leading-[0.95] tracking-[0.04em] text-barber-fg">
            BOOK Subedi CUTs
          </h2>
          <ScrollLink
            href="#booking"
            className="pointer-events-auto mt-8 inline-flex items-center justify-center rounded-full bg-barber-accent px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-barber-bg transition-colors hover:bg-barber-accent-hover active:scale-[0.99]"
          >
            Book now
          </ScrollLink>
        </ScrollReveal>

        {/* Left column — tall vertical stack, scrolls on page scroll */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 left-[8%] z-[1] sm:left-[10%]"
          aria-hidden
        >
          <div
            className="flex flex-col flex-nowrap items-start gap-[32vh] pt-[22vh] will-change-transform sm:gap-[38vh] sm:pt-[24vh]"
            style={{ transform: `translate3d(0, ${leftY}%, 0)` }}
          >
            {leftSlots.map((item, index) => (
              <GallerySlot
                key={item.id ?? item.alt ?? `left-${index}`}
                image={item.src ? item : null}
                sizeClass={LEFT_SLOT_SIZES[index % LEFT_SLOT_SIZES.length]}
              />
            ))}
          </div>
        </div>

        {/* Right column — offset start + slower parallax */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 right-[8%] z-[1] sm:right-[10%]"
          aria-hidden
        >
          <div
            className="flex flex-col flex-nowrap items-end gap-[28vh] pt-[32vh] will-change-transform sm:gap-[34vh] sm:pt-[36vh]"
            style={{ transform: `translate3d(0, ${rightY}%, 0)` }}
          >
            {rightSlots.map((item, index) => (
              <GallerySlot
                key={item.id ?? item.alt ?? `right-${index}`}
                image={item.src ? item : null}
                sizeClass={RIGHT_SLOT_SIZES[index % RIGHT_SLOT_SIZES.length]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
