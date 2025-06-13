import { Tree, TreePreset } from '@dgreenheck/ez-tree'
import { Group } from 'three'

import { RNG } from './noise'
// import { createSimplifiedMesh } from './utils'

function createTree(rng) {
  const range = 20
  const x = (rng.random() - 0.5) * range
  const y = (rng.random() - 0.5) * range
  const presets = Object.keys(TreePreset)
  const index = Math.floor(rng.random() * presets.length)

  const t = new Tree()
  t.position.set(x, 0, y)
  t.loadPreset(presets[index])
  t.options.seed = 10000 * rng.random()
  t.generate()
  t.castShadow = true
  t.receiveShadow = true
  t.scale.set(0.1, 0.1, 0.1)

  return t
}

async function loadAndAddTrees(treeCount, forest) {
  const rng = new RNG('Tree', 999)
  let i = 0
  while (i < treeCount) {
    const tree = createTree(rng)
    forest.add(tree)
    i++
  }
}

export function createForest() {
  // Add a forest of trees in the backgroune
  const forest = new Group()
  forest.name = 'Forest'

  const tree = new Tree()
  tree.loadPreset('Ash Medium')
  // tree.leavesMesh = createSimplifiedMesh(tree.leavesMesh)
  // tree.branchesMesh = createSimplifiedMesh(tree.branchesMesh)
  tree.generate()
  tree.castShadow = true
  tree.receiveShadow = true
  tree.position.set(2, 0, 2)
  tree.scale.set(0.1, 0.1, 0.1)
  forest.add(tree)

  const treeCount = 50
  loadAndAddTrees(treeCount, forest)
  return forest
}
