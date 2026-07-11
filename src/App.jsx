import { useState } from 'react'
import BrowsePage from './components/BrowsePage/BrowsePage'
import LandingPage from './components/LandingPage/LandingPage'
import SignInPage from './components/SignInPage/SignInPage'

function App() {
  const [screen, setScreen] = useState('landing')

  if (screen === 'browse') {
    return <BrowsePage />
  }

  if (screen === 'signin') {
    return <SignInPage onBackHome={() => setScreen('landing')} onBrowse={() => setScreen('browse')} />
  }

  return (
    <LandingPage
      onSignIn={() => setScreen('signin')}
      onBrowse={() => setScreen('browse')}
    />
  )
}

export default App
