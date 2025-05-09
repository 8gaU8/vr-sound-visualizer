import * as THREE from 'three'

import { Clouds } from './clouds'
import { Grass } from './grass'
import { Ground } from './ground'
import { Rocks } from './rocks'
import { Skybox } from './skybox'

export class Environment extends THREE.Object3D {
  constructor() {
    super()

    this.ground = new Ground()
    this.add(this.ground)

    this.grass = new Grass()
    this.grass.scale.set(0.2, 0.2, 0.2)
    this.add(this.grass)

    this.skybox = new Skybox()
    this.add(this.skybox)

    this.rocks = new Rocks()
    this.rocks.scale.set(0.2, 0.2, 0.2)
    this.add(this.rocks)

    this.clouds = new Clouds()
    this.clouds.position.set(0, 200, 0)
    this.clouds.rotation.x = Math.PI / 2
    this.add(this.clouds)
  }

  update(elapsedTime) {
    this.grass.update(elapsedTime)
    this.clouds.update(elapsedTime)
  }
}
