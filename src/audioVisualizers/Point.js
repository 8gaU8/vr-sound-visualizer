// @ts-check

import * as THREE from 'three'

import { VisualizeOptions } from '../defaultConfigs/VisualizeOptions'

// eslint-disable-next-line no-unused-vars
import { SpectrogramModel } from './SpectrogramModel'
import { calcAngle2Pos, calcDistance, calcPos2Angle, getCameraYawAngle } from './angleUtils'

const pointOptions = VisualizeOptions.directionalIndicator.point

export class Point {
  /**
   * @description The target spectrogram object
   * @type {SpectrogramModel}
   */
  target

  /**
   * camera to reference the direction
   * @type {THREE.Camera}
   */
  camera

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
   * @param {SpectrogramModel} target
   * @param {THREE.Camera} camera
   */
  constructor(target, camera) {
    this.target = target
    this.camera = camera
    this.#initialAngle = getCameraYawAngle(this.camera)

    this.mesh = this.#genMesh()
    this.update()
  }

  #genMesh() {
    const pointGeometry = new THREE.CircleGeometry(1, 32, 32)
    const pointMaterial = new THREE.MeshBasicMaterial({
      color: pointOptions.color,
      side: THREE.FrontSide,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      opacity: pointOptions.opacity,
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
    const targetPosition = this.target.position
    const objectAngle = calcPos2Angle(targetPosition, cameraPosition)

    // calculate global angle
    const angle = objectAngle - cameraAngle

    // position of the point to draw
    let { x, y } = calcAngle2Pos(angle)
    x *= VisualizeOptions.directionalIndicator.ring.radius
    y *= VisualizeOptions.directionalIndicator.ring.radius
    this.mesh.position.set(x, y, pointOptions.z)

    // calculate size of the point
    // calculate distance between camera and the point
    const distance = calcDistance(this.camera, this.target.position)
    // calculate the size of the point based on the distance
    let size = ((1 / distance) * this.target.intensity) / 500
    // clip size
    size = Math.max(pointOptions.minSize, Math.min(size, pointOptions.maxSize))

    this.mesh.scale.set(size, size, size)
  }
}
