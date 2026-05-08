export default function WhatsAppCTA() {
  return (
    <div className="container">
      <div className="cta-section cta-whatsapp" data-aos="zoom-in" data-aos-delay="100">
        <i className="fab fa-whatsapp" style={{ fontSize: '3.5rem', color: '#25D366', marginBottom: '1rem' }}></i>
        <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', marginBottom: '1rem' }}>Prêt à vivre votre <span style={{ color: 'var(--rose-accent)' }}>prochaine aventure</span> ?</h2>
        <p style={{ maxWidth: '500px', margin: '0 auto 2rem' }}>Contactez-moi directement sur WhatsApp pour votre devis personnalisé. Réponse garantie sous 24h !</p>
        <a
          href="https://wa.me/33611051114?text=Bonjour%20!%20J'aimerais%20obtenir%20un%20devis%20pour%20mon%20voyage%20%C3%A0%20mesure."
          className="btn-whatsapp-cta"
          target="_blank"
          rel="noopener"
        >
          <i className="fab fa-whatsapp"></i> Discutons de votre voyage
        </a>
        <p className="cta-subtext">On part où ? ✈️🌍</p>
      </div>
    </div>
  )
}
