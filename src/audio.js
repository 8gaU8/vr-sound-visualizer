import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

import { SpectrogramModel } from './audioVisualizers/SpectrogramModel.js'
import { HapticsManager } from './haptics'

export class AudioManager {
  constructor() {
    this.listener = new THREE.AudioListener()
    this.audioLoader = new THREE.AudioLoader()
    this.gltfLoader = new GLTFLoader() // for loading 3D glb models
    this.hapticsManager = new HapticsManager()
    this.clock = new THREE.Clock()

    this.models = new Map() //store loaded models
  }

  update() {
    const time = this.clock.getElapsedTime()
    this.models.forEach(({ model, motion, spectrogramModel }) => {
      if (motion && model) {
        model.position.y = model.position.y + 0.005 * Math.sin(time * 1.5)
        model.rotation.y = 0.2 * Math.sin(time * 1.5 * 0.5)
      }
      spectrogramModel.update()
    })
  }

  async loadModelAudio(modelPath, audioPath, motion = true) {
    try {
      // Load the 3D model glb
      const gltf = await this.#loadModel(modelPath)
      const model = gltf.scene

      //create an audio object
      const audio = await this.#loadAudio(audioPath)
      audio.play()

      model.add(audio)

      // Add audio to haptics manager for audio haptics
      this.hapticsManager.audioHaptics(audio, {
        intensityMultiplier: 1.0,
        frequencyRange: [0, 32],
        minIntensity: 0.05,
        maxIntensity: 0.5,
        threshold: 0.3,
      })

      // Generate spectrogram model
      const spectrogramModel = this.#genSpectrogramModel(audio)
      model.add(spectrogramModel.mesh)
      spectrogramModel.mesh.position.set(0, 1, 0) // Position the spectrogram mesh above the model

      //store ref
      this.models.set(modelPath, { model, audio, motion, spectrogramModel })

      return { model, audio, spectrogramModel }
    } catch (error) {
      console.error('Error loading model or audio:', error)
      throw error
    }
  }

  // Play audio for specific model
  playAudio(modelUrl) {
    const modelData = this.models.get(modelUrl)
    if (modelData && modelData.audio) {
      modelData.audio.play()
    }
  }

  // Stop audio for specific model
  stopAudio(modelUrl) {
    const modelData = this.models.get(modelUrl)
    if (modelData && modelData.audio) {
      modelData.audio.stop()
    }
  }

  // Clean up resources
  dispose() {
    this.models.forEach(({ model, audio }) => {
      audio.stop()
      audio.disconnect()
      model.traverse((child) => {
        if (child.material) child.material.dispose()
        if (child.geometry) child.geometry.dispose()
      })
    })
    this.models.clear()
  }
  //load ambient audio
  async loadAmbientAudio(path) {
    try {
      const ambientAudio = new THREE.Audio(this.listener)
      const ambAudioBuffer = await this.#loadAudioBuffer(path)
      ambientAudio.setBuffer(ambAudioBuffer)
      ambientAudio.setLoop(true)
      ambientAudio.setVolume(0.5)
      ambientAudio.play()

      return ambientAudio
    } catch (error) {
      console.error('Error loading ambient audio:', error)
      throw error
    }
  }

  updateAudioListener(camera) {
    this.listener.position.copy(camera.position)
    this.listener.quaternion.copy(camera.quaternion) //update the audio listener to the head orientation
    this.update() //update motion
  }

  async #loadModel(url) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => resolve(gltf),
        (progress) => {
          if (progress.loaded / progress.total === 1) {
            console.log('Loaded:', url)
          }
        },
        (error) => reject(error),
      )
    })
  }

  async #loadAudio(audioPath) {
    const audio = new THREE.PositionalAudio(this.listener)
    const audioBuffer = await this.#loadAudioBuffer(audioPath)
    audio.setBuffer(audioBuffer)
    audio.setRefDistance(5) // Set the distance at which the audio is heard at full volume
    audio.setRolloffFactor(2) // Add rolloff factor
    audio.setDistanceModel('inverse') // Change to inverse for better distance attenuation
    audio.setDirectionalCone(180, 230, 0.1) // Add directional cone for more realistic sound
    audio.setLoop(true) // Set the audio to loop
    return audio
  }

  async #loadAudioBuffer(url) {
    return new Promise((resolve, reject) => {
      this.audioLoader.load(
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
   *
   * @param {THREE.Audio} audio
   * @returns {SpectrogramModel}
   */
  #genSpectrogramModel(audio) {
    // This method is not used in this class, but can be implemented if needed
    // It would generate a mesh for the spectrogram visualization
    const spectrogramModel = new SpectrogramModel(audio)
    return spectrogramModel
  }
}
