// @ts-check

/**
 * @typedef {typeof import('./defaultConfigs/birds/woodpecker.json.js').config} BirdConfig
 * @typedef {import('three').AudioListener} AudioListener
 * @typedef {import('three').Camera} Camera
 */

import { Group } from 'three'

import { AudioController } from './AudioController.js'
import { BirdModelController } from './BirdModelController.js'
import { SpectrogramModelController } from './audioVisualizers/SpectrogramModelController.js'

/**
 * @description BirdAVController manages the audio and visual components of a bird model.
 *
 * **Children of `BirdAVController`**
 * - `BirdModelController` (3D bird model)
 * - `AudioController` (positional audio model)
 * - `SpectrogramModelController` (spectrogram model)
 */
export class BirdAVController {
  /** @type {Group} */
  meshGroup

  /** @type {BirdModelController} - Path to the audio file */
  birdModelController

  /** @type {AudioController} - Path to the audio file */
  audioController

  /** @type {SpectrogramModelController} - The spectrogram model controller */
  spectrogramModelController

  /** @type {AudioListener} */
  audioListener

  /** @type {BirdConfig} */
  config

  /**
   * @param {BirdConfig} config - The parameters for the bird model including paths, position, scale, and motion.
   * @param {AudioListener} audioListener - The audio listener for the scene.
   */
  constructor(config, audioListener) {
    this.config = config
    this.audioListener = audioListener
    // this.camera = camera
    this.birdModelController = new BirdModelController(this.config)
    this.audioController = new AudioController(this.config, this.audioListener)
  }

  /**
   */
  async load() {
    await this.birdModelController.load()
    await this.audioController.load()
    this.spectrogramModelController = new SpectrogramModelController(this.audioController)

    // this.spectrogramModelController = new SpectrogramModelController(this.audioController)

    this.meshGroup = new Group()
    this.meshGroup.name = `${this.config.name}Controller`

    this.meshGroup.add(this.birdModelController.mesh)
    this.meshGroup.add(this.spectrogramModelController.mesh)
    this.meshGroup.add(this.audioController.audio)

    this.meshGroup.position.copy(this.config.position)
  }

  /**
   * @param {number} time  - The elapsed time since the last update.
   * @param {Camera} camera - The camera used for rendering the scene.
   * @description Updates the bird model and spectrogram based on the elapsed time.
   */
  update(time, camera) {
    // update model position
    this.birdModelController.updateModelPosition(time, this.meshGroup)
    // update spectrogram
    this.spectrogramModelController.update(camera)
  }

  get intensity() {
    return this.spectrogramModelController.intensity
  }

  get position() {
    return this.meshGroup.position
  }

  /**
   * @description Enables or disables Spectrogram visualization
   * @param {boolean} enabled - Whether to enable or disable the Spectrogram.
   */
  setSpectrogramEnabled(enabled) {
    this.spectrogramModelController.mesh.visible = enabled
  }
}
