//@ts-check

/**
 * @typedef {import('./AudioController.js').AudioController} AudioController
 * @typedef {typeof import('../public/configs/woodpecker.json.js').config} BirdConfig
 * @typedef {import('three').AudioListener} AudioListener
 * @typedef {import('three').Camera} Camera
 * @typedef {import('three').Scene} Scene
 * @typedef {import('three').WebGLRenderer } WebGLRenderer
 */

import { BirdAVController } from './BirdAVController.js'
import { DirectionIndicator } from './audioVisualizers/DirectionIndicator.js'
import { HapticsManager } from './haptics.js'

export class BirdsWatcher {
  /** @type {AudioListener} */
  audioListener
  /** @type {HapticsManager} */
  hapticsManager
  /** @type {Array<BirdAVController>} */
  birds
  /** @type {DirectionIndicator} */
  directionIndicator
  /** @type {Camera} */
  camera

  /**
   * @description BirdWatcher manages the audio and visual components of a bird model.
   * @param {AudioListener} audioListener - The audio listener for the scene.
   * @param {Camera} camera - The camera used for rendering the scene.
   */
  constructor(audioListener, camera) {
    this.audioListener = audioListener
    this.camera = camera

    this.hapticsManager = new HapticsManager()
    this.birds = []
    this.directionIndicator = new DirectionIndicator(this.camera)
  }

  /**
   * @description Adds a new bird model controller with audio and visual components.
   * @param {BirdConfig} birdConfig - The parameters for the bird model including paths, position, scale, and motion.
   */
  async addBird(birdConfig) {
    const birdAVController = new BirdAVController(birdConfig, this.audioListener, this.camera)
    await birdAVController.load()
    this.birds.push(birdAVController)

    this.addHaptics(birdAVController.audioController)
  }

  /**
   * @param {AudioController} audioController
   */
  addHaptics(audioController) {
    const audio = audioController.audio
    if (!audio) {
      console.warn('No audio found in AudioController')
      return
    }
    this.hapticsManager.audioHaptics(audio, {
      intensityMultiplier: 1.0,
      frequencyRange: [0, 32],
      minIntensity: 0.05,
      maxIntensity: 0.5,
      threshold: 0.2,
    })
  }

  /**
   * @description Updates all bird models and their associated audio.
   * @param {Number} time - The elapsed time since the last update.
   * @param {Camera} camera - The camera used for rendering the scene.
   */
  update(time, camera) {
    this.birds.forEach((birdAVController) => {
      birdAVController.update(time)
    })
    // Update the audio listener's position and orientation to match the camera
    this.audioListener.position.copy(camera.position)
    this.audioListener.quaternion.copy(camera.quaternion)

    this.directionIndicator.update()
  }

  /**
   * @description Updates the haptic feedback. only in XR mode.
   * @param {WebGLRenderer} renderer
   */
  updateHaptics(renderer) {
    const session = renderer.xr.getSession()
    this.hapticsManager.updateGamepad(session)
    this.hapticsManager.update()
  }

  /**
   * @param {Scene} scene
   */
  addToScene(scene) {
    this.birds.forEach((controller) => {
      scene.add(controller.meshGroup)
    })
    this.directionIndicator.addTargets(this.birds)
  }

  /**
   * @description Enables or disables Spectrogram visualization for all birds.
   * @param {boolean} enabled - Whether to enable or disable the Spectrogram.
   */
  setSpectrogramEnabled(enabled) {
    console.log('Setting spectrogram enabled:', enabled)
    this.birds.forEach((birdAVController) => {
      birdAVController.setSpectrogramEnabled(enabled)
    })
  }
}
