import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'

import { createScene } from './scene'
import { setupUI } from './ui'

document.addEventListener('DOMContentLoaded', async () => {
  // Create container for renderer
  const container = document.createElement('div')
  document.body.appendChild(container)

  // Setup WebGL2 canvas and context
  const canvas = document.createElement('canvas')
  document.body.appendChild(canvas)

  // Configure renderer with WebGL2 support
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  })
  renderer.setClearColor(0)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 2
  container.appendChild(renderer.domElement)

  const { scene, environment, tree, camera, controls } = await createScene(renderer)

  const composer = new EffectComposer(renderer)

  composer.addPass(new RenderPass(scene, camera))

  const smaaPass = new SMAAPass(
    container.clientWidth * renderer.getPixelRatio(),
    container.clientHeight * renderer.getPixelRatio(),
  )
  composer.addPass(smaaPass)

  composer.addPass(new OutputPass())

  const clock = new THREE.Clock()
  function animate() {
    // Update time for wind sway shaders
    const t = clock.getElapsedTime()
    tree.update(t)
    scene.getObjectByName('Forest').children.forEach((o) => o.update(t))
    environment.update(t)

    controls.update()
    composer.render()
    requestAnimationFrame(animate)
  }

  function resize() {
    renderer.setSize(container.clientWidth, container.clientHeight)
    smaaPass.setSize(container.clientWidth, container.clientHeight)
    composer.setSize(container.clientWidth, container.clientHeight)
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
  }

  window.addEventListener('resize', resize)

  setupUI(tree, environment, renderer, scene, camera, controls, "Ash Medium");
  animate()
  resize()

})
