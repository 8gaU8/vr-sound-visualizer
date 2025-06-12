// @ts-check
/**
 * @typedef {import('ajv').ValidateFunction} ValidateFunction
 */

import Ajv from 'ajv'

import { config as blueFlowerConfig } from './configs/blueFlower.json.js'
import { config as grassConfig } from './configs/grass.json.js'
import { config as parrotTrellisConfig } from './configs/parrotTrellis.json.js'
import { config as rockConfig } from './configs/rock.json.js'
import { config as skyConfig } from './configs/sky.json.js'
import { config as whiteFlowerConfig } from './configs/whiteFlower.json.js'
import { config as windConfig } from './configs/wind.json.js'
import { config as woodpeckerConfig } from './configs/woodpecker.json.js'
import { config as yellowFlowerConfig } from './configs/yellowFlower.json.js'

class ConfigValidator {
  /** @type {Ajv} */
  ajv

  /** @type {Record<string, number>} */
  seedStore = {}

  /** @type {Record<string, ValidateFunction} */
  schemaValidators = {}

  constructor() {
    this.ajv = new Ajv({ allErrors: true, strict: true })
  }

  /**
   * @description Checks if the seed is unique across all configurations.
   * @param {string } id
   * @param {number} seed
   */
  isUniqueSeed(id, seed) {
    for (const [key, value] of Object.entries(this.seedStore)) {
      if (id === key) {
        console.warn(`Skipping seed check for ${id} as it is already being processed`)
        break
      }
      if (value === seed) {
        throw new Error(`Seed ${seed} in "${id}" config already used in "${key}" config`)
      }
    }
    this.seedStore[id] = seed
    return true
  }

  /**
   * @description Validates the configuration against the provided schema
   * @param {object} config
   */
  async validateConfig(config) {
    const validator = await this.loadSchema(config['$schema'])
    if (!validator(config)) {
      console.error('Configuration validation errors:', 'at', config.id, validator.errors)
      throw new Error('Invalid configuration')
    }
    if (config['seed'] !== undefined) {
      this.isUniqueSeed(config['id'], config['seed'])
    }
    console.debug('Configuration validated:', config.id)
  }

  /**
   * @description Loads the schema from the specified path and compiles it into a validator function.
   * This function caches the validator to avoid reloading the schema multiple times.
   * @param {string} _schemaPath
   * @returns {Promise<ValidateFunction>}
   */
  async loadSchema(_schemaPath) {
    const schemaPath = _schemaPath + '.js'
    // Try to retrieve the validator from cache
    if (this.schemaValidators[schemaPath]) {
      console.debug(`Using cached validator for schema: ${schemaPath}`)
      return this.schemaValidators[schemaPath]
    }

    try {
      const module = await import(schemaPath)
      if (!module.schema) {
        throw new Error(`Schema not found in module: ${schemaPath}`)
      }
      const schema = module.schema
      const validator = this.ajv.compile(schema)
      this.schemaValidators[schemaPath] = validator
      return validator
    } catch (error) {
      console.error(`Failed to load schema from ${schemaPath}:`, error)
      throw error
    }
  }
}

/**
 * @description Validates all configurations against their respective schemas
 */
function validateAllConfigs() {
  const validator = new ConfigValidator()

  validator.validateConfig(blueFlowerConfig)
  validator.validateConfig(grassConfig)
  validator.validateConfig(rockConfig)
  validator.validateConfig(whiteFlowerConfig)
  validator.validateConfig(yellowFlowerConfig)
  validator.validateConfig(windConfig)
  validator.validateConfig(parrotTrellisConfig)
  validator.validateConfig(woodpeckerConfig)
  validator.validateConfig(skyConfig)
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
