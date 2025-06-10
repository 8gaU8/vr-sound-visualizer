export const schema = {
  type: 'object',
  $comment:
    'This schema defines the options for flower configurations, including model type, instance count, radii, patchness, patch scale, base size, and size variation.',
  properties: {
    $schema: {
      type: 'string',
      const: './schemas/natureObject.schema.json',
    },
    id: {
      type: 'string',
      description: 'Unique identifier for the nature object configuration.',
    },
    model: {
      type: 'string',
    },
    instanceCount: {
      type: 'integer',
      minimum: 0,
    },
    maxInstanceCount: {
      type: 'integer',
      minimum: 0,
    },
    seed: {
      type: 'integer',
      minimum: 0,
    },
    innerRadius: {
      type: 'number',
      minimum: 0,
    },
    maxRadius: {
      type: 'number',
      minimum: 0,
    },
    patchness: {
      type: 'number',
      minimum: 0,
      maximum: 1,
    },
    patchScale: {
      type: 'number',
      minimum: 0,
    },
    baseSize: {
      type: 'object',
      description: 'Base size of the grass instance, defining its dimensions in 3D space.',
      properties: {
        x: { type: 'number' },
        y: { type: 'number' },
        z: { type: 'number' },
      },
      required: ['x', 'y', 'z'],
    },
    sizeVariation: {
      type: 'object',
      description: 'Size variation of the grass instance, defining its dimensions in 3D space.',
      properties: {
        x: { type: 'number' },
        y: { type: 'number' },
        z: { type: 'number' },
      },
      required: ['x', 'y', 'z'],
    },
  },
  required: ['$schema', 'id', 'seed', 'baseSize', 'instanceCount', 'sizeVariation'],
  additionalProperties: false,
}
