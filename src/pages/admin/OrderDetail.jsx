import React, { useState, useEffect, useRef } from "react"
import { useParams, useSearchParams, useNavigate } from "react-router-dom"
import AdminLayout from "../../components/AdminLayout"
import { ordersAPI } from "../../services/api"

const STATUS_OPTIONS = [
  { value: "new", label: "🔴 Nouveau" },
  { value: "progress", label: "🟡 En cours" },
  { value: "sent", label: "🟢 Carnet envoyé" },
  { value: "done", label: "⚫ Terminé" },
]

const STATUS_LABELS = { new: "Nouveau", progress: "En cours", sent: "Carnet envoyé", done: "Terminé" }
const STATUS_COLORS = { new: "#E75480", progress: "#f0a030", sent: "#38c172", done: "#888" }

export default function OrderDetail() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [replyMessage, setReplyMessage] = useState("")
  const [replyFile, setReplyFile] = useState(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = () => {
    setLoading(true)
    ordersAPI.getById(id)
      .then(res => {
        setOrder(res.data)
        setLoading(false)
      })
      .catch(() => {
        setNotFound(true)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (searchParams.get("reply") === "1") {
      const ta = document.getElementById("replyMessage")
      if (ta) ta.focus()
    }
  }, [order, searchParams])

  const handleStatusChange = (newStatus) => {
    if (newStatus === order.status) return
    setUpdatingStatus(true)
    ordersAPI.updateStatus(id, newStatus)
      .then(res => {
        setOrder(res.data)
        setUpdatingStatus(false)
      })
      .catch(err => {
        alert("Erreur lors de la mise à jour du statut")
        setUpdatingStatus(false)
      })
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyMessage && !replyFile) {
      alert("Veuillez ajouter un message ou un fichier")
      return
    }
    setSending(true)
    try {
      await ordersAPI.reply(id, { message: replyMessage, file: replyFile })
      setReplyMessage("")
      setReplyFile(null)
      setSent(true)
      fetchOrder()
      setTimeout(() => setSent(false), 3000)
    } catch (err) {
      alert("Erreur lors de l'envoi de la réponse")
    }
    setSending(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => setDragOver(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === "application/pdf") {
      setReplyFile(file)
    } else {
      alert("Veuillez sélectionner un fichier PDF")
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type === "application/pdf") {
      setReplyFile(file)
    } else {
      alert("Veuillez sélectionner un fichier PDF")
    }
  }

  if (loading) {
    return (
      <AdminLayout activeNav="orders">
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "var(--rose-accent)" }}></i>
        </div>
      </AdminLayout>
    )
  }

  if (notFound || !order) {
    return (
      <AdminLayout activeNav="orders">
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: "3rem", color: "var(--rose-clair)", marginBottom: "1rem", display: "block" }}></i>
          <h2>Commande introuvable</h2>
          <button className="order-btn primary" style={{ marginTop: "1rem", display: "inline-flex", cursor: "pointer" }} onClick={() => navigate("/admin/orders")}>
            <i className="fas fa-arrow-left"></i> Retour aux commandes
          </button>
        </div>
      </AdminLayout>
    )
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "Non spécifiée"
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
  }

  return (
    <AdminLayout activeNav="orders">
      <div style={{ marginBottom: "1.5rem" }}>
        <button
          onClick={() => navigate("/admin/orders")}
          style={{
            background: "none",
            border: "none",
            color: "var(--rose-accent)",
            cursor: "pointer",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <i className="fas fa-arrow-left"></i> Retour aux commandes
        </button>
      </div>

      <div className="detail-grid">
        {/* Colonne gauche - Infos client et voyage */}
        <div className="admin-card">
          <h2 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>
            <i className="fas fa-user-circle" style={{ marginRight: "0.5rem" }}></i>
            Informations client
          </h2>
          <div style={{ marginBottom: "1rem" }}>
            <strong style={{ display: "block", fontSize: "1.1rem", marginBottom: "0.5rem" }}>{order.name}</strong>
            <p style={{ margin: "0.3rem 0", color: "var(--texte-secondaire)" }}>
              <i className="fas fa-envelope" style={{ marginRight: "0.5rem" }}></i>
              {order.email}
            </p>
            {order.phone && (
              <p style={{ margin: "0.3rem 0", color: "var(--texte-secondaire)" }}>
                <i className="fas fa-phone" style={{ marginRight: "0.5rem" }}></i>
                {order.phone}
              </p>
            )}
            {order.age && (
              <p style={{ margin: "0.3rem 0", color: "var(--texte-secondaire)" }}>
                <i className="fas fa-birthday-cake" style={{ marginRight: "0.5rem" }}></i>
                Âge : {order.age}
              </p>
            )}
          </div>

          <h3 style={{ fontSize: "1rem", margin: "1.5rem 0 1rem 0" }}>
            <i className="fas fa-map-marked-alt" style={{ marginRight: "0.5rem" }}></i>
            Détails du voyage
          </h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <p style={{ margin: 0 }}>
              <i className="fas fa-map-marker-alt" style={{ marginRight: "0.5rem", color: "var(--rose-accent)" }}></i>
              <strong>Destination :</strong> {order.destination}
            </p>
            <p style={{ margin: 0 }}>
              <i className="fas fa-calendar" style={{ marginRight: "0.5rem", color: "var(--rose-accent)" }}></i>
              <strong>Date souhaitée :</strong> {formatDate(order.date)}
            </p>
            <p style={{ margin: 0 }}>
              <i className="fas fa-coins" style={{ marginRight: "0.5rem", color: "var(--rose-accent)" }}></i>
              <strong>Budget :</strong> {order.budget}
            </p>
            <p style={{ margin: 0 }}>
              <i className="fas fa-clock" style={{ marginRight: "0.5rem", color: "var(--rose-accent)" }}></i>
              <strong>Durée :</strong> {order.duration}
            </p>
            {order.composition && (
              <p style={{ margin: 0 }}>
                <i className="fas fa-users" style={{ marginRight: "0.5rem", color: "var(--rose-accent)" }}></i>
                <strong>Composition :</strong> {order.composition}
              </p>
            )}
            {order.climate && (
              <p style={{ margin: 0 }}>
                <i className="fas fa-thermometer-half" style={{ marginRight: "0.5rem", color: "var(--rose-accent)" }}></i>
                <strong>Climat :</strong> {order.climate}
              </p>
            )}
            {order.english && (
              <p style={{ margin: 0 }}>
                <i className="fas fa-language" style={{ marginRight: "0.5rem", color: "var(--rose-accent)" }}></i>
                <strong>Anglais :</strong> {order.english}
              </p>
            )}
            {order.travel_style && (
              <p style={{ margin: 0 }}>
                <i className="fas fa-star" style={{ marginRight: "0.5rem", color: "var(--rose-accent)" }}></i>
                <strong>Style :</strong> {order.travel_style}
              </p>
            )}
            {order.accommodation && (
              <p style={{ margin: 0 }}>
                <i className="fas fa-hotel" style={{ marginRight: "0.5rem", color: "var(--rose-accent)" }}></i>
                <strong>Hébergement :</strong> {order.accommodation}
              </p>
            )}
            {order.food && (
              <p style={{ margin: 0 }}>
                <i className="fas fa-utensils" style={{ marginRight: "0.5rem", color: "var(--rose-accent)" }}></i>
                <strong>Alimentation :</strong> {order.food}
              </p>
            )}
            {order.feelings && (
              <p style={{ margin: 0 }}>
                <i className="fas fa-smile" style={{ marginRight: "0.5rem", color: "var(--rose-accent)" }}></i>
                <strong>Envies :</strong> {order.feelings}
              </p>
            )}
          </div>

          {order.activities && order.activities.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <strong style={{ display: "block", marginBottom: "0.5rem" }}>Activités recherchées :</strong>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {order.activities.map((activity, idx) => (
                  <span key={idx} className="order-tag">{activity}</span>
                ))}
              </div>
            </div>
          )}

          {order.message && (
            <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--rose-clair)", borderRadius: "8px" }}>
              <strong>Message du client :</strong>
              <p style={{ margin: "0.5rem 0 0 0" }}>{order.message}</p>
            </div>
          )}
        </div>

        {/* Colonne droite - Statut et Réponse */}
        <div>
          {/* Statut */}
          <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ marginBottom: "1rem", fontSize: "1rem" }}>
              <i className="fas fa-flag" style={{ marginRight: "0.5rem" }}></i>
              Statut de la commande
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <span
                className={`order-status ${order.status}`}
                style={{ fontSize: "0.9rem", padding: "0.4rem 0.8rem" }}
              >
                {STATUS_LABELS[order.status]}
              </span>
              {updatingStatus && <i className="fas fa-spinner fa-spin"></i>}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  disabled={updatingStatus || opt.value === order.status}
                  style={{
                    padding: "0.4rem 0.8rem",
                    borderRadius: "20px",
                    border: `2px solid ${STATUS_COLORS[opt.value]}`,
                    background: order.status === opt.value ? STATUS_COLORS[opt.value] : "transparent",
                    color: order.status === opt.value ? "white" : STATUS_COLORS[opt.value],
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    opacity: opt.value === order.status ? 0.7 : 1
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Répondre */}
          <div className="admin-card">
            <h3 style={{ marginBottom: "1rem", fontSize: "1rem" }}>
              <i className="fas fa-reply" style={{ marginRight: "0.5rem" }}></i>
              Répondre au client
            </h3>
            <form onSubmit={handleReply}>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  id="replyMessage"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows="4"
                  placeholder="Votre message pour le client..."
                  style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd" }}
                ></textarea>
              </div>
              <div className="form-group">
                <label>Carnet de voyage (PDF)</label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragOver ? "var(--rose-accent)" : "#ddd"}`,
                    borderRadius: "8px",
                    padding: "2rem",
                    textAlign: "center",
                    cursor: "pointer",
                    background: dragOver ? "var(--rose-clair)" : "transparent",
                    transition: "all 0.3s"
                  }}
                >
                  <i className="fas fa-cloud-upload-alt" style={{ fontSize: "2rem", color: "var(--rose-accent)", display: "block", marginBottom: "0.5rem" }}></i>
                  {replyFile ? (
                    <p style={{ margin: 0, color: "var(--rose-accent)" }}>
                      <i className="fas fa-file-pdf"></i> {replyFile.name}
                    </p>
                  ) : (
                    <p style={{ margin: 0, color: "var(--texte-secondaire)" }}>
                      Glissez un fichier PDF ici ou cliquez pour sélectionner
                    </p>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                />
              </div>
              <button
                type="submit"
                className="order-btn primary"
                disabled={sending || (!replyMessage && !replyFile)}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {sending ? (
                  <><i className="fas fa-spinner fa-spin"></i> Envoi en cours...</>
                ) : (
                  <><i className="fas fa-paper-plane"></i> Envoyer la réponse</>
                )}
              </button>
              {sent && (
                <div style={{ marginTop: "1rem", padding: "0.8rem", background: "#d4edda", color: "#155724", borderRadius: "8px", textAlign: "center" }}>
                  <i className="fas fa-check-circle"></i> Réponse envoyée avec succès !
                </div>
              )}
            </form>
          </div>

          {/* Historique des réponses */}
          {order.replies && order.replies.length > 0 && (
            <div className="admin-card" style={{ marginTop: "1.5rem" }}>
              <h3 style={{ marginBottom: "1rem", fontSize: "1rem" }}>
                <i className="fas fa-history" style={{ marginRight: "0.5rem" }}></i>
                Historique des réponses
              </h3>
              {order.replies.map((reply, idx) => (
                <div key={idx} style={{ padding: "1rem", background: "var(--rose-clair)", borderRadius: "8px", marginBottom: "0.5rem" }}>
                  <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", color: "var(--texte-secondaire)" }}>
                    <i className="fas fa-clock"></i> {formatDate(reply.createdAt)}
                  </p>
                  {reply.message && <p style={{ margin: "0 0 0.5rem 0" }}>{reply.message}</p>}
                  {reply.pdfPath && (
                    <a
                      href={reply.pdfPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--rose-accent)", fontSize: "0.9rem" }}
                    >
                      <i className="fas fa-file-pdf"></i> Voir le PDF
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
