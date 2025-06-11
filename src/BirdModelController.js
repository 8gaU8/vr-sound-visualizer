// @ts-check
import { CatmullRomCurve3, Quaternion, Vector3 } from 'three'

import { loaders } from './loaders'
import { RNG } from './noise.js'

/**
 * @typedef {import('three').Mesh} Mesh
 * @typedef {import('three').Object3D} Object3D
 * @typedef {typeof import('./defaultConfigs/birds/woodpecker.json.js').config} BirdConfig
 */

/**
 *
 * @param {BirdConfig} config
 * @returns {Vector3[]} - Returns an array of Vector3 points representing the motion path of the bird.
 */
function generateMotion(config) {
  const rng = new RNG(config.seed) // Seed for consistent random generation
  const randomPoints = []
  for (let i = 0; i < 20; i++) {
    const randomX = rng.random() * 5 //+ config.position.x
    const randomY = rng.random() * 3 //+ config.position.y
    const randomZ = rng.random() * 5 //+ config.position.z
    randomPoints.push(new Vector3(randomX, randomY, randomZ))
  }
  const curve = new CatmullRomCurve3(randomPoints, true, 'catmullrom', 0.5)
  const points = curve.getPoints(2000)
  return points
}

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

    this.curvePoints = generateMotion(this.config)
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
   * @param {Number} time
   * @returns {Vector3} - Returns the position of the bird model at the specified time.
   */
  getPosition(time) {
    const t = time * 0.05 // Convert time to seconds
    const index = Math.floor(t * this.curvePoints.length) % this.curvePoints.length
    const point = this.curvePoints[index]
    return point.clone()
  }

  /**
   *
   * @param {Number} time
   * @returns {Quaternion} - Returns the quaternion representing the rotation of the bird model at the specified time.
   */
  getQuaternion(time) {
    const t = time * 0.05 // Convert time to seconds
    const index = Math.floor(t * this.curvePoints.length) % this.curvePoints.length
    const point = this.curvePoints[index]
    //  Rotate the bird model to face the direction of motion
    const nextIndex = (index + 1) % this.curvePoints.length
    const nextPoint = this.curvePoints[nextIndex]
    const direction = nextPoint.clone().sub(point).normalize()
    const lookAtPoint = point.clone().add(direction)
    const quaternion = new Quaternion()
    quaternion.setFromUnitVectors(new Vector3(0, 0, 1), lookAtPoint.clone().sub(point).normalize())
    return quaternion.clone()
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
    const position = this.getPosition(time)
    model.position.copy(position)

    // update model rotation
    const quaternion = this.getQuaternion(time)
    model.quaternion.copy(quaternion)
  }
}
