// @ts-check

import * as THREE from 'three'

// @ts-ignore
import fragShaer from './shaders/spectrogram.frag?raw'
// @ts-ignore
import vertShaer from './shaders/spectrogram.vert?raw'

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
   * @description The size of the FFT
   * @type {Number}
   */
  fftSize

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

    this.analyser = new THREE.AudioAnalyser(audio, this.fftSize)
    this.uniforms = {
      tAudioData: {
        value: new THREE.DataTexture(this.analyser.data, this.fftSize / 2, 1, THREE.RedFormat),
      },
    }
  }

  /**
   * @description Create a mesh for the spectrogram
   * @returns {THREE.Mesh}
   */
  createSpectrogramMesh() {
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertShaer,
      fragmentShader: fragShaer,
      transparent: true,
      side: THREE.DoubleSide,
    })

    const geometry = new THREE.PlaneGeometry(10, 10)

    const mesh = new THREE.Mesh(geometry, material)
    return mesh
  }

  update() {
    this.analyser.getFrequencyData()
    this.uniforms.tAudioData.value.needsUpdate = true
    this.intensity = Math.max(...this.analyser.data.map(Math.abs))
  }
}
