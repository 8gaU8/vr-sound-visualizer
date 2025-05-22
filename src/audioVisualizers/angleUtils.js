// @ts-check

import * as THREE from 'three'

/**
 * @description Get the yaw angle of the camera in radians
 * @param {THREE.Camera} camera
 * @returns {Number} radians along the Y axis
 */
export function getCameraYawAngle(camera) {
  const direction = new THREE.Vector3()
  camera.getWorldDirection(direction)

  // radians -π ~ π
  const angle = Math.atan2(direction.x, direction.z)

  // normalize to 0 ~ 2π
  const angleRadians = (angle + 2 * Math.PI) % (2 * Math.PI)

  return angleRadians
}

/**
 * @description Calculate the angle between two points
 * @param {THREE.Vector3} p1
 * @param {THREE.Vector3} p2
 * @returns {Number}
 */
export function calcPos2Angle(p1, p2) {
  const dx = p2.x - p1.x
  const dz = p2.z - p1.z
  const angle = Math.atan2(dx, dz)
  return angle
}

/**
 * @description Calculate the xy-position of the point based on the angle
 * @param {Number} angle
 * @returns {{x: Number, y: Number}}
 */
export function calcAnglet2Pos(angle) {
  const y = Math.sin(angle) / 10
  const x = Math.cos(angle) / 10
  return { x, y }
}
