import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Gallery from './components/Gallery.jsx'
import Reviews from './components/Reviews.jsx'
import Booking from './components/Booking.jsx'
import Footer from './components/Footer.jsx'
import { scrollToHash } from './lib/scroll.js'

export default function App() {
  useEffect(() => {
    const { hash } = window.location
    if (!hash) return
    requestAnimationFrame(() => scrollToHash(hash))
  }, [])

  return (
    <div className="min-h-dvh bg-barber-bg font-barber-sans text-barber-fg antialiased">
      <Navbar />
      <main>
        <Hero />
        <Gallery />
        <Reviews />
        <Booking />
      </main>
      <Footer />
    </div>
  )
}
