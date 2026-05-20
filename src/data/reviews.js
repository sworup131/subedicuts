import bipinPhoto from '../assets/reviews/geminiBipin.png'
import sujanPhoto from '../assets/reviews/sujanPhoto.jpg'
import maheshPhoto from '../assets/reviews/MaheshPhoto.png'

/** Aggregate stats — update when you have real Google Business data */
export const reviewSummary = {
  averageRating: 4.3,
  totalCount: 3,
  /** Replace with your Google Business review URL when ready */
  googleReviewUrl: null,
}

export const reviews = [
  {
    id: '1',
    name: 'Bipin S.',
    service: 'Taper Fade',
    rating: 5,
    quote: 'Best cut I’ve had in years. Clean lines, on time, and the shop has a great vibe.',
    photo: bipinPhoto,
  },
  {
    id: '2',
    name: 'Sujan S.',
    service: 'Classic scissor cut',
    rating: 4,
    quote: 'Great cut and friendly service. Wait was a little longer than expected, but worth it.',
    photo: sujanPhoto,
  },
  {
    id: '3',
    name: 'Mahesh N.',
    service: 'Beard and Flow cut',
    rating: 4,
    quote: 'Solid beard shape and good attention to detail. Will definitely come back.',
    photo: maheshPhoto,
  },
]
