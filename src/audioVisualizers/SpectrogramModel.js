import * as THREE from 'three'

import fragShaer from './shaders/spectrogram.frag?raw'
import vertShaer from './shaders/spectrogram.vert?raw'

export class SpectrogramModel {
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
  }
}
