import * as THREE from 'three'

import { createForest } from './forest'
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

    /** @type {Ground} */
    this.ground = new Ground()
    this.add(this.ground)

    /** @type {Grass} */
    this.grass = new Grass()
    this.add(this.grass)

    this.skybox = new Skybox()
    this.add(this.skybox)

    /** @type {Rocks} */
    this.rocks = new Rocks()
    this.add(this.rocks)

    /** @type {Clouds} */
    const clouds = new Clouds()
    clouds.position.set(0, 200, 0)
    clouds.rotation.x = Math.PI / 2
    this.clouds = clouds
    this.add(this.clouds)

    // Add a forest of trees in the background
    const forest = createForest()
    this.forest = forest
    this.add(forest)
  }

  /**
   * @param {number} elapsedTime - Elapsed time since the application started
   */
  update(elapsedTime) {
    this.grass.update(elapsedTime)
    this.clouds.update(elapsedTime)
    this.forest.children.forEach((o) => o.update(elapsedTime))
  }
}
