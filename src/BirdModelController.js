// @ts-check
import { CatmullRomCurve3, Vector3 } from 'three'

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

    this.curvePoints = BirdModelController.#generateMotion()
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
      const t = time * 0.05 // Convert time to seconds
      const index = Math.floor(t * this.curvePoints.length) % this.curvePoints.length
      const point = this.curvePoints[index]

      this.mesh.position.copy(point)

      //  Rotate the bird model to face the direction of motion
      const nextIndex = (index + 1) % this.curvePoints.length
      const nextPoint = this.curvePoints[nextIndex]
      const direction = nextPoint.clone().sub(point).normalize()
      const lookAtPoint = point.clone().add(direction)
      this.mesh.quaternion.setFromUnitVectors(
        new Vector3(0, 0, 1), // Default forward vector
        lookAtPoint.clone().sub(point).normalize(), // Direction to look at
      )
    }
  }

  static #generateMotion() {
    const randomPoints = []
    for (var i = 0; i < 20; i++) {
      const randomX = Math.random() * 5 + 1
      const randomY = Math.random() * 5 + 1
      const randomZ = Math.random() * 5 + 1
      randomPoints.push(new Vector3(randomX, randomY, randomZ))
    }
    const curve = new CatmullRomCurve3(randomPoints, true, 'catmullrom', 0.5)
    const points = curve.getPoints(2000)
    return points
  }
}
