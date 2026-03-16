import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="sidebar">

      {/* --- Profil / Accès membre --- */}
      {user ? (
        <div className="sidebar-block">
          <div className="sidebar-block__header">
            <span className="sidebar-block__title">Profil</span>
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

      {/* --- Membres en ligne --- */}
      <div className="sidebar-block">
        <div className="sidebar-block__header">
          <span className="sidebar-block__title">Membres en ligne</span>
          <span className="sidebar-block__count">0 connecté</span>
        </div>
        <div className="sidebar-block__body">
          <div className="online-members">
            <div className="online-empty">
              Aucun membre connecté actuellement.
            </div>
          </div>
        </div>
      </div>

      {/* --- Métriques --- */}
      <div className="sidebar-block">
        <div className="sidebar-block__header">
          <span className="sidebar-block__title">Métriques du réseau</span>
        </div>
        <div className="sidebar-block__body">
          <div className="sidebar-metrics">
            <div className="sidebar-metric">
              <span className="sidebar-metric__label">Catégories</span>
              <span className="sidebar-metric__value">6</span>
            </div>
            <div className="sidebar-metric">
              <span className="sidebar-metric__label">Statut</span>
              <span className="sidebar-metric__value active">En ligne</span>
            </div>
            <div className="sidebar-metric">
              <span className="sidebar-metric__label">Accès</span>
              <span className="sidebar-metric__value active">Ouvert</span>
            </div>
            <div className="sidebar-metric">
              <span className="sidebar-metric__label">Langue</span>
              <span className="sidebar-metric__value">Français</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Activité récente --- */}
      <div className="sidebar-block">
        <div className="sidebar-block__header">
          <span className="sidebar-block__title">Activité récente</span>
        </div>
        <div className="sidebar-block__body">
          <div className="activity-feed">
            <div className="activity-empty">
              Aucune activité récente à afficher.
            </div>
          </div>
        </div>
      </div>

    </aside>
  )
}
