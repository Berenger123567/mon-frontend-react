import { useState, useEffect, useRef } from 'react'
import { ordersAPI } from '../../services/api'

const COMPOSITION_LABELS = {
  solo: 'Solo',
  couple: 'Couple',
  amis: 'Amis',
  famille: 'Famille',
  groupe: 'Groupe organisé'
}

const CLIMATE_LABELS = {
  hot: 'Chaud',
  temperate: 'Tempéré',
  cold: 'Froid'
}

const HEBERGEMENT_LABELS = {
  simple: 'Hôtel 3★',
  luxe: 'Hôtel 4-5★',
  airbnb: 'Airbnb / Location',
  auberge: 'Auberge / Éco-lodge'
}

const DURATION_MAP = {
  '3-5': '3-5 jours',
  '6-8': '6-8 jours',
  '9-12': '9-12 jours',
  '12+': '12+ jours'
}

const STEPS = [
  { number: 1, label: 'Profil' },
  { number: 2, label: 'Destination' },
  { number: 3, label: 'Confort' },
  { number: 4, label: 'Ambiance' }
]

const AGE_OPTIONS = ['-18', '18-25', '26-35', '36-50', '50+']
const COMPOSITION_OPTIONS = [
  { value: 'solo', icon: 'fa-user', label: 'Solo' },
  { value: 'couple', icon: 'fa-heart', label: 'En couple' },
  { value: 'amis', icon: 'fa-users', label: 'Entre amis' },
  { value: 'famille', icon: 'fa-users', label: 'En famille' },
  { value: 'groupe', icon: 'fa-user-friends', label: 'Groupe organisé' }
]
const BUDGET_OPTIONS = ['-300€', '300-600€', '600-900€', '900-1200€', '1200€+']

const DESTINATION_OPTIONS = [
  { value: 'plage', emoji: '🏖️', label: 'Plage' },
  { value: 'montagne', emoji: '⛰️', label: 'Montagne' },
  { value: 'ville', emoji: '🏛️', label: 'Ville' },
  { value: 'campagne', emoji: '🌿', label: 'Campagne' },
  { value: 'ile', emoji: '🏝️', label: 'Île' }
]
const ACTIVITY_OPTIONS = [
  { value: 'aventure', emoji: '🧗', label: 'Aventure' },
  { value: 'culture', emoji: '🏛️', label: 'Culture' },
  { value: 'detente', emoji: '🧘', label: 'Détente' },
  { value: 'nature', emoji: '🌲', label: 'Nature' },
  { value: 'culinaire', emoji: '🍷', label: 'Gastronomie' }
]
const CLIMATE_OPTIONS = [
  { value: 'hot', emoji: '☀️', label: 'Très chaud (25°+)' },
  { value: 'temperate', emoji: '🌤️', label: 'Tempéré (15-24°)' },
  { value: 'cold', emoji: '❄️', label: 'Froid / neige' }
]

const ACCOMMODATION_OPTIONS = [
  { value: 'simple', emoji: '🏨', label: 'Hôtel 3★' },
  { value: 'luxe', emoji: '✨', label: 'Hôtel 4-5★' },
  { value: 'airbnb', emoji: '🏠', label: 'Airbnb / Location' },
  { value: 'auberge', emoji: '🎒', label: 'Auberge / Éco-lodge' }
]
const FOOD_OPTIONS = [
  { value: 'vegetarien', emoji: '🥬', label: 'Végétarien' },
  { value: 'vegan', emoji: '🌱', label: 'Vegan' },
  { value: 'halal', emoji: '☪️', label: 'Halal' },
  { value: 'sans_gluten', emoji: '🌾', label: 'Sans gluten' },
  { value: 'allergies', emoji: '⚠️', label: 'Allergies' }
]
const ENGLISH_OPTIONS = [
  { value: 'none', emoji: '🔇', label: 'Aucun' },
  { value: 'beginner', emoji: '📖', label: 'Débutant' },
  { value: 'intermediate', emoji: '💬', label: 'Intermédiaire' },
  { value: 'advanced', emoji: '🎯', label: 'Avancé / Bilingue' }
]

const FEELING_OPTIONS = [
  { value: 'libre', emoji: '🕊️', label: 'Libre' },
  { value: 'heureux', emoji: '😊', label: 'Heureux.se' },
  { value: 'depayse', emoji: '🌍', label: 'Dépaysé.e' },
  { value: 'inspire', emoji: '✨', label: 'Inspiré.e' },
  { value: 'repose', emoji: '🧘', label: 'Reposé.e' },
  { value: 'energique', emoji: '⚡', label: 'Boosté.e' }
]
const PERIOD_OPTIONS = [
  { value: 'printemps', emoji: '🌸', label: 'Printemps' },
  { value: 'ete', emoji: '☀️', label: 'Été' },
  { value: 'automne', emoji: '🍂', label: 'Automne' },
  { value: 'hiver', emoji: '❄️', label: 'Hiver' },
  { value: 'flexible', emoji: '📅', label: 'Flexible' }
]
const DURATION_OPTIONS = ['3-5', '6-8', '9-12', '12+']

const INITIAL_FORM_DATA = {
  fullname: '',
  age: '',
  composition: '',
  budget: '',
  destination_type: [],
  activities: [],
  climate: '',
  hebergement: '',
  alimentation: [],
  english: '',
  objectif: '',
  feelings: [],
  envisage: '',
  period: '',
  duration: '',
  notes: '',
  email: '',
  phone: ''
}

export default function TravelForm({ isOpen, onClose, callbacks }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({ ...INITIAL_FORM_DATA })
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [error, setError] = useState('')
  const fullnameRef = useRef(null)
  const emailRef = useRef(null)
  const phoneRef = useRef(null)
  const prevCompositionRef = useRef('')
  const prevAgeRef = useRef('')
  const timerRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1)
      setFormData({ ...INITIAL_FORM_DATA })
      if (timerRef.current) clearInterval(timerRef.current)
      setShowSuccess(false)
      setCountdown(3)
    }
  }, [isOpen])

  useEffect(() => {
    if (!showSuccess) return
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          onClose?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [showSuccess])

  const syncProfileEffects = (newData) => {
    if (!callbacks) return
    const age = newData.age || formData.age
    const composition = newData.composition || formData.composition
    if (newData.age !== undefined && newData.age !== prevAgeRef.current) {
      prevAgeRef.current = newData.age
      if (age && composition) callbacks.syncEarthWithProfile(age, composition)
    }
    if (newData.composition !== undefined && newData.composition !== prevCompositionRef.current) {
      prevCompositionRef.current = newData.composition
      callbacks.updatePeopleMarkers(composition)
      if (age && composition) callbacks.syncEarthWithProfile(age, composition)
    }
  }

  const updateField = (field, value) => {
    if (error) setError('')
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      if (field === 'fullname') {
        callbacks?.updateNameMarker(value)
      } else if (field === 'age' || field === 'composition') {
        syncProfileEffects(updated)
      } else if (field === 'budget') {
        callbacks?.syncBudget(value)
      } else if (field === 'climate') {
        callbacks?.syncClimate(value)
        callbacks?.updateWeather(value)
      } else if (field === 'hebergement') {
        callbacks?.syncHebergement(value)
      } else if (field === 'english') {
        callbacks?.syncEnglish(value)
      } else if (field === 'period') {
        callbacks?.syncPeriod(value)
      } else if (field === 'duration') {
        callbacks?.syncDuration(value)
      }
      return updated
    })
  }

  const toggleArrayField = (field, value) => {
    setFormData(prev => {
      const arr = prev[field]
      const isAdding = !arr.includes(value)
      const updatedArr = isAdding ? [...arr, value] : arr.filter(v => v !== value)
      const updated = { ...prev, [field]: updatedArr }
      if (isAdding) {
        if (field === 'destination_type') callbacks?.syncDestinationType(value)
        if (field === 'activities') callbacks?.syncActivities(value)
        if (field === 'alimentation') callbacks?.syncAlimentation(value)
        if (field === 'feelings') callbacks?.syncFeelings(value)
      }
      return updated
    })
  }

  const validateStep = (step) => {
    if (step === 1 && !formData.fullname.trim()) {
      setError('Veuillez saisir votre nom et prénom')
      fullnameRef.current?.focus()
      return false
    }
    if (step === 4) {
      if (!formData.email.trim()) {
        setError('Veuillez saisir votre email')
        emailRef.current?.focus()
        return false
      }
      if (!formData.phone.trim()) {
        setError('Veuillez saisir votre numéro de téléphone')
        phoneRef.current?.focus()
        return false
      }
    }
    return true
  }

  const nextStep = () => {
    if (!validateStep(currentStep)) return
    if (currentStep < 4) setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep(4)) return
    setSubmitting(true)

    const getDateFromPeriod = (period) => {
      if (!period || period === 'flexible') return new Date().toISOString().split('T')[0]
      const year = new Date().getFullYear()
      const periodMap = {
        'printemps': `${year}-04-01`,
        'ete': `${year}-07-01`,
        'automne': `${year}-10-01`,
        'hiver': `${year}-12-01`
      }
      return periodMap[period] || new Date().toISOString().split('T')[0]
    }

    const payload = {
      name: formData.fullname,
      email: formData.email,
      phone: formData.phone,
      age: formData.age || '',
      english: formData.english || '',
      destination: formData.envisage || formData.destination_type.join(', ') || 'À définir',
      date: getDateFromPeriod(formData.period),
      budget: formData.budget || '',
      duration: DURATION_MAP[formData.duration] || formData.duration || '',
      composition: COMPOSITION_LABELS[formData.composition] || formData.composition || '',
      climate: CLIMATE_LABELS[formData.climate] || formData.climate || '',
      travel_style: formData.objectif || '',
      activities: formData.activities || [],
      accommodation: HEBERGEMENT_LABELS[formData.hebergement] || formData.hebergement || '',
      food: formData.alimentation.join(', ') || '',
      feelings: formData.feelings.join(', ') || '',
      message: formData.notes || '',
      status: 'new',
    }

    try {
      await ordersAPI.create(payload)
    } catch (err) {
      console.warn('API unavailable, saving locally:', err)
      const pending = JSON.parse(localStorage.getItem('imani_pending_orders') || '[]')
      pending.push(payload)
      localStorage.setItem('imani_pending_orders', JSON.stringify(pending))
    }

    setSubmitting(false)
    setFormData({ ...INITIAL_FORM_DATA })
    setShowSuccess(true)
    setCountdown(3)
  }

  if (!isOpen) return null

  return (
    <div className="form-page-content" id="form-page">
      <button id="backHome" onClick={onClose}>
        <i className="fas fa-arrow-left"></i> Retour
      </button>

      <div className="container">
        <div className="form-card" data-aos="fade-up">
          <div className="form-progress">
            <div className="progress-steps">
              {STEPS.map((step) => (
                <div
                  key={step.number}
                  className={`step-indicator${currentStep === step.number ? ' active' : ''}${currentStep > step.number ? ' completed' : ''}`}
                >
                  {step.number}
                </div>
              ))}
            </div>
            <div className="progress-labels">
              {STEPS.map((step) => (
                <span key={step.number}>{step.label}</span>
              ))}
            </div>
          </div>

          <form id="travel-form">
            <div className={`form-step${currentStep === 1 ? ' active-step' : ''}`} data-step="1">
              <h3><i className="fas fa-user-circle"></i> Vos informations</h3>

              <div className="form-group">
                <label>Nom et prénom</label>
                <input type="text" name="fullname" required placeholder="Sophie Durand"
                  ref={fullnameRef} value={formData.fullname} onChange={e => updateField('fullname', e.target.value)} />
              </div>

              <div className="form-group">
                <label>Âge</label>
                <div className="options-grid">
                  {AGE_OPTIONS.map(opt => (
                    <div className="option-item" key={opt}>
                      <input type="radio" name="age" value={opt} id={`age-${opt}`}
                        checked={formData.age === opt} onChange={() => updateField('age', opt)} />
                      <label htmlFor={`age-${opt}`}>{opt} ans</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Vous voyagez</label>
                <div className="options-grid">
                  {COMPOSITION_OPTIONS.map(opt => (
                    <div className="option-item" key={opt.value}>
                      <input type="radio" name="composition" value={opt.value} id={`comp-${opt.value}`}
                        checked={formData.composition === opt.value} onChange={() => updateField('composition', opt.value)} />
                      <label htmlFor={`comp-${opt.value}`}><i className={`fas ${opt.icon}`}></i> {opt.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Budget total (par personne)</label>
                <div className="options-grid">
                  {BUDGET_OPTIONS.map(opt => (
                    <div className="option-item" key={opt}>
                      <input type="radio" name="budget" value={opt} id={`budget-${opt}`}
                        checked={formData.budget === opt} onChange={() => updateField('budget', opt)} />
                      <label htmlFor={`budget-${opt}`}>{opt}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`form-step${currentStep === 2 ? ' active-step' : ''}`} data-step="2">
              <h3><i className="fas fa-map-marked-alt"></i> Votre destination idéale</h3>

              <div className="form-group">
                <label>Type de destination</label>
                <div className="options-grid">
                  {DESTINATION_OPTIONS.map(opt => (
                    <div className="option-item" key={opt.value}>
                      <input type="checkbox" name="destination_type" value={opt.value} id={`dest-${opt.value}`}
                        checked={formData.destination_type.includes(opt.value)}
                        onChange={() => toggleArrayField('destination_type', opt.value)} />
                      <label htmlFor={`dest-${opt.value}`}>{opt.emoji} {opt.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Activités recherchées</label>
                <div className="options-grid">
                  {ACTIVITY_OPTIONS.map(opt => (
                    <div className="option-item" key={opt.value}>
                      <input type="checkbox" name="activities" value={opt.value} id={`act-${opt.value}`}
                        checked={formData.activities.includes(opt.value)}
                        onChange={() => toggleArrayField('activities', opt.value)} />
                      <label htmlFor={`act-${opt.value}`}>{opt.emoji} {opt.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Climat souhaité</label>
                <div className="options-grid">
                  {CLIMATE_OPTIONS.map(opt => (
                    <div className="option-item" key={opt.value}>
                      <input type="radio" name="climate" value={opt.value} id={`climate-${opt.value}`}
                        checked={formData.climate === opt.value} onChange={() => updateField('climate', opt.value)} />
                      <label htmlFor={`climate-${opt.value}`}>{opt.emoji} {opt.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`form-step${currentStep === 3 ? ' active-step' : ''}`} data-step="3">
              <h3><i className="fas fa-hotel"></i> Votre confort</h3>

              <div className="form-group">
                <label>Type d'hébergement</label>
                <div className="options-grid">
                  {ACCOMMODATION_OPTIONS.map(opt => (
                    <div className="option-item" key={opt.value}>
                      <input type="radio" name="hebergement" value={opt.value} id={`hotel-${opt.value}`}
                        checked={formData.hebergement === opt.value} onChange={() => updateField('hebergement', opt.value)} />
                      <label htmlFor={`hotel-${opt.value}`}>{opt.emoji} {opt.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Préférences alimentaires</label>
                <div className="options-grid">
                  {FOOD_OPTIONS.map(opt => (
                    <div className="option-item" key={opt.value}>
                      <input type="checkbox" name="alimentation" value={opt.value} id={`food-${opt.value}`}
                        checked={formData.alimentation.includes(opt.value)}
                        onChange={() => toggleArrayField('alimentation', opt.value)} />
                      <label htmlFor={`food-${opt.value}`}>{opt.emoji} {opt.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Niveau d'anglais</label>
                <div className="options-grid">
                  {ENGLISH_OPTIONS.map(opt => (
                    <div className="option-item" key={opt.value}>
                      <input type="radio" name="english" value={opt.value} id={`eng-${opt.value}`}
                        checked={formData.english === opt.value} onChange={() => updateField('english', opt.value)} />
                      <label htmlFor={`eng-${opt.value}`}>{opt.emoji} {opt.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`form-step${currentStep === 4 ? ' active-step' : ''}`} data-step="4">
              <h3><i className="fas fa-star"></i> Vos envies profondes</h3>

              <div className="form-group">
                <label>Objectif principal du voyage</label>
                <textarea name="objectif" rows="3" placeholder="Je rêve de... découvrir des paysages uniques, me ressourcer, vivre une aventure inoubliable..."
                  value={formData.objectif} onChange={e => updateField('objectif', e.target.value)} />
              </div>

              <div className="form-group">
                <label>Comment voulez-vous vous sentir ?</label>
                <div className="options-grid">
                  {FEELING_OPTIONS.map(opt => (
                    <div className="option-item" key={opt.value}>
                      <input type="checkbox" name="feelings" value={opt.value} id={`feel-${opt.value}`}
                        checked={formData.feelings.includes(opt.value)}
                        onChange={() => toggleArrayField('feelings', opt.value)} />
                      <label htmlFor={`feel-${opt.value}`}>{opt.emoji} {opt.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Destination(s) déjà envisagée(s)</label>
                <input type="text" name="envisage" placeholder="Ex: Japon, Italie, Costa Rica, Islande..."
                  value={formData.envisage} onChange={e => updateField('envisage', e.target.value)} />
              </div>

              <div className="form-group">
                <label>Période souhaitée</label>
                <div className="options-grid">
                  {PERIOD_OPTIONS.map(opt => (
                    <div className="option-item" key={opt.value}>
                      <input type="radio" name="period" value={opt.value} id={`period-${opt.value}`}
                        checked={formData.period === opt.value} onChange={() => updateField('period', opt.value)} />
                      <label htmlFor={`period-${opt.value}`}>{opt.emoji} {opt.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Durée souhaitée</label>
                <div className="options-grid">
                  {DURATION_OPTIONS.map(opt => (
                    <div className="option-item" key={opt}>
                      <input type="radio" name="duration" value={opt} id={`dur-${opt}`}
                        checked={formData.duration === opt} onChange={() => updateField('duration', opt)} />
                      <label htmlFor={`dur-${opt}`}>{opt} jours</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Notes supplémentaires</label>
                <textarea name="notes" rows="2" placeholder="Une information importante ? Handicap, envie particulière, contrainte..."
                  value={formData.notes} onChange={e => updateField('notes', e.target.value)} />
              </div>

              <div className="form-group">
                <label>Email pour recevoir votre projet</label>
                <input type="email" name="email" required placeholder="votre@email.com"
                  ref={emailRef} value={formData.email} onChange={e => updateField('email', e.target.value)} />
              </div>

              <div className="form-group">
                <label>Téléphone</label>
                <input type="tel" name="phone" required placeholder="+33 6 12 34 56 78"
                  ref={phoneRef} value={formData.phone} onChange={e => updateField('phone', e.target.value)} />
              </div>
            </div>

            {error && (
              <div style={{
                color: '#e74c3c',
                background: '#fde8e8',
                padding: '0.7rem 1rem',
                borderRadius: '8px',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                <i className="fas fa-exclamation-circle" style={{ marginRight: '0.5rem' }}></i>
                {error}
              </div>
            )}

            <div className="form-navigation">
              <button type="button" className="btn-prev" onClick={prevStep}
                style={{ display: currentStep > 1 ? 'inline-flex' : 'none' }}>
                <i className="fas fa-arrow-left"></i> Retour
              </button>
              {currentStep < 4 ? (
                <button type="button" className="btn-next" onClick={nextStep}>
                  Suivant <i className="fas fa-arrow-right"></i>
                </button>
              ) : (
                <button type="button" className="btn-submit" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? (
                    <span><i className="fas fa-spinner fa-spin"></i> Envoi en cours...</span>
                  ) : (
                    <span>✨ Envoyer mon projet</span>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {showSuccess && (
        <div className="form-success-overlay">
          <div className="form-success-modal">
            <div className="form-success-check">
              <i className="fas fa-check"></i>
            </div>
            <h3>Projet envoyé avec succès !</h3>
            <p>Nous avons bien reçu votre demande. Notre équipe vous contactera sous 48h pour créer votre carnet de voyage personnalisé.</p>
            <div className="form-success-countdown">
              <span>Retour à l'accueil dans <strong>{countdown}</strong> seconde{countdown > 1 ? 's' : ''}</span>
              <div className="form-success-bar">
                <div className="form-success-bar-fill" style={{ width: `${(countdown / 3) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
