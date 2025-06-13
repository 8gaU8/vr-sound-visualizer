//@ts-check

/**
 * @typedef {typeof import('../../public/configs/sky.json.js').config} SkyConfig
 */

import * as THREE from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js'
import { degToRad } from 'three/src/math/MathUtils.js'

import { defaultConfigs } from '../defaultConfigs/loadConfig.js'

export class Skybox extends THREE.Mesh {
  /**
   * @type { THREE.AmbientLight}
   */
  ambientLight

  /**
   * @type {THREE.DirectionalLight}
   */
  sunLight
  /**
   * @type {Sky}
   */
  sky

  constructor() {
    super()

    this.name = 'Skybox'
    this.sky = new Sky()
    this.sky.scale.setScalar(45000)
    this.add(this.sky)

    this.ambientLight = new THREE.AmbientLight()
    this.add(this.ambientLight)
    this.sunLight = new THREE.DirectionalLight()
    this.add(this.sunLight)

    this.applyConfig()
  }

  initLighting() {
    // ambient light
    const ambientColorValue = defaultConfigs.sky.ambientColor
    const ambientColor = new THREE.Color(
      ambientColorValue.r / 255,
      ambientColorValue.g / 255,
      ambientColorValue.b / 255,
    )
    this.ambientLight.color = ambientColor
    this.ambientLight.intensity = defaultConfigs.sky.ambientIntensity

    // sun position
    const el = degToRad(defaultConfigs.sky.elevation)
    const az = degToRad(defaultConfigs.sky.azimuth)
    const sunPosition = new THREE.Vector3(
      20 * Math.cos(el) * Math.sin(az),
      20 * Math.sin(el),
      20 * Math.cos(el) * Math.cos(az),
    )
    this.sunLight.position.copy(sunPosition)
    this.sunLight.intensity = defaultConfigs.sky.intensity
    const color = defaultConfigs.sky.sunColor
    this.sunLight.color.setRGB(color.r / 255, color.g / 255, color.b / 255)
    this.sunLight.castShadow = true
    const cmmeraSize = 25
    this.sunLight.shadow.camera.left = -cmmeraSize
    this.sunLight.shadow.camera.right = cmmeraSize
    this.sunLight.shadow.camera.top = cmmeraSize
    this.sunLight.shadow.camera.bottom = -cmmeraSize
    const t = 2048
    this.sunLight.shadow.mapSize = new THREE.Vector2(t, t)
    this.sunLight.shadow.normalBias = 0.02
  }

  #setSkyUniformsAndSun() {
    const phi = THREE.MathUtils.degToRad(90 - defaultConfigs.sky.elevation)
    const theta = THREE.MathUtils.degToRad(defaultConfigs.sky.azimuth)
    const sun = new THREE.Vector3()
    sun.setFromSphericalCoords(1, phi, theta)
    this.sky.material.uniforms['sunPosition'].value.copy(sun)
    this.sky.material.uniforms['turbidity'].value = defaultConfigs.sky.turbidity
    this.sky.material.uniforms['rayleigh'].value = defaultConfigs.sky.rayleigh
    this.sky.material.uniforms['mieCoefficient'].value = defaultConfigs.sky.mieCoefficient
    this.sky.material.uniforms['mieDirectionalG'].value = defaultConfigs.sky.mieDirectionalG
  }

  /**
   */
  applyConfig() {
    this.initLighting()
    this.#setSkyUniformsAndSun()
  }

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
