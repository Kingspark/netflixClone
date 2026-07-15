import { useState } from 'react'
import BrowsePage from './components/BrowsePage/BrowsePage'
import LandingPage from './components/LandingPage/LandingPage'
import SignInPage from './components/SignInPage/SignInPage'
import { getStoredToken, getStoredEmail, saveToken, saveEmail, clearToken } from './services/apiService'

function App() {
  const [screen, setScreen] = useState('landing')
  const [authToken, setAuthToken] = useState(() => getStoredToken())
  const [currentUser, setCurrentUser] = useState(() => getStoredEmail())

  function handleAuthSuccess(token, email) {
    saveToken(token)
    saveEmail(email)
    setAuthToken(token)
    setCurrentUser(email)
    setScreen('browse')
  }

  function handleBrowse() {
    if (authToken) {
      setScreen('browse')
    } else {
      setScreen('signin')
    }
  }

  function handleSignOut() {
    clearToken()
    setAuthToken(null)
    setCurrentUser(null)
    setScreen('landing')
  }

  if (screen === 'browse') {
    return (
      <BrowsePage
        authToken={authToken}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />
    )
  }

  if (screen === 'signin') {
    return (
      <SignInPage
        onBackHome={() => setScreen('landing')}
        onBrowse={handleBrowse}
        onAuthSuccess={handleAuthSuccess}
      />
    )
  }

  return (
    <LandingPage
      onSignIn={() => setScreen('signin')}
      onBrowse={handleBrowse}
    />
  )
}

export default App
