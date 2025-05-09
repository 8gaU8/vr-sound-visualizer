import * as THREE from 'three'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'

/**
 * Initializes and configures a THREE.js WebGL renderer.
 *
 * @param {HTMLElement} container - The HTML container element to append the renderer's DOM element to.
 * @returns {THREE.WebGLRenderer} - The initialized WebGL renderer.
 */
export function initRenderer(container) {
  // Setup WebGL2 canvas and context
  const canvas = document.createElement('canvas')
  document.body.appendChild(canvas)

  // Configure renderer with WebGL2 support
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  })
  renderer.xr.enabled = true
  renderer.setClearColor(0)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 2
  container.appendChild(renderer.domElement)
  document.body.appendChild(VRButton.createButton(renderer))
  return renderer
}
