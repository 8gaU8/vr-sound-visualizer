import { simplex2d } from '../noise.js'

import { BaseOptions } from './baseOptions.js'

export class FlowerOptions extends BaseOptions {
  /**
   * Path to the flower model
   */
  modelPath = null

  /**
   * Number of flowers to generate (per color)
   */
  instanceCount = 50

  /**
   * Size of the grass patches
   */
  scale = 0.05

  /**
   * positions of the flowers
   */
  positions = []

  /**
   * rotations of the flowers
   */
  rotations = []

  /**
   * scales of the flowers
   */
  scales = []

  constructor(modelPath, seed) {
    super(seed)
    this.modelPath = modelPath
    this.generateProperties()
  }

  /**
   * Generates random colors for the flowers
   */
  generateProperties() {
    for (let i = 0; i < this.instanceCount; i++) {
      const r = 10 + this.random() * 5
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
      const scale = 0.02 + 0.03 * this.random()
      this.scales.push(scale)
    }
  }
}

export class AllFlowersOptions extends BaseOptions {
  /**
   * Options for red flowers
   * @type {FlowerOptions}
   */
  white = null

  /**
   * Options for blue flowers
   * @type {FlowerOptions}
   */
  blue = null

  /**
   * Options for yellow flowers
   * @type {FlowerOptions}
   */
  yellow = null

  constructor() {
    super(0)
    this.white = new FlowerOptions('flower_white.glb', this.seed + 10)
    this.blue = new FlowerOptions('flower_blue.glb', this.seed + 11)
    this.yellow = new FlowerOptions('flower_yellow.glb', this.seed + 12)
  }
}
