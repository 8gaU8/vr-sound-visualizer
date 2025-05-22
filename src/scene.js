import { Tree, TreePreset } from '@dgreenheck/ez-tree'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { AudioManager } from './audio.js'
import { DirectionIndicator } from './audioVisualizers/DirectionIndicator.js'
import { SpectrogramModel } from './audioVisualizers/SpectrogramModel.js'
import { Environment } from './environment'
import { createSimplifiedMesh, Group } from './utils'

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function paintUI() {
  return new Promise((resolve) => requestAnimationFrame(resolve))
}

/**
 * Creates a new instance of the Three.js scene
 * @param {THREE.WebGLRenderer} renderer
 * @returns
 */
export async function createScene(renderer) {
  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x94b9f8, 0.01)

  const environment = new Environment()
  scene.add(environment)

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000)
  scene.add(camera)
  camera.position.set(10, 1.7, 0)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.update()

  //create audio and add it to the camera
  const audioManager = new AudioManager()
  scene.add(audioManager.listener)

  // Add a directional indicator
  const directionIndicator = new DirectionIndicator(camera)
  const indicator = directionIndicator.indicator
  camera.add(indicator)

  const tree = new Tree()
  tree.loadPreset('Ash Medium')
  tree.leavesMesh = createSimplifiedMesh(tree.leavesMesh)
  tree.branchesMesh = createSimplifiedMesh(tree.branchesMesh)
  tree.generate()
  tree.castShadow = true
  tree.receiveShadow = true
  tree.position.set(2, 0, 2)
  scene.add(tree)

  // Add a forest of trees in the background
  const forest = new THREE.Group()
  forest.name = 'Forest'

  const treeCount = 2
  const minDistance = 10
  const maxDistance = 20

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

    forest.add(t)
  }

  async function loadTrees(i) {
    while (i < treeCount) {
      createTree()

      await paintUI()

      i++
    }

    // All trees are loaded, hide loading screen
    await sleep(300)
  }

  const spectrogramModels = new Group()
  spectrogramModels.name = 'SpectrogramModels'

  //AUDIO+model
  async function AudioModel() {
    const modelAudioPairs = [
      {
        model: 'parrot trellis.glb',
        audio: 'quaker-parrot-screams-231906.mp3',
        position: { x: 3, y: 2, z: -8 },
        scale: { x: 8, y: 8, z: 8 },
      },
      {
        model: 'woodpecker.glb',
        audio: 'Pileated Woodpecker .mp3',
        position: { x: 5, y: 2, z: 2 },
        scale: { x: 0.5, y: 0.5, z: 0.5 },
      },
    ]

    try {
      for (const pair of modelAudioPairs) {
        const { model, audio } = await audioManager.loadModelAudio(
          pair.model,
          pair.audio,
          scene,
          pair.position,
        )

        model.scale.set(pair.scale.x, pair.scale.y, pair.scale.z) // Adjust scale if needed
        model.visible = true // Ensure visibility is on
        model.castShadow = true
        model.receiveShadow = true

        audio.play()
        const spectrogramModel = new SpectrogramModel(audio)
        spectrogramModels.add(spectrogramModel)
        const mesh = spectrogramModel.createSpectrogramMesh()
        mesh.position.set(pair.position.x, pair.position.y, pair.position.z)

        scene.add(mesh)
      }
    } catch (error) {
      console.error('Error loading model or audio:', error)
      throw error
    }
  }

  //load ambient sounds
  const ambientAudioload = audioManager.loadAmbientAudio('ambient wind edited.mp3')

  // Start the tree loading process
  await loadTrees(0)
  await AudioModel()

  scene.add(forest)

  // scale every objects in the scene
  scene.traverse((object) => {
    if (object.isMesh) {
      object.scale.set(0.1, 0.1, 0.1)
    }
  })

  return {
    scene,
    environment,
    tree,
    camera,
    controls,
    audioManager,
    spectrogramModels,
    directionIndicator,
  }
}
