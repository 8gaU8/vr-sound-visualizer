// @ts-check
import { Tree, TreePreset } from '@dgreenheck/ez-tree'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { AudioController } from './AudioController.js'
import { BirdsWatcher } from './BirdsWatcher.js'
import { DirectionIndicator } from './audioVisualizers/DirectionIndicator.js'
import { configValidator } from './defaultConfigs/loadConfig.js'
import { Environment } from './environment'
import { Ground } from './natureObjects/ground.js'
import { createSimplifiedMesh } from './utils'

/**
 * Creates a new instance of the Three.js scene
 * @param {THREE.WebGLRenderer} renderer
 * @returns
 */
export async function createScene(renderer) {
  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x94b9f8, 0.06)

  const ground = new Ground()
  scene.add(ground)

  const environment = new Environment()
  scene.add(environment)

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000)
  scene.add(camera)
  camera.position.set(10, 1.7, 0)

  const controls = new OrbitControls(camera, renderer.domElement)

  const tree = new Tree()
  tree.loadPreset('Ash Medium')
  tree.leavesMesh = createSimplifiedMesh(tree.leavesMesh)
  tree.branchesMesh = createSimplifiedMesh(tree.branchesMesh)
  tree.generate()
  tree.castShadow = true
  tree.receiveShadow = true
  tree.position.set(2, 0, 2)
  tree.scale.set(0.1, 0.1, 0.1)
  scene.add(tree)

  // Add a forest of trees in the background
  const forest = new THREE.Group()
  forest.name = 'Forest'

  const treeCount = 20
  const minDistance = 5
  const maxDistance = 15

  function createTree() {
    const r = minDistance + Math.random() * maxDistance
    const theta = 2 * Math.PI * Math.random()
    const presets = Object.keys(TreePreset)
    const index = Math.floor(Math.random() * presets.length)

    const t = new Tree()
    t.position.set(r * Math.cos(theta), 0, r * Math.sin(theta))
    t.loadPreset(presets[index])
    t.options.seed = 10000 * Math.random()
    t.generate()
    t.castShadow = true
    t.receiveShadow = true
    t.scale.set(0.1, 0.1, 0.1)

    forest.add(t)
  }

  async function loadTrees(i) {
    while (i < treeCount) {
      createTree()
      i++
    }
  }

  const audioListener = new THREE.AudioListener()
  scene.add(audioListener)

  // load ambient sounds
  AudioController.loadAmbientAudio('ambient.mp3', audioListener)

  const birdsWatcher = new BirdsWatcher(audioListener, camera)
  for (const birdConfig of configValidator.getConfigsBySchema('schemas/bird.schema.json')) {
    console.log('Adding bird:', birdConfig.name)
    await birdsWatcher.addBird(birdConfig)
  }
  birdsWatcher.addToScene(scene)

  // Start the tree loading process
  await loadTrees(0)
  scene.add(forest)

  return {
    scene,
    environment,
    tree,
    camera,
    controls,
    birdsWatcher,
  }
}
