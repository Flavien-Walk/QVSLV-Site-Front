import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMessages, postMessage } from '../services/api'

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export default function Shoutbox() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [apiError, setApiError] = useState(false)
  const bottomRef = useRef(null)

  const load = async () => {
    try {
      const res = await getMessages()
      setMessages(res.data.messages || [])
      setApiError(false)
    } catch {
      setApiError(true)
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (e) => {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    try {
      await postMessage(text.trim())
      setText('')
      await load()
    } catch {
      // silencieux
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="shoutbox">
      <div className="shoutbox__header">
        <span className="shoutbox__title">Terminal de Discussion</span>
        <div className="shoutbox__status">
          <div className="status-dot" style={{ background: apiError ? 'var(--error)' : 'var(--success)' }} />
          <span>{apiError ? 'Hors ligne' : 'En direct'}</span>
          {!apiError && messages.length > 0 && (
            <span className="shoutbox__count">{messages.length} message{messages.length > 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      <div className="shoutbox__messages">
        {apiError ? (
          <div className="shoutbox__empty" style={{ color: 'var(--text-muted)', fontStyle: 'normal', fontSize: '0.75rem' }}>
            Discussion temporairement indisponible.
          </div>
        ) : messages.length === 0 ? (
          <div className="shoutbox__empty">Aucun message pour l'instant. Soyez le premier à écrire.</div>
        ) : (
          messages.map((msg) => {
            const username = msg.user?.username || msg.username || '???'
            return (
              <div key={msg._id || msg.id} className="shoutbox__msg">
                <span className="shoutbox__msg-user">{username}</span>
                <span className="shoutbox__msg-time">{formatTime(msg.createdAt)}</span>
                <span className="shoutbox__msg-text">{msg.text}</span>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {user ? (
        <form className="shoutbox__input-area" onSubmit={send}>
          <input
            className="shoutbox__input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Votre message…"
            maxLength={300}
            disabled={apiError}
          />
          <button className="shoutbox__send" type="submit" disabled={sending || !text.trim() || apiError}>
            {sending ? '…' : 'Envoyer'}
          </button>
        </form>
      ) : (
        <div className="shoutbox__login-prompt">
          <Link to="/login">Connectez-vous</Link> pour participer à la discussion
        </div>
      )}
    </div>
  )
}
