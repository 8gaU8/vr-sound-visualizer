import * as THREE from 'three'

import { initRenderer } from './renderer'
import { createScene } from './scene'
import { setupUI } from './ui'

async function main() {
  // Remove the loading overlay
  const overlay = document.getElementById('overlay')
  if (overlay) {
    overlay.remove()
  }

  // Create container for renderer
  const container = document.createElement('div')
  document.body.appendChild(container)

  const renderer = initRenderer(container)

  const {
    scene,
    environment,
    tree,
    camera,
    controls,
    audioManager,
    spectrogramModels,
    directionIndicator,
  } = await createScene(renderer)

  const clock = new THREE.Clock()
  function render() {
    if (renderer.xr.isPresenting) {
      const session = renderer.xr.getSession()
      audioManager.hapticsManager.updateGamepad(session)
      audioManager.hapticsManager.update()

      audioManager.updateAudioListener(renderer.xr.getCamera())
    } else {
      controls.update()
      audioManager.updateAudioListener(camera)
    }

    // Update time for wind sway shaders
    const t = clock.getElapsedTime()
    tree.update(t)
    scene.getObjectByName('Forest').children.forEach((o) => o.update(t))
    environment.update(t)

    spectrogramModels.update()
    directionIndicator.update()
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
}

async function _onload() {
  const startButton = document.getElementById('startButton')
  startButton.addEventListener('click', main)
}

document.addEventListener('DOMContentLoaded', _onload)
