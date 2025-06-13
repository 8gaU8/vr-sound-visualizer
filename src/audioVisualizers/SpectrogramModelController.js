// @ts-check

/**
 * @typedef {import('../AudioController.js').AudioController} AudioController
 * @typedef {import('../BirdModelController.js').BirdModelController} BirdModelController
 * @typedef {import('three').Camera} Camera
 * @typedef {typeof import('../../public/configs/woodpecker.json.js').config} BirdConfig
 */

import * as THREE from 'three'

import { VisualizeOptions } from '../defaultConfigs/VisualizeOptions'

import { spectrogramShaders } from './shaders.js'

const spectrogramOpt = VisualizeOptions.spectrogramModel

export class SpectrogramModelController {
  /** @type {Camera} */
  camera

  /**
   * @description The analyser for the audio
   * @type {THREE.AudioAnalyser}
   */
  analyser

  /**
   * @description The uniforms for the shader
   * @type {Object}
   */
  uniforms

  /**
   * @description Current maximum amplitude
   * @type {Number}
   */
  intensity = 0

  /**
   * @description The mesh for the spectrogram
   * @type {THREE.Mesh}
   */
  mesh

  /**
   * @description Configs of bird
   * @type {BirdConfig}
   */
  config

  /**
   * @param {AudioController} audioController
   * @param {Camera} camera
   */
  constructor(audioController, camera) {
    this.fftSize = 64
    this.camera = camera
    this.config = audioController.config

    const color = new THREE.Color().setHex(this.config.color)

    this.analyser = new THREE.AudioAnalyser(audioController.audio, spectrogramOpt.fftSize)
    this.uniforms = {
      colorR: {
        value: Number(color.r),
      },
      colorG: {
        value: Number(color.g),
      },
      colorB: {
        value: Number(color.b),
      },

      tAudioData: {
        value: new THREE.DataTexture(
          this.analyser.data,
          spectrogramOpt.fftSize / 2,
          1,
          THREE.RedFormat,
        ),
      },
    }
    this.mesh = this.#generateSpectrogramMesh()
    this.mesh.name = `${audioController.config.name}SpectrogramMesh`
    this.camera.add(this.mesh)
  }

  /**
   * @description Create a mesh for the spectrogram
   * @returns {THREE.Mesh}
   */
  #generateSpectrogramMesh() {
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: spectrogramShaders.vertShader,
      fragmentShader: spectrogramShaders.fragShader,
      transparent: true,
      side: THREE.DoubleSide,
    })

    const geometry = new THREE.PlaneGeometry(spectrogramOpt.width, spectrogramOpt.height)

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.copy(this.config.spectrogramPosition)
    return mesh
  }

  /**
   * @param {THREE.Mesh} targetMesh
   */
  updateVisibility(targetMesh) {
    if (!VisualizeOptions.spectrogramModel.enabled) {
      return false
    }

    // get world position of the mesh
    const targetWorldPosition = new THREE.Vector3()
    targetMesh.getWorldPosition(targetWorldPosition)

    // distance from camera to target
    const distance = this.camera.position.distanceTo(targetWorldPosition)

    // get vector from camera to mesh
    const vecToMesh = new THREE.Vector3()
    vecToMesh.subVectors(targetWorldPosition, this.camera.position).normalize()

    // get camera direction vector
    const cameraDirection = new THREE.Vector3(0, 0, -1)
    cameraDirection.applyQuaternion(this.camera.quaternion).normalize()

    //get angle between camera direction and mesh direction
    const angle = vecToMesh.dot(cameraDirection)

    // use configured thresholds to determine visibility
    const distanceCriterion = distance < spectrogramOpt.visibleThresholds.distance
    const angleCriterion = angle > spectrogramOpt.visibleThresholds.angle

    // set visibility based on distance and angle
    this.mesh.visible = distanceCriterion && angleCriterion
  }

  get position() {
    return this.mesh.position
  }

  /**
   * @param {THREE.Mesh} targetMesh
   */
  update(targetMesh) {
    this.analyser.getFrequencyData()
    this.uniforms.tAudioData.value.needsUpdate = true
    this.intensity = this.#calcIntensity(this.analyser.data)

    this.updateVisibility(targetMesh)
  }

  /**
   * @param {Uint8Array<ArrayBufferLike> } data
   * @returns {Number}
   */
  #calcIntensity(data) {
    const intensity = Math.max(...data.map(Math.abs))
    return intensity
  }
}
