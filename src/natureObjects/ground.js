import * as THREE from 'three'

import { GrassOptions } from '../defaultConfigs/GrassOptions'

let loaded = false
let _grassTexture = null
let _dirtTexture = null
let _dirtNormal = null

/**
 *
 * @returns {Promise<THREE.Geometry>}
 */
async function fetchAssets() {
  if (loaded) return

  const textureLoader = new THREE.TextureLoader()

  _grassTexture = await textureLoader.loadAsync('grass.jpg')
  _grassTexture.wrapS = THREE.RepeatWrapping
  _grassTexture.wrapT = THREE.RepeatWrapping
  _grassTexture.colorSpace = THREE.SRGBColorSpace
  _grassTexture.repeat.set(100, 100)

  _dirtTexture = await textureLoader.loadAsync('dirt_color.jpg')
  _dirtTexture.wrapS = THREE.RepeatWrapping
  _dirtTexture.wrapT = THREE.RepeatWrapping
  _dirtTexture.colorSpace = THREE.SRGBColorSpace

  _dirtNormal = await textureLoader.loadAsync('dirt_normal.jpg')
  _dirtNormal.repeat.set(100, 100)
  _dirtNormal.wrapS = THREE.RepeatWrapping
  _dirtNormal.wrapT = THREE.RepeatWrapping

  loaded = true
}

export class Ground extends THREE.Mesh {
  constructor(options = new GrassOptions()) {
    super()

    /**
     * @type {GrassOptions}
     */
    this.options = options

    fetchAssets().then(() => {
      // Ground plane with procedural grass/dirt texture
      this.material = new THREE.MeshPhongMaterial({
        map: _grassTexture,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.01,
        // normalMap: _dirtNormal,
        bumpMap: _dirtTexture,
        bumpScale: 10,
        shininess: 0.1,
        receiveShadow: true,
        castShadow: false,
      })

      this.geometry = new THREE.PlaneGeometry(2000, 2000)
      this.rotation.x = -Math.PI / 2
      this.receiveShadow = true
    })
  }
}
