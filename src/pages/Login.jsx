import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login } from '../services/api'

export default function Login() {
  const { saveSession } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ username: '', password: '', remember: false })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.username || !form.password) { setError('Veuillez remplir tous les champs.'); return }
    setLoading(true)
    try {
      const res = await login({ username: form.username, password: form.password })
      saveSession(res.data.token, res.data.user, form.remember)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants incorrects.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">QVSLV</div>
          <div className="auth-subtitle">Connexion à votre espace</div>
        </div>

        <div className="auth-body">
          {error && <div className="alert alert--error">{error}</div>}
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Identifiant ou email</label>
              <div className="input-wrapper">
                <span className="input-icon">◉</span>
                <input
                  className="form-input"
                  type="text"
                  placeholder="votre_identifiant"
                  value={form.username}
                  onChange={(e) => set('username', e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <div className="input-wrapper">
                <span className="input-icon">◈</span>
                <input
                  className="form-input"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  autoComplete="current-password"
                  style={{ paddingRight: '2.5rem' }}
                />
                <button type="button" className="input-toggle" onClick={() => setShowPw((v) => !v)}>
                  {showPw ? '○' : '●'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <label className="checkbox-group" style={{ margin: 0 }}>
                <input type="checkbox" checked={form.remember} onChange={(e) => set('remember', e.target.checked)} />
                <div className="checkbox-custom" />
                <span>Rester connecté</span>
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--primary)', cursor: 'pointer' }}>
                Mot de passe oublié ?
              </span>
            </div>

            <button className="btn-submit" type="submit" disabled={loading}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>

        <div className="auth-footer">
          Pas encore membre ? <Link to="/register">Créer un compte</Link>
        </div>
      </div>
    </div>
  )
}
