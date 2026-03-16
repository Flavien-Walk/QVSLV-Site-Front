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

  // Ferme le menu au clic extérieur
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  const initials = user ? (user.firstName[0] + user.lastName[0]).toUpperCase() : ''

  return (
    <header className="header">

      {/* Logo + branding */}
      <Link to="/" className="header__logo">
        <img
          src="/assets/accueil/logo.png"
          alt="QVSLV"
          onError={(e) => { e.target.style.display = 'none' }}
        />
        <div className="header__logo-brand">
          <span className="header__logo-text glitch" data-text="QVSLV">QVSLV</span>
          <span className="header__logo-tagline">Archives &amp; Documentation</span>
        </div>
      </Link>

      {/* Navigation centrale */}
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

      {/* Actions droite */}
      <div className="header__actions">
        {/* Niveau d'accès */}
        <div className="header__access-level">
          <span className="header__access-label">ACCÈS</span>
          <span className={`header__access-badge${user ? ' header__access-badge--member' : ''}`}>
            {user ? (user.accessLevel || 'VÉRIFIÉ') : 'ANONYME'}
          </span>
        </div>

        {user ? (
          <div className="user-menu" ref={menuRef}>
            <button
              className="user-menu__trigger"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
            >
              <div className="user-menu__avatar">{initials}</div>
              <span className="user-menu__name">{user.username}</span>
              <span className="user-menu__arrow">{menuOpen ? '▲' : '▼'}</span>
            </button>

            {menuOpen && (
              <div className="user-menu__dropdown">
                <div className="user-menu__info">
                  <div className="user-menu__info-level">{user.accessLevel}</div>
                  <div className="user-menu__info-name">{user.firstName} {user.lastName}</div>
                </div>
                <div className="user-menu__divider" />
                <button className="user-menu__item user-menu__item--danger" onClick={handleLogout}>
                  <span>⎋</span> Déconnexion
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="header__auth">
            <Link to="/login" className="btn-outline">Connexion</Link>
            <Link to="/register" className="btn-primary">Rejoindre</Link>
          </div>
        )}
      </div>
    </header>
  )
}
