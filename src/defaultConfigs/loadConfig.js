import Ajv from 'ajv'

import { config as parrotTrellisConfig } from './birds/parrotTrellis.json.js'
import { schema as birdSchema } from './birds/schemas/bird.schema.js'
import { config as woodpeckerConfig } from './birds/woodpecker.json.js'
import { config as blueFlowerConfig } from './natureObjects/blueFlower.json.js'
import { config as grassConfig } from './natureObjects/grass.json.js'
import { config as rockConfig } from './natureObjects/rock.json.js'
import { schema as natureObjectSchema } from './natureObjects/schemas/natureObject.schema.js'
import { schema as skySchema } from './natureObjects/schemas/sky.schema.js'
import { schema as windSchema } from './natureObjects/schemas/wind.schema.js'
import { config as skyConfig } from './natureObjects/sky.json.js'
import { config as whiteFlowerConfig } from './natureObjects/whiteFlower.json.js'
import { config as windConfig } from './natureObjects/wind.json.js'
import { config as yellowFlowerConfig } from './natureObjects/yellowFlower.json.js'

// Store for unique seeds
/** @type {Record<string, number>} */
const seedStore = {}

/**
 * @description Checks if the seed is unique across all configurations.
 * @param {string } id
 * @param {any} seed
 */
function isUniqueSeed(id, seed) {
  for (const [key, value] of Object.entries(seedStore)) {
    if (value === seed && key !== id) {
      console.error(`Seed ${seed} in ${id} already used in ${key}`)
      throw new Error(`Seed ${seed} in ${id} already used in ${key}`)
    }
  }
  seedStore[id] = seed
  return true
}

// validate configs using the schema
const ajv = new Ajv({ allErrors: true, strict: true })

/**
 * @description Validates the configuration against the provided schema
 * @param {object} config
 * @param {object} schema
 */
function validateConfig(config, schema) {
  const validate = ajv.compile(schema)
  if (!validate(config)) {
    console.error('Configuration validation errors:', 'at', config.id, validate.errors)
    throw new Error('Invalid configuration')
  }

  if (config['seed'] !== undefined) {
    isUniqueSeed(config['id'], config['seed'])
  }
  console.log('Configuration validated:', config.id)
}

/**
 * @description Validates all configurations against their respective schemas
 */
function validateAllConfigs() {
  validateConfig(blueFlowerConfig, natureObjectSchema)
  validateConfig(grassConfig, natureObjectSchema)
  validateConfig(rockConfig, natureObjectSchema)
  validateConfig(whiteFlowerConfig, natureObjectSchema)
  validateConfig(yellowFlowerConfig, natureObjectSchema)
  validateConfig(windConfig, windSchema)
  validateConfig(parrotTrellisConfig, birdSchema)
  validateConfig(woodpeckerConfig, birdSchema)
  validateConfig(skyConfig, skySchema)
}

// run validation on all configs
validateAllConfigs()

// Export the validated configurations
export const defaultConfigs = {
  blueFlower: blueFlowerConfig,
  grass: grassConfig,
  rock: rockConfig,
  whiteFlower: whiteFlowerConfig,
  wind: windConfig,
  yellowFlower: yellowFlowerConfig,
  sky: skyConfig,
}

// Export only the bird configurations
export const birdConfigs = [parrotTrellisConfig, woodpeckerConfig]
