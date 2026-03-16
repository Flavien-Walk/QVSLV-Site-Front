import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Shoutbox from '../components/Shoutbox'
import Sidebar from '../components/Sidebar'
import CategoryCard, { STATIC_CATEGORIES } from '../components/CategoryCard'

const FILTERS = [
  { key: 'all', label: 'Tout' },
  { key: 'dossier', label: 'Dossiers' },
  { key: 'archive', label: 'Archives' },
  { key: 'theorie', label: 'Théories' },
  { key: 'ressource', label: 'Ressources' },
]

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const handleSearch = (e) => {
    e.preventDefault()
    if (!search.trim()) return
    navigate(`/dossiers?search=${encodeURIComponent(search.trim())}`)
  }

  return (
    <div className="page-container">
      {user && (
        <div style={{
          background: 'var(--primary-dim)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontSize: '0.7rem', fontWeight: 700, color: 'var(--bg)', flexShrink: 0 }}>
            {(user.firstName[0] + user.lastName[0]).toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.06em' }}>
              Bienvenue, {user.username}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Niveau d'accès : {user.accessLevel} — {user.specialization}
            </div>
          </div>
        </div>
      )}

      <div className="toolbar">
        <form className="search-wrapper" onSubmit={handleSearch}>
          <span className="search-icon">⌕</span>
          <input
            className="search-input"
            placeholder="Rechercher un dossier, une archive, une théorie…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <div className="toolbar-filters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`filter-btn${filter === f.key ? ' filter-btn--active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="main-grid">
        <div>
          <Shoutbox />
          <div className="categories-grid">
            {STATIC_CATEGORIES.map((cat) => (
              <CategoryCard key={cat.key} category={cat} />
            ))}
          </div>
        </div>
        <Sidebar />
      </div>
    </div>
  )
}
