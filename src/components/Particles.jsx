import { useEffect, useRef } from 'react'

export default function Particles() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const particles = []

    const create = () => {
      const el = document.createElement('div')
      el.className = 'particle'
      const rand = Math.random()
      const size = rand < 0.5 ? 3 : rand < 0.75 ? 2 : 4
      const x = Math.random() * 100
      const dur = rand < 0.5 ? (Math.random() * 4 + 8) : rand < 0.75 ? (Math.random() * 2 + 10) : (Math.random() * 2 + 6)
      const isSecondary = Math.random() > 0.5
      el.style.cssText = `
        left: ${x}%;
        top: -10px;
        width: ${size}px;
        height: ${size}px;
        background: ${isSecondary ? 'var(--secondary)' : 'var(--primary)'};
        box-shadow: 0 0 8px ${isSecondary ? 'var(--secondary)' : 'var(--primary)'};
        animation-duration: ${dur}s;
        animation-delay: ${Math.random() * 5}s;
      `
      container.appendChild(el)
      particles.push(el)
      setTimeout(() => {
        el.remove()
        particles.splice(particles.indexOf(el), 1)
      }, (dur + 5) * 1000)
    }

    // Initial batch
    for (let i = 0; i < 50; i++) create()
    const interval = setInterval(create, 600)
    return () => {
      clearInterval(interval)
      particles.forEach((p) => p.remove())
    }
  }, [])

  return <div ref={containerRef} className="particles-container" aria-hidden="true" />
}
