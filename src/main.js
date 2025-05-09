import * as THREE from 'three'

import { initRenderer } from './renderer'
import { createScene } from './scene'
import { setupUI } from './ui'

document.addEventListener('DOMContentLoaded', async () => {
  // Create container for renderer
  const container = document.createElement('div')
  document.body.appendChild(container)

  const renderer = initRenderer(container)

  const { scene, environment, tree, camera, controls } = await createScene(renderer)

  const clock = new THREE.Clock()
  function render() {
    // Update time for wind sway shaders
    const t = clock.getElapsedTime()
    tree.update(t)
    scene.getObjectByName('Forest').children.forEach((o) => o.update(t))
    environment.update(t)

    controls.update()
    renderer.render(scene, camera)
  }

  function resize() {
    renderer.setSize(container.clientWidth, container.clientHeight)
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
  }

  window.addEventListener('resize', resize)

  setupUI(tree, environment, renderer, scene, camera, controls, 'Ash Medium')
  renderer.setAnimationLoop(render)
  resize()
  
})
