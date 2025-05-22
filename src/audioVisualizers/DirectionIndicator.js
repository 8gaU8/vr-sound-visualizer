// @ts-check

import * as THREE from 'three'

import { Point } from './Point'
// eslint-disable-next-line no-unused-vars
import { SpectrogramModel } from './SpectrogramModel'

export class DirectionIndicator {
  /**
   * @description The main mesh of the direction indicator
   * @type {THREE.Group}
   */
  indicator

  /**
   * @type {Array<Point>}
   * @description The points that are used to indicate the direction
   */
  points = []

  /**
   * @type {THREE.Camera}
   * @description The camera to which the indicator is attached
   */
  camera

  #ringRadius = 2
  #ringThickness = 0.2

  /**
   * @description The direction indicator
   * @param {THREE.Camera} camera
   * @description The camera to which the indicator is attached
   */
  constructor(camera) {
    this.camera = camera
    this.indicator = this.#generateIndicator()
  }

  #generateRing() {
    const innerR = this.#ringRadius - this.#ringThickness / 2
    const outerR = this.#ringRadius + this.#ringThickness / 2
    const thetaSegments = 32
    const ringGeometry = new THREE.RingGeometry(innerR, outerR, thetaSegments)
    const ringMAterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      side: THREE.FrontSide,
      depthTest: false,
      transparent: true,
      opacity: 0.8,
    })
    const ringMesh = new THREE.Mesh(ringGeometry, ringMAterial)
    ringMesh.name = 'ring'
    return ringMesh
  }

  #generateIndicator() {
    const indicator = new THREE.Group()
    indicator.name = 'DirectionIndicator'

    const ringMesh = this.#generateRing()
    indicator.add(ringMesh)

    indicator.position.set(0, 0, -2)
    return indicator
  }

  /**
   * @description Add a sound object as a target to the indicator.
   *              The target will be represented as a point on the indicator ring.
   * @param {THREE.Mesh} target
   */
  addTarget(target) {
    const point = new Point(target, this.camera, this.#ringRadius)
    this.points.push(point)
    this.indicator.add(point.mesh)
  }

  /**
   * @description Update the position of the indicator and the points
   */
  update() {
    this.points.forEach((point) => {
      point.update()
    })
  }
}
