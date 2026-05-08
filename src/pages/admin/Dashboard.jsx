import { useState, useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import AdminLayout from '../../components/AdminLayout'
import WelcomeAnimation from './WelcomeAnimation'
import { statsAPI } from '../../services/api'

function animateValue(element, start, end, duration) {
  if (!element) return
  let startTime = null
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp
    const progress = Math.min((timestamp - startTime) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    element.textContent = Math.floor(eased * (end - start) + start)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

function DashboardContent({ stats }) {
  const [currentDate, setCurrentDate] = useState('')
  const barRef = useRef(null)
  const donutRef = useRef(null)
  const lineRef = useRef(null)
  const chartsCreated = useRef(false)

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }))
  }, [])

  useEffect(() => {
    if (!stats || chartsCreated.current) return
    chartsCreated.current = true

    const { kpi, composition, weeklyOrders, weeklyLabels, trendData } = stats

    animateValue(document.getElementById('kpiTotal'), 0, kpi.total, 1200)
    animateValue(document.getElementById('kpiProgress'), 0, kpi.progress, 1000)
    animateValue(document.getElementById('kpiSent'), 0, kpi.sent, 1000)
    animateValue(document.getElementById('kpiMonth'), 0, kpi.month, 800)

    if (barRef.current) {
      new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: weeklyLabels || ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
          datasets: [{
            label: 'Demandes',
            data: weeklyOrders || [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(231, 84, 128, 0.15)',
            borderColor: '#E75480',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
            barThickness: 24,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: 'DM Sans' } } },
            x: { grid: { display: false }, ticks: { font: { family: 'DM Sans' } } },
          }
        }
      })
    }

    if (donutRef.current) {
      const compKeys = Object.keys(composition || {})
      const compValues = Object.values(composition || {})
      if (compKeys.length > 0) {
        new Chart(donutRef.current, {
          type: 'doughnut',
          data: {
            labels: compKeys,
            datasets: [{
              data: compValues,
              backgroundColor: ['#E75480', '#f0a030', '#38c172', '#8b5cf6', '#06b6d4'],
              borderWidth: 3, borderColor: 'white', hoverOffset: 8,
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false, cutout: '65%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: { padding: 15, usePointStyle: true, pointStyleWidth: 10, font: { family: 'DM Sans', size: 12 } }
              }
            }
          }
        })
      } else {
        donutRef.current.parentElement.innerHTML = '<p style="text-align:center;color:var(--texte-secondaire);padding:2rem;">Aucune donnée disponible</p>'
      }
    }

    if (lineRef.current) {
      new Chart(lineRef.current, {
        type: 'line',
        data: {
          labels: ['Semaine -3', 'Semaine -2', 'Semaine -1', 'Cette semaine'],
          datasets: [{
            label: 'Demandes',
            data: trendData || [0, 0, 0, 0],
            borderColor: '#E75480',
            backgroundColor: 'rgba(231, 84, 128, 0.08)',
            fill: true, tension: 0.4,
            pointBackgroundColor: '#E75480', pointBorderColor: 'white',
            pointBorderWidth: 2, pointRadius: 5, pointHoverRadius: 7,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: 'DM Sans' } } },
            x: { grid: { display: false }, ticks: { font: { family: 'DM Sans' } } },
          }
        }
      })
    }
  }, [stats])

  const TrendIndicator = ({ value }) => {
    if (value === 0) return <span className="kpi-trend neutral"><i className="fas fa-minus"></i> 0%</span>
    const isUp = value > 0
    return (
      <span className={`kpi-trend ${isUp ? 'up' : 'down'}`}>
        <i className={`fas fa-arrow-${isUp ? 'up' : 'down'}`}></i> {isUp ? '+' : ''}{value}%
      </span>
    )
  }

  return (
    <AdminLayout activeNav="dashboard">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Tableau de <span>bord</span></h1>
            <p>Bienvenue ! Voici un aperçu de votre activité.</p>
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--texte-secondaire)' }}>{currentDate}</span>
          </div>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon"><i className="fas fa-inbox"></i></div>
          <div className="kpi-value" id="kpiTotal">0</div>
          <div className="kpi-label">Total demandes</div>
          {stats && <TrendIndicator value={stats.trends.total} />}
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><i className="fas fa-spinner"></i></div>
          <div className="kpi-value" id="kpiProgress">0</div>
          <div className="kpi-label">En cours de traitement</div>
          {stats && <TrendIndicator value={stats.trends.progress} />}
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><i className="fas fa-paper-plane"></i></div>
          <div className="kpi-value" id="kpiSent">0</div>
          <div className="kpi-label">Carnets envoyés</div>
          {stats && <TrendIndicator value={stats.trends.sent} />}
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><i className="fas fa-calendar-check"></i></div>
          <div className="kpi-value" id="kpiMonth">0</div>
          <div className="kpi-label">Ce mois-ci</div>
          {stats && <TrendIndicator value={stats.trends.month} />}
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Demandes cette semaine</h3>
          <p className="chart-subtitle">Nombre de nouvelles demandes par jour</p>
          <div className="chart-container"><canvas ref={barRef}></canvas></div>
        </div>
        <div className="chart-card">
          <h3>Types de voyageurs</h3>
          <p className="chart-subtitle">Répartition par composition</p>
          <div className="chart-container-sm"><canvas ref={donutRef}></canvas></div>
        </div>
      </div>

      <div className="chart-card" style={{ marginBottom: '2rem' }}>
        <h3>Évolution sur 30 jours</h3>
        <p className="chart-subtitle">Tendances des demandes par semaine</p>
        <div className="chart-container"><canvas ref={lineRef}></canvas></div>
      </div>

      <div className="recent-section">
        <h3><i className="fas fa-clock" style={{ color: 'var(--rose-accent)', marginRight: '0.5rem' }}></i> Activité récente</h3>
        <div id="recentList">
          {(stats?.recent || []).map(order => (
            <div key={order.id} className="recent-item">
              <div className="recent-avatar">{order.name?.replace(/&/g, '').split(' ').map(p => p[0]).slice(0, 2).join('')}</div>
              <div className="recent-info">
                <strong>{order.name}</strong>
                <span>{order.destination} · {new Date(order.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <span className={`recent-status ${order.status}`}>{{ new: 'Nouveau', progress: 'En cours', sent: 'Carnet envoyé', done: 'Terminé' }[order.status]}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

export default function Dashboard() {
  const [showWelcome, setShowWelcome] = useState(() => localStorage.getItem('imani_welcome_shown') !== 'true')
  const [stats, setStats] = useState(null)

  useEffect(() => {
    statsAPI.getDashboard()
      .then(res => setStats(res.data))
      .catch(err => console.error('Failed to load stats:', err))
  }, [])

  return (
    <>
      {showWelcome && <WelcomeAnimation onComplete={() => { setShowWelcome(false); localStorage.setItem('imani_welcome_shown', 'true'); }} />}
      {!showWelcome && <DashboardContent stats={stats} />}
    </>
  )
}
