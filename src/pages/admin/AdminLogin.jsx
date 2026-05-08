import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [particles, setParticles] = useState([])
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const newParticles = []
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        size: Math.random() * 12 + 4,
        left: Math.random() * 100,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.15 + 0.05,
      })
    }
    setParticles(newParticles)
  }, [])

  useEffect(() => {
    document.body.classList.add('admin-login-body')
    return () => {
      document.body.classList.remove('admin-login-body')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/admin/welcome')
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="admin-login-bg"></div>
      <div className="admin-login-particles">
        {particles.map(p => (
          <div
            key={p.id}
            className="admin-particle"
            style={{
              width: p.size + 'px',
              height: p.size + 'px',
              left: p.left + '%',
              background: `rgba(231, 84, 128, ${p.opacity})`,
              animationDuration: p.duration + 's',
              animationDelay: p.delay + 's',
            }}
          />
        ))}
      </div>

      <div className="admin-login-container">
        <div className="admin-brand-panel">
          <div className="admin-brand-decoration"></div>
          <div className="admin-brand-decoration"></div>
          <div className="admin-brand-decoration"></div>

          <div className="admin-brand-content">
            <img src="/images/logo.png" alt="Imani Travel Planner" className="admin-brand-logo" />
            <h1 className="admin-brand-title">Imani Travel Planner</h1>
            <p className="admin-brand-subtitle">Espace d&apos;administration sécurisée</p>
            <ul className="admin-brand-features">
              <li><i className="fas fa-chart-line"></i> Suivi des demandes</li>
              <li><i className="fas fa-users"></i> Gestion des voyageurs</li>
              <li><i className="fas fa-globe"></i> Destinations actives</li>
              <li><i className="fas fa-shield-alt"></i> Dashboard sécurisé</li>
            </ul>
          </div>
        </div>

        <div className="admin-form-panel">
          <div className="admin-form-header">
            <h2>Bonjour ! <span>{String.fromCodePoint(0x1F44B)}</span></h2>
            <p>Connectez-vous pour accéder à votre espace d&apos;administration</p>
          </div>

          {error && (
            <div className="admin-error-message show">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-form-group">
              <label htmlFor="admin-email">Adresse email</label>
              <div className="admin-input-wrapper">
                <input
                  type="email"
                  id="admin-email"
                  placeholder="admin@imanitravelplanner.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <i className="fas fa-envelope field-icon"></i>
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="admin-password">Mot de passe</label>
              <div className="admin-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="admin-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <i className="fas fa-lock field-icon"></i>
                <button
                  type="button"
                  className="admin-toggle-password"
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label="Afficher le mot de passe"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="admin-btn-wrapper">
              <button type="submit" className={`admin-btn-login${loading ? ' loading' : ''}`}>
                <span className="admin-btn-text"><i className="fas fa-sign-in-alt"></i> Se connecter</span>
                <div className="admin-btn-spinner"></div>
              </button>
            </div>
          </form>

          <div className="admin-form-footer">
            <Link to="/"><i className="fas fa-arrow-left"></i> Retour au site</Link>
          </div>
        </div>
      </div>
    </>
  )
}
