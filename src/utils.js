import { SimplifyModifier } from 'three/examples/jsm/modifiers/SimplifyModifier.js'

/**
 * Creates a simplified version of the given mesh by reducing its vertex count.
 *
 * @param {THREE.Mesh} mesh - The original mesh to simplify.
 * @returns {THREE.Mesh} - The simplified mesh with reduced vertex count and flat shading.
 */
export function createSimplifiedMesh(mesh) {
  const modifier = new SimplifyModifier()
  const simplified = mesh.clone()
  simplified.material = simplified.material.clone()
  simplified.material.flatShading = true
  const count = Math.floor(simplified.geometry.attributes.position.count * 0.5) // number of vertices to remove
  simplified.geometry = modifier.modify(simplified.geometry, count)
  return simplified
}
