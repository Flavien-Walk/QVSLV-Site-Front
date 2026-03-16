import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/dossiers', label: 'Dossiers' },
  { to: '/archives', label: 'Archives' },
  { to: '/theories', label: 'Théories' },
  { to: '/ressources', label: 'Ressources' },
]

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const initials = user ? (user.firstName[0] + user.lastName[0]).toUpperCase() : ''

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="header">
      <Link to="/" className="header__logo">
        <img src="/assets/accueil/logo.png" alt="QVSLV" onError={(e) => { e.target.style.display = 'none' }} />
        <span className="header__logo-text">QVSLV</span>
      </Link>

      <nav className="header__nav">
        {NAV_LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="header__actions">
        {user ? (
          <div className="user-menu" ref={menuRef}>
            <button className="user-menu__trigger" onClick={() => setMenuOpen((o) => !o)}>
              <div className="user-menu__avatar">{initials}</div>
              <span className="user-menu__name">{user.username}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>{menuOpen ? '▲' : '▼'}</span>
            </button>
            {menuOpen && (
              <div className="user-menu__dropdown">
                <div style={{ padding: '0.65rem 1rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-heading)', letterSpacing: '0.06em' }}>
                    {user.accessLevel}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text)', marginTop: '0.15rem' }}>
                    {user.firstName} {user.lastName}
                  </div>
                </div>
                <button className="user-menu__item user-menu__item--danger" onClick={handleLogout}>
                  <span>⎋</span> Déconnexion
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="btn-outline">Connexion</Link>
            <Link to="/register" className="btn-primary">Rejoindre</Link>
          </>
        )}
      </div>
    </header>
  )
}
