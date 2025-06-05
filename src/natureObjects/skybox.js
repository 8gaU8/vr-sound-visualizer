//@ts-check
import * as THREE from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js'
import { degToRad } from 'three/src/math/MathUtils.js'

export class Skybox {
  constructor(scene) {
    this.options = {
      turbidity: 10,
      rayleigh: 3,
      mieCoefficient: 0.008,
      mieDirectionalG: 0.9,
      elevation: 45,
      azimuth: 180,
      sunColor: new THREE.Color(0xffe5b0).convertLinearToSRGB(),
    }

    this.sky = this.initSky()
    scene.add(this.sky)

    const el = degToRad(this.options.elevation)
    const az = degToRad(this.options.azimuth)
    const sunPosition = new THREE.Vector3(
      20 * Math.cos(el) * Math.sin(az),
      20 * Math.sin(el),
      20 * Math.cos(el) * Math.cos(az),
    )

    this.sunLight = new THREE.DirectionalLight()
    this.sunLight.intensity = 4
    this.sunLight.color = this.options.sunColor
    this.sunLight.position.copy(sunPosition)
    this.sunLight.castShadow = true
    const cmmeraSize = 50
    this.sunLight.shadow.camera.left = -cmmeraSize
    this.sunLight.shadow.camera.right = cmmeraSize
    this.sunLight.shadow.camera.top = cmmeraSize
    this.sunLight.shadow.camera.bottom = -cmmeraSize
    const t = 2048
    this.sunLight.shadow.mapSize = new THREE.Vector2(t, t)
    this.sunLight.shadow.bias = -0.001
    this.sunLight.shadow.normalBias = 0.2
    scene.add(this.sunLight)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
  }

  initSky() {
    const sky = new Sky()
    sky.scale.setScalar(45000)
    const phi = THREE.MathUtils.degToRad(90 - this.options.elevation)
    const theta = THREE.MathUtils.degToRad(this.options.azimuth)

    const sun = new THREE.Vector3()

    sun.setFromSphericalCoords(1, phi, theta)

    sky.material.uniforms['sunPosition'].value.copy(sun)
    sky.material.uniforms['turbidity'].value = this.options.turbidity
    sky.material.uniforms['rayleigh'].value = this.options.rayleigh
    sky.material.uniforms['mieCoefficient'].value = this.options.mieCoefficient
    sky.material.uniforms['mieDirectionalG'].value = this.options.mieDirectionalG
    return sky
  }

  onchange(options) {
    this.options = options

    const phi = THREE.MathUtils.degToRad(90 - this.options.elevation)
    const theta = THREE.MathUtils.degToRad(this.options.azimuth)

    const sun = new THREE.Vector3()
    sun.setFromSphericalCoords(1, phi, theta)

    this.sky.material.uniforms['sunPosition'].value.copy(sun)
    this.sky.material.uniforms['turbidity'].value = this.options.turbidity
    this.sky.material.uniforms['rayleigh'].value = this.options.rayleigh
    this.sky.material.uniforms['mieCoefficient'].value = this.options.mieCoefficient
    this.sky.material.uniforms['mieDirectionalG'].value = this.options.mieDirectionalG

    this.updateSunPosition()
  }

  updateSunPosition() {
    const el = degToRad(this.options.elevation)
    const az = degToRad(this.options.azimuth)

    this.sunLight.position.set(
      20 * Math.cos(el) * Math.sin(az),
      20 * Math.sin(el),
      20 * Math.cos(el) * Math.cos(az),
    )
  }
}
