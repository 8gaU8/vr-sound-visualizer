import * as THREE from 'three'

import { VRUI } from './VR-ui'
import { configValidator, registerFileChangeListener } from './defaultConfigs/loadConfig'
import { initRenderer } from './renderer'
import { StatsWrapper } from './stats'

async function initialization() {
  // Remove the loading overlay
  const overlay = document.getElementById('overlay')
  if (overlay) {
    overlay.remove()
  }

  // initialize the configuration manager
  await configValidator.initialize()
  const color = new THREE.Color().setHex((configValidator.configStore.woodpecker.color))
  console.log(color)



  // Import scene dynamically to make sure the module is loaded after the configuration is ready
  const sceneModule = await import('./scene.js')
  const createScene = sceneModule.createScene

  // File input element for configuration files
  const inputElement = document.getElementById('fileInput')
  registerFileChangeListener(inputElement)

  // Create container for renderer
  const container = document.createElement('div')
  document.body.appendChild(container)

  const renderer = initRenderer(container)
  return { createScene, renderer, container }
}

async function main() {
  const { createScene, renderer, container } = await initialization()

  const { scene, environment, camera, controls, birdsWatcher } = await createScene(renderer)
  const { htmlMesh, updateTeleportMarker } = VRUI(
    scene,
    camera,
    renderer,
    birdsWatcher,
    environment.ground,
  )

  const stats = new StatsWrapper(scene, camera)

  const clock = new THREE.Clock()
  function render() {
    const t = clock.getElapsedTime()
    if (renderer.xr.isPresenting) {
      birdsWatcher.update(t, renderer.xr.getCamera())
      birdsWatcher.updateHaptics(renderer)
      updateTeleportMarker()
    } else {
      controls.update()
      birdsWatcher.update(t, camera)
    }

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

  renderer.setAnimationLoop(render)
  resize()
}

async function _onload() {
  const startButton = document.getElementById('startButton')
  startButton.addEventListener('click', main)
}

document.addEventListener('DOMContentLoaded', _onload)
