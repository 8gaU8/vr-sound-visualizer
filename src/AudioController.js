// @ts-check

/**
 * @typedef {import('./defaultConfigs/BirdModelParam.js').BirdModelParam} BirdModelParam
 * @typedef {import('three').AudioListener} AudioListener
 */

import { Audio, PositionalAudio } from 'three'

import { loaders } from './loaders.js'

export class AudioController {
  /** @type {AudioListener} - The audio listener for the scene. */
  audioListener

  /** @type {PositionalAudio} - */
  audio

  /** @type {BirdModelParam} - The parameters for the bird model including paths, position, scale, and motion */
  param

  /**
   * @description manage audio
   * @param {BirdModelParam} birdModelParam - The parameters for the bird model including paths, position, scale, and motion.
   * @param {AudioListener} audioListener - The audio listener for the scene.
   */
  constructor(birdModelParam, audioListener) {
    this.param = birdModelParam
    this.audioListener = audioListener
  }

  async load() {
    const audio = await AudioController.#loadAudio(this.param.audioPath, this.audioListener)
    audio.name = `${this.param.name}Audio`
    this.audio = audio
    this.play()
  }

  /** @description Play audio for specific model */
  play() {
    this.audio.play()
  }

  /** @description Stop audio for specific model */
  stopAudio() {
    this.audio.stop()
  }

  /**
   * @param {String} audioPath
   * @param {AudioListener} audioListener
   */
  static async #loadAudio(audioPath, audioListener) {
    const audio = new PositionalAudio(audioListener)
    const audioBuffer = await AudioController.#loadAudioBuffer(audioPath)
    audio.setBuffer(audioBuffer)
    audio.setRefDistance(5) // Set the distance at which the audio is heard at full volume
    audio.setRolloffFactor(2) // Add rolloff factor
    audio.setDistanceModel('inverse') // Change to inverse for better distance attenuation
    audio.setDirectionalCone(180, 230, 0.1) // Add directional cone for more realistic sound
    audio.setLoop(true) // Set the audio to loop
    return audio
  }

  /** @param {String} url */
  static async #loadAudioBuffer(url) {
    return new Promise((resolve, reject) => {
      loaders.audioLoader.load(
        url,
        (buffer) => resolve(buffer),
        (progress) => {
          if (progress.loaded / progress.total === 1) {
            console.log('Loaded:', url)
          }
        },
        (error) => reject(error),
      )
    })
  }

  /**
   * @param {string} path
   * @param {AudioListener} listener
   */
  static async loadAmbientAudio(path, listener) {
    const ambientAudio = new Audio(listener)
    const ambAudioBuffer = await AudioController.#loadAudioBuffer(path)
    ambientAudio.setBuffer(ambAudioBuffer)
    ambientAudio.setLoop(true)
    ambientAudio.setVolume(0.5)
    ambientAudio.play()
  }
}
