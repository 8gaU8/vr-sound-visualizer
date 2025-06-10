export const config = {
  $schema: './schemas/natureObject.schema.json',
  id: 'grass',
  model: 'grass.glb',
  seed: 100,
  instanceCount: 5000,
  maxInstanceCount: 25000,
  innerRadius: 5,
  scale: 100,
  maxRadius: 20,
  patchness: 0.7,
  patchScale: 10,
  baseSize: {
    x: 0.3,
    y: 0.2,
    z: 0.3,
  },
  sizeVariation: {
    x: 0.1,
    y: 0.2,
    z: 0.1,
  },
}
