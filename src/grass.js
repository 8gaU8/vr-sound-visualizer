import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

import { AllFlowersOptions } from './defaultConfigs/FlowerOptions'
import { GrassOptions } from './defaultConfigs/GrassOptions'
import { createSimplifiedMesh } from './utils'

let loaded = false
let _grassMesh = null
let _blueFlower = null
let _whiteFlower = null
let _yellowFlower = null

export class Grass extends THREE.Object3D {
  constructor(grassOptions = new GrassOptions(), flowerOptions = new AllFlowersOptions()) {
    super()

    /**
     * @type {GrassOptions}
     */
    this.grassOptions = grassOptions

    /**
     * @type {AllFlowersOptions}
     */
    this.flowerOptions = flowerOptions

    this.flowers = new THREE.Group()
    this.add(this.flowers)

    this.fetchAssets().then(() => {
      this.generateGrass()
      this.generateFlowers(_whiteFlower, this.flowerOptions.white)
      this.generateFlowers(_blueFlower, this.flowerOptions.blue)
      this.generateFlowers(_yellowFlower, this.flowerOptions.yellow)
    })
  }

  get instanceCount() {
    return this.grassMesh?.count ?? this.grassOptions.instanceCount
  }

  set instanceCount(value) {
    console.log('Setting instance count to', value)
    this.grassMesh.count = value
  }

  /**
   *
   * @returns {Promise<THREE.Geometry>}
   */
  async fetchAssets() {
    if (loaded) return

    const gltfLoader = new GLTFLoader()

    _grassMesh = (await gltfLoader.loadAsync('grass.glb')).scene.children[0]
    _whiteFlower = (await gltfLoader.loadAsync(this.flowerOptions.white.modelPath)).scene
      .children[0]
    _blueFlower = (await gltfLoader.loadAsync(this.flowerOptions.blue.modelPath)).scene.children[0]
    _yellowFlower = (await gltfLoader.loadAsync(this.flowerOptions.yellow.modelPath)).scene
      .children[0]

    // The flower is composed of multiple meshes with different materials. Append the
    // wind shader code to each material
    ;[_whiteFlower, _blueFlower, _yellowFlower].forEach((mesh) => {
      mesh.traverse((o) => {
        if (o.isMesh && o.material) {
          if (o.material.map) {
            o.material = new THREE.MeshPhongMaterial({ map: o.material.map })
          }
          this.appendWindShader(o.material)
        }
      })
    })

    loaded = true
  }

  update(elapsedTime) {
    this.traverse((o) => {
      if (o.isMesh && o.material?.userData.shader) {
        o.material.userData.shader.uniforms.uTime.value = elapsedTime
      }
    })
  }

  generateGrass() {
    const grassMaterial = new THREE.MeshPhongMaterial({
      map: _grassMesh.material.map,
      // Add some emission so grass has some color when not lit
      emissive: new THREE.Color(0x308040),
      emissiveIntensity: 0.05,
      transparent: false,
      alphaTest: 0.5,
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide,
    })

    this.appendWindShader(grassMaterial, true)

    // Decrease grass brightness
    grassMaterial.color.multiplyScalar(0.6)

    this.grassMesh = new THREE.InstancedMesh(
      _grassMesh.geometry,
      grassMaterial,
      this.grassOptions.maxInstanceCount,
    )
    this.grassMesh = createSimplifiedMesh(this.grassMesh)

    this.generateGrassInstances()

    this.add(this.grassMesh)
  }

  generateGrassInstances() {
    const dummy = new THREE.Object3D()

    let count = 0
    for (let i = 0; i < this.grassOptions.maxInstanceCount; i++) {
      const p = this.grassOptions.positions[i]
      dummy.position.set(p[0], p[1], p[2])

      // Set rotation randomly
      const r = this.grassOptions.rotations[i]
      dummy.rotation.set(0, r, 0)

      // Set scale randomly
      const s = this.grassOptions.scales[i]
      dummy.scale.set(s[0], s[1], s[2])

      // Apply the transformation to the instance
      dummy.updateMatrix()

      const c = this.grassOptions.colors[i]
      const color = new THREE.Color(c[0], c[1], c[2])

      this.grassMesh.setMatrixAt(count, dummy.matrix)
      this.grassMesh.setColorAt(count, color)
      count++
    }

    // Set count to only show up to `instanceCount` instances
    this.grassMesh.count = this.grassOptions.instanceCount

    this.grassMesh.receiveShadow = true
    this.grassMesh.castShadow = true

    // Ensure the transformation is updated in the GPU
    this.grassMesh.instanceMatrix.needsUpdate = true
    this.grassMesh.instanceColor.needsUpdate = true
  }

  /**
   *
   * @param {THREE.Mesh} flowerMesh
   * @param {FlowerOptions} flowerOptions
   */
  generateFlowers(flowerMesh, flowerOptions) {
    for (let i = 0; i < flowerOptions.instanceCount; i++) {
      const flower = flowerMesh.clone()

      const p = flowerOptions.positions[i]
      flower.position.set(p[0], p[1], p[2])

      const r = flowerOptions.rotations[i]
      flower.rotation.set(0, r, 0)

      const s = flowerOptions.scales[i]
      flower.scale.set(s, s, s)

      this.flowers.add(flower)
    }
  }

  /**
   *
   * @param {THREE.Material} material
   */
  appendWindShader(material, instanced = false) {
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 }
      shader.uniforms.uWindStrength = { value: this.grassOptions.windStrength }
      shader.uniforms.uWindFrequency = { value: this.grassOptions.windFrequency }
      shader.uniforms.uWindScale = { value: this.grassOptions.windScale }

      shader.vertexShader =
        `
      uniform float uTime;
      uniform vec3 uWindStrength;
      uniform float uWindFrequency;
      uniform float uWindScale;
      ` + shader.vertexShader

      // Add code for simplex noise
      shader.vertexShader = shader.vertexShader.replace(
        `void main() {`,
        `
        vec3 mod289(vec3 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec2 mod289(vec2 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec3 permute(vec3 x) {
          return mod289(((x * 34.0) + 1.0) * x);
        }

        float simplex2d(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;

          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

          vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
          m = m * m;
          m = m * m;

          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;

          m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

          vec3 g;
          g.x = a0.x * x0.x + h.x * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
        
        void main() {`,
      )

      // To make code reusable for grass and flowers, conditionally multiply by instanceMatrix
      let vertexShader = instanced
        ? `
        vec4 mvPosition = instanceMatrix * vec4(transformed, 1.0);
        float windOffset = 2.0 * 3.14 * simplex2d((modelMatrix * mvPosition).xz / uWindScale);
        vec3 windSway = position.y * uWindStrength * 
        sin(uTime * uWindFrequency + windOffset) *
        cos(uTime * 1.4 * uWindFrequency + windOffset);

        mvPosition.xyz += windSway;
        mvPosition = modelViewMatrix * mvPosition;

        gl_Position = projectionMatrix * mvPosition;
        `
        : `
        vec4 mvPosition = vec4(transformed, 1.0);
        float windOffset = 2.0 * 3.14 * simplex2d((modelMatrix * mvPosition).xz / uWindScale);
        vec3 windSway = 0.2 * position.y * uWindStrength * 
        sin(uTime * uWindFrequency + windOffset) *
        cos(uTime * 1.4 * uWindFrequency + windOffset);

        mvPosition.xyz += windSway;
        mvPosition = modelViewMatrix * mvPosition;

        gl_Position = projectionMatrix * mvPosition;
        `

      // worldPosition = modelMatrix * instanceMatrix * position;
      // worldWindDirection = model
      shader.vertexShader = shader.vertexShader.replace(`#include <project_vertex>`, vertexShader)

      material.userData.shader = shader
    }
  }
}
