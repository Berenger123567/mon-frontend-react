import { Routes, Route } from 'react-router-dom'
import Home from './pages/client/Home'
import AdminLogin from './pages/admin/AdminLogin'
import WelcomeAnimation from './pages/admin/WelcomeAnimation'
import Dashboard from './pages/admin/Dashboard'
import Orders from './pages/admin/Orders'
import OrderDetail from './pages/admin/OrderDetail'
import Settings from './pages/admin/Settings'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/welcome" element={
        <ProtectedRoute>
          <WelcomeAnimation />
        </ProtectedRoute>
      } />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/orders" element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      } />
      <Route path="/admin/orders/:id" element={
        <ProtectedRoute>
          <OrderDetail />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App
