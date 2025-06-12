export const schema = {
  type: 'object',
  $comment:
    'This schema defines the options for sky configurations, including turbidity, rayleigh scattering, mie coefficient, mie directional G, elevation, azimuth, and sun color.',
  properties: {
    $schema: {
      type: 'string',
      const: 'schemas/sky.schema.json',
    },
    id: {
      type: 'string',
      description: 'Unique identifier for the nature object configuration.',
    },
    intensity: {
      type: 'number',
      description: 'Intensity of the sky light.',
    },
    turbidity: {
      type: 'number',
      minimum: 0,
      maximum: 20,
    },
    rayleigh: {
      type: 'number',
      minimum: 0,
      maximum: 10,
    },
    mieCoefficient: {
      type: 'number',
      minimum: 0,
      maximum: 0.1,
    },
    mieDirectionalG: {
      type: 'number',
      minimum: 0,
      maximum: 1,
    },
    elevation: {
      type: 'number',
      minimum: 0,
      maximum: 90,
    },
    azimuth: {
      type: 'number',
      minimum: 0,
      maximum: 360,
    },
    sunColor: {
      type: 'object',
      description: 'Color of the sun in RGB format.',
      properties: {
        r: { type: 'number', minimum: 0, maximum: 255 },
        g: { type: 'number', minimum: 0, maximum: 255 },
        b: { type: 'number', minimum: 0, maximum: 255 },
      },
      required: ['r', 'g', 'b'],
    },
    ambientColor: {
      type: 'object',
      description: 'Color of the ambient light in RGB format.',
      properties: {
        r: { type: 'number', minimum: 0, maximum: 255 },
        g: { type: 'number', minimum: 0, maximum: 255 },
        b: { type: 'number', minimum: 0, maximum: 255 },
      },
      required: ['r', 'g', 'b'],
    },
    ambientIntensity: {
      type: 'number',
      description: 'Intensity of the ambient light.',
    },
  },
  required: [
    'id',
    '$schema',
    'intensity',
    'turbidity',
    'rayleigh',
    'mieCoefficient',
    'mieDirectionalG',
    'elevation',
    'azimuth',
    'sunColor',
    'ambientColor',
    'ambientIntensity',
  ],
}
