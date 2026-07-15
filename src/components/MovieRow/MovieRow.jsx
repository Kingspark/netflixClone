import { useRef } from 'react'
import Icon from '../Icon/Icon'
import styles from './MovieRow.module.css'

export default function MovieRow({ row, activeCardId, defaultCardId, onActiveCardChange, onMoreInfo = () => {}, likedIds = new Set(), onToggleLike = () => {} }) {
  const rowRef = useRef(null)
  const offsetRef = useRef(0)

  const handleScroll = (direction) => {
    if (!rowRef.current) {
      return
    }

    const strip = rowRef.current
    const shell = strip.parentElement
    const lastCard = strip.lastElementChild

    // Measure real content width: right edge of last card + right padding
    const rightPadding = parseFloat(getComputedStyle(strip).paddingRight) || 48
    const totalContentWidth = lastCard
      ? lastCard.offsetLeft + lastCard.offsetWidth + rightPadding
      : strip.offsetWidth

    const visibleWidth = shell ? shell.offsetWidth : strip.offsetWidth
    const maxOffset = Math.max(0, totalContentWidth - visibleWidth)

    offsetRef.current = Math.max(0, Math.min(offsetRef.current + direction * 520, maxOffset))
    strip.style.transform = `translateX(-${offsetRef.current}px)`
  }

  return (
    <section className={styles.movieRow}>
      <h2>{row.title}</h2>
      {row.subtitle ? <p className={styles.rowSubtitle}>{row.subtitle}</p> : null}
      <div className={styles.rowShell}>
        <button
          type="button"
          className={`${styles.rowArrow} ${styles.leftArrow}`}
          aria-label={`Scroll ${row.title} left`}
          onClick={() => handleScroll(-1)}
        >
          <Icon name="chevronLeft" className={styles.rowArrowIcon} />
        </button>

        <div className={styles.movieStrip} role="list" ref={rowRef}>
          {row.items.map((movie, index) => {
            const cardId = `${row.key}-${movie.id}-${index}`
            const isExpanded = activeCardId === cardId

            return (
              <div
                className={`${styles.cardSlot} ${isExpanded ? styles.isExpanded : ''}`}
                key={cardId}
                role="listitem"
                onMouseEnter={() => onActiveCardChange(cardId)}
                onMouseLeave={() => onActiveCardChange(defaultCardId)}
                onFocus={() => onActiveCardChange(cardId)}
                onBlur={() => onActiveCardChange(defaultCardId)}
                tabIndex={0}
              >
                <article className={styles.movieCard}>
                  {movie.image ? (
                    <img src={movie.image} alt={movie.title} loading="lazy" />
                  ) : (
                    <div className={styles.imagePlaceholder} aria-hidden="true">
                      <span>{movie.title}</span>
                    </div>
                  )}
                  <div className={styles.expandedPanel}>
                    <strong className={styles.cardTitle}>{movie.title}</strong>

                    <div className={styles.cardActions}>
                      <button type="button" aria-label={`Play ${movie.title}`}>
                        <Icon name="play" className={styles.cardActionIcon} />
                      </button>
                      <button type="button" aria-label={`Add ${movie.title} to list`}>
                        <Icon name="plus" className={styles.cardActionIcon} />
                      </button>
                      <button
                        type="button"
                        aria-label={likedIds.has(String(movie.id)) ? `Unlike ${movie.title}` : `Like ${movie.title}`}
                        onClick={() => onToggleLike(movie)}
                        style={{
                          color: likedIds.has(String(movie.id)) ? '#e50914' : undefined,
                          borderColor: likedIds.has(String(movie.id)) ? '#e50914' : undefined,
                        }}
                      >
                        <Icon
                          name="heart"
                          className={styles.cardActionIcon}
                          filled={likedIds.has(String(movie.id))}
                        />
                      </button>
                      <button
                        type="button"
                        aria-label={`More details about ${movie.title}`}
                        className={styles.expandIcon}
                        onClick={() => onMoreInfo(movie)}
                      >
                        <Icon name="chevronDown" className={styles.cardActionIcon} />
                      </button>
                    </div>

                    <p className={styles.cardMeta}>
                      <span>{movie.rating}</span>
                      <span>{movie.type}</span>
                      {movie.year ? <span>{movie.year}</span> : null}
                      <span>{movie.quality ?? 'HD'}</span>
                      {movie.voteLabel ? <span>{movie.voteLabel}</span> : null}
                    </p>
                    <p className={styles.cardTags}>{(movie.tags ?? []).join('  •  ') || 'Drama'}</p>
                    {movie.overview ? <p className={styles.cardOverview}>{movie.overview}</p> : null}
                    <button type="button" className={styles.moreInfoButton} onClick={() => onMoreInfo(movie)}>
                      View full metadata
                    </button>
                  </div>
                </article>
              </div>
            )
          })}
        </div>

        <button
          type="button"
          className={`${styles.rowArrow} ${styles.rightArrow}`}
          aria-label={`Scroll ${row.title} right`}
          onClick={() => handleScroll(1)}
        >
          <Icon name="chevronRight" className={styles.rowArrowIcon} />
        </button>
      </div>
    </section>
  )
}