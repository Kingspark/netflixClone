import NavBar from '../NavBar/NavBar'

export default function Header({ searchQuery = '', onSearchQueryChange = () => {}, onSignOut = () => {} }) {
  return <NavBar searchQuery={searchQuery} onSearchQueryChange={onSearchQueryChange} onSignOut={onSignOut} />
}