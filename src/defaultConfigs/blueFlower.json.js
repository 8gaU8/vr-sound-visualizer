export const config = {
  $schema: './schemas/natureObject.schema.json',
  id: 'blueFlower',
  model: 'blueFlower.glb',
  seed: 1,
  instanceCount: 50,
  innerRadius: 5,
  maxRadius: 15,
  patchness: 0.5,
  patchScale: 10,
  baseSize: {
    x: 0.002,
    y: 0.002,
    z: 0.002,
  },
  sizeVariation: {
    x: 0.003,
    y: 0.003,
    z: 0.003,
  },
}
