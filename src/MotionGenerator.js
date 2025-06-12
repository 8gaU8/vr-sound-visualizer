//@ts-check

/**
 * @typedef {import('three').Mesh} Mesh
 * @typedef {import('three').Object3D} Object3D
 * @typedef {typeof import('../public/configs/woodpecker.json.js').config} BirdConfig
 */

import { CatmullRomCurve3, Quaternion, Vector3 } from 'three'

import { RNG } from './noise.js'

export class MotionGenerator {
  /** @type {BirdConfig} */
  config
  /** @type {RNG} */
  rng
  /** @type {Vector3[]} */
  curvePoints

  /**
   * @param {BirdConfig} config
   */
  constructor(config) {
    this.config = config
    this.rng = new RNG(config.seed)
    this.curvePoints = this.generateMotion()
  }

  /**
   * @returns {Vector3[]} - Returns an array of Vector3 points representing the motion path of the bird.
   */
  generateMotion() {
    const randomPoints = []
    for (let i = 0; i < 20; i++) {
      const randomX = this.rng.random() * 5 + this.config.position.x
      const randomY = this.rng.random() * 1 + this.config.position.y
      const randomZ = this.rng.random() * 5 + this.config.position.z
      randomPoints.push(new Vector3(randomX, randomY, randomZ))
    }
    const curve = new CatmullRomCurve3(randomPoints, true, 'catmullrom', 0.5)
    const points = curve.getPoints(2000)
    return points
  }

  /**
   * @param {number} time
   * @returns {Vector3} - Returns the position of the bird model at the specified time.
   */
  getPosition(time) {
    const t = time * 0.025 // Convert time to seconds
    const index = Math.floor(t * this.curvePoints.length) % this.curvePoints.length
    const point = this.curvePoints[index]
    return point.clone()
  }

  /**
   *
   * @param {number} time
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
}
