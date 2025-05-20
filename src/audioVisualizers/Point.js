import * as THREE from 'three'

import { calcAnglet2Pos, calcPos2Angle, getCameraYawAngle } from './angleUtils'

export class Point {
  /**
   * @description The point that indicates the direction of the sound
   * @type {THREE.Vector3}
   */
  objPosition = null

  /**
   * volume of the sound
   * @type {float}
   */
  intensity = null | undefined

  /**
   * camera to reference the direction
   * @type {THREE.Camera}
   */
  camera = null

  /**
   * @description Radius of indicator ring
   * @type {float}
   */
  indicatorRadius = null

  #z = 0.001

  /**
   * @type {THREE.Mesh}
   * @description The point mesh
   */
  mesh = null

  /**
   * @description Initial angle of the point
   * @private
   * @type {float}
   */
  #initialAngle = null

  /**
   *
   * @param {THREE.Vector3} objPosition
   * @param {float} intensity
   * @param {THREE.Camera} camera
   * @param {float} indicatorRadius
   */
  constructor(objPosition, intensity, camera, indicatorRadius) {
    this.objPosition = objPosition
    this.intensity = intensity
    this.camera = camera
    this.indicatorRadius = indicatorRadius
    this.#initialAngle = getCameraYawAngle(this.camera)

    this.mesh = this.#genMesh()
    this.update(objPosition, intensity)
  }

  #genMesh() {
    const pointGeometry = new THREE.CircleGeometry(this.intensity, 8, 8)
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
   *
   * @param {THREE.Vector3} position
   * @param {float} intensity
   */
  update(position, intensity) {
    // calculate the angle of the camera
    const cameraAngle = getCameraYawAngle(this.camera) - this.#initialAngle

    // Calculate the angle between the point and the camera
    const cameraPosition = this.camera.position
    const objectAngle = calcPos2Angle(position, cameraPosition)

    // calculate global angle
    const angle = objectAngle - cameraAngle

    // position of the point to draw
    let { x, y } = calcAnglet2Pos(angle)
    x *= this.indicatorRadius
    y *= this.indicatorRadius
    this.mesh.position.set(x, y, this.#z)
    this.mesh.scale.set(intensity, intensity, intensity)
  }
}
