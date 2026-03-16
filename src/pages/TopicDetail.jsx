import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getTopicById, deleteTopic } from '../services/api'

const CATEGORY_LABELS = {
  archives:      'Archives Historiques',
  ancient:       'Civilisations Anciennes',
  social:        'Manipulation Sociale',
  tech:          'Technologies Oubliées',
  consciousness: 'Physique & Conscience',
  symbols:       'Symbolisme',
}

const TYPE_LABELS = {
  dossier:  'Dossier',
  archive:  'Archive',
  theorie:  'Théorie',
  ressource: 'Ressource',
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function TopicDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [topic, setTopic] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    getTopicById(id)
      .then((res) => setTopic(res.data.topic))
      .catch(() => setError('Topic introuvable ou inaccessible.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Supprimer ce topic définitivement ?')) return
    try {
      await deleteTopic(id)
      navigate('/')
    } catch {
      alert('Erreur lors de la suppression.')
    }
  }

  if (loading) return (
    <div className="page-container">
      <div className="state-loader"><div className="spinner" /><span>Chargement…</span></div>
    </div>
  )

  if (error || !topic) return (
    <div className="page-container">
      <div className="alert alert--error">{error || 'Topic introuvable.'}</div>
      <Link to="/" style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>← Retour à l'accueil</Link>
    </div>
  )

  const isOwner = user && topic.author?._id === user._id
  const isAdmin = user?.accessLevel === 'ADMIN'
  const canModify = isOwner || isAdmin

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="page-header__breadcrumb" style={{ marginBottom: '1.5rem' }}>
        <Link to="/">Accueil</Link>
        {' › '}
        <Link to={`/${topic.type}s`}>{TYPE_LABELS[topic.type] || 'Topics'}</Link>
        {' › '}
        {topic.title}
      </div>

      <div className="topic-detail">

        {/* En-tête du topic */}
        <div className="topic-detail__header">
          <div className="topic-detail__meta-top">
            <span className="content-card__tag">{TYPE_LABELS[topic.type]}</span>
            <span className="content-card__tag" style={{ background: 'var(--secondary-dim)', color: 'var(--secondary)', borderColor: 'rgba(0,255,213,0.25)' }}>
              {CATEGORY_LABELS[topic.category] || topic.category}
            </span>
            {topic.isPinned && <span className="content-card__tag" style={{ background: 'rgba(255,215,0,0.1)', color: '#ffd700', borderColor: 'rgba(255,215,0,0.3)' }}>📌 Épinglé</span>}
          </div>
          <h1 className="topic-detail__title">{topic.title}</h1>
          <div className="topic-detail__author-line">
            <span>Par <strong style={{ color: 'var(--primary)' }}>{topic.author?.username || 'Inconnu'}</strong></span>
            <span style={{ color: 'var(--text-muted)' }}>·</span>
            <span>{formatDate(topic.createdAt)}</span>
            <span style={{ color: 'var(--text-muted)' }}>·</span>
            <span>{topic.views} vue{topic.views !== 1 ? 's' : ''}</span>
            {topic.tags?.length > 0 && (
              <>
                <span style={{ color: 'var(--text-muted)' }}>·</span>
                <div className="topic-detail__tags">
                  {topic.tags.map((tag) => (
                    <span key={tag} className="topic-detail__tag">#{tag}</span>
                  ))}
                </div>
              </>
            )}
          </div>
          {canModify && (
            <div className="topic-detail__actions">
              <Link to={`/topics/${id}/edit`} className="btn-outline" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}>
                Modifier
              </Link>
              <button onClick={handleDelete} className="btn-outline" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', color: 'var(--error)', borderColor: 'rgba(255,68,102,0.35)' }}>
                Supprimer
              </button>
            </div>
          )}
        </div>

        {/* Contenu principal — visible par tous */}
        <div className="topic-detail__content">
          {topic.content.split('\n').map((line, i) => (
            line.trim() ? <p key={i}>{line}</p> : <br key={i} />
          ))}
        </div>

        {/* Section ressources membres */}
        {topic.isLocked && topic.hasRestrictedContent && (
          <div className="topic-detail__locked">
            <div className="topic-detail__locked-icon">🔒</div>
            <div className="topic-detail__locked-title">Contenu réservé aux membres</div>
            <p className="topic-detail__locked-desc">
              Ce topic contient des liens et ressources accessibles uniquement aux membres connectés.
            </p>
            <div className="topic-detail__locked-actions">
              <Link to="/login" className="btn-submit" style={{ width: 'auto', padding: '0.7rem 1.75rem', textDecoration: 'none' }}>
                Se connecter
              </Link>
              <Link to="/register" className="btn-outline" style={{ fontSize: '0.78rem' }}>
                Créer un compte
              </Link>
            </div>
          </div>
        )}

        {/* Liens — visibles membres seulement */}
        {!topic.isLocked && topic.links?.length > 0 && (
          <div className="topic-detail__resources">
            <h3 className="topic-detail__resources-title">
              🔗 Liens <span className="topic-form__members-badge">Membres</span>
            </h3>
            <div className="topic-detail__links-list">
              {topic.links.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="topic-detail__link">
                  <span className="topic-detail__link-label">{link.label || link.url}</span>
                  <span className="topic-detail__link-url">{link.url}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Ressources — visibles membres seulement */}
        {!topic.isLocked && topic.resources?.length > 0 && (
          <div className="topic-detail__resources">
            <h3 className="topic-detail__resources-title">
              📁 Ressources <span className="topic-form__members-badge">Membres</span>
            </h3>
            <div className="topic-detail__resource-list">
              {topic.resources.map((res, i) => (
                <div key={i} className="topic-detail__resource">
                  <a href={res.url} target="_blank" rel="noopener noreferrer" className="topic-detail__resource-label">
                    {res.label || res.url}
                  </a>
                  {res.description && (
                    <p className="topic-detail__resource-desc">{res.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
