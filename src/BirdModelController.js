// @ts-check
import { loaders } from './loaders'

/**
 * @typedef {import('three').Mesh} Mesh
 * @typedef {import('./defaultConfigs/BirdModelParam.js').BirdModelParam} BirdModelParam
 */

export class BirdModelController {
  /** @type {Mesh} - The 3D mesh of the bird model */
  mesh

  /** @type {BirdModelParam} - The parameters for the bird model including paths, position, scale, and motion */
  param

  /**
   * @param {BirdModelParam} birdModelParam - The parameters for the bird model including paths, position, scale, and motion.
   */
  constructor(birdModelParam) {
    this.param = birdModelParam
  }

  /**
   * @description Loads the bird model from the specified path
   */
  async load() {
    const gltf = await this.#loadModel(this.param.modelPath)

    /** @type {Mesh} gltf.scene */
    const model = gltf.scene
    model.visible = true // Ensure visibility is on
    model.castShadow = true
    model.receiveShadow = true
    model.scale.copy(this.param.scale)
    model.name = `${this.param.name}Model`
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
   * Updates the bird model's position and rotation based on time.
   * @param {Number} time
   */
  update(time) {
    if (this.param.motion) {
      this.mesh.position.y += 0.005 * Math.sin(time * 1.5)
      this.mesh.rotation.y = 0.2 * Math.sin(time * 1.5 * 0.5)
    }
  }
}
