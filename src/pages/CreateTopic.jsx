import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createTopic } from '../services/api'

const TYPES = [
  { value: 'dossier',  label: 'Dossier' },
  { value: 'archive',  label: 'Archive' },
  { value: 'theorie',  label: 'Théorie' },
  { value: 'ressource', label: 'Ressource' },
]

const CATEGORIES = [
  { value: 'archives',     label: 'Archives Historiques' },
  { value: 'ancient',      label: 'Civilisations Anciennes' },
  { value: 'social',       label: 'Manipulation Sociale' },
  { value: 'tech',         label: 'Technologies Oubliées' },
  { value: 'consciousness', label: 'Physique & Conscience' },
  { value: 'symbols',      label: 'Symbolisme' },
]

const emptyLink = () => ({ label: '', url: '' })
const emptyResource = () => ({ label: '', url: '', description: '' })

export default function CreateTopic() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    content: '',
    type: 'dossier',
    category: 'archives',
    tags: '',
  })
  const [links, setLinks] = useState([])
  const [resources, setResources] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Visiteur non connecté — afficher une invitation à se connecter
  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <div className="auth-logo">Créer un topic</div>
            <p className="auth-subtitle">Vous devez être membre pour publier un topic.</p>
          </div>
          <div className="auth-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Les membres connectés peuvent créer des topics, partager des liens et des ressources
              avec la communauté.
            </p>
            <Link to="/login" className="btn-submit" style={{ display: 'block', textDecoration: 'none', marginBottom: '0.75rem' }}>
              Se connecter
            </Link>
            <Link to="/register" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Pas encore membre ? Rejoindre
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  // Gestion liens
  const addLink = () => setLinks((l) => [...l, emptyLink()])
  const removeLink = (i) => setLinks((l) => l.filter((_, idx) => idx !== i))
  const setLink = (i, field, value) =>
    setLinks((l) => l.map((item, idx) => idx === i ? { ...item, [field]: value } : item))

  // Gestion ressources
  const addResource = () => setResources((r) => [...r, emptyResource()])
  const removeResource = (i) => setResources((r) => r.filter((_, idx) => idx !== i))
  const setResource = (i, field, value) =>
    setResources((r) => r.map((item, idx) => idx === i ? { ...item, [field]: value } : item))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.content.trim()) {
      setError('Le titre et le contenu sont obligatoires.')
      return
    }
    setLoading(true)
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        links: links.filter((l) => l.url.trim()),
        resources: resources.filter((r) => r.url.trim()),
      }
      const res = await createTopic(payload)
      navigate(`/topics/${res.data.topic._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header__breadcrumb">
          <Link to="/">Accueil</Link> › Créer un topic
        </div>
        <h1 className="page-header__title">Nouveau topic</h1>
        <p className="page-header__desc">
          Publiez un dossier, une archive, une théorie ou une ressource. Les liens et ressources
          que vous ajoutez sont réservés aux membres connectés.
        </p>
      </div>

      <form className="topic-form" onSubmit={handleSubmit}>

        {error && <div className="alert alert--error">{error}</div>}

        {/* Section / Catégorie */}
        <div className="topic-form__section">
          <h3 className="topic-form__section-title">Destination</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type de publication</label>
              <select className="form-input form-input--no-icon" value={form.type} onChange={(e) => set('type', e.target.value)}>
                {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Catégorie</label>
              <select className="form-input form-input--no-icon" value={form.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="topic-form__section">
          <h3 className="topic-form__section-title">Contenu public</h3>
          <p className="topic-form__section-desc">Visible par tous, même les visiteurs non connectés.</p>
          <div className="form-group">
            <label className="form-label">Titre</label>
            <div className="input-wrapper">
              <span className="input-icon">✦</span>
              <input
                className="form-input"
                placeholder="Titre du topic…"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                maxLength={200}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Contenu / Présentation</label>
            <textarea
              className="form-input"
              placeholder="Décrivez votre topic, son contexte, ce qu'il apporte…"
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              maxLength={10000}
              style={{ minHeight: 160 }}
            />
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.3rem', textAlign: 'right' }}>
              {form.content.length} / 10 000
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Tags (séparés par des virgules)</label>
            <div className="input-wrapper">
              <span className="input-icon">#</span>
              <input
                className="form-input"
                placeholder="ex : ufos, 1947, roswell"
                value={form.tags}
                onChange={(e) => set('tags', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Liens — réservés membres */}
        <div className="topic-form__section topic-form__section--members">
          <div className="topic-form__section-header">
            <h3 className="topic-form__section-title">Liens <span className="topic-form__members-badge">Membres</span></h3>
            <p className="topic-form__section-desc">Accessibles uniquement aux membres connectés.</p>
          </div>
          {links.map((link, i) => (
            <div key={i} className="topic-form__row-group">
              <div className="form-row">
                <input className="form-input form-input--no-icon" placeholder="Libellé" value={link.label}
                  onChange={(e) => setLink(i, 'label', e.target.value)} maxLength={100} />
                <input className="form-input form-input--no-icon" placeholder="https://…" value={link.url}
                  onChange={(e) => setLink(i, 'url', e.target.value)} maxLength={500} />
              </div>
              <button type="button" className="topic-form__remove-btn" onClick={() => removeLink(i)}>✕ Supprimer</button>
            </div>
          ))}
          <button type="button" className="topic-form__add-btn" onClick={addLink}>+ Ajouter un lien</button>
        </div>

        {/* Ressources — réservées membres */}
        <div className="topic-form__section topic-form__section--members">
          <div className="topic-form__section-header">
            <h3 className="topic-form__section-title">Ressources <span className="topic-form__members-badge">Membres</span></h3>
            <p className="topic-form__section-desc">Documents, sources, références — réservés aux membres connectés.</p>
          </div>
          {resources.map((res, i) => (
            <div key={i} className="topic-form__row-group">
              <div className="form-row">
                <input className="form-input form-input--no-icon" placeholder="Libellé" value={res.label}
                  onChange={(e) => setResource(i, 'label', e.target.value)} maxLength={150} />
                <input className="form-input form-input--no-icon" placeholder="https://…" value={res.url}
                  onChange={(e) => setResource(i, 'url', e.target.value)} maxLength={500} />
              </div>
              <input className="form-input form-input--no-icon" placeholder="Description (optionnel)" value={res.description}
                onChange={(e) => setResource(i, 'description', e.target.value)} maxLength={300}
                style={{ marginTop: '0.5rem' }} />
              <button type="button" className="topic-form__remove-btn" onClick={() => removeResource(i)}>✕ Supprimer</button>
            </div>
          ))}
          <button type="button" className="topic-form__add-btn" onClick={addResource}>+ Ajouter une ressource</button>
        </div>

        {/* Fichiers PDF — placeholder */}
        <div className="topic-form__section topic-form__section--members topic-form__section--coming">
          <h3 className="topic-form__section-title">Fichiers PDF <span className="topic-form__members-badge">Membres</span></h3>
          <p className="topic-form__section-desc" style={{ color: 'var(--text-muted)' }}>
            L'ajout de fichiers PDF sera disponible prochainement.
          </p>
        </div>

        <div className="topic-form__actions">
          <button type="button" className="btn-outline" onClick={() => navigate(-1)}>Annuler</button>
          <button type="submit" className="btn-submit" disabled={loading} style={{ width: 'auto', padding: '0.8rem 2rem' }}>
            {loading ? 'Publication…' : 'Publier le topic'}
          </button>
        </div>
      </form>
    </div>
  )
}
