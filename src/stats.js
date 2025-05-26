import StatsVR from 'statsvr'

import { StatsOptions } from './defaultConfigs/StatsOptions'

export class StatsWrapper {
  /**
   * @type {StatsVR}
   */
  stats

  /**
   * @param {THREE.Scene} scene
   * @param {THREE.Camera} camera
   */
  constructor(scene, camera) {
    if (!StatsOptions.enable) {
      return
    }
    this.stats = new StatsVR(scene, camera)
    this.stats.setX(StatsOptions.position.x)
    this.stats.setY(StatsOptions.position.y)
    this.stats.setZ(StatsOptions.position.z)
  }

  update() {
    if (!StatsOptions.enable) {
      return
    }
    this.stats.update()
  }
}
