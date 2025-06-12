export const config = {
  $schema: 'schemas/sky.schema.json',
  id: 'sky',
  intensity: 4,
  turbidity: 10,
  rayleigh: 3,
  mieCoefficient: 0.008,
  mieDirectionalG: 0.9,
  elevation: 45,
  azimuth: 180,
  sunColor: {
    r: 255,
    g: 229,
    b: 176,
  },
  ambientColor: {
    r: 255,
    g: 255,
    b: 255,
  },
  ambientIntensity: 0.5,
}
