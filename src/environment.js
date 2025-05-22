import * as THREE from 'three'

import { Clouds } from './natureObjects/clouds'
import { Grass } from './natureObjects/grass'
import { Ground } from './natureObjects/ground'
import { Rocks } from './natureObjects/rocks'
import { Skybox } from './natureObjects/skybox'

/**
 * @extends THREE.Object3D
 */
export class Environment extends THREE.Object3D {
  constructor() {
    super()

    /**
     * @type {Ground}
     */
    this.ground = new Ground()
    this.add(this.ground)

    /**
     * @type {Grass}
     */
    this.grass = new Grass()
    this.add(this.grass)

    /**
     * @type {Skybox}
     */
    this.skybox = new Skybox()
    this.add(this.skybox)

    /**
     * @type {Rocks}
     */
    this.rocks = new Rocks()
    this.add(this.rocks)

    /**
     * @type {Clouds}
     */
    this.clouds = new Clouds()
    this.clouds.position.set(0, 200, 0)
    this.clouds.rotation.x = Math.PI / 2
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
