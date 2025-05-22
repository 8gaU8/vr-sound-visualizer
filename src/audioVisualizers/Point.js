// @ts-check

import * as THREE from 'three'

import { calcAnglet2Pos, calcDistance, calcPos2Angle, getCameraYawAngle } from './angleUtils'

export class Point {
  /**
   * @description The target spectrogram object
   * @type {THREE.Mesh}
   */
  target

  /**
   * camera to reference the direction
   * @type {THREE.Camera}
   */
  camera

  /**
   * @description Radius of indicator ring
   * @type {Number}
   */
  indicatorRadius

  #z = 0.001

  /**
   * @type {THREE.Mesh}
   * @description The point mesh
   */
  mesh

  /**
   * @description Initial angle of the point
   * @type {Number}
   */
  #initialAngle

  /**
   *
   * @param {THREE.Mesh} target
   * @param {THREE.Camera} camera
   * @param {Number} indicatorRadius
   */
  constructor(target, camera, indicatorRadius) {
    this.target = target
    this.camera = camera
    this.indicatorRadius = indicatorRadius
    this.#initialAngle = getCameraYawAngle(this.camera)

    this.mesh = this.#genMesh()
    this.update()
  }

  #genMesh() {
    const pointGeometry = new THREE.CircleGeometry(1, 32, 32)
    const pointMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.FrontSide,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      opacity: 1.0,
    })
    const point = new THREE.Mesh(pointGeometry, pointMaterial)
    return point
  }

  /**
   * @description Update the position of the point depending on the camera position and the target object
   */
  update() {
    // calculate the angle of the camera
    const cameraAngle = getCameraYawAngle(this.camera) - this.#initialAngle

    // Calculate the angle between the point and the camera
    const cameraPosition = this.camera.position
    // console.log('target position', this.target.position)
    const objectAngle = calcPos2Angle(this.target.position, cameraPosition)

    // calculate global angle
    const angle = objectAngle - cameraAngle

    // position of the point to draw
    let { x, y } = calcAnglet2Pos(angle)
    x *= this.indicatorRadius
    y *= this.indicatorRadius
    this.mesh.position.set(x, y, this.#z)

    // calculate size of the point
    // calculate distance between camera and the point
    const distance = calcDistance(this.camera, this.target.position)
    // calculate the size of the point based on the distance
    const size = 1 / distance
    // console.log('size', size)
    // const size = 10

    this.mesh.scale.set(size, size, size)
  }
}
