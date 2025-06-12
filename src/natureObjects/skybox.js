//@ts-check

/**
 * @typedef {typeof import('../defaultConfigs/natureObjects/sky.json.js').config} SkyConfig
 */

import * as THREE from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js'
import { degToRad } from 'three/src/math/MathUtils.js'

import { defaultConfigs } from '../defaultConfigs/loadConfig.js'

export class Skybox extends THREE.Mesh {
  constructor() {
    super()

    this.name = 'Skybox'
    this.sky = this.initSky()
    this.add(this.sky)

    const el = degToRad(defaultConfigs.sky.elevation)
    const az = degToRad(defaultConfigs.sky.azimuth)
    const sunPosition = new THREE.Vector3(
      20 * Math.cos(el) * Math.sin(az),
      20 * Math.sin(el),
      20 * Math.cos(el) * Math.cos(az),
    )

    this.sunLight = new THREE.DirectionalLight()
    this.sunLight.intensity = defaultConfigs.sky.intensity

    // normalize color values to [0, 1] range
    const color = defaultConfigs.sky.sunColor
    this.sunLight.color.setRGB(color.r / 255, color.g / 255, color.b / 255)
    this.sunLight.position.copy(sunPosition)
    this.sunLight.castShadow = true
    const cmmeraSize = 25
    this.sunLight.shadow.camera.left = -cmmeraSize
    this.sunLight.shadow.camera.right = cmmeraSize
    this.sunLight.shadow.camera.top = cmmeraSize
    this.sunLight.shadow.camera.bottom = -cmmeraSize
    const t = 2048
    this.sunLight.shadow.mapSize = new THREE.Vector2(t, t)
    // this.sunLight.shadow.bias = -0.001
    this.sunLight.shadow.normalBias = 0.02
    this.add(this.sunLight)

    const ambientColorValue = defaultConfigs.sky.ambientColor
    const ambientColor = new THREE.Color(
      ambientColorValue.r / 255,
      ambientColorValue.g / 255,
      ambientColorValue.b / 255,
    )

    const ambientLight = new THREE.AmbientLight(ambientColor, defaultConfigs.sky.ambientIntensity)
    this.add(ambientLight)
  }

  initSky() {
    const sky = new Sky()
    sky.scale.setScalar(45000)
    const phi = THREE.MathUtils.degToRad(90 - defaultConfigs.sky.elevation)
    const theta = THREE.MathUtils.degToRad(defaultConfigs.sky.azimuth)

    const sun = new THREE.Vector3()

    sun.setFromSphericalCoords(1, phi, theta)

    sky.material.uniforms['sunPosition'].value.copy(sun)
    sky.material.uniforms['turbidity'].value = defaultConfigs.sky.turbidity
    sky.material.uniforms['rayleigh'].value = defaultConfigs.sky.rayleigh
    sky.material.uniforms['mieCoefficient'].value = defaultConfigs.sky.mieCoefficient
    sky.material.uniforms['mieDirectionalG'].value = defaultConfigs.sky.mieDirectionalG
    return sky
  }

  // /**
  //  * @param {SkyConfig} options
  //  */
  // onchange(options) {
  //   defaultConfigs.sky = options

  //   const phi = THREE.MathUtils.degToRad(90 - defaultConfigs.sky.elevation)
  //   const theta = THREE.MathUtils.degToRad(defaultConfigs.sky.azimuth)

  //   const sun = new THREE.Vector3()
  //   sun.setFromSphericalCoords(1, phi, theta)

  //   this.sky.material.uniforms['sunPosition'].value.copy(sun)
  //   this.sky.material.uniforms['turbidity'].value = defaultConfigs.sky.turbidity
  //   this.sky.material.uniforms['rayleigh'].value = defaultConfigs.sky.rayleigh
  //   this.sky.material.uniforms['mieCoefficient'].value = defaultConfigs.sky.mieCoefficient
  //   this.sky.material.uniforms['mieDirectionalG'].value = defaultConfigs.sky.mieDirectionalG

  //   this.updateSunPosition()
  // }

  updateSunPosition() {
    const el = degToRad(defaultConfigs.sky.elevation)
    const az = degToRad(defaultConfigs.sky.azimuth)

    this.sunLight.position.set(
      20 * Math.cos(el) * Math.sin(az),
      20 * Math.sin(el),
      20 * Math.cos(el) * Math.cos(az),
    )
  }
}
