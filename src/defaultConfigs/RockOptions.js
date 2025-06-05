import { BaseOptions } from './BaseOptions.js'

export class RockOptions extends BaseOptions {
  /**
   * Number of rock instances
   */
  instanceCount = 30

  /**
   * Scale factor
   */
  size = { x: 0.2, y: 0.2, z: 0.2 }

  /**
   * Maximum variation in the rock size
   */
  sizeVariation = { x: 0.3, y: 0.3, z: 0.3 }

  /**
   * positions of the rocks
   */
  positions = []

  /**
   * rotations of the rocks
   */
  rotations = []

  /**
   * scales of the rocks
   */
  scales = []

  constructor() {
    const seed = 200
    super(seed)
    this.generateRockPositions()
  }

  generateRockPositions() {
    for (let i = 0; i < this.instanceCount; i++) {
      // Set position randomly
      const p = new Array(20 * (this.random() - 0.5) * 5, 0.3, 20 * (this.random() - 0.5) * 5)
      this.positions.push(p)

      // Set rotation randomly
      const r = new Array(0, 2 * Math.PI * this.random(), 0)
      this.rotations.push(r)

      // Set scale randomly
      const scale = new Array(
        this.sizeVariation.x * this.random() + this.size.x,
        this.sizeVariation.y * this.random() + this.size.y,
        this.sizeVariation.z * this.random() + this.size.z,
      )
      this.scales.push(scale)
    }
  }
}
