// @ts-check

/**
 * @typedef {typeof import('./defaultConfigs/_configs/woodpecker.json.js').config} BirdConfig
 * @typedef {import('three').AudioListener} AudioListener
 */

import { Audio, PositionalAudio } from 'three'

import { loaders } from './loaders.js'

export class AudioController {
  /** @type {AudioListener} - The audio listener for the scene. */
  audioListener

  /** @type {PositionalAudio} - */
  audio

  /** @type {BirdConfig} - The parameters for the bird model including paths, position, scale, and motion */
  config

  /**
   * @description manage audio
   * @param {BirdConfig} config - The parameters for the bird model including paths, position, scale, and motion.
   * @param {AudioListener} audioListener - The audio listener for the scene.
   */
  constructor(config, audioListener) {
    this.config = config
    this.audioListener = audioListener
  }

  async load() {
    const audio = await AudioController.#loadAudio(this.config.audioPath, this.audioListener)
    audio.name = `${this.config.name}Audio`
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
