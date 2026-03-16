import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getContentCounts, getTopics } from '../services/api'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export default function Sidebar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [totalDocs, setTotalDocs] = useState(null)
  const [recentTopics, setRecentTopics] = useState([])

  useEffect(() => {
    getContentCounts()
      .then((res) => {
        const counts = res.data.counts || {}
        const total = Object.values(counts).reduce((a, b) => a + b, 0)
        setTotalDocs(total)
      })
      .catch(() => setTotalDocs(null))

    getTopics()
      .then((res) => {
        const items = res.data.topics || res.data.items || []
        setRecentTopics(items.slice(0, 5))
      })
      .catch(() => setRecentTopics([]))
  }, [])

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
              Rejoignez la communauté pour contribuer et accéder aux contenus membres.
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

      {/* --- Métriques --- */}
      <div className="sidebar-block">
        <div className="sidebar-block__header">
          <span className="sidebar-block__title">Métriques</span>
        </div>
        <div className="sidebar-block__body">
          <div className="sidebar-metrics">
            <div className="sidebar-metric">
              <span className="sidebar-metric__label">Documents</span>
              <span className="sidebar-metric__value">
                {totalDocs === null ? '…' : totalDocs.toLocaleString('fr-FR')}
              </span>
            </div>
            <div className="sidebar-metric">
              <span className="sidebar-metric__label">Catégories</span>
              <span className="sidebar-metric__value">6</span>
            </div>
            <div className="sidebar-metric">
              <span className="sidebar-metric__label">Langue</span>
              <span className="sidebar-metric__value">Français</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Publications récentes --- */}
      <div className="sidebar-block">
        <div className="sidebar-block__header">
          <span className="sidebar-block__title">Publications récentes</span>
          {recentTopics.length > 0 && (
            <span className="sidebar-block__count">{recentTopics.length}</span>
          )}
        </div>
        <div className="sidebar-block__body">
          {recentTopics.length === 0 ? (
            <div className="activity-empty">Aucune publication récente.</div>
          ) : (
            <div className="activity-feed">
              {recentTopics.map((topic) => (
                <div
                  key={topic._id}
                  className="activity-item"
                  onClick={() => navigate(`/topics/${topic._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="activity-item__text">{topic.title}</span>
                  <span className="activity-item__time">{formatDate(topic.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </aside>
  )
}
