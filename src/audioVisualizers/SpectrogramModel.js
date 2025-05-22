// @ts-check

import * as THREE from 'three'

import { VisualizeOptions } from '../defaultConfigs/VisualizeOptions'

// @ts-ignore
import fragShader from './shaders/spectrogram.frag?raw'
// @ts-ignore
import vertShader from './shaders/spectrogram.vert?raw'

const spectrogramOpt = VisualizeOptions.spectrogramModel

export class SpectrogramModel {
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
   * @param {THREE.Audio<AudioNode>} audio
   */
  constructor(audio) {
    this.fftSize = 64

    this.analyser = new THREE.AudioAnalyser(audio, spectrogramOpt.fftSize)
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
  }

  /**
   * @description Create a mesh for the spectrogram
   * @returns {THREE.Mesh}
   */
  #generateSpectrogramMesh() {
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertShader,
      fragmentShader: fragShader,
      transparent: true,
      side: THREE.DoubleSide,
    })

    const geometry = new THREE.PlaneGeometry(spectrogramOpt.width, spectrogramOpt.height)

    const mesh = new THREE.Mesh(geometry, material)
    return mesh
  }

  get position() {
    return this.mesh.position
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
}
