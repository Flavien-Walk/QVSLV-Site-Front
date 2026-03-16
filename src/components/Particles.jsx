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
      const size = Math.random() * 3 + 1
      const x = Math.random() * 100
      const dur = Math.random() * 12 + 8
      const drift = (Math.random() - 0.5) * 80
      el.style.cssText = `
        left: ${x}%;
        bottom: -10px;
        width: ${size}px;
        height: ${size}px;
        background: ${Math.random() > 0.5 ? 'rgba(194,100,255,0.6)' : 'rgba(0,255,213,0.4)'};
        animation-duration: ${dur}s;
        animation-delay: ${Math.random() * 5}s;
        --drift: ${drift}px;
      `
      container.appendChild(el)
      particles.push(el)
      setTimeout(() => {
        el.remove()
        particles.splice(particles.indexOf(el), 1)
      }, (dur + 5) * 1000)
    }

    // Initial batch
    for (let i = 0; i < 40; i++) create()
    const interval = setInterval(create, 800)
    return () => {
      clearInterval(interval)
      particles.forEach((p) => p.remove())
    }
  }, [])

  return <div ref={containerRef} className="particles-container" aria-hidden="true" />
}
