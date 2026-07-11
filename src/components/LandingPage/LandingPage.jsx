import { useState, useEffect } from 'react'
import { footerColumns } from '../../data/catalog'
import { movies } from '../../data/movies'
import { loadTrendingTitles } from '../../services/movieService'
import Footer from '../Footer/Footer'
import Icon from '../Icon/Icon'
import logo from '../../assets/ImagesForInitialUse/image/logo.png'
import loginBackground from '../../assets/ImagesForInitialUse/image/login.jpg'
import styles from './LandingPage.module.css'

const features = [
  {
    title: 'Watch on your TV',
    description: 'Compatible with Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.',
    accent: '01',
  },
  {
    title: 'Download for offline viewing',
    description: 'Save titles to your device and always have something to watch, even without internet.',
    accent: '02',
  },
  {
    title: 'Stream on any device',
    description: 'Watch on your phone, tablet, laptop, or TV — your content follows you everywhere.',
    accent: '03',
  },
  {
    title: 'Family-friendly profiles',
    description: 'Create separate profiles for everyone at home, including a dedicated kids experience.',
    accent: '04',
  },
]

const faqs = [
  {
    question: 'What is StreamVault?',
    answer:
      'StreamVault is a Netflix UI clone built with React as a front-end learning and portfolio project. It is not affiliated with or endorsed by Netflix, Inc.',
  },
  {
    question: 'Is this a real streaming service?',
    answer: 'No. StreamVault is a UI practice project. No real accounts, payments, or subscriptions exist.',
  },
  {
    question: 'Where does the content data come from?',
    answer: 'Movie and TV data is sourced from the TMDB API. This product uses the TMDB API but is not endorsed or certified by TMDB.',
  },
  {
    question: 'Can I use this project?',
    answer: 'Yes — it is an open learning demo. Feel free to study, fork, or adapt it for your own practice.',
  },
]

export default function LandingPage({ onSignIn, onBrowse }) {
  const [emailTop, setEmailTop] = useState('')
  const [emailBottom, setEmailBottom] = useState('')
  const [trendingMovies, setTrendingMovies] = useState(movies.slice(0, 10))

  useEffect(() => {
    let isMounted = true
    loadTrendingTitles().then((items) => {
      if (isMounted) setTrendingMovies(items)
    })
    return () => { isMounted = false }
  }, [])

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <a href="#" className={styles.brandLink} aria-label="StreamVault home">
          <img src={logo} alt="StreamVault" className={styles.brandLogo} />
        </a>

        <div className={styles.topBarActions}>
          <button type="button" className={styles.linkButton} onClick={onBrowse}>
            Browse
          </button>
          <button type="button" className={styles.signInButton} onClick={onSignIn}>
            Sign In
          </button>
        </div>
      </header>

      <section className={styles.heroSection}>
        <img src={loginBackground} alt="Hero background" className={styles.heroBackdrop} />
        <div className={styles.heroOverlay}></div>

        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Explore movies, TV shows, and more</p>
          <h1>Stream smart. Watch everywhere.</h1>
          <p className={styles.heroCopy}>
            Ready to explore? Enter your email to get started with StreamVault.
          </p>

          <form className={styles.emailForm} onSubmit={(event) => { event.preventDefault(); onSignIn() }}>
            <input type="email" placeholder="Email address" aria-label="Email address" value={emailTop} onChange={(event) => setEmailTop(event.target.value)} />
            <button type="submit" className={styles.getStartedButton}>
              Get Started
              <Icon name="chevronRight" className={styles.buttonIcon} />
            </button>
          </form>

          <button type="button" className={styles.secondaryCta} onClick={onBrowse}>
            Explore the catalog
          </button>
        </div>
      </section>

      <section className={styles.trendingSection}>
        <div className={styles.sectionHeading}>
          <h2>Trending Now</h2>
        </div>

        <div className={styles.posterStrip}>
          {trendingMovies.map((movie, index) => (
            <article className={styles.posterCard} key={movie.id}>
              <span className={styles.posterRank}>{index + 1}</span>
              <div className={styles.posterImageWrap}>
                <span className={styles.streamMark}>▶</span>
                <img src={movie.image ?? movie.poster_path} alt={movie.title} loading="lazy" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className={styles.sectionHeading}>
          <h2>More Reasons to Explore</h2>
        </div>

        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <article className={styles.featureCard} key={feature.title}>
              <span className={styles.featureAccent}>{feature.accent}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.sectionHeading}>
          <h2>Frequently Asked Questions</h2>
        </div>

        <div className={styles.faqList}>
          {faqs.map((faq) => (
            <details key={faq.question} className={styles.faqItem}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>

        <div className={styles.bottomCta}>
          <p>Ready to explore? Enter your email to get started.</p>
          <form className={styles.emailFormBottom} onSubmit={(event) => { event.preventDefault(); onSignIn() }}>
            <input type="email" placeholder="Email address" aria-label="Email address bottom" value={emailBottom} onChange={(event) => setEmailBottom(event.target.value)} />
            <button type="submit" className={styles.getStartedButton}>
              Get Started
              <Icon name="chevronRight" className={styles.buttonIcon} />
            </button>
          </form>
        </div>
      </section>

      <Footer columns={footerColumns} />
    </div>
  )
}