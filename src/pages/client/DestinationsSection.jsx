const destinations = [
  {
    name: 'Santorini',
    location: 'Grèce',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=600&fit=crop',
    large: true,
    delay: '100'
  },
  {
    name: 'Bali',
    location: 'Indonésie',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop',
    large: false,
    delay: '200'
  },
  {
    name: 'Kyoto',
    location: 'Japon',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    large: false,
    delay: '300'
  },
  {
    name: 'Maldives',
    location: 'Océan Indien',
    image: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=600&h=400&fit=crop',
    large: false,
    delay: '100'
  },
  {
    name: 'Le Caire',
    location: 'Égypte',
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&h=600&fit=crop',
    large: true,
    delay: '200'
  },
  {
    name: 'Dakar',
    location: 'Sénégal',
    image: 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=600&h=400&fit=crop',
    large: false,
    delay: '300'
  }
]

export default function DestinationsSection() {
  return (
    <section className="section gallery-section" id="destinations">
      <div className="container">
        <div data-aos="fade-up" style={{ textAlign: 'center' }}>
          <span className="section-tag" style={{ margin: '0 auto' }}><i className="fas fa-globe-europe"></i> Destinations populaires</span>
          <h2 className="section-title">Nos voyageurs <span style={{ color: 'var(--rose-accent)' }}>adorent</span></h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>Des destinations de rêve pour tous les styles de voyage.</p>
        </div>
        <div className="gallery-grid">
          {destinations.map((dest, index) => (
            <div
              key={index}
              className={`gallery-card${dest.large ? ' gallery-card-large' : ''}`}
              data-aos="fade-up"
              data-aos-delay={dest.delay}
            >
              <img src={dest.image} alt={dest.name} />
              <div className="gallery-overlay">
                <h3>{dest.name}</h3>
                <p><i className="fas fa-map-marker-alt"></i> {dest.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
