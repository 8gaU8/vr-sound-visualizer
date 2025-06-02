// @ts-check

/**
 * @typedef {import('../AudioController.js').AudioController} AudioController
 * @typedef {import('../BirdModelController.js').BirdModelController} BirdModelController
 */

import * as THREE from 'three'

import { VisualizeOptions } from '../defaultConfigs/VisualizeOptions'

import { spectrogramShaders } from './shaders.js'

const spectrogramOpt = VisualizeOptions.spectrogramModel

export class SpectrogramModelController {
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
   * @param {AudioController} audioController
   */
  constructor(audioController) {
    this.fftSize = 64

    this.analyser = new THREE.AudioAnalyser(audioController.audio, spectrogramOpt.fftSize)
    this.uniforms = {
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
    this.mesh.name = `${audioController.param.name}SpectrogramMesh`
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
    mesh.translateY(0.5)
    mesh.translateZ(-0.5)
    return mesh
  }

  /**
   * @param {BirdModelController} birdModelController
   */
  followsModel(birdModelController) {
    this.mesh.position.copy(birdModelController.mesh.position)
    this.mesh.position.y += 0.5
    // this.mesh.position.x += 0.5
    // this.mesh.position.z += 0.5
  }

  update() {
    this.analyser.getFrequencyData()
    this.uniforms.tAudioData.value.needsUpdate = true
    this.intensity = this.#calcIntensity(this.analyser.data)
  }

  /**
   * @param {Uint8Array<ArrayBufferLike> } data
   * @returns {Number}
   */
  #calcIntensity(data) {
    const intensity = Math.max(...data.map(Math.abs))
    return intensity
  }

  /**
   * @description Adds the spectrogram mesh to the scene
   * @param {THREE.Scene} scene - The scene to add the mesh to
   */
  addToScene(scene) {
    scene.add(this.mesh)
  }

  /**
   * @description スペクトログラム平面をカメラの方向に向ける
   * @param {THREE.Camera} camera
   */
  faceToCamera(camera) {
    if (this.mesh && camera) {
      this.mesh.lookAt(camera.position)
    }
  }
}
