// @ts-check

import { MotionGenerator } from './MotionGenerator.js'
import { loaders } from './loaders'

/**
 * @typedef {import('three').Mesh} Mesh
 * @typedef {import('three').Object3D} Object3D
 * @typedef {typeof import('./defaultConfigs/configs/woodpecker.json.js').config} BirdConfig
 */

export class BirdModelController {
  /** @type {Mesh} - The 3D mesh of the bird model */
  mesh

  /** @type {BirdConfig} */
  config

  /**
   * @param {BirdConfig} config - The parameters for the bird model including paths, position, scale, and motion.
   */
  constructor(config) {
    this.config = config

    this.motionGenerator = new MotionGenerator(config)
  }

  /**
   * @description Loads the bird model from the specified path
   */
  async load() {
    const gltf = await this.#loadModel(this.config.modelPath)

    /** @type {Mesh} gltf.scene */
    const model = gltf.scene
    model.visible = true // Ensure visibility is on
    model.castShadow = true
    model.receiveShadow = true
    model.scale.copy(this.config.scale)
    model.name = `${this.config.name}Model`
    this.mesh = model
  }

  /**
   * @param {String} url - The URL of the 3D model to load
   */
  async #loadModel(url) {
    return new Promise((resolve, reject) => {
      loaders.gltfLoader.load(
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

  /**
   * @description Updates the position and rotation of the bird model based on the elapsed time.
   * @param {number} time
   * @param {Object3D} model
   */
  updateModelPosition(time, model) {
    // If motion is disabled, do not update position or rotation
    if (!this.config.motion) return

    // update model position
    const position = this.motionGenerator.getPosition(time)
    model.position.copy(position)

    // update model rotation
    const quaternion = this.motionGenerator.getQuaternion(time)
    model.quaternion.copy(quaternion)
  }
}
