import killerSally from '../assets/ImagesForInitialUse/image/10061.jpg'
import pepsi from '../assets/ImagesForInitialUse/image/10066.jpg'
import fitForTv from '../assets/ImagesForInitialUse/image/10067.jpg'
import champion from '../assets/ImagesForInitialUse/image/10079.jpg'
import theArt from '../assets/ImagesForInitialUse/image/10072.jpg'
import coldStorage from '../assets/ImagesForInitialUse/image/coldStorage.webp'
import hamnet from '../assets/ImagesForInitialUse/image/hamnet.webp'
import marshals from '../assets/ImagesForInitialUse/image/marshals.webp'
import monarch from '../assets/ImagesForInitialUse/image/monarchLegacyOfMonsters.webp'

// Direct app-local copy of the structure from Resources/Data/Data.js.
export const movies = [
  {
    id: 1,
    title: 'Monarch',
    poster_path: monarch,
    matureRating: 'U/A 16+',
    category: 'Movie',
    quality: 'HD',
    genres: ['Action', 'Thriller', 'Adventure'],
    badge: 'Recently added',
  },
  {
    id: 2,
    title: 'Killer Sally',
    poster_path: killerSally,
    matureRating: 'U/A 16+',
    category: 'Movie',
    quality: 'HD',
    genres: ['Crime', 'Drama', 'Thriller'],
    badge: 'Recently added',
  },
  {
    id: 3,
    title: 'Pepsi',
    poster_path: pepsi,
    matureRating: 'U/A 16+',
    category: 'Movie',
    quality: 'HD',
    genres: ['Sci-Fi', 'Thriller', 'Action'],
    badge: 'Recently added',
  },
  {
    id: 4,
    title: 'Fit For Tv',
    poster_path: fitForTv,
    matureRating: 'U/A 13+',
    category: 'Movie',
    quality: 'HD',
    genres: ['Adventure', 'Fantasy'],
    badge: 'Recently added',
  },
  {
    id: 5,
    title: 'Champion',
    poster_path: champion,
    matureRating: 'U/A 13+',
    category: 'Movie',
    quality: 'HD',
    genres: ['Adventure', 'Fantasy'],
    badge: 'Recently added',
  },
  {
    id: 6,
    title: 'Damsel',
    poster_path: theArt,
    matureRating: 'U/A 13+',
    category: 'Movie',
    quality: 'HD',
    genres: ['Adventure', 'Fantasy'],
    badge: 'Recently added',
  },
  {
    id: 7,
    title: 'Cold Storage',
    poster_path: coldStorage,
    matureRating: 'U/A 13+',
    category: 'Movie',
    quality: 'HD',
    genres: ['Adventure', 'Fantasy'],
    badge: 'Recently added',
  },
  {
    id: 8,
    title: 'Hamnet',
    poster_path: hamnet,
    matureRating: 'U/A 13+',
    category: 'Movie',
    quality: 'HD',
    genres: ['Adventure', 'Fantasy'],
    badge: 'Recently added',
  },
  {
    id: 9,
    title: 'Marshals',
    poster_path: marshals,
    matureRating: 'U/A 13+',
    category: 'Movie',
    quality: 'HD',
    genres: ['Adventure', 'Fantasy'],
    badge: 'Recently added',
  },
]