import * as THREE from 'three'

import { initRenderer } from './renderer'
import { createScene } from './scene'
import { StatsWrapper } from './stats'
import { setupUI } from './ui'
import { VRUI } from './VR-ui'

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

  const { scene, environment, tree, camera, controls, birdsWatcher, directionIndicator } =
    await createScene(renderer)
  const { gui, interactiveGroup, htmlMesh } = VRUI(
    scene,
    camera,
    renderer,
    directionIndicator,
    birdsWatcher.hapticsManager,
    birdsWatcher,
  )
  const stats = new StatsWrapper(scene, camera)

  const clock = new THREE.Clock()
  function render() {
    const t = clock.getElapsedTime()
    if (renderer.xr.isPresenting) {
      birdsWatcher.update(t, renderer.xr.getCamera())
      birdsWatcher.updateHaptics(renderer)
    } else {
      controls.update()
      birdsWatcher.update(t, camera)
    }
    directionIndicator.update()

    // Update time for wind sway shaders
    tree.update(t)
    scene.getObjectByName('Forest').children.forEach((o) => o.update(t))
    environment.update(t)

    stats.update()

    if (htmlMesh && htmlMesh.material.map) {
      htmlMesh.material.map.update()
    }

    renderer.render(scene, camera)
  }

  function resize() {
    renderer.setSize(container.clientWidth, container.clientHeight)
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
  }

  window.addEventListener('resize', resize)

  // setupUI(tree, environment, renderer, scene, camera, controls, 'Ash Medium')
  renderer.setAnimationLoop(render)
  resize()
}

async function _onload() {
  const startButton = document.getElementById('startButton')
  startButton.addEventListener('click', main)
}

document.addEventListener('DOMContentLoaded', _onload)
