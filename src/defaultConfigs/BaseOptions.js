import prand from 'pure-rand'

export class BaseOptions {
  /**
   * seed for random number generation
   */
  seed = null

  constructor(seed) {
    if (seed === undefined) {
      throw new Error('seed is undefined')
    }
    this.seed = seed
    this.rng = prand.xoroshiro128plus(this.seed)
  }

  /**
   * @description export the every options to json
   * @returns {object} json object
   */
  jsonExport() {
    return JSON.stringify(this, function (key, value) {
      //   console.log(key, value)
      if (typeof value === 'function') {
        return undefined
      }
      return value
    })
  }

  jsonImport(json) {
    const obj = JSON.parse(json)
    for (const key in obj) {
      if (this[key] !== undefined) {
        this[key] = obj[key]
      }
    }
  }

  random() {
    const g1 = prand.unsafeUniformIntDistribution(0, (1 << 24) - 1, this.rng)
    const value = g1 / (1 << 24)
    return value
  }
}
