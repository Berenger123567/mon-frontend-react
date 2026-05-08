import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'

export default function ThreeScene({ cameraRef, sceneRef, earthRef, avatarAnimateFn, getRotationSpeed }) {
  const containerRef = useRef(null)
  const animationRef = useRef(null)

  const setupScene = useCallback(() => {
    const container = containerRef.current
    if (!container) return null

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x050b1a)
    scene.fog = new THREE.FogExp2(0x050b1a, 0.003)

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0, 14)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x050b1a, 1)
    container.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0x404060)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2)
    mainLight.position.set(5, 10, 7)
    scene.add(mainLight)

    const fillLight = new THREE.PointLight(0x88aaff, 0.4)
    fillLight.position.set(-3, 2, 4)
    scene.add(fillLight)

    const backLight = new THREE.PointLight(0xffaa88, 0.3)
    backLight.position.set(0, 1, -8)
    scene.add(backLight)

    const textureLoader = new THREE.TextureLoader()

    const earthGeometry = new THREE.SphereGeometry(2.8, 256, 256)
    const earthMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg')
    const earthSpecularMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg')
    const earthNormalMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg')

    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthMap,
      specularMap: earthSpecularMap,
      specular: new THREE.Color(0x333333),
      shininess: 8,
      normalMap: earthNormalMap,
      normalScale: new THREE.Vector2(0.9, 0.9),
    })
    const earth = new THREE.Mesh(earthGeometry, earthMaterial)
    scene.add(earth)

    const cloudMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_clouds_1024.png')
    const cloudGeometry = new THREE.SphereGeometry(2.83, 256, 256)
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudMap,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    })
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial)
    scene.add(clouds)

    const starCount = 5000
    const starsGeometry = new THREE.BufferGeometry()
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const radius = 30 + Math.random() * 40
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.4
      starPositions[i * 3 + 2] = radius * Math.cos(phi)
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.8 })
    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)

    const nearStarsCount = 2000
    const nearStarsGeometry = new THREE.BufferGeometry()
    const nearStarPositions = new Float32Array(nearStarsCount * 3)
    for (let i = 0; i < nearStarsCount; i++) {
      nearStarPositions[i * 3] = (Math.random() - 0.5) * 70
      nearStarPositions[i * 3 + 1] = (Math.random() - 0.5) * 40
      nearStarPositions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 20
    }
    nearStarsGeometry.setAttribute('position', new THREE.BufferAttribute(nearStarPositions, 3))
    const nearStarsMaterial = new THREE.PointsMaterial({ color: 0xffb6c1, size: 0.04, transparent: true, opacity: 0.5 })
    const nearStars = new THREE.Points(nearStarsGeometry, nearStarsMaterial)
    scene.add(nearStars)

    return { scene, camera, renderer, earth, clouds, stars, nearStars }
  }, [])

  useEffect(() => {
    const result = setupScene()
    if (!result) return

    const { scene, camera, renderer, earth, clouds, stars, nearStars } = result

    cameraRef.current = camera
    earthRef.current = earth
    sceneRef.current = scene

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      const rotSpeed = getRotationSpeed ? getRotationSpeed() : 0.002
      earth.rotation.y += rotSpeed
      clouds.rotation.y += rotSpeed * 1.2
      stars.rotation.y += 0.0002
      nearStars.rotation.x += 0.0001

      if (avatarAnimateFn) avatarAnimateFn()

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', handleResize)
      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [setupScene, cameraRef, sceneRef, earthRef, avatarAnimateFn, getRotationSpeed])

  return <div ref={containerRef} />
}
