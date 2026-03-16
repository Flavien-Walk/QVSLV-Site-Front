import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getContent } from '../services/api'
import ContentCard from '../components/ContentCard'
import Sidebar from '../components/Sidebar'

const CATEGORIES = [
  { key: 'all', label: 'Toutes' },
  { key: 'archives', label: 'Archives' },
  { key: 'ancient', label: 'Civilisations' },
  { key: 'social', label: 'Manipulation' },
  { key: 'tech', label: 'Technologies' },
  { key: 'consciousness', label: 'Conscience' },
  { key: 'symbols', label: 'Symbolisme' },
]

export default function ContentPage({ type, title, description, icon }) {
  const [searchParams, setSearchParams] = useSearchParams()

  // URL est la source de vérité — les états locaux en dérivent
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || 'all'

  const [inputValue, setInputValue] = useState(search)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Sync inputValue si l'URL change (navigation externe)
  useEffect(() => {
    setInputValue(searchParams.get('search') || '')
  }, [searchParams])

  // Charger les contenus à chaque changement de params URL
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    const params = { type }
    if (category !== 'all') params.category = category
    if (search.trim()) params.search = search.trim()

    getContent(params)
      .then((res) => {
        if (!cancelled) setItems(res.data.items || [])
      })
      .catch(() => {
        if (!cancelled) {
          setError('Impossible de charger les contenus. Vérifiez votre connexion.')
          setItems([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [type, category, search])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (inputValue.trim()) next.search = inputValue.trim()
    if (category !== 'all') next.category = category
    setSearchParams(next)
  }

  const handleCategoryChange = (key) => {
    const next = {}
    if (search.trim()) next.search = search
    if (key !== 'all') next.category = key
    setSearchParams(next)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header__breadcrumb">
          <Link to="/">Accueil</Link> › {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '1.5rem' }}>{icon}</span>
          <h1 className="page-header__title">{title}</h1>
        </div>
        <p className="page-header__desc">{description}</p>
      </div>

      <div className="main-grid">
        <div>
          <div className="toolbar" style={{ marginBottom: '1.25rem' }}>
            <form className="search-wrapper" onSubmit={handleSearchSubmit}>
              <span className="search-icon">⌕</span>
              <input
                className="search-input"
                placeholder={`Rechercher dans ${title.toLowerCase()}…`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </form>
          </div>

          <div className="toolbar-filters" style={{ marginBottom: '1.25rem' }}>
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                className={`filter-btn${category === c.key ? ' filter-btn--active' : ''}`}
                onClick={() => handleCategoryChange(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="state-loader">
              <div className="spinner" />
              <span>Chargement…</span>
            </div>
          ) : error ? (
            <div className="alert alert--error" style={{ margin: 0 }}>{error}</div>
          ) : items.length === 0 ? (
            <div className="state-empty">
              <div className="state-empty__icon">📂</div>
              <div className="state-empty__title">Aucun contenu</div>
              <div className="state-empty__desc">
                {search
                  ? `Aucun résultat pour « ${search} ». Essayez d'autres mots-clés.`
                  : 'Cette section est en cours de constitution. Revenez bientôt.'}
              </div>
            </div>
          ) : (
            <div className="content-list">
              {items.map((item) => (
                <ContentCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
        <Sidebar />
      </div>
    </div>
  )
}
