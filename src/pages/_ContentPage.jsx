import { useState, useEffect, useCallback } from 'react'
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
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { type }
      if (category !== 'all') params.category = category
      if (search.trim()) params.search = search.trim()
      const res = await getContent(params)
      setItems(res.data.items || res.data.content || [])
    } catch {
      setError('Impossible de charger les contenus.')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [type, category, search])

  useEffect(() => { load() }, [load])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = {}
    if (search.trim()) params.search = search
    if (category !== 'all') params.category = category
    setSearchParams(params)
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
            <form className="search-wrapper" onSubmit={handleSearch}>
              <span className="search-icon">⌕</span>
              <input
                className="search-input"
                placeholder={`Rechercher dans ${title.toLowerCase()}…`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
          </div>

          <div className="toolbar-filters" style={{ marginBottom: '1.25rem' }}>
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                className={`filter-btn${category === c.key ? ' filter-btn--active' : ''}`}
                onClick={() => setCategory(c.key)}
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
