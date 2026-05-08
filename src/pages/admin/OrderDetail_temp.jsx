import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import { ordersAPI } from '../../services/api'

const STATUS_OPTIONS = [
  { value: 'new', label: '🔴 Nouveau' },
  { value: 'progress', label: '🟡 En cours' },
  { value: 'sent', label: '🟢 Carnet envoyé' },
  { value: 'done', label: '⚫ Terminé' },
]

const STATUS_LABELS = { new: 'Nouveau', progress: 'En cours', sent: 'Carnet envoyé', done: 'Terminé' }
const STATUS_COLORS = { new: '#E75480', progress: '#f0a030', sent: '#38c172', done: '#888' }

export default function OrderDetail() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')
  const [replyFile, setReplyFile] = useState(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)
