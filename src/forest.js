import { Tree, TreePreset } from '@dgreenheck/ez-tree'
import { Group } from 'three'

import { createSimplifiedMesh } from './utils'

function createTree() {
  const minDistance = 5
  const maxDistance = 15
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

  return t
}

async function loadAndAddTrees(treeCount, forest) {
  let i = 0
  while (i < treeCount) {
    const tree = createTree()
    forest.add(tree)
    i++
  }
}

export function createForest() {
  // Add a forest of trees in the background
  const forest = new Group()
  forest.name = 'Forest'

  const tree = new Tree()
  tree.loadPreset('Ash Medium')
  tree.leavesMesh = createSimplifiedMesh(tree.leavesMesh)
  tree.branchesMesh = createSimplifiedMesh(tree.branchesMesh)
  tree.generate()
  tree.castShadow = true
  tree.receiveShadow = true
  tree.position.set(2, 0, 2)
  tree.scale.set(0.1, 0.1, 0.1)
  forest.add(tree)

  const treeCount = 20
  loadAndAddTrees(treeCount, forest)
  return forest
}
