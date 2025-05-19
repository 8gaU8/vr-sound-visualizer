// DirectionIndicator.js

import * as THREE from 'three'

export class DirectionIndicator {
  /**
   * @type {THREE.Group}
   */
  indicator = null

  #ringRadius = 2
  #ringThickness = 0.2

  constructor() {
    this.indicator = this.#generateIndicator()
  }

  /**
   * Creates a new instance of the DirectionIndicator
   * @param {THREE.Vector3} position
   */
  addPosition(position) {
    this.positions.push(position)
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

  #calcPositionFromDirection(direction) {
    const y = (Math.sin(direction) * this.#ringRadius) / 10
    const x = (Math.cos(direction) * this.#ringRadius) / 10
    return { x, y }
  }

  #generatePoint(direction) {
    const radius = this.#ringThickness
    const pointGeometry = new THREE.CircleGeometry(radius, 8, 8)
    const pointMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.FrontSide,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      opacity: 1.0,
    })
    const point = new THREE.Mesh(pointGeometry, pointMaterial)

    const position = this.#calcPositionFromDirection(direction)
    point.position.set(position.x, position.y, 0.001)
    return point
  }

  #generateIndicator() {
    const indicator = new THREE.Group()
    indicator.name = 'DirectionIndicator'

    const ringMesh = this.#generateRing()
    indicator.add(ringMesh)
    indicator.add(this.#generatePoint(0))
    indicator.add(this.#generatePoint(Math.PI / 2))
    indicator.add(this.#generatePoint(Math.PI / 4))
    indicator.add(this.#generatePoint(Math.PI))

    indicator.position.set(0, 0, -2)
    return indicator
  }
}
