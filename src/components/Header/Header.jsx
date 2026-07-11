import NavBar from '../NavBar/NavBar'

export default function Header({ searchQuery = '', onSearchQueryChange = () => {} }) {
  return <NavBar searchQuery={searchQuery} onSearchQueryChange={onSearchQueryChange} />
}