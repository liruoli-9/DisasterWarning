import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { gsap } from 'gsap'

export function createLandslideScene(container) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  container.appendChild(renderer.domElement)

  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(30, 50, 30)
  scene.add(light)
  scene.add(new THREE.AmbientLight(0xaaaaaa))

  camera.position.set(25, 20, 30)
  camera.lookAt(0, 5, 0)

  const loader = new GLTFLoader()
  const modelUrl = '/models/shanmai01.glb'

  let mountain, slide

  loader.load(modelUrl, gltf => {
    // 主山体模型
    mountain = gltf.scene
    mountain.name = 'mountain'
    scene.add(mountain)
  
    // 自动缩放和居中模型
    const box = new THREE.Box3().setFromObject(mountain)
    const size = new THREE.Vector3()
    box.getSize(size)
  
    const center = new THREE.Vector3()
    box.getCenter(center)
    mountain.position.sub(center) // 平移到原点
  
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 20 / maxDim // 目标缩放最大边为20单位
    mountain.scale.setScalar(scale)
  
    // 克隆滑体
    slide = mountain.clone()
    slide.name = 'slide'
    slide.position.set(0, 0, 0)
    slide.visible = false
    scene.add(slide)
  
    // 相机重设
    camera.position.set(0, 15, 30)
    camera.lookAt(0, 5, 0)
  
    // 添加辅助坐标轴与网格
    const grid = new THREE.GridHelper(100, 50)
    const axes = new THREE.AxesHelper(10)
    scene.add(grid, axes)
  
    playLandslideAnimation()
  })
  function playLandslideAnimation() {
    if (!mountain || !slide) return

    // 1. 山体变色（模拟雨水浸润）
    mountain.traverse(child => {
      if (child.isMesh) {
        child.material = child.material.clone()
        gsap.to(child.material.color, {
          r: 0.3, g: 0.25, b: 0.2,
          duration: 2
        })
      }
    })

    // 2. 模拟轻微震动
    gsap.to(mountain.rotation, {
      z: 0.05,
      yoyo: true,
      repeat: 5,
      duration: 0.2,
      delay: 2
    })

    // 3. 启用滑体、模拟滑动
    slide.visible = true
    gsap.to(slide.position, {
      x: 6,
      y: -1,
      z: 4,
      delay: 4,
      duration: 3,
      ease: 'power2.inOut'
    })

    gsap.to(slide.rotation, {
      x: -0.1,
      z: 0.1,
      delay: 4.5,
      duration: 2
    })
  }

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()

  return {
    destroy() {
      container.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }
}
