export default function HeroSection({ onOpenForm }) {
  return (
    <section className="hero-section" id="home">
      <div className="hero-content">
        <div className="hero-badge">
          <i className="fas fa-star" style={{ color: '#FFD700' }}></i>
          <span>Plus de 2500 voyages créés</span>
        </div>

        <h1 className="hero-title">
          Votre voyage.<br />
          Votre vision.<br />
          Notre <span className="accent">expertise</span>.
        </h1>

        <p className="hero-subtitle">
          <strong>Imani Travel Planner</strong> crée l'itinéraire qui vous ressemble.
        </p>

        <div className="hero-cta-group">
          <a href="#" className="btn-hero-primary" onClick={(e) => { e.preventDefault(); onOpenForm?.() }}>
            <i className="fas fa-magic"></i> Commencer l'aventure
          </a>
        </div>
      </div>
    </section>
  )
}
