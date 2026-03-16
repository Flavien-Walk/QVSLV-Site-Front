import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { register } from '../services/api'

const SPECIALIZATIONS = [
  { value: 'archives', label: 'Archiviste / Documentation' },
  { value: 'ancient', label: 'Civilisations Anciennes' },
  { value: 'social', label: 'Sciences Sociales' },
  { value: 'tech', label: 'Technologie & Innovation' },
  { value: 'consciousness', label: 'Physique & Conscience' },
  { value: 'symbols', label: 'Sémiologie & Symbolisme' },
  { value: 'crypto', label: 'Cryptologie & Codes' },
  { value: 'research', label: 'Recherche Générale' },
]

function getStrength(pw) {
  if (!pw) return { level: 0, label: '', cls: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const map = [
    { label: 'Faible', cls: 'strength-fill--weak' },
    { label: 'Moyen', cls: 'strength-fill--fair' },
    { label: 'Bon', cls: 'strength-fill--good' },
    { label: 'Fort', cls: 'strength-fill--strong' },
  ]
  return { level: score, ...map[Math.max(0, score - 1)] }
}

export default function Register() {
  const { saveSession } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '', lastName: '', username: '', email: '',
    password: '', confirmPassword: '', specialization: '', motivation: '',
    terms: false,
  })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const strength = getStrength(form.password)
  const pwMatch = form.confirmPassword && form.password === form.confirmPassword

  const generateUsername = () => {
    const adjectives = ['SIGMA', 'DELTA', 'OMEGA', 'NEXUS', 'CIPHER', 'VECTOR', 'AXIOM']
    const nouns = ['SEEKER', 'ANALYST', 'WATCHER', 'ARCHIVIST', 'PROBE', 'NODE']
    const num = Math.floor(Math.random() * 900 + 100)
    set('username', `${adjectives[Math.floor(Math.random() * adjectives.length)]}_${nouns[Math.floor(Math.random() * nouns.length)]}_${num}`)
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.terms) { setError('Vous devez accepter les conditions d\'utilisation.'); return }
    if (form.password !== form.confirmPassword) { setError('Les mots de passe ne correspondent pas.'); return }
    if (form.password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return }
    if (!form.specialization) { setError('Veuillez choisir une spécialisation.'); return }

    setLoading(true)
    try {
      const res = await register({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email,
        password: form.password,
        specialization: form.specialization,
        motivation: form.motivation,
      })
      saveSession(res.data.token, res.data.user, false)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du compte.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container auth-container--wide">
        <div className="auth-header">
          <div className="auth-logo">QVSLV</div>
          <div className="auth-subtitle">Créer votre compte</div>
        </div>

        <div className="auth-body">
          <div className="register-steps">
            <div className="step step--active">
              <div className="step__circle">1</div>
              <div className="step__label">Inscription</div>
            </div>
            <div className="step-line" />
            <div className="step">
              <div className="step__circle">2</div>
              <div className="step__label">Vérification</div>
            </div>
            <div className="step-line" />
            <div className="step">
              <div className="step__circle">3</div>
              <div className="step__label">Accès accordé</div>
            </div>
          </div>

          {error && <div className="alert alert--error">{error}</div>}

          <form onSubmit={submit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Prénom</label>
                <input className="form-input form-input--no-icon" type="text" placeholder="Jean" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Nom</label>
                <input className="form-input form-input--no-icon" type="text" placeholder="Dupont" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Identifiant</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input className="form-input form-input--no-icon" style={{ flex: 1 }} type="text" placeholder="votre_identifiant" value={form.username} onChange={(e) => set('username', e.target.value)} required minLength={3} />
                <button type="button" onClick={generateUsername} style={{ background: 'var(--primary-dim)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0 0.85rem', color: 'var(--primary)', fontSize: '0.65rem', fontFamily: 'var(--font-heading)', letterSpacing: '0.08em', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                  Générer
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input form-input--no-icon" type="email" placeholder="contact@exemple.com" value={form.email} onChange={(e) => set('email', e.target.value)} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Mot de passe</label>
                <div className="input-wrapper">
                  <input className="form-input form-input--no-icon" type={showPw ? 'text' : 'password'} placeholder="Min. 6 caractères" value={form.password} onChange={(e) => set('password', e.target.value)} required style={{ paddingRight: '2.2rem' }} />
                  <button type="button" className="input-toggle" onClick={() => setShowPw((v) => !v)}>{showPw ? '○' : '●'}</button>
                </div>
                {form.password && (
                  <div className="password-strength">
                    <div className="strength-bar"><div className={`strength-fill ${strength.cls}`} /></div>
                    <span className="strength-label">{strength.label}</span>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Confirmer le mot de passe</label>
                <input
                  className={`form-input form-input--no-icon${form.confirmPassword ? (pwMatch ? ' form-input--success' : ' form-input--error') : ''}`}
                  type={showPw ? 'text' : 'password'} placeholder="Répéter le mot de passe"
                  value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Spécialisation</label>
              <select className="form-input form-input--no-icon" value={form.specialization} onChange={(e) => set('specialization', e.target.value)} required>
                <option value="">— Choisir une spécialisation —</option>
                {SPECIALIZATIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Motivation <span style={{ color: 'var(--text-muted)', textTransform: 'none', fontSize: '0.65rem' }}>(optionnel)</span></label>
              <textarea className="form-input form-input--no-icon" placeholder="Pourquoi rejoindre QVSLV ?" value={form.motivation} onChange={(e) => set('motivation', e.target.value)} rows={3} />
            </div>

            <label className="checkbox-group">
              <input type="checkbox" checked={form.terms} onChange={(e) => set('terms', e.target.checked)} />
              <div className="checkbox-custom" />
              <span>J'accepte les <a href="#" style={{ color: 'var(--primary)' }}>conditions d'utilisation</a> et la politique de confidentialité</span>
            </label>

            <button className="btn-submit" type="submit" disabled={loading}>
              {loading ? 'Création du compte…' : 'Créer mon compte'}
            </button>
          </form>
        </div>

        <div className="auth-footer">
          Déjà membre ? <Link to="/login">Se connecter</Link>
        </div>
      </div>
    </div>
  )
}
