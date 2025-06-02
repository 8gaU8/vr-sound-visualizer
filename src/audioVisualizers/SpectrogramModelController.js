// @ts-check

/**
 * @typedef {import('../AudioController.js').AudioController} AudioController
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
    // this.camera = camera
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

    updateVisibility(camera){
    const visibleThreshold = 10
    const angleThreshold = 0.5
    // console.log('updateVisibility', camera.position)
    const distance= camera.position.distanceTo(this.mesh.position)
  
    //get vector from camera to mesh
    const vecToMesh = new THREE.Vector3()
    vecToMesh.subVectors(this.mesh.position, camera.position).normalize()
    //get camera direction vector
    const cameraDirection = new THREE.Vector3(0,0,-1)
    cameraDirection.applyQuaternion(camera.quaternion).normalize()
    //get angle between camera direction and mesh direction
    const angle = vecToMesh.dot(cameraDirection)

    this.mesh.visible = distance < visibleThreshold && angle > angleThreshold

    
  }

  get position() {
    return this.mesh.position
  }

  update(camera) {
    this.analyser.getFrequencyData()
    this.uniforms.tAudioData.value.needsUpdate = true
    this.intensity = this.#calcIntensity(this.analyser.data)
    this.updateVisibility(camera)
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
}
