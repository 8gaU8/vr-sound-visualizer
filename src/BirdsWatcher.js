//@ts-check

/**
 * @typedef {import('./AudioController.js').AudioController} AudioController
 * @typedef {import('./defaultConfigs/BirdModelParam.js').BirdModelParam} BirdModelParam
 * @typedef {import('three').AudioListener} AudioListener
 * @typedef {import('three').Camera} Camera
 * @typedef {import('three').Scene} Scene
 * @typedef {import('three').WebGLRenderer } WebGLRenderer
 */

import { BirdAVController } from './BirdAVController.js'
import { HapticsManager } from './haptics.js'

export class BirdsWatcher {
  /** @type {AudioListener} */
  audioListener
  /** @type {HapticsManager} */
  hapticsManager
  /** @type {Array<BirdAVController>} */
  birds

  /**
   * @param {AudioListener} audioListener - The audio listener for the scene.
   * @description BirdWatcher manages the audio and visual components of a bird model.
   */
  constructor(audioListener) {
    this.audioListener = audioListener
    this.hapticsManager = new HapticsManager()
    this.birds = []
  }

  /**
   * @description Adds a new bird model controller with audio and visual components.
   * @param {BirdModelParam} birdModelParam - The parameters for the bird model including paths, position, scale, and motion.
   */
  async addBird(birdModelParam) {
    const birdAVController = new BirdAVController(birdModelParam, this.audioListener)
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
      threshold: 0.3,
    })
  }

  /**
   * @description Updates all bird models and their associated audio.
   * @param {Number} time - The elapsed time since the last update.
   * @param {Camera} camera - The camera used for rendering the scene.
   */
  update(time, camera) {
    this.birds.forEach((controller) => {
      controller.update(time, camera)
    })
    // Update the audio listener's position and orientation to match the camera
    this.audioListener.position.copy(camera.position)
    this.audioListener.quaternion.copy(camera.quaternion)
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
  }
}
