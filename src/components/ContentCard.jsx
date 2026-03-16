import { useNavigate } from 'react-router-dom'

const CATEGORY_LABELS = {
  archives: 'Archives',
  ancient: 'Civilisations',
  social: 'Manipulation',
  tech: 'Technologies',
  consciousness: 'Conscience',
  symbols: 'Symbolisme',
}

const TYPE_LABELS = {
  dossier: 'Dossier',
  archive: 'Archive',
  theorie: 'Théorie',
  ressource: 'Ressource',
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ContentCard({ item }) {
  const navigate = useNavigate()

  return (
    <div
      className="content-card"
      onClick={() => navigate(`/topics/${item._id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="content-card__header">
        <div className="content-card__category-dot" />
        <div style={{ flex: 1 }}>
          <div className="content-card__title">{item.title}</div>
          <div className="content-card__excerpt">
            {item.description || item.excerpt || item.content?.slice(0, 160) || 'Aucune description disponible.'}
          </div>
        </div>
      </div>
      <div className="content-card__footer">
        {item.category && (
          <span className="content-card__tag">{CATEGORY_LABELS[item.category] || item.category}</span>
        )}
        {item.type && (
          <span className="content-card__tag">{TYPE_LABELS[item.type] || item.type}</span>
        )}
        {item.author?.username && (
          <span>Par {item.author.username}</span>
        )}
        {item.createdAt && (
          <span style={{ marginLeft: 'auto' }}>{formatDate(item.createdAt)}</span>
        )}
        {item.views != null && (
          <span>{item.views} vue{item.views !== 1 ? 's' : ''}</span>
        )}
      </div>
    </div>
  )
}
