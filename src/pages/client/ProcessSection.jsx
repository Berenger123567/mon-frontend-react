const steps = [
  {
    number: '1',
    icon: 'fa-comments',
    title: 'Racontez-nous votre rêve',
    desc: 'Remplissez notre formulaire voyage et partagez vos envies, votre budget et vos dates. Plus vous nous en dites, plus votre voyage sera sur mesure.',
    details: ['Budget & dates', 'Style de voyage', 'Activités souhaitées'],
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=350&fit=crop',
    aos: 'fade-right',
    delay: '100',
    imageAos: 'fade-left',
    imageDelay: '150'
  },
  {
    number: '2',
    icon: 'fa-search-location',
    title: 'Je déniche les meilleures options',
    desc: 'Je parcours le web pour trouver les vols les moins chers, les hôtels les plus charmants et les activités les plus authentiques. Tout est vérifié et testé.',
    details: ['Vols aux meilleurs prix', 'Hébergements sélectionnés', 'Activités exclusives'],
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=350&fit=crop',
    aos: 'fade-left',
    delay: '200',
    imageAos: 'fade-right',
    imageDelay: '250',
    right: true
  },
  {
    number: '3',
    icon: 'fa-envelope-open-text',
    title: 'Recevez votre carnet sur mesure',
    desc: 'Vous recevez un carnet de voyage complet avec tous les liens de réservation, vos itinéraires jour par jour et mes conseils perso pour chaque étape.',
    details: ['Carnet PDF complet', 'Itinéraires détaillés', 'Conseils locaux'],
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&h=350&fit=crop',
    aos: 'fade-right',
    delay: '300',
    imageAos: 'fade-left',
    imageDelay: '350'
  },
  {
    number: '4',
    icon: 'fa-suitcase-rolling',
    title: 'Profitez, c\'est prêt !',
    desc: 'Vous gardez le contrôle total sur vos paiements, je vous mâche tout le travail. Il ne vous reste plus qu\'à faire vos valises et profiter !',
    details: ['Paiement direct', 'Aucune surprise', 'Support pendant le voyage'],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=350&fit=crop',
    aos: 'fade-left',
    delay: '400',
    imageAos: 'fade-right',
    imageDelay: '450',
    right: true
  }
]

export default function ProcessSection() {
  return (
    <section className="section value-prop-section" id="process">
      <div className="container">
        <div data-aos="fade-up" style={{ textAlign: 'center' }}>
          <span className="section-tag" style={{ margin: '0 auto' }}><i className="fas fa-route"></i> Concrètement</span>
          <h2 className="section-title">Votre voyage idéal en <span style={{ color: 'var(--rose-accent)' }}>4 étapes</span></h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>Simple, fluide et sans stress.</p>
        </div>

        <div className="process-timeline">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`timeline-step${step.right ? ' step_right' : ''}`}
              data-aos={step.aos}
              data-aos-delay={step.delay}
            >
              <div className="timeline-content">
                <div className="timeline-badge">
                  <span className="timeline-number">{step.number}</span>
                  <i className={`fas ${step.icon}`}></i>
                </div>
                <div className="timeline-text">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                  <ul className="timeline-details">
                    {step.details.map((detail, i) => (
                      <li key={i}><i className="fas fa-check"></i>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="timeline-image" data-aos={step.imageAos} data-aos-delay={step.imageDelay}>
                <img src={step.image} alt={step.title} />
                <div className="timeline-image-overlay">
                  <span>Étape {step.number}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="why-choose-block" data-aos="fade-up" data-aos-delay="200">
          <div className="why-choose-grid">
            <div className="why-choose-image">
              <img src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=500&h=400&fit=crop" alt="Voyage serein" />
            </div>
            <div className="why-choose-text">
              <h3><i className="fas fa-shield-alt" style={{ color: 'var(--rose-accent)' }}></i> Pourquoi me choisir ?</h3>
              <p>Que vous partiez seul(e) en Égypte, entre amis au Sénégal ou en couple en Grèce, je vous donne toutes les astuces pour éviter les arnaques locales (taxis, cartes SIM, change). Et bien sûr, je vous informe sur les démarches à suivre pour réaliser votre voyage sereinement.</p>
            </div>
          </div>
        </div>

        <div className="price-block" data-aos="zoom-in" data-aos-delay="300">
          <div className="price-content">
            <i className="fas fa-tag"></i>
            <span className="price-label">Le prix ?</span>
            <span className="price-text">C'est un forfait de service <strong>(à partir de 15€</strong> selon votre demande) qui vous fera économiser bien plus sur votre budget final ! 💸</span>
          </div>
          <a href="https://wa.me/33611051114?text=Bonjour%20!%20J'aimerais%20obtenir%20un%20devis%20pour%20mon%20voyage%20%C3%A0%20mesure." className="btn-price-cta" target="_blank" rel="noopener">
            <i className="fab fa-whatsapp"></i> Contactez-moi pour votre devis personnalisé
          </a>
          <p className="price-subtext">On part où ? ✈️🌍</p>
        </div>
      </div>
    </section>
  )
}
