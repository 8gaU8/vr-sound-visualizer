import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

import { RockOptions } from '../defaultConfigs/RockOptions'
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
  constructor(options = new RockOptions()) {
    super()

    /**
     * @type {RockOptions}
     */
    this.options = options

    fetchAssets().then(() => {
      this.add(this.generateInstances(_rock1Mesh))
      this.add(this.generateInstances(_rock2Mesh))
      this.add(this.generateInstances(_rock3Mesh))
    })
  }

  generateInstances(mesh) {
    const instancedMesh = new THREE.InstancedMesh(mesh.geometry, mesh.material, 200)

    const dummy = new THREE.Object3D()

    let count = 0
    for (let i = 0; i < this.options.instanceCount; i++) {
      // Set position randomly
      const p = this.options.positions[i]

      dummy.position.set(p[0], p[1], p[2])

      // Set rotation randomly
      const r = this.options.rotations[i]

      dummy.rotation.set(r[0], r[1], r[2])

      // Set scale randomly
      const s = this.options.scales[i]
      dummy.scale.set(s[0], s[1], s[2])

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
