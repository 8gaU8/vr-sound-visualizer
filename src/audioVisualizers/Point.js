// @ts-check

import * as THREE from 'three'

import { calcAnglet2Pos, calcPos2Angle, getCameraYawAngle } from './angleUtils'

export class Point {
  /**
   * @description The point that indicates the direction of the sound
   * @type {THREE.Vector3}
   */
  objPosition

  /**
   * volume of the sound
   * @type {Number}
   */
  intensity

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
   * @param {THREE.Vector3} objPosition
   * @param {Number} intensity
   * @param {THREE.Camera} camera
   * @param {Number} indicatorRadius
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
    const pointGeometry = new THREE.CircleGeometry(this.intensity, 32, 32)
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
   * @param {Number} intensity
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
