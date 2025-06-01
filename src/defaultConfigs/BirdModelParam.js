// @ts-check

import { Vector3 } from 'three'

const MOTION_ENABLED = true

export class BirdModelParam {
  /** @type {String} The name of the bird model, used for identification.  */
  name

  /** @type {String} The path to the 3D model file. */
  modelPath

  /** @type {String} The path to the audio file associated with the bird model. */
  audioPath

  /** @type {Vector3} The position of the bird model in the 3D space. */
  position

  /** @type {Vector3} The scale of the bird model in the 3D space. */
  scale

  /** @type {Boolean} Whether the bird model has motion enabled. */
  motion

  /**
   * @param {String} name
   * @param {String} modelPath
   * @param {String} audioPath
   * @param {Vector3} position
   * @param {Vector3} scale
   * @param {boolean} motion
   */
  constructor(name, modelPath, audioPath, position, scale, motion) {
    this.name = name
    this.modelPath = modelPath
    this.audioPath = audioPath
    this.position = position
    this.scale = scale
    this.motion = motion
  }
}

export const birdsParams = [
  new BirdModelParam(
    'parrotTrellis',
    'parrot trellis.glb',
    'quaker-parrot-screams-231906.mp3',
    new Vector3(3, 2, -8),
    new Vector3(8, 8, 8),
    MOTION_ENABLED,
  ),
  new BirdModelParam(
    'woodpecker',
    'woodpecker.glb',
    'Pileated Woodpecker .mp3',
    new Vector3(5, 2, 2),
    new Vector3(0.5, 0.5, 0.5),
    MOTION_ENABLED,
  ),
]
