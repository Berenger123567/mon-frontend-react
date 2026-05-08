import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { authAPI } from '../../services/api'

export default function Settings() {
  const [adminName, setAdminName] = useState('')
  const [nameSaved, setNameSaved] = useState(false)

  const [adminEmail, setAdminEmail] = useState('')
  const [emailSaved, setEmailSaved] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [savingEmail, setSavingEmail] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false })
  const [saving, setSaving] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('imani_admin_name')
    setAdminName(saved || 'Imani Admin')
    const savedEmail = localStorage.getItem('imani_admin_email')
    setAdminEmail(savedEmail || 'admin@imani.com')
  }, [])

  const handleSaveName = (e) => {
    e.preventDefault()
    if (!adminName.trim()) return
    localStorage.setItem('imani_admin_name', adminName.trim())
    setNameSaved(true)
    setTimeout(() => setNameSaved(false), 3000)
  }

  const handleSaveEmail = async (e) => {
    e.preventDefault()
    setEmailError('')
    setEmailSaved(false)
    if (!adminEmail.includes('@')) {
      setEmailError('Email invalide')
      return
    }
    setSavingEmail(true)
    try {
      await authAPI.updateEmail(adminEmail)
      localStorage.setItem('imani_admin_email', adminEmail)
      setEmailSaved(true)
      setTimeout(() => setEmailSaved(false), 3000)
    } catch (err) {
      setEmailError(err.response?.data?.error || 'Erreur lors de la modification de l\'email')
    }
    setSavingEmail(false)
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSaved(false)

    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setSaving(true)
    try {
      await authAPI.changePassword(currentPassword, newPassword)
      setPasswordSaved(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordSaved(false), 3000)
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Erreur lors du changement de mot de passe')
    }
    setSaving(false)
  }

  return (
    <AdminLayout activeNav="settings">
      <div className="settings-header">
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>
          <i className="fas fa-cog" style={{ marginRight: '0.75rem' }}></i>
          Paramètres
        </h1>
        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '0.95rem' }}>
          Gérez votre profil et vos identifiants de connexion
        </p>
      </div>

      <div className="settings-grid">
        <div className="admin-card">
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            <i className="fas fa-user-circle" style={{ marginRight: '0.5rem', color: 'var(--rose-accent)' }}></i>
            Nom d'affichage
          </h2>
          <form onSubmit={handleSaveName}>
            <div className="form-group">
              <label>Votre nom</label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Imani Admin"
                required
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
              />
            </div>
            <button
              type="submit"
              className="order-btn primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            >
              <i className="fas fa-save"></i> Enregistrer
            </button>
            {nameSaved && (
              <div style={{ marginTop: '0.8rem', padding: '0.6rem', background: '#d4edda', color: '#155724', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' }}>
                <i className="fas fa-check-circle"></i> Nom enregistré
              </div>
              )}
            </form>
          </div>

          <div className="admin-card">
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
              <i className="fas fa-envelope" style={{ marginRight: '0.5rem', color: 'var(--rose-accent)' }}></i>
              Email de connexion
            </h2>
            <form onSubmit={handleSaveEmail}>
              <div className="form-group">
                <label>Email administrateur</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@imani.com"
                  required
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
              {emailError && (
                <div style={{ padding: '0.6rem', background: '#fde8e8', color: '#e74c3c', borderRadius: '8px', marginBottom: '0.8rem', fontSize: '0.9rem', textAlign: 'center' }}>
                  <i className="fas fa-exclamation-circle" style={{ marginRight: '0.5rem' }}></i>
                  {emailError}
                </div>
              )}
              <button
                type="submit"
                className="order-btn primary"
                disabled={savingEmail}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {savingEmail ? (
                  <><i className="fas fa-spinner fa-spin"></i> Enregistrement...</>
                ) : (
                  <><i className="fas fa-save"></i> Enregistrer l'email</>
                )}
              </button>
              {emailSaved && (
                <div style={{ marginTop: '0.8rem', padding: '0.6rem', background: '#d4edda', color: '#155724', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' }}>
                  <i className="fas fa-check-circle"></i> Email modifié avec succès
                </div>
              )}
            </form>
          </div>

          <div className="admin-card">
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
              <i className="fas fa-lock" style={{ marginRight: '0.5rem', color: 'var(--rose-accent)' }}></i>
              Mot de passe
            </h2>
            <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Mot de passe actuel</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd.current ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.8rem', paddingRight: '2.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
                <span onClick={() => setShowPwd(prev => ({ ...prev, current: !prev.current }))}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#999' }}>
                  <i className={`fas fa-eye${showPwd.current ? '' : '-slash'}`}></i>
                </span>
              </div>
            </div>
            <div className="form-group">
              <label>Nouveau mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd.new ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{ width: '100%', padding: '0.8rem', paddingRight: '2.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
                <span onClick={() => setShowPwd(prev => ({ ...prev, new: !prev.new }))}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#999' }}>
                  <i className={`fas fa-eye${showPwd.new ? '' : '-slash'}`}></i>
                </span>
              </div>
            </div>
            <div className="form-group">
              <label>Confirmer le mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd.confirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{ width: '100%', padding: '0.8rem', paddingRight: '2.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                />
                <span onClick={() => setShowPwd(prev => ({ ...prev, confirm: !prev.confirm }))}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#999' }}>
                  <i className={`fas fa-eye${showPwd.confirm ? '' : '-slash'}`}></i>
                </span>
              </div>
            </div>
            {passwordError && (
              <div style={{ padding: '0.6rem', background: '#fde8e8', color: '#e74c3c', borderRadius: '8px', marginBottom: '0.8rem', fontSize: '0.9rem', textAlign: 'center' }}>
                <i className="fas fa-exclamation-circle" style={{ marginRight: '0.5rem' }}></i>
                {passwordError}
              </div>
            )}
            <button
              type="submit"
              className="order-btn primary"
              disabled={saving}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {saving ? (
                <><i className="fas fa-spinner fa-spin"></i> Modification en cours...</>
              ) : (
                <><i className="fas fa-key"></i> Modifier le mot de passe</>
              )}
            </button>
            {passwordSaved && (
              <div style={{ marginTop: '0.8rem', padding: '0.6rem', background: '#d4edda', color: '#155724', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' }}>
                <i className="fas fa-check-circle"></i> Mot de passe modifié avec succès
              </div>
            )}
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}