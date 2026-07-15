import { useState } from 'react'
import Icon from '../Icon/Icon'
import logo from '../../assets/ImagesForInitialUse/image/logo.png'
import styles from './NavBar.module.css'

const navItems = [
  'Home',
  'TV Shows',
  'Movies',
  'New & Popular',
  'My List',
  'Browse by Language',
]

export default function NavBar({ searchQuery = '', onSearchQueryChange = () => {}, onSignOut = () => {} }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const hasSearchValue = searchQuery.trim().length > 0

  return (
    <header className={styles.topNav}>
      <div className={styles.navLeft}>
        <a href="#" className={styles.brandLink} aria-label="StreamVault home">
          <img src={logo} alt="" className={styles.brandLogo} />
        </a>

        {/* Desktop inline nav — hidden on small screens */}
        <nav className={styles.mainNav} aria-label="Primary">
          {navItems.map((item) => (
            <a href="#" key={item}>
              {item}
            </a>
          ))}
        </nav>
      </div>

      <div className={styles.navRight}>
        <div className={`${styles.searchShell} ${searchOpen || hasSearchValue ? styles.searchOpen : ''}`}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Open search"
            onClick={() => setSearchOpen((current) => !current)}
          >
            <Icon name="search" className={styles.iconStroke} />
          </button>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Search"
            aria-label="Search"
          />
        </div>

        <button type="button" className={styles.iconButton} aria-label="Notifications">
          <span className={styles.notificationDot}></span>
          <Icon name="bell" className={styles.iconStroke} />
        </button>

        <div
          className={styles.profileShell}
          onMouseEnter={() => setAccountMenuOpen(true)}
          onMouseLeave={() => setAccountMenuOpen(false)}
        >
          <button
            type="button"
            className={styles.profileTrigger}
            aria-haspopup="menu"
            aria-expanded={accountMenuOpen}
            onClick={() => setAccountMenuOpen((current) => !current)}
          >
            <span className={styles.profileAvatar}>
              <Icon name="profile" className={styles.iconStroke} />
            </span>
            <span className={styles.profileChevron}>
              <Icon name="chevronDown" className={styles.iconStroke} />
            </span>
          </button>

          {accountMenuOpen ? (
            <div className={styles.profileMenu} role="menu">
              <div className={styles.profileMenuInner}>
                <a href="#" role="menuitem">Account</a>
                <a href="#" role="menuitem">Help Center</a>
                <div className={styles.menuDivider}></div>
                <a
                  href="#"
                  role="menuitem"
                  onClick={(event) => {
                    event.preventDefault()
                    setAccountMenuOpen(false)
                    onSignOut()
                  }}
                >
                  Sign out
                </a>
              </div>
            </div>
          ) : null}
        </div>

        {/* Hamburger — visible only on small screens */}
        <button
          type="button"
          className={styles.hamburgerButton}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} className={styles.iconStroke} />
        </button>
      </div>

      {/* Mobile slide-down nav */}
      {menuOpen ? (
        <nav className={styles.mobileMenu} aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a href="#" key={item} onClick={() => setMenuOpen(false)}>
              {item}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  )
}