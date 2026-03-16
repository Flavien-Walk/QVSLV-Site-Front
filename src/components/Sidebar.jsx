import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="sidebar">
      {user ? (
        <div className="sidebar-block">
          <div className="sidebar-block__header">
            <span className="sidebar-block__title">Mon profil</span>
          </div>
          <div className="sidebar-user">
            <div className="sidebar-user__avatar">
              {(user.firstName[0] + user.lastName[0]).toUpperCase()}
            </div>
            <div className="sidebar-user__name">{user.username}</div>
            <div className="sidebar-user__level">{user.accessLevel}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {user.specialization}
            </div>
          </div>
        </div>
      ) : (
        <div className="sidebar-block">
          <div className="sidebar-block__header">
            <span className="sidebar-block__title">Accès membre</span>
          </div>
          <div className="sidebar-block__body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Rejoignez la communauté pour contribuer, commenter et accéder aux contenus membres.
            </p>
            <Link to="/register" className="btn-primary" style={{ display: 'block', textAlign: 'center', padding: '0.6rem' }}>
              Rejoindre
            </Link>
            <Link to="/login" style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Déjà membre ? Connexion
            </Link>
          </div>
        </div>
      )}

      <div className="sidebar-block">
        <div className="sidebar-block__header">
          <span className="sidebar-block__title">Système</span>
        </div>
        <div className="sidebar-block__body">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-item__value">6</span>
              <span className="stat-item__label">Catégories</span>
            </div>
            <div className="stat-item">
              <span className="stat-item__value">24/7</span>
              <span className="stat-item__label">En ligne</span>
            </div>
            <div className="stat-item">
              <span className="stat-item__value">🔓</span>
              <span className="stat-item__label">Ouvert</span>
            </div>
            <div className="stat-item">
              <span className="stat-item__value">FR</span>
              <span className="stat-item__label">Langue</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
