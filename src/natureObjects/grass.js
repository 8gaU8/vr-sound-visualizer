// @ts-check
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

import { defaultConfigs } from '../defaultConfigs/loadConfig.js'
import { RNG, simplex2d } from '../noise.js'
import { createSimplifiedMesh } from '../utils'

let loaded = false
let _grassMesh = null
let _blueFlower = null
let _whiteFlower = null
let _yellowFlower = null

export class Grass extends THREE.Object3D {
  constructor() {
    super()

    this.flowers = new THREE.Group()
    this.add(this.flowers)

    this.fetchAssets()
      .then(() => {
        this.generateGrass()
        this.generateFlowers(_whiteFlower, defaultConfigs.whiteFlower)
        this.generateFlowers(_blueFlower, defaultConfigs.blueFlower)
        this.generateFlowers(_yellowFlower, defaultConfigs.yellowFlower)
      })
      .catch((error) => {
        console.error('Error fetching grass assets:', error)
      })
  }

  get instanceCount() {
    return this.grassMesh?.count ?? defaultConfigs.grass.instanceCount
  }

  set instanceCount(value) {
    console.log('Setting instance count to', value)
    this.grassMesh.count = value
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async fetchAssets() {
    if (loaded) return

    const gltfLoader = new GLTFLoader()
    _grassMesh = (await gltfLoader.loadAsync(defaultConfigs.grass.model)).scene.children[0]
    _whiteFlower = (await gltfLoader.loadAsync(defaultConfigs.whiteFlower.model)).scene.children[0]
    _blueFlower = (await gltfLoader.loadAsync(defaultConfigs.blueFlower.model)).scene.children[0]
    _yellowFlower = (await gltfLoader.loadAsync(defaultConfigs.yellowFlower.model)).scene
      .children[0]

    // The flower is composed of multiple meshes with different materials. Append the
    // wind shader code to each material
    ;[_whiteFlower, _blueFlower, _yellowFlower].forEach((mesh) => {
      mesh.traverse((o) => {
        // @ts-ignore
        if (o.isMesh && o.material) {
          // @ts-ignore
          if (o.material.map) {
            // @ts-ignore
            o.material = new THREE.MeshPhongMaterial({ map: o.material.map })
          }
          o = createSimplifiedMesh(o)
          // @ts-ignore
          this.appendWindShader(o.material)
        }
      })
    })

    loaded = true
  }

  update(elapsedTime) {
    this.traverse((o) => {
      // @ts-ignore
      if (o.isMesh && o.material?.userData.shader) {
        // @ts-ignore
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

    // Decrease grass brightness
    grassMaterial.color.multiplyScalar(0.6)

    this.grassMesh = new THREE.InstancedMesh(
      _grassMesh.geometry,
      grassMaterial,
      defaultConfigs.grass.maxInstanceCount,
    )
    this.grassMesh = createSimplifiedMesh(this.grassMesh)

    this.appendWindShader(this.grassMesh.material, true)

    this.generateGrassInstances()

    this.add(this.grassMesh)
  }

  generateGrassInstances() {
    const dummy = new THREE.Object3D()
    const rng = new RNG(defaultConfigs.grass.seed)

    let count = 0
    for (let i = 0; i < defaultConfigs.grass.maxInstanceCount; i++) {
      const radius =
        defaultConfigs.grass.innerRadius + rng.random() * defaultConfigs.grass.maxRadius
      const theta = rng.random() * 2.0 * Math.PI

      // Set position randomly
      const position = new Array(radius * Math.cos(theta), 0, radius * Math.sin(theta))

      const n =
        0.5 +
        0.5 *
          simplex2d(
            new THREE.Vector2(
              position[0] / defaultConfigs.grass.scale,
              position[2] / defaultConfigs.grass.scale,
            ),
          )
      if (n > defaultConfigs.grass.patchiness) {
        continue
      }

      dummy.position.set(position[0], position[1], position[2])

      // Set rotation randomly
      const r = 2 * Math.PI * rng.random()
      dummy.rotation.set(0, r, 0)

      // Set scale randomly
      const s = new THREE.Vector3(
        defaultConfigs.grass.sizeVariation.x * rng.random() + defaultConfigs.grass.baseSize.x,
        defaultConfigs.grass.sizeVariation.y * rng.random() + defaultConfigs.grass.baseSize.y,
        defaultConfigs.grass.sizeVariation.z * rng.random() + defaultConfigs.grass.baseSize.z,
      )
      dummy.scale.copy(s)

      // Apply the transformation to the instance
      dummy.updateMatrix()

      const color = new THREE.Color(0.25 + rng.random() * 0.1, 0.3 + rng.random() * 0.3, 0.1)

      this.grassMesh.setMatrixAt(count, dummy.matrix)
      this.grassMesh.setColorAt(count, color)
      count++
    }

    // Set count to only show up to `instanceCount` instances
    this.instanceCount = defaultConfigs.grass.instanceCount

    this.grassMesh.receiveShadow = true
    this.grassMesh.castShadow = true

    // Ensure the transformation is updated in the GPU
    this.grassMesh.instanceMatrix.needsUpdate = true
    this.grassMesh.instanceColor.needsUpdate = true
  }

  /**
   *
   * @param {THREE.Mesh} flowerMesh
   * @param {typeof defaultConfigs.yellowFlower} flowerOptions
   */
  generateFlowers(flowerMesh, flowerOptions) {
    const rng = new RNG(flowerOptions.seed)
    for (let i = 0; i < flowerOptions.instanceCount; i++) {
      const flower = flowerMesh.clone()

      const r = rng.random() * flowerOptions.maxRadius + flowerOptions.innerRadius
      const theta = rng.random() * 2.0 * Math.PI

      const p = new THREE.Vector3(r * Math.cos(theta), 0, r * Math.sin(theta))
      const n =
        0.5 +
        0.5 * simplex2d(new THREE.Vector2(p[0] / flowerOptions.scale, p[2] / flowerOptions.scale))

      if (n > flowerOptions.patchiness && rng.random() + 0.6 > flowerOptions.patchiness) {
        continue
      }

      flower.position.copy(p)

      const rotation = 2 * Math.PI * rng.random()
      flower.rotation.set(0, rotation, 0)

      const scale = 0.002 + 0.003 * rng.random()
      flower.scale.set(scale, scale, scale)

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
      shader.uniforms.uWindStrength = { value: defaultConfigs.wind.strength }
      shader.uniforms.uWindFrequency = { value: defaultConfigs.wind.frequency }
      shader.uniforms.uWindScale = { value: defaultConfigs.wind.scale }

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
        vec3 windSway = position.y * uWindStrength *2.0* 
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
