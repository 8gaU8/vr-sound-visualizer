// @ts-check

import * as THREE from 'three'

import { VisualizeOptions } from '../defaultConfigs/VisualizeOptions'

import { Point } from './Point'
// eslint-disable-next-line no-unused-vars
import { SpectrogramModel } from './SpectrogramModel'

const ringOptions = VisualizeOptions.directionalIndicator.ring

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
    const innerR = ringOptions.radius - ringOptions.thickness / 2
    const outerR = ringOptions.radius + ringOptions.thickness / 2
    const thetaSegments = 32
    const ringGeometry = new THREE.RingGeometry(innerR, outerR, thetaSegments)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: ringOptions.color,
      side: THREE.FrontSide,
      depthTest: false,
      transparent: true,
      opacity: ringOptions.opacity,
    })
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial)
    ringMesh.name = 'ring'
    return ringMesh
  }

  #generateIndicator() {
    const indicator = new THREE.Group()
    indicator.name = 'DirectionIndicator'

    const ringMesh = this.#generateRing()
    indicator.add(ringMesh)

    const p = ringOptions.position
    indicator.position.set(p.x, p.y, p.z)
    return indicator
  }

  /**
   * @description Add a sound object as a target to the indicator.
   *              The target will be represented as a point on the indicator ring.
   * @param {SpectrogramModel} target
   */
  addTarget(target) {
    const point = new Point(target, this.camera)
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
