import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const LETTERS = [
  { char: '', hasDot: true, hasBar: true },
  { char: 'm', hasDot: false, hasBar: false },
  { char: 'a', hasDot: false, hasBar: false },
  { char: 'n', hasDot: false, hasBar: false },
  { char: '', hasDot: false, hasBar: true },
]

export default function WelcomeAnimation({ onComplete }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [dotDetached, setDotDetached] = useState(false)
  const [dotActive, setDotActive] = useState(false)
  const [dotPos, setDotPos] = useState({ left: 0, top: 0 })
  const [hitLetter, setHitLetter] = useState(null)
  const [greeting, setGreeting] = useState('')
  const [greetingVisible, setGreetingVisible] = useState(false)
  const [subtitleVisible, setSubtitleVisible] = useState(false)
  const [fading, setFading] = useState(false)
  const [particles, setParticles] = useState([])
  const [impactParticles, setImpactParticles] = useState([])
  const containerRef = useRef(null)
  const lettersRef = useRef([])
  const navigate = useNavigate()

  useEffect(() => {
    const hour = new Date().getHours()
    let g
    if (hour >= 5 && hour < 12) g = 'Bonjour'
    else if (hour >= 12 && hour < 18) g = "Bonne après-midi"
    else g = 'Bonsoir'
    setGreeting(g + ', Admin !')

    const newParticles = []
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        size: Math.random() * 10 + 5,
        left: Math.random() * 100,
        bottom: Math.random() * 30,
        bg: `rgba(231, 84, 128, ${Math.random() * 0.2 + 0.1})`,
        dur: Math.random() * 8 + 6,
        delay: Math.random() * 3,
      })
    }
    setParticles(newParticles)
  }, [])

  useEffect(() => {
    if (visibleCount < LETTERS.length) {
      const timer = setTimeout(() => setVisibleCount(prev => prev + 1), 400 + visibleCount * 150)
      return () => clearTimeout(timer)
    } else {
      const detachTimer = setTimeout(() => {
        setDotDetached(true)
        setTimeout(() => startBounce(), 300)
      }, 400 + LETTERS.length * 150 + 300)
      return () => clearTimeout(detachTimer)
    }
  }, [visibleCount])

  const startBounce = () => {
    if (!containerRef.current) return
    const nameEl = containerRef.current.querySelector('.welcome-name')
    if (!nameEl) return
    const nameRect = nameEl.getBoundingClientRect()
    const firstLetter = lettersRef.current[0]
    const firstDotEl = firstLetter?.querySelector('.letter-dot')
    if (!firstLetter || !firstDotEl) return

    setDotPos({
      left: firstLetter.getBoundingClientRect().left - nameRect.left + firstLetter.getBoundingClientRect().width / 2 - 12,
      top: firstDotEl.offsetTop,
    })
    setDotActive(true)

    const targets = [
      { index: 1 },
      { index: 2 },
      { index: 3 },
      { index: 4 },
    ]

    let step = 0
    const bounce = () => {
      if (step >= targets.length) {
        setTimeout(() => finish(), 600)
        return
      }
      const target = targets[step]
      const targetEl = lettersRef.current[target.index]
      if (!targetEl) { step++; setTimeout(() => bounce(), 500); return }
      const rect = targetEl.getBoundingClientRect()
      const x = rect.left - nameRect.left + rect.width / 2 - 12
      const y = rect.top - nameRect.top - 10

      setDotPos({ left: x, top: y })
      setTimeout(() => {
        createImpact(nameRect.left + x + 12, nameRect.top + y + 12)
        setHitLetter(target.index)
        setTimeout(() => setHitLetter(null), 400)
        if (target.index === 4) setDotPos(prev => ({ ...prev }))
        step++
        setTimeout(() => bounce(), 500)
      }, 400)
    }

    setTimeout(() => bounce(), 200)
  }

  const createImpact = (x, y) => {
    const count = 8
    const newParticles = []
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i
      const distance = Math.random() * 40 + 20
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
        size: Math.random() * 8 + 4,
        bg: `hsl(${340 + Math.random() * 20}, 80%, ${60 + Math.random() * 20}%)`,
      })
    }
    setImpactParticles(prev => [...prev, ...newParticles])
    setTimeout(() => {
      setImpactParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)))
    }, 600)
  }

  const finish = () => {
    setGreetingVisible(true)
    setTimeout(() => setSubtitleVisible(true), 300)
    setTimeout(() => {
      setFading(true)
      setTimeout(() => {
        onComplete?.()
        navigate('/admin/dashboard')
      }, 800)
    }, 1800)
  }

  return (
    <div ref={containerRef} className={`welcome-screen${fading ? ' fade-out' : ''}`}>
      <div className="welcome-particles">
        {particles.map((p, i) => (
          <div
            key={i}
            className="welcome-particle"
            style={{
              width: p.size + 'px', height: p.size + 'px',
              left: p.left + '%', bottom: p.bottom + '%',
              background: p.bg,
              animationDuration: p.dur + 's',
              animationDelay: p.delay + 's',
            }}
          />
        ))}
      </div>
      {impactParticles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute', left: p.x + 'px', top: p.y + 'px',
            width: p.size + 'px', height: p.size + 'px', borderRadius: '50%',
            background: p.bg, pointerEvents: 'none', zIndex: 100,
            '--tx': p.tx + 'px', '--ty': p.ty + 'px',
            animation: 'impactBurst 0.6s ease forwards',
          }}
        />
      ))}
      <div className="welcome-content">
        <p className={`welcome-greeting${greetingVisible ? ' visible' : ''}`}>{greeting}</p>
        <div className="welcome-name" id="welcomeName">
          {LETTERS.map((l, idx) => (
            <span
              key={idx}
              ref={el => lettersRef.current[idx] = el}
              className={`letter${idx < visibleCount ? ' visible' : ''}${hitLetter === idx ? ' hit' : ''}`}
            >
              {l.hasDot && <span className={`letter-dot${dotDetached ? ' detached' : ''}`}></span>}
              {l.hasBar ? <span className="letter-i-bar">I</span> : l.char}
            </span>
          ))}
          <div className={`welcome-bounce-dot${dotActive ? ' active' : ''}`} style={{ left: dotPos.left + 'px', top: dotPos.top + 'px', transition: 'left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}></div>
        </div>
        <p className={`welcome-subtitle${subtitleVisible ? ' visible' : ''}`}>Admin Imani Travel Planner</p>
      </div>
    </div>
  )
}
