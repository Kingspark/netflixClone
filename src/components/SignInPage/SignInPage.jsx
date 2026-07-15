import { useState } from 'react'
import Footer from '../Footer/Footer'
import logo from '../../assets/ImagesForInitialUse/image/logo.png'
import loginBackground from '../../assets/ImagesForInitialUse/image/login.jpg'
import { footerColumns } from '../../data/catalog'
import { authApi } from '../../services/apiService'
import styles from './SignInPage.module.css'

export default function SignInPage({ onBackHome, onBrowse, onAuthSuccess }) {
  const [mode, setMode] = useState('signin') // 'signin' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'register') {
        await authApi.register(email, password)
        // Show confirmation and switch to sign-in — don't auto-navigate
        setSuccess('Account created! Please sign in with your new credentials.')
        setMode('signin')
        setPassword('')
      } else {
        const { token, email: returnedEmail } = await authApi.login(email, password)
        if (onAuthSuccess) {
          onAuthSuccess(token, returnedEmail)
        } else {
          onBrowse()
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
          <h1>{mode === 'signin' ? 'Sign In' : 'Create Account'}</h1>
          <p>Sign in to your StreamVault account to continue watching.</p>

          {success ? <p className={styles.successMsg}>{success}</p> : null}
          {error ? <p className={styles.errorMsg}>{error}</p> : null}

          <form className={styles.signInForm} onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </label>

            <button type="submit" className={styles.signInButton} disabled={loading}>
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className={styles.cardFooter}>
            <p>
              {mode === 'signin' ? (
                <>New to StreamVault?{' '}
                  <button type="button" onClick={() => { setMode('register'); setError('') }}>Create an account</button>
                </>
              ) : (
                <>Already have an account?{' '}
                  <button type="button" onClick={() => { setMode('signin'); setError('') }}>Sign in</button>
                </>
              )}
            </p>
            <small>This is a learning project — no real payment is required.</small>
          </div>
        </section>
      </main>

      <Footer columns={footerColumns} />
    </div>
  )
}