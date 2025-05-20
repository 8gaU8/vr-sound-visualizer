// DirectionIndicator.js

import * as THREE from 'three'

import { Point } from './Point'

export class DirectionIndicator {
  /**
   * @type {THREE.Group}
   */
  indicator = null

  /**
   * @private
   * @type {Array<Point>}
   * @description The points that are used to indicate the direction
   */
  points = []

  #ringRadius = 2
  #ringThickness = 0.2

  /**
   * @description The direction indicator
   * @param {THREE.Camera} camera
   * @description The camera to which the indicator is attached
   */
  constructor(camera) {
    this.indicator = this.#generateIndicator(camera)
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

  #generatePoint(camera, position) {
    const point = new Point(position, 0.1, camera, this.#ringRadius)
    return point
  }

  #generateIndicator(camera) {
    const indicator = new THREE.Group()
    indicator.name = 'DirectionIndicator'

    const ringMesh = this.#generateRing()
    indicator.add(ringMesh)

    this.points.push(
      this.#generatePoint(camera, new THREE.Vector3(2, 0, 2)),
      // this.#generatePoint(camera, new THREE.Vector3(-2, 0, 2)),
    )
    this.points.forEach((point) => {
      indicator.add(point.mesh)
    })

    indicator.position.set(0, 0, -2)
    return indicator
  }

  update() {
    this.points.forEach((point) => {
      point.update(point.objPosition, point.intensity)
    })
  }
}
