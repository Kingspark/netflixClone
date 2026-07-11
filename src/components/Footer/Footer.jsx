import Icon from '../Icon/Icon'
import styles from './Footer.module.css'

export default function Footer({ columns }) {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.socialRow}>
        <a href="#" aria-label="Facebook">
          <Icon name="facebook" className={styles.socialIcon} />
        </a>
        <a href="#" aria-label="Instagram">
          <Icon name="instagram" className={styles.socialIcon} />
        </a>
        <a href="#" aria-label="Twitter">
          <Icon name="twitter" className={styles.socialIcon} />
        </a>
        <a href="#" aria-label="YouTube">
          <Icon name="youtube" className={styles.socialIcon} />
        </a>
      </div>

      <div className={styles.footerGrid}>
        {columns.map((column) => (
          <div key={column[0]} className={styles.footerColumn}>
            {column.map((item) => (
              <a href="#" key={item}>
                {item}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.legalBlock}>
        <p className={styles.legalPrimary}>
          StreamVault is a front-end learning project &mdash; not affiliated with or endorsed by Netflix, Inc.
          All Netflix trademarks and brand assets are the property of Netflix, Inc.
        </p>
        <p className={styles.legalSecondary}>
          Movie &amp; TV data provided by{' '}
          <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">TMDB</a>.
          {' '}This product uses the TMDB API but is not endorsed or certified by TMDB.
          {' '}&copy; {new Date().getFullYear()} StreamVault &mdash; Built for educational &amp; portfolio purposes only.
        </p>
      </div>
    </footer>
  )
}