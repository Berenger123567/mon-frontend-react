import { useState, useEffect, useRef, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import { ordersAPI } from '../../services/api'

const FILTERS = [
  { key: 'all', label: 'Toutes', emoji: '' },
  { key: 'new', label: 'Nouveau', emoji: '🔴' },
  { key: 'progress', label: 'En cours', emoji: '🟡' },
  { key: 'sent', label: 'Envoyé', emoji: '🟢' },
  { key: 'done', label: 'Terminé', emoji: '⚫' },
]

const AVATAR_COLORS = ['#e84393', '#0984e3', '#00b894', '#6c5ce7', '#fdcb6e', '#e17055', '#a29bfe']
const STATUS_LABELS = { new: 'Nouveau', progress: 'En cours', sent: 'Carnet envoyé', done: 'Terminé' }

function getAvatarColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getInitials(name) {
  const parts = name.replace(/&/g, '').split(' ')
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
}

function formatDate(dateStr) {
  if (!dateStr) return 'Non spécifiée'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    return dateStr
  }
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function getTime(order) {
  if (!order.date) return -Infinity
  const d = new Date(order.date)
  return isNaN(d.getTime()) ? -Infinity : d.getTime()
}

export default function Orders() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || 'all')
  const [orders, setOrders] = useState([])
  const [counts, setCounts] = useState({ all: 0, new: 0, progress: 0, sent: 0, done: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const cardsRef = useRef([])

  const filtered = useMemo(() => {
    let result = orders
    if (activeFilter !== 'all') {
      result = result.filter(o => o.status === activeFilter)
    }
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(o =>
        o.name.toLowerCase().includes(s) ||
        o.email.toLowerCase().includes(s) ||
        o.destination.toLowerCase().includes(s)
      )
    }
    return result.sort((a, b) => getTime(b) - getTime(a))
  }, [orders, activeFilter, search])

  useEffect(() => {
    setError(null)
    ordersAPI.getAll()
      .then(res => {
        const data = res.data.map(o => ({ ...o, id: o._id }))
        setOrders(data)
        const c = { all: data.length, new: 0, progress: 0, sent: 0, done: 0 }
        data.forEach(o => { c[o.status] = (c[o.status] || 0) + 1 })
        setCounts(c)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load orders:', err)
        setError(err.response?.data?.error || 'Erreur lors du chargement des commandes')
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    cardsRef.current = []
  }, [activeFilter, search])

  useEffect(() => {
    if (loading || error || filtered.length === 0) return
    const timer = setTimeout(() => {
      cardsRef.current.forEach((el, idx) => {
        if (el) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        }
      })
    }, 100)
    return () => clearTimeout(timer)
  }, [filtered, loading, error])

  const handlePhone = (order) => {
    const phone = order.phone?.replace(/[^0-9]/g, '') || '33611051114'
    const text = encodeURIComponent(`Bonjour ${order.name} ! Concernant votre voyage à ${order.destination}...`)
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank')
  }

  return (
    <AdminLayout activeNav="orders">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Mes <span>commandes</span></h1>
            <p>Gérez les demandes de vos voyageurs</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--texte-secondaire)' }}>
              {filtered.length} commande{filtered.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="orders-toolbar">
        <div className="orders-search">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-pills">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`filter-pill${activeFilter === f.key ? ' active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.emoji}{f.emoji ? ' ' : ''}{f.label} <span className="count">{counts[f.key]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="orders-grid">
        {loading ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem', color: 'var(--texte-secondaire)' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--rose-accent)' }}></i>
          </div>
        ) : error ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem', color: '#ff4444' }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Erreur de chargement</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--texte-secondaire)' }}>{error}</p>
            <button
              className="order-btn primary"
              style={{ marginTop: '1rem' }}
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-redo"></i> Réessayer
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem', color: 'var(--texte-secondaire)' }}>
            <i className="fas fa-inbox" style={{ fontSize: '3rem', color: 'var(--rose-clair)', marginBottom: '1rem', display: 'block' }}></i>
            <p style={{ fontSize: '1.1rem' }}>Aucune commande trouvée</p>
          </div>
        ) : (
          filtered.map((order, idx) => {
            const initials = getInitials(order.name)
            const tags = [order.composition, order.climate, ...(order.activities || []).slice(0, 2)].filter(Boolean)
            return (
              <div
                key={order.id}
                className="order-card"
                ref={el => { if (el) cardsRef.current[idx] = el }}
                style={{ opacity: 0, transform: 'translateY(20px)', transition: `all 0.4s ease ${idx * 0.05}s` }}
              >
                <div className="order-card-header">
                  <div className="order-client">
                    <div className="order-client-avatar" style={{ background: getAvatarColor(order.name) }}>
                      {initials}
                    </div>
                    <div className="order-client-info">
                      <strong>{order.name}</strong>
                      <span>{order.email}</span>
                    </div>
                  </div>
                  <span className={`order-status ${order.status}`}>{STATUS_LABELS[order.status]}</span>
                </div>
                <div className="order-card-body">
                  <div className="order-detail-row">
                    <i className="fas fa-map-marker-alt"></i> {order.destination}
                  </div>
                  <div className="order-detail-row">
                    <i className="fas fa-calendar"></i> {formatDate(order.date)}
                  </div>
                  <div className="order-detail-row">
                    <i className="fas fa-coins"></i> Budget : {order.budget} · {order.duration}
                  </div>
                  <div className="order-tags">
                    {tags.map((t, i) => (
                      <span key={i} className="order-tag">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="order-card-footer">
                  <button className="order-btn primary" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                    <i className="fas fa-eye"></i> Voir
                  </button>
                  <button className="order-btn secondary" onClick={() => navigate(`/admin/orders/${order.id}?reply=1`)}>
                    <i className="fas fa-reply"></i> Répondre
                  </button>
                  <button className="order-btn whatsapp" onClick={() => handlePhone(order)} title="WhatsApp">
                    <i className="fab fa-whatsapp"></i>
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </AdminLayout>
  )
}
