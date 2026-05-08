import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ordersAPI } from '../services/api'

export default function AdminLayout({ children, activeNav }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [newCount, setNewCount] = useState(0)
  const [adminName, setAdminName] = useState('Imani Admin')
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    const saved = localStorage.getItem('imani_admin_name')
    if (saved) setAdminName(saved)
  }, [])

  useEffect(() => {
    ordersAPI.getAll({ status: 'new' })
      .then(res => setNewCount(res.data.length))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const linkClass = (path) => `sidebar-link${activeNav === path ? ' active' : ''}`

  const initials = adminName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <>
      <div className="mobile-header">
        <button className="mobile-toggle" onClick={() => setSidebarOpen(prev => !prev)}>
          <i className="fas fa-bars"></i>
        </button>
        <span className="mobile-brand">Imani Travel Planner</span>
      </div>
      <div className={`sidebar-overlay${sidebarOpen ? ' show' : ''}`} onClick={() => setSidebarOpen(false)}></div>

      <div className="admin-layout visible" id="adminLayout">
        <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="sidebar-header">
            <img src="/images/logo.png" alt="Logo" className="sidebar-logo" />
            <div className="sidebar-brand">
              Imani Travel Planner
              <small>Administration</small>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div className="sidebar-section-label">Principal</div>
            <Link to="/admin/dashboard" className={linkClass('dashboard')}>
              <i className="fas fa-chart-pie"></i> Dashboard
            </Link>
            <Link to="/admin/orders" className={linkClass('orders')}>
              <i className="fas fa-suitcase-rolling"></i> Mes commandes
              {newCount > 0 && <span className="badge">{newCount}</span>}
            </Link>

            <div className="sidebar-section-label">Système</div>
            <Link to="/admin/settings" className={linkClass('settings')}>
              <i className="fas fa-cog"></i> Paramètres
            </Link>
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="sidebar-user-avatar">{initials}</div>
              <div className="sidebar-user-info">
                <strong>{adminName}</strong>
                <span>Administratrice</span>
              </div>
            </div>
            <button className="sidebar-logout" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Déconnexion
            </button>
          </div>
        </aside>

        <main className="main-content">
          {children}
        </main>
      </div>
    </>
  )
}
