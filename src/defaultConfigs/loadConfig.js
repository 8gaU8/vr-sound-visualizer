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

class ConfigManager {
  /** @type {string} */
  configRoot = document.URL

  /** @type {Ajv} */
  ajv = new Ajv({ allErrors: true, strict: true })

  /** @type {Record<string, number>} */
  seedStore = {}

  /** @type {Record<string, ValidateFunction} */
  schemaValidators = {}

  /**
   * @param {string | undefined} [configBase]
   */
  constructor(configBase) {
    if (configBase) {
      this.configRoot = document.URL + configBase
    }
  }

  /**
   * @description Validates the configuration against the provided schema
   * @param {object} config
   * @throws {Error}
   */
  async validateConfig(config) {
    const validator = await this.#loadSchema(config['$schema'])
    if (!validator(config)) {
      console.error('Configuration validation errors:', 'at', config.id, validator.errors)
      throw new Error('Invalid configuration')
    }
    if (config['seed'] !== undefined) {
      this.#isUniqueSeed(config['id'], config['seed'])
    }
    console.debug('Configuration validated:', config.id)
  }

  /**
   * @description Checks if the seed is unique across all configurations.
   * @param {string } id
   * @param {number} seed
   * @throws {Error}
   */
  #isUniqueSeed(id, seed) {
    for (const key of Object.keys(this.seedStore)) {
      const storedSeed = this.seedStore[key]

      // if the seed is already used in another config, then erro
      if (seed === storedSeed) {
        if (id === key) {
          console.debug(`Seed ${seed} in "${id}" config is already stored`)
          return
        }
        throw new Error(`Seed ${seed} in "${id}" config already used in "${key}" config`)
      }
    }
    this.seedStore[id] = seed
    return
  }

  /**
   * @description Loads the schema from the specified path and compiles it into a validator function.
   * This function caches the validator to avoid reloading the schema multiple times.
   * @param {string} _schemaPath
   * @returns {Promise<ValidateFunction>}
   */
  async #loadSchema(_schemaPath) {
    const schemaPath = this.configRoot + _schemaPath + '.js'
    // Try to retrieve the validator from cache
    if (this.schemaValidators[schemaPath]) {
      console.debug(`Using cached validator for schema: ${schemaPath}`)
      return this.schemaValidators[schemaPath]
    }

    try {
      const module = await import(/* @vite-ignore */ schemaPath)
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

  /**
   * @description Accepts an uploaded configuration object and validates it against the schema.
   * @param {object} config
   * @returns {Promise<void>}
   */
  async validateUploadedConfig(config) {
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid configuration object')
    }
    if (!config['$schema']) {
      throw new Error('Configuration must have a $schema property')
    }
    await this.validateConfig(config)
    console.debug('Uploaded configuration validated:', config.id)
  }
}

/**
 * @description Validates all configurations against their respective schemas
 * Only used in initialization phase to ensure all configs are valid
 * @param {ConfigManager} validator
 */
function validateAllConfigs(validator) {
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

// =================== INITIALIZATION ==============================
const configValidator = new ConfigManager()

// run validation on all configs
validateAllConfigs(configValidator)

// =================== Configuration File Input Handler ==================

function fileChangeEventListner(event) {
  function _onload(e) {
    try {
      const options = JSON.parse(e.target.result)
      configValidator.validateUploadedConfig(options)
      console.log('Parsed options:', options)
    } catch (error) {
      console.error('Error parsing JSON:', error)
      alert('Invalid configuration file. Please upload a valid JSON file.')
    }
  }

  function _onerror(e) {
    const msg = 'Error reading file: ' + e
    console.error(msg)
    alert(msg)
  }

  const file = event.target.files[0]
  console.log(event.target.files.length)
  if (!file) {
    // No file selected, exit the function
    return
  }

  const reader = new FileReader()

  // setting the READER
  reader.onload = _onload.bind(reader)
  reader.onerror = _onerror.bind(reader)

  // Read the file as text
  reader.readAsText(file)
}

function resetFileInput(event) {
  // Reset the file input value to allow re-uploading the same file
  event.target.value = ''
}

/**
 * @param {HTMLInputElement} inputElement
 */
export function registerFileChangeListener(inputElement) {
  if (!inputElement || !(inputElement instanceof HTMLInputElement)) {
    throw new Error('Input element must be an HTMLInputElement')
  }

  inputElement.addEventListener('click', resetFileInput.bind(inputElement))
  inputElement.addEventListener('change', fileChangeEventListner.bind(inputElement))
}

// =================== Export the validator for use in other modules ==================
export { configValidator }

// =================== Export the configurations ==================
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
