// @ts-check
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { AudioController } from './AudioController.js'
import { BirdsWatcher } from './BirdsWatcher.js'
import { configValidator } from './defaultConfigs/loadConfig.js'
import { Environment } from './environment'
import { createForest } from './forest.js'

/**
 * Creates a new instance of the Three.js scene
 * @param {THREE.WebGLRenderer} renderer
 * @returns
 */
export async function createScene(renderer) {
  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x94b9f8, 0.06)

  const environment = new Environment()
  scene.add(environment)

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000)
  scene.add(camera)
  camera.position.set(10, 1.7, 0)

  const controls = new OrbitControls(camera, renderer.domElement)

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
  const forest = createForest()
  scene.add(forest)

  return {
    scene,
    environment,
    camera,
    controls,
    birdsWatcher,
  }
}
