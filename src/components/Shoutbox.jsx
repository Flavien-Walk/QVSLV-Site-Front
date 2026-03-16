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
  const bottomRef = useRef(null)

  const load = async () => {
    try {
      const res = await getMessages()
      setMessages(res.data.messages || [])
    } catch {
      // silently fail - backend may not be live yet
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
      // noop
    } finally {
      setSending(false)
    }
  }

  const initials = (username) => username?.slice(0, 2).toUpperCase() || '??'

  return (
    <div className="shoutbox">
      <div className="shoutbox__header">
        <span className="shoutbox__title">Discussion</span>
        <div className="shoutbox__status">
          <div className="status-dot" />
          <span>En direct</span>
        </div>
      </div>

      <div className="shoutbox__messages">
        {messages.length === 0 ? (
          <div className="shoutbox__empty">Aucun message pour l'instant. Soyez le premier.</div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id || msg.id} className="shoutbox__msg">
              <div className="shoutbox__msg-avatar">{initials(msg.user?.username || msg.username)}</div>
              <div className="shoutbox__msg-body">
                <div className="shoutbox__msg-header">
                  <span className="shoutbox__msg-user">{msg.user?.username || msg.username}</span>
                  <span className="shoutbox__msg-time">{formatTime(msg.createdAt)}</span>
                </div>
                <div className="shoutbox__msg-text">{msg.text}</div>
              </div>
            </div>
          ))
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
          />
          <button className="shoutbox__send" type="submit" disabled={sending || !text.trim()}>
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
