import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar({ onOpenForm, onOpenEngagements }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <Link to="/" className="logo-group">
            <img src="/images/logo.png" alt="Imani Travel Planner" className="logo-img" />
          </Link>

          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>

          <ul className="nav-menu">
            <li><a href="#home" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('home') }}>Accueil</a></li>
            <li><a href="#intro" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('intro') }}>Pourquoi nous</a></li>
            <li><a href="#process" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('process') }}>Comment ça se passe</a></li>
            <li><a href="#destinations" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('destinations') }}>Destinations</a></li>
            <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onOpenEngagements?.() }}>Engagements</a></li>
            <li><a href="#testimonials" className="nav-link" onClick={(e) => { e.preventDefault(); scrollTo('testimonials') }}>Témoignages</a></li>
            <li>
              <a href="#" className="btn-nav" onClick={(e) => { e.preventDefault(); onOpenForm?.() }}>
                ✨ Créer mon voyage
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className={`mobile-menu ${mobileOpen ? 'active' : ''}`} id="mobile-menu">
        <a href="#home" className="mobile-link" onClick={() => scrollTo('home')}>Accueil</a>
        <a href="#intro" className="mobile-link" onClick={() => scrollTo('intro')}>Pourquoi nous</a>
        <a href="#process" className="mobile-link" onClick={() => scrollTo('process')}>Comment ça se passe</a>
        <a href="#destinations" className="mobile-link" onClick={() => scrollTo('destinations')}>Destinations</a>
        <a href="#" className="mobile-link" onClick={(e) => { e.preventDefault(); onOpenEngagements?.(); setMobileOpen(false) }}>Engagements</a>
        <a href="#testimonials" className="mobile-link" onClick={() => scrollTo('testimonials')}>Témoignages</a>
        <a href="#" className="btn-nav" onClick={(e) => { e.preventDefault(); onOpenForm?.() }}>✨ Planifier</a>
      </div>
    </>
  )
}
