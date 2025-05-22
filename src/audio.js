import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

import { HapticsManager } from './haptics'

export class AudioManager {
  constructor() {
    this.listener = new THREE.AudioListener()
    this.audioLoader = new THREE.AudioLoader()
    this.gltfLoader = new GLTFLoader() // for loading 3D glb models
    this.models = new Map() //store loaded models
    this.hapticsManager = new HapticsManager()
  }

  async loadModelAudio(modelPath, audioPath) {
    try {
      // Load the 3D model glb
      const gltf = await this.loadModel(modelPath)
      const model = gltf.scene

      //create an audio object positio
      const audio = new THREE.PositionalAudio(this.listener) ////positional audio///////////
      // Load the audio file
      const audioBuffer = await this.loadAudio(audioPath)
      audio.setBuffer(audioBuffer)
      audio.setRefDistance(5) // Set the distance at which the audio is heard at full volume
      audio.setRolloffFactor(2) // Add rolloff factor
      audio.setDistanceModel('inverse') // Change to inverse for better distance attenuation
      audio.setDirectionalCone(180, 230, 0.1) // Add directional cone for more realistic sound
      audio.setLoop(true) // Set the audio to loop
      // audio.setVolume(0.5) // Set the volume of the audio

      // Add the audio object to the model
      model.add(audio)

      //store ref
      this.models.set(modelPath, { model, audio })

      this.hapticsManager.audioHaptics(audio, {
        intensityMultiplier: 1.0,
        frequencyRange: [0, 32],
        minIntensity: 0.05,
        maxIntensity: 0.5,
        threshold: 0.3,
      })

      return { model, audio }
    } catch (error) {
      console.error('Error loading model or audio:', error)
      throw error
    }
  }

  async loadModel(url) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => resolve(gltf),
        (progress) =>
          console.log(`Loading model: ${Math.round((progress.loaded / progress.total) * 100)}%`),
        (error) => reject(error),
      )
    })
  }

  async loadAudio(url) {
    return new Promise((resolve, reject) => {
      this.audioLoader.load(
        url,
        (buffer) => resolve(buffer),
        (progress) =>
          console.log(`Loading audio: ${Math.round((progress.loaded / progress.total) * 100)}%`),
        (error) => reject(error),
      )
    })
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
      const ambAudioBuffer = await this.loadAudio(path)
      ambientAudio.setBuffer(ambAudioBuffer)
      ambientAudio.setLoop(true)
      ambientAudio.setVolume(0.5)
      ambientAudio.play()

      // scene.add(ambientAudio)

      return ambientAudio
    } catch (error) {
      console.error('Error loading ambient audio:', error)
      throw error
    }
  }

  updateAudioListener(camera) {
    this.listener.position.copy(camera.position)
    this.listener.quaternion.copy(camera.quaternion) //update the audio listener to the head orientation
    //update haptics
    // if (renderer.xr.isPresenting) {
    //   const session = renderer.xr.getSession();
    //   this.hapticsManager.updateGamepad(session);
    //   this.hapticsManager.update();
    // }
  }
}
