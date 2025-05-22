import { simplex2d } from '../noise.js'

import { BaseOptions } from './BaseOptions.js'

export class GrassOptions extends BaseOptions {
  /**
   * Number of grass instances
   */
  instanceCount = 500

  /**
   * Maximum number of grass instances
   */
  maxInstanceCount = 25000

  /**
   * Size of the grass patches
   */
  scale = 0.05

  /**
   * Patchiness of the grass
   */
  patchiness = 0.1

  /**
   * Scale factor for the grass model
   */
  size = { x: 1, y: 0.8, z: 1 }

  /**
   * Maximum variation in the grass size
   */
  sizeVariation = { x: 1, y: 2, z: 1 }

  /**
   * Strength of wind along each axis
   */
  windStrength = { x: 0.3, y: 0, z: 0.3 }

  /**
   * Oscillation frequency for wind movement
   */
  windFrequency = 1.0

  /**
   * Controls how localized wind effects are
   */
  windScale = 400.0

  /**
   * positions of the glass
   */
  positions = []

  /**
   * rotations of the glass
   */
  rotations = []

  /**
   * scales of the glass
   */
  scales = []

  /**
   * Grass colors
   */

  colors = []

  constructor() {
    super(50)
    this.generatePositions()
  }

  /**
   * Generates random positions for the grass instances
   */
  generatePositions() {
    for (let i = 0; i < this.maxInstanceCount; i++) {
      const r = 10 + this.random() * 50
      const theta = this.random() * 2.0 * Math.PI

      // Set position randomly
      const p = new Array(r * Math.cos(theta), 0, r * Math.sin(theta))

      const n = 0.5 + 0.5 * simplex2d(new Array(p[0] / this.scale, p[2] / this.scale))

      if (n > this.patchiness && this.random() + 0.6 > this.patchiness) {
        continue
      }

      this.positions.push(p)

      // Set rotation randomly
      this.rotations.push(2 * Math.PI * this.random())

      // Set scale randomly
      this.scales.push(
        new Array(
          this.sizeVariation.x * this.random() + this.size.x,
          this.sizeVariation.y * this.random() + this.size.y,
          this.sizeVariation.z * this.random() + this.size.z,
        ),
      )

      const color = new Array(0.25 + this.random() * 0.1, 0.3 + this.random() * 0.3, 0.1)
      this.colors.push(color)
    }
  }
}
