import { useEffect } from 'react'

const ENGAGEMENTS = [
  {
    icon: 'fa-hand-holding-heart',
    title: 'Transparence totale',
    desc: 'Aucun frais caché, devis clair et détaillé avant toute réservation. Vous savez exactement ce que vous payez.'
  },
  {
    icon: 'fa-headset',
    title: 'Support 24/7',
    desc: 'Disponible par WhatsApp pendant tout votre voyage, 7 jours sur 7. Une question ? Je suis là.'
  },
  {
    icon: 'fa-gem',
    title: 'Qualité garantie',
    desc: 'Hébergements et activités sélectionnés avec soin, testés et approuvés. Rien n\'est laissé au hasard.'
  },
  {
    icon: 'fa-heart',
    title: '100% personnalisé',
    desc: 'Chaque voyage est unique, conçu sur mesure selon vos envies, votre budget et votre style.'
  },
  {
    icon: 'fa-tag',
    title: 'Meilleur prix',
    desc: 'Je négocie les meilleurs tarifs pour vous faire économiser sans sacrifier la qualité.'
  },
  {
    icon: 'fa-smile-beam',
    title: 'Satisfaction garantie',
    desc: 'Si vous n\'êtes pas satisfait, je m\'engage à trouver une solution qui vous convient.'
  }
]

export default function EngagementsOverlay({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('show-engagements')
    } else {
      document.body.classList.remove('show-engagements')
    }
    return () => document.body.classList.remove('show-engagements')
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="engagements-overlay" onClick={onClose}>
      <div className="engagements-content" onClick={e => e.stopPropagation()}>
        <button className="engagements-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="engagements-header">
          <span className="engagements-tag"><i className="fas fa-shield-alt"></i> Nos engagements</span>
          <h2 className="engagements-title">
            Pourquoi me <span style={{ color: 'var(--rose-accent)' }}>choisir</span> ?
          </h2>
          <p className="engagements-subtitle">
            Voici ce à quoi vous pouvez vous attendre quand vous me confiez votre voyage.
          </p>
        </div>

        <div className="engagements-grid">
          {ENGAGEMENTS.map((item, i) => (
            <div key={i} className="engagement-card">
              <div className="engagement-icon">
                <i className={`fas ${item.icon}`}></i>
              </div>
              <h3 className="engagement-title">{item.title}</h3>
              <p className="engagement-desc">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="engagements-footer">
          <a
            href="https://wa.me/33611051114?text=Bonjour%20!%20Je%20souhaite%20en%20savoir%20plus%20sur%20vos%20services."
            className="btn-engagements-cta"
            target="_blank"
            rel="noopener"
          >
            <i className="fab fa-whatsapp"></i> Discutons de votre projet
          </a>
        </div>
      </div>
    </div>
  )
}
