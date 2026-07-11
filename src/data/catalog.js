import { movies as resourceMovies } from './movies'
import bannerImage from '../assets/ImagesForInitialUse/image/banner.jpeg'

const movies = resourceMovies.map((movie) => ({
  id: movie.id,
  title: movie.title,
  image: movie.poster_path,
  rating: movie.matureRating,
  type: movie.category,
  badge: movie.badge,
  quality: movie.quality,
  tags: movie.genres,
}))

export const rows = [
  {
    key: 'popular',
    title: 'Popular on StreamVault',
    subtitle: 'A quick run-through of the titles people are pressing play on right now.',
    items: [movies[0], movies[1], movies[2], movies[3], movies[4], movies[5]],
  },
  {
    key: 'watch-again',
    title: 'Watch It Again',
    subtitle: 'Jump back into the titles you already hovered, opened, or started earlier.',
    items: [movies[6], movies[7], movies[8], movies[0], movies[1], movies[2]],
  },
]

export const browseHero = {
  eyebrow: 'FEATURED',
  title: 'Featured Title',
  description:
    'An acclaimed series that has captivated audiences worldwide with its compelling characters and stunning visuals.',
  backdrop: bannerImage,
  badge: 'Featured',
}

export const footerColumns = [
  ['Audio Description', 'Investor Relations', 'Legal Notices'],
  ['Help Centre', 'Jobs', 'Cookie Preferences'],
  ['Gift Cards', 'Terms of Use', 'Corporate Information'],
  ['Media Centre', 'Privacy', 'Contact Us'],
]

export const defaultCardId = null

export function buildLocalBrowseModel() {
  return {
    hero: browseHero,
    rows,
  }
}