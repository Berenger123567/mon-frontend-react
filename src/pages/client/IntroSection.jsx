export default function IntroSection() {
  return (
    <section className="section intro-section" id="intro">
      <div className="container">
        <div className="intro-grid">
          <div data-aos="fade-right">
            <span className="section-tag"><i className="fas fa-sparkles"></i> Votre Travel Planner</span>
            <h2 className="section-title">
              <span style={{ color: 'var(--rose-accent)' }}>✨</span> Et si vos vacances commençaient <span style={{ color: 'var(--rose-accent)' }}>dès maintenant</span> ?
            </h2>
            <p className="intro-hook">
              Vous rêvez de partir, mais l'idée de passer des heures à comparer des vols, chercher l'hôtel parfait ou vérifier les formalités de visa vous décourage ?
              <strong>C'est là que j'interviens !</strong>
            </p>
            <p className="intro-sub">
              En tant que <strong>Travel Planner</strong>, mon rôle est de créer pour vous le voyage idéal sans que vous n'ayez à lever le petit doigt pour l'organisation. <span style={{ fontSize: '1.3rem' }}>🌍</span>
            </p>
            <div className="intro-stats">
              <div className="stat-item">
                <span className="stat-number">2500+</span>
                <span className="stat-label">Voyages créés</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">98%</span>
                <span className="stat-label">Satisfaction</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">40+</span>
                <span className="stat-label">Destinations</span>
              </div>
            </div>
          </div>
          <div className="intro-image-wrapper" data-aos="fade-left" data-aos-delay="200">
            <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=700&h=500&fit=crop" alt="Voyageur contemplatif" />
            <div className="intro-floating-card">
              <i className="fas fa-check-circle"></i>
              <span>Voyage sur mesure garanti</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
