import { useState, useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
import { Box, Spinner } from '@chakra-ui/react'

// Material tuning. The GLB bakes lighting into Baked_BaseColor and leaves
// metallicFactor at the glTF default of 1.0, so it renders fully metallic.
// mipmaps: false stops the GPU averaging across the atlas's many small UV
// islands (what makes skin bleed onto hair); costs some shimmer when rotating.
const MAT = {
  metalness: 0.1,
  roughness: 0.8,
  envIntensity: 1.0,
  dropRoughnessMap: true,
  mipmaps: false
}
const LIGHT = { ambient: 0.55, key: 0.6, rim: 1.6 }

// Logo position on the shirt, as fractions of the portrait's bbox. +x = viewer's right.
const CHEST = { x: 0.30, y: -0.42, z: 0.46 }
const CHEST_SCALE = 0.18
const SNAP_DISTANCE = 2.5

function tuneMaterials(obj, maxAnisotropy) {
  obj.traverse(o => {
    if (!o.isMesh || !o.material) return
    const m = o.material
    m.metalness = MAT.metalness
    m.metalnessMap = null
    m.roughness = MAT.roughness
    m.envMapIntensity = MAT.envIntensity
    if (MAT.dropRoughnessMap) m.roughnessMap = null
    for (const t of [m.map, m.normalMap, m.roughnessMap]) {
      if (!t) continue
      t.anisotropy = maxAnisotropy
      if (!MAT.mipmaps) {
        t.generateMipmaps = false
        t.minFilter = THREE.LinearFilter
      }
      t.needsUpdate = true
    }
    m.needsUpdate = true
  })
}

function fit(obj, height) {
  const box = new THREE.Box3().setFromObject(obj)
  const size = box.getSize(new THREE.Vector3())
  const centre = box.getCenter(new THREE.Vector3())
  obj.position.sub(centre)
  const wrap = new THREE.Group()
  wrap.add(obj)
  wrap.scale.setScalar(height / size.y)
  wrap.userData.extent = size.clone().multiplyScalar(height / size.y)
  return wrap
}

const Scene = () => {
  const refContainer = useRef()
  const [loading, setLoading] = useState(true)
  const refRenderer = useRef()

  const handleWindowResize = useCallback(() => {
    const { current: renderer } = refRenderer
    const { current: container } = refContainer
    if (container && renderer) {
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
  }, [])

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const { current: container } = refContainer
    if (!container) return

    const scW = container.clientWidth
    const scH = container.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(scW, scH)
    container.appendChild(renderer.domElement)
    refRenderer.current = renderer

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

    scene.add(new THREE.AmbientLight(0xffffff, LIGHT.ambient))
    const key = new THREE.DirectionalLight(0xffffff, LIGHT.key)
    key.position.set(4, 6, 8)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xffffff, LIGHT.rim)
    rim.position.set(-6, 4, -8)
    scene.add(rim)

    const target = new THREE.Vector3(0, 3, 0)
    const initialCameraPosition = new THREE.Vector3(
      20 * Math.sin(0.2 * Math.PI),
      10,
      20 * Math.cos(0.2 * Math.PI)
    )
    const scale = scH * 0.007 + 4.8
    const camera = new THREE.OrthographicCamera(-scale, scale, scale, -scale, 0.01, 50000)
    camera.position.copy(initialCameraPosition)
    camera.lookAt(target)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.2
    controls.target = target

    let portrait = null
    let mouse = null
    let dragControls = null
    let attached = false
    let snap = 0
    let hovering = false
    let req = null
    let frame = 0

    const loader = new GLTFLoader()
    const load = url => new Promise((res, rej) => loader.load(url, res, undefined, rej))

    const onMouseMove = event => {
      if (!mouse || attached) return
      const rect = renderer.domElement.getBoundingClientRect()
      const ndc = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      )
      const ray = new THREE.Raycaster()
      ray.setFromCamera(ndc, camera)
      const hit = ray.intersectObject(mouse, true).length > 0
      if (hit !== hovering) {
        hovering = hit
        document.body.style.cursor = hit ? 'grab' : 'default'
      }
    }

    Promise.all([load('/mesh/portrait.glb'), load('/mesh/mouse.glb')])
      .then(([p, m]) => {
        const maxAniso = renderer.capabilities.getMaxAnisotropy()
        tuneMaterials(p.scene, maxAniso)
        tuneMaterials(m.scene, maxAniso)
        portrait = fit(p.scene, 5)
        portrait.position.set(0, 3, 0)
        scene.add(portrait)

        mouse = fit(m.scene, 1.4)
        mouse.position.set(4.5, 1.6, 0)
        scene.add(mouse)

        dragControls = new DragControls([mouse], camera, renderer.domElement)
        dragControls.addEventListener('dragstart', () => {
          controls.enabled = false
          document.body.style.cursor = 'grabbing'
        })
        dragControls.addEventListener('dragend', () => {
          controls.enabled = true
          document.body.style.cursor = 'default'
          const flat = mouse.position.clone().setY(portrait.position.y)
          if (!attached && flat.distanceTo(portrait.position) < SNAP_DISTANCE) {
            attached = true
            dragControls.enabled = false
            portrait.worldToLocal(mouse.position)
            mouse.quaternion.identity()
            portrait.add(mouse)
          }
        })

        renderer.domElement.addEventListener('mousemove', onMouseMove)
        setLoading(false)
      })
      .catch(err => {
        console.error('mesh load failed', err)
        setLoading(false)
      })

    const chestTarget = new THREE.Vector3()
    const startPos = new THREE.Vector3()
    let startScale = 1
    let captured = false

    const animate = () => {
      req = requestAnimationFrame(animate)
      frame = frame <= 100 ? frame + 1 : frame

      if (frame <= 100) {
        const p = initialCameraPosition
        const rot = -Math.sqrt(1 - Math.pow(frame / 120 - 1, 4)) * Math.PI * 20
        camera.position.y = 10
        camera.position.x = p.x * Math.cos(rot) + p.z * Math.sin(rot)
        camera.position.z = p.z * Math.cos(rot) - p.x * Math.sin(rot)
        camera.lookAt(target)
      } else {
        controls.update()
      }

      if (portrait) portrait.rotation.y += 0.0004

      if (mouse && !attached) {
        mouse.rotation.y += 0.001
        if (!hovering) {
          mouse.scale.setScalar(
            (mouse.userData.base ||= mouse.scale.x) * (1 + Math.sin(Date.now() * 0.003) * 0.04)
          )
        }
      }

      if (attached && snap < 1) {
        if (!captured) {
          const e = portrait.userData.extent
          chestTarget.set(
            (CHEST.x * e.x) / portrait.scale.x,
            (CHEST.y * e.y) / portrait.scale.y,
            (CHEST.z * e.z) / portrait.scale.z
          )
          startPos.copy(mouse.position)
          startScale = mouse.scale.x
          captured = true
        }
        snap = Math.min(1, snap + 0.03)
        const t = 1 - Math.pow(1 - snap, 3)
        mouse.position.lerpVectors(startPos, chestTarget, t)
        mouse.scale.setScalar(startScale + (CHEST_SCALE / portrait.scale.x - startScale) * t)
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(req)
      renderer.domElement.removeEventListener('mousemove', onMouseMove)
      pmrem.dispose()
      if (dragControls) dragControls.dispose()
      controls.dispose()
      renderer.domElement.remove()
      renderer.dispose()
    }
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize, false)
    return () => window.removeEventListener('resize', handleWindowResize, false)
  }, [handleWindowResize])

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
      {loading && (
        <Spinner size="xl" position="absolute" left="50%" top="50%" ml="-20px" mt="-20px" color="teal.400" />
      )}
    </Box>
  )
}

export default Scene
