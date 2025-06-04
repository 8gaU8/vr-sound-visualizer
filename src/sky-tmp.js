//@ts-check
import * as THREE from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js'
import { degToRad } from 'three/src/math/MathUtils.js'

/**
 * @param {THREE.Scene} scene - The Three.js scene to which the sky will be added
 */
export function initSky(scene) {
  const skyOptions = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 45,
    azimuth: 180,
    sunColor: new THREE.Color(0xffe5b0).convertLinearToSRGB(),
  }

  const sky = new Sky()
  sky.scale.setScalar(45000)
  const phi = THREE.MathUtils.degToRad(90 - skyOptions.elevation)
  const theta = THREE.MathUtils.degToRad(skyOptions.azimuth)

  const sun = new THREE.Vector3()

  sun.setFromSphericalCoords(1, phi, theta)

  sky.material.uniforms['sunPosition'].value.copy(sun)
  sky.material.uniforms['turbidity'].value = skyOptions.turbidity
  sky.material.uniforms['rayleigh'].value = skyOptions.rayleigh
  sky.material.uniforms['mieCoefficient'].value = skyOptions.mieCoefficient
  sky.material.uniforms['mieDirectionalG'].value = skyOptions.mieDirectionalG

  scene.add(sky)

  const el = degToRad(skyOptions.elevation)
  const az = degToRad(skyOptions.azimuth)
  const sunPosition = new THREE.Vector3(
    20 * Math.cos(el) * Math.sin(az),
    20 * Math.sin(el),
    20 * Math.cos(el) * Math.cos(az),
  )

  const sunLight = new THREE.DirectionalLight()
  sunLight.intensity = 4
  sunLight.color = skyOptions.sunColor
  sunLight.position.copy(sunPosition)
  sunLight.castShadow = true
  const cmmeraSize = 50
  sunLight.shadow.camera.left = -cmmeraSize
  sunLight.shadow.camera.right = cmmeraSize
  sunLight.shadow.camera.top = cmmeraSize
  sunLight.shadow.camera.bottom = -cmmeraSize
  const t = 2048
  sunLight.shadow.mapSize = new THREE.Vector2(t, t)
  sunLight.shadow.bias = -0.001
  sunLight.shadow.normalBias = 0.2
  scene.add(sunLight)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
}
