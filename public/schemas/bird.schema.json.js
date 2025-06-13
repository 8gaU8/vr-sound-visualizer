export const schema = {
  type: 'object',
  $comment:
    'This schema defines the options for bird configurations, including model type, audio path, position, scale, and motion.',
  properties: {
    $schema: {
      type: 'string',
      const: 'schemas/bird.schema.json',
    },
    id: {
      type: 'string',
      description: 'Unique identifier for the bird object configuration.',
    },
    seed: {
      type: 'integer',
      description:
        'Seed for random generation, used to ensure consistent behavior across sessions.',
    },
    name: {
      type: 'string',
      description: 'Name of the bird model, used for identification.',
    },
    modelPath: {
      type: 'string',
      description: 'Path to the 3D model file of the bird.',
    },
    audioPath: {
      type: 'string',
      description: 'Path to the audio file associated with the bird model.',
    },
    position: {
      type: 'object',
      description: 'Position of the bird model in the 3D space.',
      properties: {
        x: { type: 'number' },
        y: { type: 'number' },
        z: { type: 'number' },
      },
      required: ['x', 'y', 'z'],
    },
    scale: {
      type: 'object',
      description: 'Scale of the bird model in the 3D space.',
      properties: {
        x: { type: 'number' },
        y: { type: 'number' },
        z: { type: 'number' },
      },
      required: ['x', 'y', 'z'],
    },
    motion: {
      type: 'boolean',
      description: 'Whether the bird model has motion enabled.',
      default: true,
    },
    color: {
      type: 'number',
      description: 'Color of the bird model, represented as a hexadecimal string.',
      minimum: 0x000000, // Minimum color is black
      maximum: 0xffffff, // Maximum color is white
      default: 0xffffff, // Default color is white
    },
    spectrogramPosition: {
      type: 'object',
      description: 'Position of the spectrogram model in the 3D space.',
      properties: {
        x: { type: 'number' },
        y: { type: 'number' },
        z: { type: 'number' },
      },
      required: ['x', 'y', 'z'],
    },
  },
  required: ['id', 'name', 'modelPath', 'audioPath', 'position', 'scale', 'color'],
  additionalProperties: false,
}
