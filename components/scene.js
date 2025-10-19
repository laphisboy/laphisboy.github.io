import { useState, useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { Box, Spinner } from '@chakra-ui/react'


function createInteractiveScene(scene, camera, renderer) {
  // Create main large object (cube)
  const mainGeometry = new THREE.BoxGeometry(2, 2, 2)
  const mainMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x4ecdc4,
    transparent: true,
    opacity: 0.8
  })
  const mainObject = new THREE.Mesh(mainGeometry, mainMaterial)
  mainObject.position.set(0, 1, 0)
  mainObject.userData = { type: 'main', isTransformed: false }
  scene.add(mainObject)

  // Create smaller draggable object (sphere)
  const smallGeometry = new THREE.SphereGeometry(0.5, 32, 32)
  const smallMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xff6b6b,
    transparent: true,
    opacity: 0.9
  })
  const smallObject = new THREE.Mesh(smallGeometry, smallMaterial)
  smallObject.position.set(3, 1, 0)
  smallObject.userData = { type: 'draggable' }
  scene.add(smallObject)

  // Create outline effect for hover
  const outlineGeometry = new THREE.SphereGeometry(0.52, 32, 32) // Slightly larger
  const outlineMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffaa00,
    transparent: true,
    opacity: 0,
    side: THREE.BackSide
  })
  const outlineObject = new THREE.Mesh(outlineGeometry, outlineMaterial)
  outlineObject.position.copy(smallObject.position)
  outlineObject.visible = false
  scene.add(outlineObject)

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  // Create drag controls for the small object
  const dragControls = new DragControls([smallObject], camera, renderer.domElement)
  
  // Add hover effect and visual feedback
  let isHovering = false
  
  // Mouse hover events
  const onMouseMove = (event) => {
    const rect = renderer.domElement.getBoundingClientRect()
    const mouse = new THREE.Vector2()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(smallObject)
    
    if (intersects.length > 0 && !isHovering) {
      isHovering = true
      smallObject.material.color.setHex(0xff5555) // Slightly brighter red
      smallObject.scale.setScalar(1.05) // Slightly larger
      outlineObject.visible = true
      outlineObject.material.opacity = 0.6 // Subtle glowing outline
      document.body.style.cursor = 'grab'
    } else if (intersects.length === 0 && isHovering) {
      isHovering = false
      smallObject.material.color.setHex(0xff6b6b) // Original red
      smallObject.scale.setScalar(1) // Original size
      outlineObject.visible = false
      outlineObject.material.opacity = 0 // Hide outline
      document.body.style.cursor = 'default'
    }
  }
  
  // Add mouse move listener
  renderer.domElement.addEventListener('mousemove', onMouseMove)
  
  // Add drag event listeners
  dragControls.addEventListener('dragstart', () => {
    smallObject.material.opacity = 0.7
    smallObject.material.color.setHex(0xff2222) // Even brighter when dragging
    outlineObject.visible = true
    outlineObject.material.opacity = 1.0 // Full glow when dragging
    document.body.style.cursor = 'grabbing'
  })
  
  dragControls.addEventListener('drag', (event) => {
    // Update outline position to follow the sphere
    outlineObject.position.copy(smallObject.position)
  })
  
  dragControls.addEventListener('dragend', () => {
    smallObject.material.opacity = 0.9
    smallObject.material.color.setHex(0xff6b6b) // Back to original red
    outlineObject.visible = false
    outlineObject.material.opacity = 0 // Hide outline
    document.body.style.cursor = 'default'
  })

  // Check for collision and transformation
  const checkCollision = () => {
    const distance = smallObject.position.distanceTo(mainObject.position)
    const threshold = 1.5 // Collision threshold
    
    if (distance < threshold && !mainObject.userData.isTransformed) {
      // Start transformation
      mainObject.userData.isTransformed = true
      
      // Hide small object
      smallObject.visible = false
      
      // Create new transformed mesh after delay
      setTimeout(() => {
        // Remove old main object
        scene.remove(mainObject)
        
        // Create new complex mesh (torus knot)
        const newGeometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16)
        const newMaterial = new THREE.MeshPhongMaterial({ 
          color: 0x00ff88,
          transparent: true,
          opacity: 0.8
        })
        const newObject = new THREE.Mesh(newGeometry, newMaterial)
        newObject.position.set(0, 1, 0)
        newObject.userData = { type: 'transformed' }
        scene.add(newObject)
        
        // Add some animation
        newObject.rotation.x = Math.PI / 4
        newObject.rotation.y = Math.PI / 4
      }, 500)
    }
  }

  // Check collision on drag end
  dragControls.addEventListener('dragend', checkCollision)

  // Add pulsing animation to make it clear it's interactive
  const pulseAnimation = () => {
    if (smallObject.visible && !isHovering) {
      const time = Date.now() * 0.003
      const pulse = Math.sin(time) * 0.1 + 1
      smallObject.scale.setScalar(pulse)
      // Also pulse the outline slightly
      outlineObject.scale.setScalar(pulse * 1.04) // Slightly larger than the sphere
    }
  }

  // Store animation function for cleanup
  smallObject.userData.pulseAnimation = pulseAnimation

  return { mainObject, smallObject, outlineObject, dragControls, onMouseMove }
}

const Scene = () => {
  const refContainer = useRef()
  const [loading, setLoading] = useState(true)
  const refRenderer = useRef()
  const scene_path = '/scene_final.glb'

  const handleWindowResize = useCallback(() => {
    const { current: renderer } = refRenderer
    const { current: container } = refContainer
    if (container && renderer) {
      const scW = container.clientWidth
      const scH = container.clientHeight

      renderer.setSize(scW, scH)
    }
  }, [])

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const { current: container } = refContainer
    if (container) {
      const scW = container.clientWidth
      const scH = container.clientHeight

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(scW, scH)
      renderer.outputEncoding = THREE.sRGBEncoding
      container.appendChild(renderer.domElement)
      refRenderer.current = renderer
      const scene = new THREE.Scene()

      const target = new THREE.Vector3(0, 3, 0)
      const initialCameraPosition = new THREE.Vector3(
        20 * Math.sin(0.2 * Math.PI),
        10,
        20 * Math.cos(0.2 * Math.PI)
      )

      const scale = scH * 0.007 + 4.8
      const camera = new THREE.OrthographicCamera(
        -scale,
        scale,
        scale,
        -scale,
        0.01,
        50000
      )
      camera.position.copy(initialCameraPosition)
      camera.lookAt(target)


      const controls = new OrbitControls(camera, renderer.domElement)
      controls.autoRotate = true
      controls.target = target

      // Create interactive scene with draggable objects
      const { mainObject, smallObject, dragControls, onMouseMove } = createInteractiveScene(scene, camera, renderer)

      let req = null
      let frame = 0
      const animate = () => {
        req = requestAnimationFrame(animate)

        frame = frame <= 100 ? frame + 1 : frame

        if (frame <= 100) {
          const p = initialCameraPosition
          const rotSpeed = -Math.sqrt(1 - Math.pow(frame / 120 - 1, 4)) * Math.PI * 20

          camera.position.y = 10
          camera.position.x =
            p.x * Math.cos(rotSpeed) + p.z * Math.sin(rotSpeed)
          camera.position.z =
            p.z * Math.cos(rotSpeed) - p.x * Math.sin(rotSpeed)
          camera.lookAt(target)
        } else {
          controls.update()
        }

        // Add some rotation to objects for visual appeal
        if (mainObject && mainObject.userData.type !== 'transformed') {
          mainObject.rotation.y += 0.01
        }
        if (smallObject && smallObject.visible) {
          smallObject.rotation.x += 0.02
          smallObject.rotation.y += 0.01
          
          // Apply pulsing animation
          if (smallObject.userData.pulseAnimation) {
            smallObject.userData.pulseAnimation()
          }
        }

        renderer.render(scene, camera)
      }

      animate()
      setLoading(false)

      return () => {
        cancelAnimationFrame(req)
        renderer.domElement.removeEventListener('mousemove', onMouseMove)
        renderer.domElement.remove()
        renderer.dispose()
      }
    }
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize, false)
    return () => {
      window.removeEventListener('resize', handleWindowResize, false)
    }
  }, [handleWindowResize])

  const SceneSpinner = () => (
    <Spinner
      size="xl"
      position="absolute"
      left="50%"
      top="50%"
      ml="calc(0px - var(--spinner-size) / 2)"
      mt="calc(0px - var(--spinner-size))"
      color="teal.400"
    />
  )

  return (
    <Box
      ref={refContainer}
      className="voxel-scene"
      m="auto"
      mt={['-20px', '-60px', '-120px']}
      mb={['-40px', '-140px', '-200px']}
      w={[210, 360, 600]}
      h={[210, 360, 600]}
      position="relative"
    >
      {loading && <SceneSpinner />}
    </Box>
  )
}

export default Scene
