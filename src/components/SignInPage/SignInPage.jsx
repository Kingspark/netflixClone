import Footer from '../Footer/Footer'
import logo from '../../assets/ImagesForInitialUse/image/logo.png'
import loginBackground from '../../assets/ImagesForInitialUse/image/login.jpg'
import { footerColumns } from '../../data/catalog'
import styles from './SignInPage.module.css'

export default function SignInPage({ onBackHome, onBrowse }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    onBrowse()
  }

  return (
    <div className={styles.page}>
      <img src={loginBackground} alt="" className={styles.backgroundImage} />
      <div className={styles.overlay}></div>

      <header className={styles.topBar}>
        <button type="button" className={styles.brandLink} onClick={onBackHome} aria-label="StreamVault home">
          <img src={logo} alt="StreamVault" className={styles.brandLogo} />
        </button>

        <div className={styles.topBarActions}>
          <button type="button" className={styles.linkButton} onClick={onBrowse}>
            Browse
          </button>
          <button type="button" className={styles.linkButton} onClick={onBackHome}>
            Home
          </button>
        </div>
      </header>

      <main className={styles.contentShell}>
        <section className={styles.signInCard}>
          <h1>Sign In</h1>
          <p>Sign in to your StreamVault account to continue watching.</p>

          <form className={styles.signInForm} onSubmit={handleSubmit}>
            <label>
              Email or phone number
              <input type="text" placeholder="Email or phone number" required />
            </label>
            <label>
              Password
              <input type="password" placeholder="Password" required />
            </label>

            <button type="submit" className={styles.signInButton}>
              Sign In
            </button>

            <div className={styles.formMeta}>
              <label className={styles.checkboxRow}>
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#">Need help?</a>
            </div>
          </form>

          <div className={styles.cardFooter}>
            <p>
              New to StreamVault? <button type="button" onClick={onBackHome}>Go back to home</button>
            </p>
            <small>
              This is a learning project — no real account or payment is required.
            </small>
          </div>
        </section>
      </main>

      <Footer columns={footerColumns} />
    </div>
  )
}