import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

import { defaultConfigs } from '../defaultConfigs/loadConfig'
import { RNG } from '../noise'
import { createSimplifiedMesh } from '../utils'

let loaded = false
let _rock1Mesh = null
let _rock2Mesh = null
let _rock3Mesh = null

/**
 *
 * @returns {Promise<THREE.Geometry>}
 */
async function fetchAssets() {
  if (loaded) return

  const gltfLoader = new GLTFLoader()

  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
  gltfLoader.setDRACOLoader(dracoLoader)

  _rock1Mesh = (await gltfLoader.loadAsync('rock1.glb')).scene.children[0]
  _rock1Mesh = createSimplifiedMesh(_rock1Mesh)
  _rock2Mesh = (await gltfLoader.loadAsync('rock2.glb')).scene.children[0]
  _rock2Mesh = createSimplifiedMesh(_rock2Mesh)
  _rock3Mesh = (await gltfLoader.loadAsync('rock3.glb')).scene.children[0]
  _rock3Mesh = createSimplifiedMesh(_rock3Mesh)

  loaded = true
}

export class Rocks extends THREE.Group {
  constructor() {
    super()

    fetchAssets().then(() => {
      this.add(this.generateInstances(_rock1Mesh, 1))
      this.add(this.generateInstances(_rock2Mesh, 2))
      this.add(this.generateInstances(_rock3Mesh, 3))
    })
  }

  /**
   * 設定を反映して岩を再生成する
   */
  applyConfig() {
    // 既存の岩インスタンスを全て削除
    while (this.children.length > 0) {
      this.remove(this.children[0])
    }
    // 再生成
    if (_rock1Mesh && _rock2Mesh && _rock3Mesh) {
      this.add(this.generateInstances(_rock1Mesh, 1))
      this.add(this.generateInstances(_rock2Mesh, 2))
      this.add(this.generateInstances(_rock3Mesh, 3))
    }
  }

  generateInstances(mesh, seedVar) {
    const instancedMesh = new THREE.InstancedMesh(mesh.geometry, mesh.material, 200)

    const dummy = new THREE.Object3D()
    const name = defaultConfigs.rock.name + `-${seedVar}`

    const rng = new RNG(name, defaultConfigs.rock.seed + seedVar)

    let count = 0
    for (let i = 0; i < defaultConfigs.rock.instanceCount; i++) {
      // Set position randomly
      const p = new THREE.Vector3(
        (rng.random() - 0.5) * defaultConfigs.rock.maxRadius,
        0.0,
        (rng.random() - 0.5) * defaultConfigs.rock.maxRadius,
      )

      dummy.position.copy(p)

      // Set rotation randomly
      const r = 2 * Math.PI * rng.random()

      dummy.rotation.y = r

      // Set scale randomly
      const scale = new THREE.Vector3(
        defaultConfigs.rock.sizeVariation.x * rng.random() + defaultConfigs.rock.baseSize.x,
        defaultConfigs.rock.sizeVariation.y * rng.random() + defaultConfigs.rock.baseSize.y,
        defaultConfigs.rock.sizeVariation.z * rng.random() + defaultConfigs.rock.baseSize.z,
      )
      dummy.scale.copy(scale)

      // Apply the transformation to the instance
      dummy.updateMatrix()

      instancedMesh.setMatrixAt(count, dummy.matrix)
      count++
    }
    instancedMesh.count = count

    // Ensure the transformation is updated in the GPU
    instancedMesh.instanceMatrix.needsUpdate = true

    instancedMesh.castShadow = true

    return instancedMesh
  }
}
