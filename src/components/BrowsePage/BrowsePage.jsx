import { useEffect, useRef, useState } from 'react'
import Header from '../Header/Header'
import HeroBanner from '../HeroBanner/HeroBanner'
import MovieRow from '../MovieRow/MovieRow'
import Footer from '../Footer/Footer'
import { defaultCardId, footerColumns } from '../../data/catalog'
import { buildLocalBrowseModel } from '../../data/catalog'
import { loadBrowseModel, loadTitleDetails, searchBrowseModel } from '../../services/movieService'
import styles from '../../App.module.css'

function formatDetailValue(value, fallback = 'Not available') {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : fallback
  }

  return value || fallback
}

export default function BrowsePage() {
  const hasTmdbApiKey = Boolean(import.meta.env.VITE_TMDB_API_KEY)

  // Tracks which card the user is hovering over across all rows.
  // defaultCardId acts as a "nothing selected" sentinel so no card starts expanded.
  const [activeCardId, setActiveCardId] = useState(defaultCardId)

  // Seed the UI with local static data immediately so the page renders
  // without waiting for the network. The live fetch below replaces this.
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

  const handleSearchQueryChange = (nextQuery) => {
    setSearchQuery(nextQuery)
    setSearchModel(null)
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
      <Header searchQuery={searchQuery} onSearchQueryChange={handleSearchQueryChange} />
      <HeroBanner spotlight={displayModel?.hero ?? browseModel.hero} onMoreInfo={handleOpenDetails} />

      {/* Render one horizontally-scrollable MovieRow per content category.
          activeCardId / onActiveCardChange are shared so only one card across
          all rows can be in the expanded hover state at a time. */}
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
        {(displayModel?.rows ?? browseModel.rows).map((row) => (
          <MovieRow
            key={row.key}
            row={row}
            activeCardId={activeCardId}
            defaultCardId={defaultCardId}
            onActiveCardChange={setActiveCardId}
            onMoreInfo={handleOpenDetails}
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
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}