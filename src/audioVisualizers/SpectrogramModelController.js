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
   * @param {BirdConfig} config
   */
  constructor(audioController, camera, config) {
    this.fftSize = 64
    this.camera = camera
    this.config = config

    const color = new THREE.Color().setHex(config.color)

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
    // mesh.translateY(-0.5)
    // mesh.translateZ(-2)
    return mesh
  }

  /**
   * @param {THREE.Camera} camera
   * @param {THREE.Vector3} worldPosition
   */
  updateVisibility(camera, worldPosition) {
    return true
    // if (VisualizeOptions.spectrogramModel.enabled) {
    //   const visibleThreshold = 5
    //   const angleThreshold = 0.5
    //   // console.log('updateVisibility', camera.position)
    //   const distance = camera.position.distanceTo(worldPosition)

    //   //get vector from camera to mesh
    //   const vecToMesh = new THREE.Vector3()
    //   vecToMesh.subVectors(worldPosition, camera.position).normalize()
    //   //get camera direction vector
    //   const cameraDirection = new THREE.Vector3(0, 0, -1)
    //   cameraDirection.applyQuaternion(camera.quaternion).normalize()
    //   //get angle between camera direction and mesh direction
    //   const angle = vecToMesh.dot(cameraDirection)

    //   this.mesh.visible = distance < visibleThreshold && angle > angleThreshold
    // }
  }

  get position() {
    return this.mesh.position
  }

  /**
   * @param {THREE.Camera} camera
   */
  update(camera) {
    this.analyser.getFrequencyData()
    this.uniforms.tAudioData.value.needsUpdate = true
    this.intensity = this.#calcIntensity(this.analyser.data)

    // //get world position of the mesh
    // const worldPosition = new THREE.Vector3()
    // this.mesh.getWorldPosition(worldPosition)
    // this.updateVisibility(camera, worldPosition)
    // this.faceToCamera(camera)
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
   * @description Make the spectrogram plane face the camera direction
   * @param {THREE.Camera} camera
   */
  faceToCamera(camera) {
    if (this.mesh && camera) {
      this.mesh.lookAt(camera.position)
    }
  }
}
