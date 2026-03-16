import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const STATS = [
  { value: '8 412', label: 'Documents' },
  { value: '1 247', label: 'Membres' },
  { value: '6', label: 'Catégories' },
  { value: '99', label: 'En ligne' },
]

const ACTIVITY = [
  { time: '2 min', action: 'Nouveau dossier ajouté dans Archives Historiques' },
  { time: '14 min', action: 'Discussion ouverte dans Symbolisme' },
  { time: '1 h', action: 'Mise à jour — Technologies Oubliées' },
  { time: '3 h', action: 'Nouveau membre vérifié' },
]

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
          <span className="sidebar-block__title">Statistiques</span>
        </div>
        <div className="sidebar-block__body">
          <div className="stats-grid">
            {STATS.map((s) => (
              <div key={s.label} className="stat-item">
                <div className="stat-item__value">{s.value}</div>
                <div className="stat-item__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sidebar-block">
        <div className="sidebar-block__header">
          <span className="sidebar-block__title">Activité récente</span>
        </div>
        <div className="sidebar-block__body">
          <div className="activity-list">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="activity-item">
                <span className="activity-item__time">{a.time}</span>
                <span>{a.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
