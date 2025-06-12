export const schema = {
  $comment:
    'This schema defines properties of wind in a 3D environment, including its strength, frequency, and scale.',
  type: 'object',
  properties: {
    $schema: {
      type: 'string',
      const: 'schemas/wind.schema.json',
    },
    id: {
      type: 'string',
      description: 'Unique identifier for the wind configuration.',
    },
    strength: {
      type: 'object',
      description: 'Strength of the wind in 3D space, defining its direction and intensity.',
      properties: {
        x: { type: 'number' },
        y: { type: 'number' },
        z: { type: 'number' },
      },
      required: ['x', 'y', 'z'],
    },
    frequency: {
      type: 'number',
      minimum: 0,
    },
    scale: {
      type: 'number',
      minimum: 0,
    },
  },
  required: ['id', '$schema', 'strength', 'frequency', 'scale'],
  additionalProperties: false,
}
