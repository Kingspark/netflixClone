import { useEffect, useRef, useState } from 'react'
import Header from '../Header/Header'
import HeroBanner from '../HeroBanner/HeroBanner'
import MovieRow from '../MovieRow/MovieRow'
import Footer from '../Footer/Footer'
import CommentsSection from '../CommentsSection/CommentsSection'
import Icon from '../Icon/Icon'
import { defaultCardId, footerColumns } from '../../data/catalog'
import { buildLocalBrowseModel } from '../../data/catalog'
import { loadBrowseModel, loadTitleDetails, searchBrowseModel, enrichRecommendationsWithPosters } from '../../services/movieService'
import { moviesApi, aiApi } from '../../services/apiService'
import styles from '../../App.module.css'

function formatDetailValue(value, fallback = 'Not available') {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : fallback
  }

  return value || fallback
}

export default function BrowsePage({ authToken = null, currentUser = null, onSignOut = () => {} }) {
  const hasTmdbApiKey = Boolean(import.meta.env.VITE_TMDB_API_KEY)

  const [activeCardId, setActiveCardId] = useState(defaultCardId)
  const [browseModel, setBrowseModel] = useState(() => ({
    ...buildLocalBrowseModel(),
    dataSource: 'fallback',
    dataReason: hasTmdbApiKey ? 'Checking TMDB connection...' : 'Missing VITE_TMDB_API_KEY.',
  }))
  const [searchQuery, setSearchQuery] = useState('')
  const [searchModel, setSearchModel] = useState(null)
  const [selectedTitle, setSelectedTitle] = useState(null)
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)
  const detailsRequestId = useRef(0)

  // Liked movies (Set of movie IDs for O(1) lookup)
  const [likedIds, setLikedIds] = useState(new Set())
  // AI recommendations row
  const [aiRecommendations, setAiRecommendations] = useState([])

  const handleSearchQueryChange = (nextQuery) => {
    setSearchQuery(nextQuery)
    setSearchModel(null)
  }

  // Load liked movies when authenticated
  useEffect(() => {
    if (!authToken) return
    moviesApi.getLiked()
      .then(({ liked }) => setLikedIds(new Set(liked.map((m) => String(m.movie_id)))))
      .catch(() => {})
  }, [authToken])

  async function refreshAiRecommendations() {
    try {
      const { recommendations } = await aiApi.getRecommendations()
      if (!recommendations?.length) return
      const enriched = await enrichRecommendationsWithPosters(recommendations)
      setAiRecommendations(enriched)
    } catch (error) {
      console.error('AI recommendations failed:', error.message)
    }
  }

  // Load AI recommendations when authenticated
  useEffect(() => {
    if (!authToken) return
    refreshAiRecommendations()
  }, [authToken])

  async function handleToggleLike(movie) {
    if (!authToken || !movie?.id) return
    const id = String(movie.id)
    const isLiked = likedIds.has(id)
    // Optimistic UI update
    setLikedIds((prev) => {
      const next = new Set(prev)
      isLiked ? next.delete(id) : next.add(id)
      return next
    })
    try {
      if (isLiked) {
        await moviesApi.unlike(id)
      } else {
        await moviesApi.like({
          movieId: id,
          title: movie.title,
          genres: movie.tags ?? [],
          posterPath: movie.image ?? '',
          mediaType: movie.mediaType ?? 'movie',
        })
      }
      // Refresh AI recommendations after a like change
      refreshAiRecommendations()
    } catch {
      // Revert on failure
      setLikedIds((prev) => {
        const next = new Set(prev)
        isLiked ? next.add(id) : next.delete(id)
        return next
      })
    }
  }

  // Fetch the live browse model (hero spotlight + movie rows) once on mount.
  // isMounted prevents a stale setState call if the component unmounts before
  // the promise resolves (e.g. user navigates away mid-request).
  useEffect(() => {
    let isMounted = true

    loadBrowseModel().then((model) => {
      if (isMounted) {
        setBrowseModel(model)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const trimmedQuery = searchQuery.trim()

    if (!trimmedQuery) {
      return undefined
    }

    let isMounted = true

    const timer = setTimeout(() => {
      searchBrowseModel(trimmedQuery)
        .then((model) => {
          if (isMounted) {
            setSearchModel(model)
          }
        })
    }, 320)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [searchQuery])

  useEffect(() => {
    if (!selectedTitle) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedTitle(null)
        setIsDetailsLoading(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedTitle])

  const displayModel = searchQuery.trim() ? searchModel : browseModel

  const handleCloseDetails = () => {
    detailsRequestId.current += 1
    setSelectedTitle(null)
    setIsDetailsLoading(false)
  }

  const handleOpenDetails = async (content) => {
    if (!content) {
      return
    }

    const requestId = detailsRequestId.current + 1
    detailsRequestId.current = requestId
    setSelectedTitle(content)
    setIsDetailsLoading(true)

    try {
      const details = await loadTitleDetails(content)

      if (detailsRequestId.current === requestId) {
        setSelectedTitle(details)
      }
    } finally {
      if (detailsRequestId.current === requestId) {
        setIsDetailsLoading(false)
      }
    }
  }

  return (
    <div className={styles.appShell}>
      <Header
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchQueryChange}
        currentUser={currentUser}
        onSignOut={onSignOut}
      />
      <HeroBanner spotlight={displayModel?.hero ?? browseModel.hero} onMoreInfo={handleOpenDetails} />

      <main className={styles.rowsArea}>
        {!hasTmdbApiKey ? (
          <p className={styles.apiNotice}>
            TMDB API key not detected. Create .env.local with VITE_TMDB_API_KEY to load live movie and TV data.
          </p>
        ) : null}
        {hasTmdbApiKey && browseModel?.dataSource === 'fallback' ? (
          <p className={styles.apiWarningNotice}>TMDB fallback: {browseModel?.dataReason ?? 'Unknown error.'}</p>
        ) : null}
        {searchQuery.trim() && !searchModel ? <p className={styles.searchStatus}>Searching TMDB...</p> : null}

        {/* AI Recommendations row — shown when logged in and AI has results */}
        {authToken && aiRecommendations.length > 0 ? (
          <MovieRow
            key="ai-recommendations"
            row={{
              key: 'ai-recommendations',
              title: '✦ Recommended for You',
              subtitle: 'Personalised by AI based on what you have liked',
              items: aiRecommendations.map((r, i) => ({
                id: `ai-${i}`,
                title: r.title,
                image: r.image || '',
                backdrop: r.backdrop || '',
                type: r.type ?? 'Movie',
                overview: r.reason,
                tags: [],
                rating: '',
                quality: 'AI',
              })),
            }}
            activeCardId={activeCardId}
            defaultCardId={defaultCardId}
            onActiveCardChange={setActiveCardId}
            onMoreInfo={handleOpenDetails}
            likedIds={likedIds}
            onToggleLike={handleToggleLike}
          />
        ) : null}

        {(displayModel?.rows ?? browseModel.rows).map((row) => (
          <MovieRow
            key={row.key}
            row={row}
            activeCardId={activeCardId}
            defaultCardId={defaultCardId}
            onActiveCardChange={setActiveCardId}
            onMoreInfo={handleOpenDetails}
            likedIds={likedIds}
            onToggleLike={handleToggleLike}
          />
        ))}
      </main>

      <Footer columns={footerColumns} />

      {selectedTitle ? (
        <div className={styles.detailsOverlay} role="presentation" onClick={handleCloseDetails}>
          <section
            className={styles.detailsModal}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedTitle.title} details`}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className={styles.detailsCloseButton} aria-label="Close details" onClick={handleCloseDetails}>
              <Icon name="close" className={styles.detailsCloseIcon} />
            </button>

            <img src={selectedTitle.backdrop ?? selectedTitle.image} alt={`${selectedTitle.title} backdrop`} className={styles.detailsBackdrop} />
            <div className={styles.detailsGradient}></div>

            <div className={styles.detailsContent}>
              <p className={styles.detailsEyebrow}>{selectedTitle.type ?? 'Title details'}</p>
              <h2>{selectedTitle.title}</h2>
              {selectedTitle.tagline ? <p className={styles.detailsTagline}>{selectedTitle.tagline}</p> : null}

              <div className={styles.detailsMetaRow}>
                {selectedTitle.year ? <span>{selectedTitle.year}</span> : null}
                {selectedTitle.voteLabel ? <span>{selectedTitle.voteLabel}</span> : null}
                {selectedTitle.languageLabel ? <span>{selectedTitle.languageLabel}</span> : null}
                {selectedTitle.runtime ? <span>{`${selectedTitle.runtime} min`}</span> : null}
                {selectedTitle.seasons ? <span>{`${selectedTitle.seasons} season${selectedTitle.seasons > 1 ? 's' : ''}`}</span> : null}
              </div>

              <p className={styles.detailsOverview}>
                {isDetailsLoading ? 'Loading TMDB metadata...' : selectedTitle.overview || 'Overview not available.'}
              </p>

              <div className={styles.detailsGrid}>
                <p><strong>Status:</strong> {formatDetailValue(selectedTitle.status)}</p>
                <p><strong>Release date:</strong> {formatDetailValue(selectedTitle.releaseDate)}</p>
                <p><strong>Genres:</strong> {formatDetailValue(selectedTitle.tags)}</p>
                <p><strong>Votes:</strong> {formatDetailValue(selectedTitle.voteCount ? `${selectedTitle.voteCount.toLocaleString()} votes` : '')}</p>
                <p><strong>Spoken languages:</strong> {formatDetailValue(selectedTitle.spokenLanguages)}</p>
                <p><strong>Production companies:</strong> {formatDetailValue(selectedTitle.productionCompanies)}</p>
                <p><strong>Production countries:</strong> {formatDetailValue(selectedTitle.productionCountries)}</p>
                <p><strong>Networks:</strong> {formatDetailValue(selectedTitle.networks)}</p>
                <p><strong>Episodes:</strong> {formatDetailValue(selectedTitle.episodes)}</p>
                <p><strong>Last air date:</strong> {formatDetailValue(selectedTitle.lastAirDate)}</p>
                <p><strong>Homepage:</strong> {selectedTitle.homepage ? <a href={selectedTitle.homepage} target="_blank" rel="noreferrer">Open official page</a> : 'Not available'}</p>
                <p><strong>IMDb ID:</strong> {formatDetailValue(selectedTitle.imdbId)}</p>
              </div>

              <CommentsSection
                movieId={selectedTitle.id}
                title={selectedTitle.title}
                mediaType={selectedTitle.mediaType}
                authToken={authToken}
                currentUser={currentUser}
              />
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}