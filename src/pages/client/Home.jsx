import { useState, useCallback, useEffect, useRef } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import * as THREE from 'three'
import TickerBar from '../../components/TickerBar'
import Navbar from '../../components/Navbar'
import ThreeScene from '../../components/ThreeScene'
import Footer from '../../components/Footer'
import HeroSection from './HeroSection'
import IntroSection from './IntroSection'
import ProcessSection from './ProcessSection'
import DestinationsSection from './DestinationsSection'
import TestimonialsSection from './TestimonialsSection'
import WhatsAppCTA from './WhatsAppCTA'
import EngagementsOverlay from './EngagementsOverlay'
import TravelForm from './TravelForm'
import useEarthEffects from '../../hooks/useEarthEffects'

const ease = (t) => t * t * (3 - 2 * t)

export default function Home() {
  const [formOpen, setFormOpen] = useState(false)
  const [formInitialized, setFormInitialized] = useState(false)
  const [engagementsOpen, setEngagementsOpen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const cameraRef = useRef(null)
  const sceneRef = useRef(null)
  const earthRef = useRef(null)
  const animFrameRef = useRef(null)

  const {
    message,
    updateNameMarker,
    updatePeopleMarkers,
    updateWeather,
    syncEarthWithProfile,
    syncDestinationType,
    syncActivities,
    syncClimate,
    syncBudget,
    syncHebergement,
    syncEnglish,
    syncAlimentation,
    syncFeelings,
    syncPeriod,
    syncDuration,
    animateAvatarEffects,
    cleanupAll,
    getEarthRotationSpeed,
  } = useEarthEffects(sceneRef, earthRef)

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    })
  }, [])

  const animateCamera = useCallback((targetX, targetY, targetZ, onComplete) => {
    const camera = cameraRef.current
    if (!camera || isTransitioning) {
      onComplete?.()
      return
    }

    setIsTransitioning(true)
    const startPosition = camera.position.clone()
    const targetPosition = new THREE.Vector3(targetX, targetY, targetZ)

    let progress = 0
    const speed = 0.015

    const animate = () => {
      progress += speed
      const eased = ease(progress)

      camera.position.x = startPosition.x + (targetPosition.x - startPosition.x) * eased
      camera.position.y = startPosition.y + (targetPosition.y - startPosition.y) * eased
      camera.position.z = startPosition.z + (targetPosition.z - startPosition.z) * eased
      camera.lookAt(0, 0, 0)

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate)
      } else {
        setIsTransitioning(false)
        onComplete?.()
      }
    }

    animate()
  }, [isTransitioning])

  const openForm = useCallback(() => {
    setFormOpen(true)
    if (!formInitialized) {
      setTimeout(() => setFormInitialized(true), 100)
    }
    animateCamera(-0.5, 0.1, 13.5)
  }, [formInitialized, animateCamera])

  const closeForm = useCallback(() => {
    cleanupAll()
    animateCamera(0, 0, 14, () => {
      setFormOpen(false)
    })
  }, [animateCamera, cleanupAll])

  const openEngagements = useCallback(() => {
    setEngagementsOpen(true)
  }, [])

  const closeEngagements = useCallback(() => {
    setEngagementsOpen(false)
  }, [])

  useEffect(() => {
    if (formOpen) {
      document.body.classList.add('show-form')
    } else {
      document.body.classList.remove('show-form')
    }
    return () => {
      document.body.classList.remove('show-form')
    }
  }, [formOpen])

  const formCallbacks = {
    updateNameMarker,
    updatePeopleMarkers,
    updateWeather,
    syncEarthWithProfile,
    syncDestinationType,
    syncActivities,
    syncClimate,
    syncBudget,
    syncHebergement,
    syncEnglish,
    syncAlimentation,
    syncFeelings,
    syncPeriod,
    syncDuration,
  }

  return (
    <>
      <div id="canvas-container"><ThreeScene cameraRef={cameraRef} sceneRef={sceneRef} earthRef={earthRef} avatarAnimateFn={animateAvatarEffects} getRotationSpeed={getEarthRotationSpeed} /></div>
      <div className="overlay"></div>

      <TickerBar />
      <Navbar onOpenForm={openForm} onOpenEngagements={openEngagements} />

      <div className="page-content">
        <HeroSection onOpenForm={openForm} />
        <IntroSection />
        <ProcessSection />
        <DestinationsSection />
        <TestimonialsSection />
        <WhatsAppCTA />
        <Footer onOpenEngagements={openEngagements} />
      </div>

      <TravelForm isOpen={formOpen && formInitialized} onClose={closeForm} callbacks={formCallbacks} formDataShape={{ age: '', composition: '' }} />
      <EngagementsOverlay isOpen={engagementsOpen} onClose={closeEngagements} />

      {message && (
        <div className="earth-message-toast" key={message}>
          {message}
        </div>
      )}
    </>
  )
}
