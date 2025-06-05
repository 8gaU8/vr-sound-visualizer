import * as THREE from 'three'

import { Clouds } from './natureObjects/clouds'
import { Grass } from './natureObjects/grass'
import { Ground } from './natureObjects/ground'
import { Rocks } from './natureObjects/rocks'

/**
 * @extends THREE.Object3D
 */
export class Environment extends THREE.Object3D {
  constructor() {
    super()

    /** @type {Ground} */
    this.ground = new Ground()
    this.add(this.ground)

    /** @type {Grass} */
    this.grass = new Grass()
    this.add(this.grass)

    /** @type {Rocks} */
    this.rocks = new Rocks()
    this.add(this.rocks)

    /** @type {Clouds} */
    const clouds = new Clouds()
    clouds.position.set(0, 200, 0)
    clouds.rotation.x = Math.PI / 2
    this.clouds = clouds
    this.add(this.clouds)
  }

  /**
   * @param {number} elapsedTime - アプリケーション開始からの経過時間
   */
  update(elapsedTime) {
    this.grass.update(elapsedTime)
    this.clouds.update(elapsedTime)
  }
}
