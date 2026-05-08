import { useRef, useCallback, useState, useEffect } from 'react'
import * as THREE from 'three'

const EARTH_RADIUS = 2.8
const MARKER_COLOR = 0x00ffcc
const HEART_COLOR = 0xff3366
const FRANCE_LAT = 46.6
const FRANCE_LON = 2.2
const SUN_POSITION = new THREE.Vector3(6, 2.5, 4)

const latLonToVector3 = (lat, lon, radius) => {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

const createCircleMarker = (color, headRadius = 0.2) => {
  const group = new THREE.Group()
  const headGeo = new THREE.SphereGeometry(headRadius, 24, 24)
  const headMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 })
  const head = new THREE.Mesh(headGeo, headMat)
  head.position.y = headRadius * 2
  group.add(head)
  group.head = head

  const ringGeo = new THREE.TorusGeometry(headRadius * 1.8, 0.02, 16, 48)
  const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 })
  const ring = new THREE.Mesh(ringGeo, ringMat)
  ring.position.y = headRadius * 2
  ring.rotation.x = Math.PI / 2
  group.add(ring)
  group.ring = ring

  const ring2Geo = new THREE.TorusGeometry(headRadius * 3, 0.01, 16, 48)
  const ring2Mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.2 })
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
  ring2.position.y = headRadius * 2
  ring2.rotation.x = Math.PI / 2
  group.add(ring2)
  group.ring2 = ring2

  return group
}

const orientMarkerToSurface = (group, position) => {
  group.position.copy(position)
  const direction = position.clone().normalize()
  group.lookAt(position.clone().add(direction))
  group.rotateX(Math.PI / 2)
}

const drawNameLabel = (name) => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 80
  const ctx = canvas.getContext('2d')
  ctx.font = 'bold 44px DM Sans, Arial, sans-serif'
  const tw = ctx.measureText(name).width
  const pad = 20
  const bw = Math.min(tw + pad * 2, 500)
  const bh = 60
  const x = (512 - bw) / 2
  const y = (80 - bh) / 2
  const r = 15

  ctx.fillStyle = 'rgba(0,0,0,0.55)'
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + bw - r, y)
  ctx.quadraticCurveTo(x + bw, y, x + bw, y + r)
  ctx.lineTo(x + bw, y + bh - r)
  ctx.quadraticCurveTo(x + bw, y + bh, x + bw - r, y + bh)
  ctx.lineTo(x + r, y + bh)
  ctx.quadraticCurveTo(x, y + bh, x, y + bh - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#00ffcc'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = '#00ffcc'
  ctx.shadowBlur = 12
  ctx.fillText(name, 256, 40)
  return canvas
}

const makeSprite = (canvas, scale = 1.0) => {
  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false })
  const sprite = new THREE.Sprite(mat)
  sprite.scale.set(scale, scale * (canvas.height / canvas.width), 1)
  return sprite
}

const drawHeart = (color, size = 256) => {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const cx = size / 2
  const cy = size / 2
  const s = size * 0.032

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.shadowColor = color
  ctx.shadowBlur = 30
  ctx.beginPath()
  ctx.moveTo(cx, cy + s * 12)
  ctx.bezierCurveTo(cx - s * 2, cy + s * 6, cx - s * 16, cy - s * 2, cx - s * 16, cy - s * 8)
  ctx.bezierCurveTo(cx - s * 16, cy - s * 18, cx - s * 6, cy - s * 20, cx, cy - s * 10)
  ctx.bezierCurveTo(cx + s * 6, cy - s * 20, cx + s * 16, cy - s * 18, cx + s * 16, cy - s * 8)
  ctx.bezierCurveTo(cx + s * 16, cy - s * 2, cx + s * 2, cy + s * 6, cx, cy + s * 12)
  ctx.closePath()

  const grad = ctx.createRadialGradient(cx, cy - s * 5, s * 2, cx, cy, s * 18)
  grad.addColorStop(0, '#ff88aa')
  grad.addColorStop(0.5, color)
  grad.addColorStop(1, color)
  ctx.fillStyle = grad
  ctx.fill()
  ctx.shadowBlur = 0
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(cx - s * 6, cy - s * 10, s * 3, s * 2, -0.5, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.fill()
  return canvas
}

const drawSunCanvas = (opacity = 1.0, size = 512) => {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const cx = size / 2
  const cy = size / 2
  const coreRadius = size * 0.15

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const haloGrad = ctx.createRadialGradient(cx, cy, coreRadius * 2, cx, cy, size * 0.48)
  haloGrad.addColorStop(0, `rgba(255, 200, 50, ${0.12 * opacity})`)
  haloGrad.addColorStop(0.5, `rgba(255, 150, 30, ${0.05 * opacity})`)
  haloGrad.addColorStop(1, 'rgba(255, 100, 0, 0)')
  ctx.fillStyle = haloGrad
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.save()
  ctx.translate(cx, cy)
  const rayCount = 24
  for (let i = 0; i < rayCount; i++) {
    const angle = (i / rayCount) * Math.PI * 2
    const rayLen = coreRadius * (1.5 + Math.random() * 2.5)
    const rayWidth = 0.03 + Math.random() * 0.04
    ctx.beginPath()
    ctx.rotate(angle)
    ctx.moveTo(coreRadius * 0.8, -rayWidth * coreRadius)
    ctx.lineTo(rayLen, -rayWidth * rayLen * 0.3)
    ctx.lineTo(rayLen, rayWidth * rayLen * 0.3)
    ctx.lineTo(coreRadius * 0.8, rayWidth * coreRadius)
    ctx.closePath()
    const rayGrad = ctx.createLinearGradient(coreRadius, 0, rayLen, 0)
    rayGrad.addColorStop(0, `rgba(255, 230, 100, ${0.5 * opacity})`)
    rayGrad.addColorStop(0.6, `rgba(255, 180, 50, ${0.15 * opacity})`)
    rayGrad.addColorStop(1, 'rgba(255, 120, 0, 0)')
    ctx.fillStyle = rayGrad
    ctx.fill()
    ctx.rotate(-angle)
  }
  ctx.restore()

  const coronaGrad = ctx.createRadialGradient(cx, cy, coreRadius * 0.5, cx, cy, coreRadius * 2.5)
  coronaGrad.addColorStop(0, `rgba(255, 255, 220, ${0.9 * opacity})`)
  coronaGrad.addColorStop(0.3, `rgba(255, 220, 80, ${0.7 * opacity})`)
  coronaGrad.addColorStop(0.6, `rgba(255, 170, 30, ${0.3 * opacity})`)
  coronaGrad.addColorStop(1, 'rgba(255, 100, 0, 0)')
  ctx.fillStyle = coronaGrad
  ctx.beginPath()
  ctx.arc(cx, cy, coreRadius * 2.5, 0, Math.PI * 2)
  ctx.fill()

  const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius)
  coreGrad.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
  coreGrad.addColorStop(0.5, `rgba(255, 240, 150, ${0.95 * opacity})`)
  coreGrad.addColorStop(1, `rgba(255, 200, 50, ${0.7 * opacity})`)
  ctx.fillStyle = coreGrad
  ctx.beginPath()
  ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2)
  ctx.fill()
  return canvas
}

export default function useEarthEffects(sceneRef, earthRef) {
  const [message, setMessage] = useState('')
  const userMarkerRef = useRef(null)
  const nameSpriteRef = useRef(null)
  const peopleMarkersRef = useRef([])
  const heartSpriteRef = useRef(null)
  const sunSpriteRef = useRef(null)
  const snowParticlesRef = useRef(null)
  const currentRingRef = useRef(null)
  const currentParticleRef = useRef(null)
  const userLatRef = useRef(null)
  const userLonRef = useRef(null)
  const geoRequestedRef = useRef(false)
  const earthRotationSpeedRef = useRef(0.002)
  const originalEarthColorRef = useRef(null)

  const showEarthMessage = useCallback((msg, duration = 3000) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), duration)
  }, [])

  const createParticleEffect = useCallback((color, count = 100, duration = 2000, radius = 4) => {
    const scene = sceneRef.current
    if (!scene) return
    if (currentParticleRef.current) scene.remove(currentParticleRef.current)

    const particleGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const velocities = []
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = radius + Math.random() * 1.5
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      velocities.push({ x: (Math.random() - 0.5) * 0.02, y: (Math.random() - 0.5) * 0.02, z: (Math.random() - 0.5) * 0.02 })
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMaterial = new THREE.PointsMaterial({ color, size: 0.04, transparent: true, opacity: 0.8 })
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particleSystem)
    currentParticleRef.current = particleSystem

    const startTime = Date.now()
    const animate = () => {
      if (!particleSystem.parent) return
      const pos = particleSystem.geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        pos[i * 3] += velocities[i].x
        pos[i * 3 + 1] += velocities[i].y
        pos[i * 3 + 2] += velocities[i].z
      }
      particleSystem.geometry.attributes.position.needsUpdate = true
      if (Date.now() - startTime < duration) requestAnimationFrame(animate)
    }
    animate()
    setTimeout(() => {
      if (particleSystem.parent) scene.remove(particleSystem)
      if (currentParticleRef.current === particleSystem) currentParticleRef.current = null
    }, duration)
  }, [sceneRef])

  const createHeartEffect = useCallback((duration = 3000) => {
    const scene = sceneRef.current
    if (!scene) return
    const heartPositions = []
    for (let i = 0; i < 300; i++) {
      const t = Math.random() * Math.PI * 2
      const x = 16 * Math.pow(Math.sin(t), 3)
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
      heartPositions.push(x * 0.08, y * 0.08 + 2.5, (Math.random() - 0.5) * 2.5)
    }
    const heartGeometry = new THREE.BufferGeometry()
    heartGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(heartPositions), 3))
    const heartMaterial = new THREE.PointsMaterial({ color: 0xff3366, size: 0.05, transparent: true })
    const heart = new THREE.Points(heartGeometry, heartMaterial)
    scene.add(heart)
    setTimeout(() => { scene.remove(heart) }, duration)
  }, [sceneRef])

  const createCometEffect = useCallback(() => {
    const scene = sceneRef.current
    if (!scene) return
    const cometGeometry = new THREE.BufferGeometry()
    const trailLength = 50
    const positions = new Float32Array(trailLength * 3)
    for (let i = 0; i < trailLength; i++) {
      positions[i * 3] = -10 - i * 0.2
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1
    }
    cometGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const cometMaterial = new THREE.PointsMaterial({ color: 0xff6600, size: 0.08 })
    const comet = new THREE.Points(cometGeometry, cometMaterial)
    scene.add(comet)

    let cometX = -12
    const animate = () => {
      if (!comet.parent) return
      cometX += 0.15
      comet.position.x = cometX
      if (cometX > 15) { scene.remove(comet); return }
      requestAnimationFrame(animate)
    }
    animate()
    setTimeout(() => { if (comet.parent) scene.remove(comet) }, 3000)
  }, [sceneRef])

  const applyEarthColorFilter = useCallback((color, intensity = 0.3) => {
    const earth = earthRef.current
    if (!earth || !earth.material) return
    if (!originalEarthColorRef.current) originalEarthColorRef.current = earth.material.color.getHex()
    const filterColor = new THREE.Color(color)
    const orig = new THREE.Color(originalEarthColorRef.current)
    earth.material.color.setRGB(
      filterColor.r * intensity + orig.r * (1 - intensity),
      filterColor.g * intensity + orig.g * (1 - intensity),
      filterColor.b * intensity + orig.b * (1 - intensity)
    )
    setTimeout(() => {
      if (earth.material && originalEarthColorRef.current) earth.material.color.setHex(originalEarthColorRef.current)
    }, 3000)
  }, [earthRef])

  const requestGeolocation = useCallback((callback) => {
    if (!navigator.geolocation) { callback(FRANCE_LAT, FRANCE_LON); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => { callback(pos.coords.latitude, pos.coords.longitude) },
      () => { callback(FRANCE_LAT, FRANCE_LON) },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
    )
  }, [])

  const updateNameMarker = useCallback((name) => {
    const earth = earthRef.current
    const scene = sceneRef.current
    if (!earth || !scene || !name || name.length < 2) return

    if (!userMarkerRef.current && !geoRequestedRef.current) {
      geoRequestedRef.current = true
      requestGeolocation((lat, lon) => {
        if (userMarkerRef.current) return
        userLatRef.current = lat
        userLonRef.current = lon
        const pos = latLonToVector3(lat, lon, EARTH_RADIUS)
        userMarkerRef.current = createCircleMarker(MARKER_COLOR, 0.18)
        orientMarkerToSurface(userMarkerRef.current, pos)
        earth.add(userMarkerRef.current)
        nameSpriteRef.current = makeSprite(drawNameLabel(name.split(' ')[0]), 1.5)
        nameSpriteRef.current.position.copy(pos.clone().normalize().multiplyScalar(EARTH_RADIUS + 1.0))
        earth.add(nameSpriteRef.current)
      })
    } else if (nameSpriteRef.current) {
      nameSpriteRef.current.material.map.image.getContext('2d').clearRect(0, 0, 512, 80)
      nameSpriteRef.current.material.map.image.getContext('2d').drawImage(drawNameLabel(name.split(' ')[0]), 0, 0)
      nameSpriteRef.current.material.map.needsUpdate = true
    }
  }, [earthRef, sceneRef, requestGeolocation])

  const updatePeopleMarkers = useCallback((type) => {
    const earth = earthRef.current
    if (!earth) return
    peopleMarkersRef.current.forEach(m => earth.remove(m))
    peopleMarkersRef.current = []
    if (heartSpriteRef.current) { earth.remove(heartSpriteRef.current); heartSpriteRef.current = null }
    if (nameSpriteRef.current) { earth.remove(nameSpriteRef.current); nameSpriteRef.current = null }
    if (userMarkerRef.current) { earth.remove(userMarkerRef.current); userMarkerRef.current = null }

    let count = 1
    if (type === 'couple') count = 2
    if (type === 'amis' || type === 'famille' || type === 'groupe') count = 3

    const lat = userLatRef.current || FRANCE_LAT
    const lon = userLonRef.current || FRANCE_LON
    for (let i = 0; i < count; i++) {
      const lonOffset = (i - (count - 1) / 2) * 2.5
      const pos = latLonToVector3(lat, lon + lonOffset, EARTH_RADIUS)
      const marker = createCircleMarker(MARKER_COLOR, 0.14)
      orientMarkerToSurface(marker, pos)
      earth.add(marker)
      peopleMarkersRef.current.push(marker)
    }
    if (type === 'couple' && peopleMarkersRef.current.length === 2) {
      heartSpriteRef.current = makeSprite(drawHeart('#ff3366'), 0.5)
      const mid = new THREE.Vector3().lerpVectors(peopleMarkersRef.current[0].position, peopleMarkersRef.current[1].position, 0.5)
      heartSpriteRef.current.position.copy(mid.clone().normalize().multiplyScalar(EARTH_RADIUS + 0.8))
      earth.add(heartSpriteRef.current)
    }
  }, [earthRef])

  const updateWeather = useCallback((climate) => {
    const scene = sceneRef.current
    if (!scene) return
    if (sunSpriteRef.current) { scene.remove(sunSpriteRef.current); sunSpriteRef.current = null }
    if (snowParticlesRef.current) { scene.remove(snowParticlesRef.current); snowParticlesRef.current = null }
    if (!climate) return

    if (climate === 'hot' || climate === 'temperate') {
      const opacity = climate === 'hot' ? 1.0 : 0.45
      const scale = climate === 'hot' ? 3.0 : 2.2
      sunSpriteRef.current = makeSprite(drawSunCanvas(opacity), scale)
      sunSpriteRef.current.position.copy(SUN_POSITION)
      scene.add(sunSpriteRef.current)
    } else if (climate === 'cold') {
      const count = 300
      const geo = new THREE.BufferGeometry()
      const pos = new Float32Array(count * 3)
      const vels = []
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 8
        pos[i * 3 + 1] = 4 + Math.random() * 4
        pos[i * 3 + 2] = (Math.random() - 0.5) * 8
        vels.push(0.005 + Math.random() * 0.01)
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      snowParticlesRef.current = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.7 }))
      snowParticlesRef.current.velocities = vels
      scene.add(snowParticlesRef.current)
    }
  }, [sceneRef])

  const syncEarthWithProfile = useCallback((age, composition) => {
    const combo = `${age}-${composition}`
    const messages = {
      '-18-solo': ["🎒 Premier grand voyage ! La Terre s'illumine pour toi ✨", () => createParticleEffect(0xff8844, 120)],
      '18-25-solo': ["🚀 Aventure en solo ! La Terre vibre d'énergie ⚡", () => createParticleEffect(0xff6600, 150), () => createCometEffect(), () => applyEarthColorFilter(0xff6600, 0.2)],
      '26-35-solo': ["💼 Voyage actif ! Découvrez le monde avec dynamisme 🌟", () => createParticleEffect(0xffaa44, 100)],
      '36-50-solo': ["🧘 Voyage de reconnexion... Harmonie et sérénité 🌊", () => applyEarthColorFilter(0x88aaff, 0.15)],
      '50+-solo': ["🕯️ Voyage d'exception... Laissez-vous porter par la magie ✨", () => { earthRotationSpeedRef.current = 0.001; setTimeout(() => { earthRotationSpeedRef.current = 0.002 }, 5000) }],
      '-18-couple': ["💕 Premiers voyages à deux ! Magique ❤️", () => createHeartEffect()],
      '18-25-couple': ["💕 Jeunes amoureux... La Terre vibre d'amour ! 🎆", () => createParticleEffect(0xff3366, 120), () => createHeartEffect()],
      '26-35-couple': ["💑 Belle complicité... Un voyage romantique vous attend ❤️", () => createParticleEffect(0xff69b4, 80), () => createHeartEffect()],
      '36-50-couple': ["💝 Romance et confort... Un séjour d'exception ✨", () => createHeartEffect(), () => applyEarthColorFilter(0xffaa88, 0.15)],
      '50+-couple': ["💖 L'amour qui dure... Un voyage inoubliable ❤️", () => createHeartEffect(), () => { earthRotationSpeedRef.current = 0.001; setTimeout(() => { earthRotationSpeedRef.current = 0.002 }, 5000) }],
      '18-25-amis': ["🎉 Roadtrip entre potes ! Préparez-vous pour l'aventure 🚗", () => createParticleEffect(0xffaa44, 200), () => createCometEffect()],
      '26-35-amis': ["🍻 Voyage entre amis ! Souvenirs garantis 📸", () => createParticleEffect(0xff8844, 120)],
      'famille': ["👨‍👩‍👧‍👦 Voyage en famille ! Des souvenirs pour tous 🌈", () => createParticleEffect(0x44aaff, 100)],
      'groupe': ["👥 Voyage en groupe ! L'aventure collective vous attend 🌍", () => createParticleEffect(0xffaa88, 150)],
    }
    const handlers = messages[combo]
    if (handlers) { showEarthMessage(handlers[0], 3000); handlers.slice(1).forEach(fn => fn()) }
  }, [showEarthMessage, createParticleEffect, createCometEffect, createHeartEffect, applyEarthColorFilter])

  const syncDestinationType = useCallback((type) => {
    const msgs = {
      plage: ["🏖️ Plages de rêve... Soleil et sable fin vous attendent ☀️", () => applyEarthColorFilter(0x44aaff, 0.2)],
      montagne: ["⛰️ Montagnes majestueuses... Grand air et panoramas 🏔️"],
      ville: ["🌆 Vie urbaine... Énergie et découvertes 🏙️", () => createParticleEffect(0xffaa66, 100)],
      campagne: ["🌿 Campagne paisible... Authenticité et calme 🍃"],
      ile: ["🏝️ Île paradisiaque... Évasion garantie 🌊", () => createParticleEffect(0x44ccff, 80)],
    }
    const handlers = msgs[type]
    if (handlers) { showEarthMessage(handlers[0], 2500); handlers.slice(1).forEach(fn => fn()) }
  }, [showEarthMessage, createParticleEffect, applyEarthColorFilter])

  const syncActivities = useCallback((activity) => {
    const msgs = {
      aventure: ["🧗 Aventure détectée ! Préparez-vous à l'excitation ! ⚡", () => createParticleEffect(0xff4400, 200), () => createCometEffect()],
      detente: ["🧘 Détente absolue... La Terre se repose avec vous 🌊", () => { earthRotationSpeedRef.current = 0.001; setTimeout(() => { earthRotationSpeedRef.current = 0.002 }, 4000) }],
      culture: ["🏛️ Passion culture ! Découvrez les trésors du monde 📚", () => createParticleEffect(0xffaa44, 80)],
      nature: ["🌲 Nature et évasion... Ressourcez-vous 🌿", () => applyEarthColorFilter(0x44aa66, 0.15)],
      culinaire: ["🍷 Gastronomie ! Voyage culinaire 🍜", () => createParticleEffect(0xff8844, 60)],
    }
    const handlers = msgs[activity]
    if (handlers) { showEarthMessage(handlers[0], 2500); handlers.slice(1).forEach(fn => fn()) }
  }, [showEarthMessage, createParticleEffect, createCometEffect, applyEarthColorFilter])

  const syncClimate = useCallback((climate) => {
    const msgs = {
      hot: ["☀️ Soleil et chaleur... Vacances paradisiaques 🏖️", () => createParticleEffect(0xffd700, 100)],
      temperate: ["🌤️ Climat tempéré... Douceur et confort 🍃"],
      cold: ["❄️ Hiver... Blanc et magique ⛄", () => createParticleEffect(0x88ccff, 100)],
    }
    const handlers = msgs[climate]
    if (handlers) { showEarthMessage(handlers[0], 2500); handlers.slice(1).forEach(fn => fn()) }
  }, [showEarthMessage, createParticleEffect])

  const syncBudget = useCallback((budget) => {
    const msgs = {
      '1200€+': ["💰 Budget confort ! Préparez-vous au luxe ✨", () => createParticleEffect(0xffd700, 150)],
      '900-1200€': ["🌟 Budget équilibré ! De belles expériences vous attendent ✨"],
      '600-900€': ["🎒 Voyage malin ! De superbes découvertes vous attendent 🌟", () => createParticleEffect(0xffaa88, 60)],
      '300-600€': ["💡 Voyage optimisé ! L'aventure sans se ruiner 🎒", () => createParticleEffect(0x88aaff, 50)],
      '-300€': ["🎯 Petit budget, grandes aventures ! On va se creuser la tête 💪", () => createParticleEffect(0xffaa88, 40)],
    }
    const handlers = msgs[budget]
    if (handlers) { showEarthMessage(handlers[0], 2500); handlers.slice(1).forEach(fn => fn()) }
  }, [showEarthMessage, createParticleEffect])

  const syncHebergement = useCallback((type) => {
    const msgs = {
      simple: ["🏨 Hôtel simple... Efficace et confort ✨", () => createParticleEffect(0xffaa88, 50)],
      luxe: ["✨ Hôtel luxe... Prestige et raffinement 🏰", () => createParticleEffect(0xffd700, 120)],
      airbnb: ["🏠 Airbnb... Authenticité et charme 🏡"],
      auberge: ["🎒 Auberge... Convivialité et rencontres 👥", () => createParticleEffect(0x44aaff, 80)],
    }
    const handlers = msgs[type]
    if (handlers) { showEarthMessage(handlers[0], 2500); handlers.slice(1).forEach(fn => fn()) }
  }, [showEarthMessage, createParticleEffect])

  const syncEnglish = useCallback((level) => {
    const msgs = {
      none: ["🔇 Aucun anglais... Pas de souci, on s'adapte 🌊"],
      beginner: ["📖 Débutant... On va apprendre ensemble 📚", () => createParticleEffect(0xffaa44, 50)],
      intermediate: ["💬 Intermédiaire... On se débrouille bien 🗣"],
      advanced: ["🎯 Avancé... Bilingue power 🌍", () => createParticleEffect(0x44aaff, 80)],
    }
    const handlers = msgs[level]
    if (handlers) { showEarthMessage(handlers[0], 2500); handlers.slice(1).forEach(fn => fn()) }
  }, [showEarthMessage, createParticleEffect])

  const syncAlimentation = useCallback((type) => {
    const msgs = {
      vegetarien: ["🥬 Végétarien... Cuisine saine et fraîche 🥗"],
      vegan: ["🌱 Vegan... Respect total de la nature 🌿", () => applyEarthColorFilter(0x44cc66, 0.15)],
      halal: ["☪️ Halal... Tradition respectée ☪", () => createParticleEffect(0x88aaff, 60)],
      sans_gluten: ["🌾 Sans gluten... Digestion paisible 🧘"],
      allergies: ["⚠️ Allergies... Prudence maximale, tout sera géré ⚠️"],
    }
    const handlers = msgs[type]
    if (handlers) { showEarthMessage(handlers[0], 2500); handlers.slice(1).forEach(fn => fn()) }
  }, [showEarthMessage, createParticleEffect, applyEarthColorFilter])

  const syncFeelings = useCallback((feeling) => {
    const msgs = {
      libre: ["🕊️ Liberté ! Le monde s'offre à vous 🌍", () => createCometEffect()],
      heureux: ["😊 Du bonheur à l'état pur ! ✨", () => createParticleEffect(0xffd700, 80)],
      repose: ["🧘 Repos assuré... Rien ne presse 🌊"],
      energique: ["⚡ Plein d'énergie ! Prêt à conquérir le monde 🚀", () => createParticleEffect(0xff6600, 120), () => createCometEffect()],
      depayse: ["🌍 Dépaysement total... Voyage au bout du monde 🌏", () => createParticleEffect(0x44aaff, 100)],
      inspire: ["✨ Inspiration... Créativité au rendez-vous 🎨"],
    }
    const handlers = msgs[feeling]
    if (handlers) { showEarthMessage(handlers[0], 2500); handlers.slice(1).forEach(fn => fn()) }
  }, [showEarthMessage, createCometEffect, createParticleEffect])

  const syncPeriod = useCallback((period) => {
    const msgs = {
      printemps: ["🌸 Printemps... Renouveau et fraîcheur 🌷", () => createParticleEffect(0xff88aa, 80)],
      ete: ["☀️ Été... Chaleur et plaisir 🏖️", () => createParticleEffect(0xffaa44, 100)],
      automne: ["🍂 Automne... Couleurs et sérénité 🍁", () => createParticleEffect(0xff8844, 80)],
      hiver: ["❄️ Hiver... Blanc et magique ⛄", () => createParticleEffect(0x88ccff, 100)],
      flexible: ["📅 Flexible... On s'adapte parfaitement 🌟"],
    }
    const handlers = msgs[period]
    if (handlers) { showEarthMessage(handlers[0], 2500); handlers.slice(1).forEach(fn => fn()) }
  }, [showEarthMessage, createParticleEffect])

  const syncDuration = useCallback((duration) => {
    const msgs = {
      '3-5': ["🎒 Court séjour ! Intense et efficace ⚡", () => createParticleEffect(0xffaa66, 60)],
      '6-8': ["🌟 Durée classique... Le bon équilibre ⚡"],
      '9-12': ["🌟 Voyage approfondi... Découvertes multiples 🌍", () => createParticleEffect(0xff8844, 100)],
      '12+': ["🌍 Voyage long cours ! Immersion totale 🌏", () => createParticleEffect(0x44aaff, 150), () => createCometEffect()],
    }
    const handlers = msgs[duration]
    if (handlers) { showEarthMessage(handlers[0], 2500); handlers.slice(1).forEach(fn => fn()) }
  }, [showEarthMessage, createParticleEffect, createCometEffect])

  const animateAvatarEffects = useCallback(() => {
    const t = Date.now() * 0.003
    const marker = userMarkerRef.current
    if (marker) {
      if (marker.ring) { marker.ring.scale.setScalar(1 + Math.sin(t * 2) * 0.2); marker.ring.material.opacity = 0.5 + Math.sin(t * 2) * 0.2 }
      if (marker.ring2) marker.ring2.scale.setScalar(1 + Math.sin(t * 2 + 1) * 0.15)
      if (marker.head) marker.head.scale.setScalar(1 + Math.sin(t * 2 + 0.5) * 0.1)
    }
    peopleMarkersRef.current.forEach((m, i) => {
      if (m.ring) { m.ring.scale.setScalar(1 + Math.sin(t * 2 + i * 0.8) * 0.2); m.ring.material.opacity = 0.5 + Math.sin(t * 2 + i * 0.8) * 0.2 }
      if (m.ring2) m.ring2.scale.setScalar(1 + Math.sin(t * 2 + i + 1) * 0.15)
      if (m.head) m.head.scale.setScalar(1 + Math.sin(t * 2 + i * 0.8 + 0.5) * 0.1)
    })
    if (heartSpriteRef.current) heartSpriteRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.18)
    if (sunSpriteRef.current) sunSpriteRef.current.scale.setScalar(sunSpriteRef.current.scale.x + Math.sin(t * 1.5) * 0.02)
    if (snowParticlesRef.current) {
      const pos = snowParticlesRef.current.geometry.attributes.position.array
      const vels = snowParticlesRef.current.velocities
      for (let i = 0; i < vels.length; i++) {
        pos[i * 3 + 1] -= vels[i]
        if (pos[i * 3 + 1] < -3) {
          pos[i * 3 + 1] = 5 + Math.random() * 3
          pos[i * 3] = (Math.random() - 0.5) * 8
          pos[i * 3 + 2] = (Math.random() - 0.5) * 8
        }
      }
      snowParticlesRef.current.geometry.attributes.position.needsUpdate = true
    }
    if (currentParticleRef.current && currentParticleRef.current.parent) {
      const pos = currentParticleRef.current.geometry.attributes.position.array
      const count = pos.length / 3
      for (let i = 0; i < count; i++) {
        pos[i * 3] += (Math.random() - 0.5) * 0.01
        pos[i * 3 + 1] += (Math.random() - 0.5) * 0.01
        pos[i * 3 + 2] += (Math.random() - 0.5) * 0.01
      }
      currentParticleRef.current.geometry.attributes.position.needsUpdate = true
    }
  }, [])

  const cleanupAll = useCallback(() => {
    const earth = earthRef.current
    const scene = sceneRef.current
    if (!earth || !scene) return
    if (userMarkerRef.current) { earth.remove(userMarkerRef.current); userMarkerRef.current = null }
    if (nameSpriteRef.current) { earth.remove(nameSpriteRef.current); nameSpriteRef.current = null }
    peopleMarkersRef.current.forEach(m => earth.remove(m))
    peopleMarkersRef.current = []
    if (heartSpriteRef.current) { earth.remove(heartSpriteRef.current); heartSpriteRef.current = null }
    if (sunSpriteRef.current) { scene.remove(sunSpriteRef.current); sunSpriteRef.current = null }
    if (snowParticlesRef.current) { scene.remove(snowParticlesRef.current); snowParticlesRef.current = null }
    if (currentParticleRef.current) { scene.remove(currentParticleRef.current); currentParticleRef.current = null }
    geoRequestedRef.current = false
    userLatRef.current = null
    userLonRef.current = null
  }, [earthRef, sceneRef])

  const getEarthRotationSpeed = useCallback(() => earthRotationSpeedRef.current, [])

  return {
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
  }
}
