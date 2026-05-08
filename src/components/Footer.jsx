import { Link } from 'react-router-dom'

export default function Footer({ onOpenForm, onOpenEngagements }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section">
            <h4>Imani Travel Planner</h4>
            <p>L'élégance du voyage sur mesure. Créez l'aventure qui vous ressemble.</p>
          </div>
          <div className="footer-section">
            <h4>Liens</h4>
            <a href="#home">Accueil</a>
            <a href="#destinations">Destinations</a>
            <a href="#process">Comment ça se passe</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onOpenEngagements?.() }}>Engagements</a>
            <a href="#testimonials">Témoignages</a>
            <a href="https://wa.me/33611051114" target="_blank" rel="noopener">WhatsApp</a>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>📧 contact@imanitravelplanner.com</p>
            <p>📞 +33 6 11 05 11 14</p>
            <p>📍 Paris, France</p>
          </div>
          <div className="footer-section">
            <h4>Suivez-nous</h4>
            <div className="social-links">
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Imani Travel Planner - Tous droits réservés | L'art du voyage sur mesure</p>
        </div>
      </div>
    </footer>
  )
}
