import geminiSworup from '../assets/gallery/geminiSworup1.png'
import geminiBipin from '../assets/gallery/geminiBipin.png'
import scissor from '../assets/gallery/scissor.jpg'
import scissorsTrimmer from '../assets/gallery/scissorsTrimmer.jpg'

/** @type {{ src: string, alt: string, id?: string }[]} */
export const galleryLeftImages = [
  { src: geminiSworup, alt: 'Client haircut at Subedi CUTs', id: 'l1' },
  { src: scissor, alt: 'Precision scissor work', id: 'l2' },
]

/** @type {{ src: string, alt: string, id?: string }[]} */
export const galleryRightImages = [
  { src: geminiBipin, alt: 'Barbershop styling', id: 'r1' },
  { src: scissorsTrimmer, alt: 'Scissors and trimmer tools', id: 'r2' },
]
