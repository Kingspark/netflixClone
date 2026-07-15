import { buildLocalBrowseModel } from '../data/catalog'

const tmdbBaseUrl = 'https://api.themoviedb.org/3'
const tmdbPosterBaseUrl = 'https://image.tmdb.org/t/p/w780'
const tmdbBackdropBaseUrl = 'https://image.tmdb.org/t/p/w1280'

const genreMap = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  27: 'Horror',
  35: 'Comedy',
  36: 'History',
  37: 'Western',
  9648: 'Mystery',
  10402: 'Music',
  10749: 'Romance',
  10752: 'War',
  10767: 'Talk',
  10768: 'War & Politics',
  53: 'Thriller',
  878: 'Sci-Fi',
}

function inferTypeLabel(content, defaultType) {
  if (defaultType) {
    return defaultType
  }

  if (content.media_type === 'tv') {
    return 'Series'
  }

  return 'Movie'
}

function toImageUrl(path, fallbackImage, baseUrl) {
  return path ? `${baseUrl}${path}` : fallbackImage
}

function toYearLabel(dateValue) {
  return dateValue ? String(dateValue).slice(0, 4) : ''
}

function toVoteLabel(voteAverage) {
  return voteAverage ? `${voteAverage.toFixed(1)}/10` : 'N/A'
}

function toLanguageLabel(languageCode) {
  return languageCode ? languageCode.toUpperCase() : 'N/A'
}

function mapContent(content, options = {}) {
  const {
    fallbackImage = '',
    defaultType,
    defaultBadge,
  } = options

  const type = inferTypeLabel(content, defaultType)
  const releaseDate = content.release_date ?? content.first_air_date ?? ''
  const image = toImageUrl(content.poster_path, fallbackImage, tmdbPosterBaseUrl)
  const backdrop = toImageUrl(content.backdrop_path, image, tmdbBackdropBaseUrl)

  return {
    id: content.id,
    title: content.title ?? content.name ?? 'Untitled',
    image,
    backdrop,
    overview: content.overview ?? '',
    popularity: content.popularity ?? 0,
    voteAverage: content.vote_average ?? 0,
    voteCount: content.vote_count ?? 0,
    voteLabel: toVoteLabel(content.vote_average ?? 0),
    mediaType: type === 'Series' ? 'tv' : 'movie',
    releaseDate,
    year: toYearLabel(releaseDate),
    language: content.original_language ?? '',
    languageLabel: toLanguageLabel(content.original_language),
    rating: content.adult ? 'U/A 16+' : 'U/A 13+',
    type,
    badge: defaultBadge,
    quality: 'HD',
    tags: (content.genre_ids ?? []).slice(0, 3).map((genreId) => genreMap[genreId] ?? 'Drama'),
  }
}

function mapDetailedContent(content, fallbackContent = {}) {
  const type = inferTypeLabel(content, fallbackContent.type)
  const releaseDate = content.release_date ?? content.first_air_date ?? fallbackContent.releaseDate ?? ''
  const runtime = content.runtime ?? content.episode_run_time?.[0] ?? null
  const genres = (content.genres ?? []).map((genre) => genre.name)
  const spokenLanguages = (content.spoken_languages ?? []).map((language) => language.english_name)
  const productionCompanies = (content.production_companies ?? []).map((company) => company.name)
  const networks = (content.networks ?? []).map((network) => network.name)

  return {
    ...fallbackContent,
    id: content.id ?? fallbackContent.id,
    title: content.title ?? content.name ?? fallbackContent.title ?? 'Untitled',
    image: toImageUrl(content.poster_path, fallbackContent.image ?? '', tmdbPosterBaseUrl),
    backdrop: toImageUrl(content.backdrop_path, fallbackContent.backdrop ?? fallbackContent.image ?? '', tmdbBackdropBaseUrl),
    overview: content.overview ?? fallbackContent.overview ?? '',
    popularity: content.popularity ?? fallbackContent.popularity ?? 0,
    voteAverage: content.vote_average ?? fallbackContent.voteAverage ?? 0,
    voteCount: content.vote_count ?? fallbackContent.voteCount ?? 0,
    voteLabel: toVoteLabel(content.vote_average ?? fallbackContent.voteAverage ?? 0),
    mediaType: type === 'Series' ? 'tv' : 'movie',
    releaseDate,
    year: toYearLabel(releaseDate),
    language: content.original_language ?? fallbackContent.language ?? '',
    languageLabel: toLanguageLabel(content.original_language ?? fallbackContent.language ?? ''),
    rating: content.adult ? 'U/A 16+' : fallbackContent.rating ?? 'U/A 13+',
    type,
    quality: fallbackContent.quality ?? 'HD',
    tags: genres.length > 0 ? genres : fallbackContent.tags ?? [],
    runtime,
    status: content.status ?? 'Released',
    tagline: content.tagline ?? '',
    homepage: content.homepage ?? '',
    imdbId: content.imdb_id ?? '',
    seasons: content.number_of_seasons ?? null,
    episodes: content.number_of_episodes ?? null,
    lastAirDate: content.last_air_date ?? '',
    spokenLanguages,
    productionCompanies,
    productionCountries: (content.production_countries ?? []).map((country) => country.name),
    networks,
  }
}

function deduplicateItems(items) {
  const unique = new Map()

  items.forEach((item) => {
    const key = `${item.type}-${item.id}`

    if (!unique.has(key)) {
      unique.set(key, item)
    }
  })

  return Array.from(unique.values())
}

function toSearchResultModel(query, items, fallbackModel) {
  const hasResults = items.length > 0
  const heroCandidate = items[0]

  return {
    hero: hasResults
      ? {
          ...heroCandidate,
          eyebrow: 'Search result',
          title: heroCandidate.title,
          description: heroCandidate.overview || fallbackModel.hero.description,
          backdrop: heroCandidate.backdrop || heroCandidate.image || fallbackModel.hero.backdrop,
          badge: heroCandidate.type,
        }
      : {
          eyebrow: 'Search',
          title: `No results for "${query}"`,
          description: 'Try a different title, genre, or keyword.',
          backdrop: fallbackModel.hero.backdrop,
          badge: 'No match',
        },
    rows: [
      buildRowsFromTitles(
        `Results for "${query}"`,
        hasResults ? `Found ${items.length} titles from TMDB.` : 'No matches were found for this query.',
        items,
        'search-results'
      ),
    ],
  }
}

function searchLocalCatalog(query, fallbackModel) {
  const normalizedQuery = query.toLowerCase()

  const localItems = deduplicateItems(
    fallbackModel.rows
      .flatMap((row) => row.items)
      .filter((item) => {
        const titleMatches = item.title.toLowerCase().includes(normalizedQuery)
        const tagMatches = (item.tags ?? []).some((tag) => tag.toLowerCase().includes(normalizedQuery))

        return titleMatches || tagMatches
      })
      .map((item) => ({
        ...item,
        overview: item.overview ?? '',
        backdrop: item.backdrop ?? item.image,
        popularity: item.popularity ?? 0,
      }))
  )

  return localItems.slice(0, 24)
}

async function loadTmdbSection(endpoint, options = {}) {
  const {
    fallbackImage,
    defaultType,
    defaultBadge,
  } = options
  const apiKey = import.meta.env.VITE_TMDB_API_KEY

  if (!apiKey) {
    return []
  }

  const response = await fetch(
    `${tmdbBaseUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${apiKey}&language=en-US`
  )

  if (!response.ok) {
    let errorMessage = `TMDB request failed (${response.status}) for ${endpoint}`

    try {
      const errorPayload = await response.json()

      if (errorPayload?.status_message) {
        errorMessage = `${errorMessage}: ${errorPayload.status_message}`
      }
    } catch {
      // Keep the HTTP status based message when the error body is not JSON.
    }

    throw new Error(errorMessage)
  }

  const payload = await response.json()
  return (payload.results ?? []).map((content) =>
    mapContent(content, {
      fallbackImage,
      defaultType,
      defaultBadge,
    })
  )
}

async function requestTmdb(endpoint) {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY

  if (!apiKey) {
    return null
  }

  const response = await fetch(
    `${tmdbBaseUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${apiKey}&language=en-US`
  )

  if (!response.ok) {
    let errorMessage = `TMDB request failed (${response.status}) for ${endpoint}`

    try {
      const errorPayload = await response.json()

      if (errorPayload?.status_message) {
        errorMessage = `${errorMessage}: ${errorPayload.status_message}`
      }
    } catch {
      // Keep the HTTP status based message when the error body is not JSON.
    }

    throw new Error(errorMessage)
  }

  return response.json()
}

function buildRowsFromTitles(title, subtitle, items, key) {
  return {
    key,
    title,
    subtitle,
    items,
  }
}

export async function loadBrowseModel() {
  const fallbackModel = buildLocalBrowseModel()
  const apiKey = import.meta.env.VITE_TMDB_API_KEY

  if (!apiKey) {
    return {
      ...fallbackModel,
      dataSource: 'fallback',
      dataReason: 'Missing VITE_TMDB_API_KEY.',
    }
  }

  try {
    const [trendingAll, popularMovies, topRatedMovies, popularSeries, topRatedSeries, upcomingMovies] = await Promise.all([
      loadTmdbSection('/trending/all/week', {
        fallbackImage: fallbackModel.hero.backdrop,
        defaultBadge: 'Trending',
      }),
      loadTmdbSection('/movie/popular', {
        fallbackImage: fallbackModel.hero.backdrop,
        defaultType: 'Movie',
        defaultBadge: 'Popular',
      }),
      loadTmdbSection('/movie/top_rated', {
        fallbackImage: fallbackModel.hero.backdrop,
        defaultType: 'Movie',
        defaultBadge: 'Top rated',
      }),
      loadTmdbSection('/tv/popular', {
        fallbackImage: fallbackModel.hero.backdrop,
        defaultType: 'Series',
        defaultBadge: 'Popular series',
      }),
      loadTmdbSection('/tv/top_rated', {
        fallbackImage: fallbackModel.hero.backdrop,
        defaultType: 'Series',
        defaultBadge: 'Top rated series',
      }),
      loadTmdbSection('/movie/upcoming', {
        fallbackImage: fallbackModel.hero.backdrop,
        defaultType: 'Movie',
        defaultBadge: 'Coming soon',
      }),
    ])

    const heroCandidate = trendingAll[0] ?? popularMovies[0] ?? popularSeries[0]

    const rows = [
      buildRowsFromTitles(
        'Trending This Week',
        'Movies and TV shows people are watching right now.',
        trendingAll,
        'trending-all'
      ),
      buildRowsFromTitles(
        'Popular Movies',
        'Current movie picks from TMDB.',
        popularMovies,
        'popular-movies'
      ),
      buildRowsFromTitles(
        'Top Rated Movies',
        'Highest rated movies from TMDB.',
        topRatedMovies,
        'top-rated-movies'
      ),
      buildRowsFromTitles(
        'Popular TV Shows',
        'Series that are currently trending with viewers.',
        popularSeries,
        'popular-series'
      ),
      buildRowsFromTitles(
        'Top Rated TV Shows',
        'The best rated series from TMDB.',
        topRatedSeries,
        'top-rated-series'
      ),
      buildRowsFromTitles(
        'Coming Soon',
        'Upcoming movie releases to add to your list.',
        upcomingMovies,
        'upcoming-movies'
      ),
    ].filter((row) => row.items.length > 0)

    if (rows.length === 0) {
      return {
        ...fallbackModel,
        dataSource: 'fallback',
        dataReason: 'TMDB returned no rows for this account/region.',
      }
    }

    return {
      hero: heroCandidate
        ? {
            ...heroCandidate,
            eyebrow: heroCandidate.type === 'Series' ? 'Top TV pick' : 'Top movie pick',
            title: heroCandidate.title,
            description: heroCandidate.overview || fallbackModel.hero.description,
            backdrop: heroCandidate.backdrop || heroCandidate.image || fallbackModel.hero.backdrop,
            badge: 'Featured',
          }
        : fallbackModel.hero,
      rows,
      dataSource: 'tmdb',
      dataReason: 'Live TMDB data loaded.',
    }
  } catch (error) {
    return {
      ...fallbackModel,
      dataSource: 'fallback',
      dataReason: error instanceof Error ? error.message : 'TMDB request failed.',
    }
  }
}

export async function loadTrendingTitles() {
  const fallbackModel = buildLocalBrowseModel()
  const apiKey = import.meta.env.VITE_TMDB_API_KEY

  if (!apiKey) {
    return fallbackModel.rows.flatMap((row) => row.items).slice(0, 10)
  }

  try {
    const items = await loadTmdbSection('/trending/all/week', {
      fallbackImage: fallbackModel.hero.backdrop,
      defaultBadge: 'Trending',
    })
    return items.slice(0, 10)
  } catch {
    return fallbackModel.rows.flatMap((row) => row.items).slice(0, 10)
  }
}

export async function searchBrowseModel(query) {
  const fallbackModel = buildLocalBrowseModel()
  const normalizedQuery = query.trim()

  if (!normalizedQuery) {
    return null
  }

  const apiKey = import.meta.env.VITE_TMDB_API_KEY

  if (!apiKey) {
    const localResults = searchLocalCatalog(normalizedQuery, fallbackModel)
    return toSearchResultModel(normalizedQuery, localResults, fallbackModel)
  }

  try {
    const encodedQuery = encodeURIComponent(normalizedQuery)

    const [movieResults, tvResults] = await Promise.all([
      loadTmdbSection(`/search/movie?query=${encodedQuery}&include_adult=false&page=1`, {
        fallbackImage: fallbackModel.hero.backdrop,
        defaultType: 'Movie',
        defaultBadge: 'Movie match',
      }),
      loadTmdbSection(`/search/tv?query=${encodedQuery}&include_adult=false&page=1`, {
        fallbackImage: fallbackModel.hero.backdrop,
        defaultType: 'Series',
        defaultBadge: 'Series match',
      }),
    ])

    const merged = deduplicateItems([...movieResults, ...tvResults])
      .sort((firstItem, secondItem) => secondItem.popularity - firstItem.popularity)
      .slice(0, 24)

    return toSearchResultModel(normalizedQuery, merged, fallbackModel)
  } catch {
    const localResults = searchLocalCatalog(normalizedQuery, fallbackModel)
    return toSearchResultModel(normalizedQuery, localResults, fallbackModel)
  }
}

export async function enrichRecommendationsWithPosters(recommendations) {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY

  if (!apiKey || recommendations.length === 0) {
    return recommendations.map((rec) => ({ ...rec, image: '' }))
  }

  const enriched = await Promise.all(
    recommendations.map(async (rec) => {
      const searchType = rec.type === 'tv' ? 'tv' : 'movie'

      try {
        const payload = await requestTmdb(
          `/search/${searchType}?query=${encodeURIComponent(rec.title)}&include_adult=false&page=1`
        )
        const match = payload?.results?.[0]

        return {
          ...rec,
          id: match?.id ?? rec.title,
          image: match?.poster_path ? `${tmdbPosterBaseUrl}${match.poster_path}` : '',
          backdrop: match?.backdrop_path ? `${tmdbBackdropBaseUrl}${match.backdrop_path}` : '',
        }
      } catch {
        return { ...rec, image: '' }
      }
    })
  )

  return enriched
}

export async function loadTitleDetails(content) {
  const fallbackModel = buildLocalBrowseModel()
  const fallbackImage = fallbackModel.hero.backdrop

  if (!content) {
    return null
  }

  const apiKey = import.meta.env.VITE_TMDB_API_KEY

  if (!apiKey || !content.id) {
    return mapDetailedContent(
      {
        ...content,
        genres: (content.tags ?? []).map((tag, index) => ({ id: index, name: tag })),
      },
      {
        ...content,
        image: content.image ?? fallbackImage,
        backdrop: content.backdrop ?? content.image ?? fallbackImage,
      }
    )
  }

  const endpoint = content.type === 'Series' ? `/tv/${content.id}` : `/movie/${content.id}`
  const payload = await requestTmdb(endpoint)

  return mapDetailedContent(payload, {
    ...content,
    image: content.image ?? fallbackImage,
    backdrop: content.backdrop ?? content.image ?? fallbackImage,
  })
}