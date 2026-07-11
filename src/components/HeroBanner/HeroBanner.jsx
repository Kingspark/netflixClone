import bannerImage from '../../assets/ImagesForInitialUse/image/banner.jpeg'
import Icon from '../Icon/Icon'
import styles from './HeroBanner.module.css'

export default function HeroBanner({ spotlight, onMoreInfo = () => {} }) {
  const heroImage = spotlight?.backdrop ?? bannerImage
  const eyebrow = spotlight?.eyebrow ?? 'FEATURED'
  const title = spotlight?.title ?? 'Featured Title'
  const description =
    spotlight?.description ??
    'An acclaimed series that has captivated audiences worldwide with its compelling characters and stunning visuals.'
  const heroMeta = [spotlight?.badge, spotlight?.type, spotlight?.year, spotlight?.voteLabel]
    .filter(Boolean)
    .join('  •  ')

  return (
    <section className={styles.heroSection}>
      <img src={heroImage} alt={`${title} banner`} className={styles.heroBackdrop} />
      <div className={styles.heroOverlay}></div>

      <div className={styles.heroContent}>
        <p className={styles.heroKicker}>{eyebrow}</p>
        <h1>{title}</h1>
        {heroMeta ? <p className={styles.heroMeta}>{heroMeta}</p> : null}
        <p className={styles.description}>
          {description}
        </p>
        <div className={styles.heroActions}>
          <button type="button" className={`${styles.heroButton} ${styles.primaryButton}`}>
            <Icon name="play" className={styles.buttonIcon} />
            Play
          </button>
          <button
            type="button"
            className={`${styles.heroButton} ${styles.secondaryButton}`}
            onClick={() => onMoreInfo(spotlight)}
          >
            <Icon name="info" className={styles.buttonIcon} />
            More Info
          </button>
        </div>
      </div>
    </section>
  )
}