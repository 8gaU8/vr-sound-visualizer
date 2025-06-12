// @ts-check
/**
 * @typedef {import('ajv').ValidateFunction} ValidateFunction
 */

import Ajv from 'ajv'

// CONSTS
const CONFIG_KEYS = [
  'grass',
  'blueFlower',
  'yellowFlower',
  'whiteFlower',
  'rock',
  'sky',
  'wind',
  'parrotTrellis',
  'woodpecker',
]

class ConfigManager {
  /** @type {string} */
  configRoot = document.URL

  /** @type {Ajv} */
  ajv = new Ajv({ allErrors: true, strict: true })

  /** @type {Record<string, number>} */
  seedStore = {}

  /** @type {Record<string, object>} */
  configStore = {}

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

  async initialize() {
    for (const key of CONFIG_KEYS) {
      const configPath = this.#originalConfigPath(key)
      const module = await import(/* @vite-ignore */ configPath)
      const config = module.config
      await this.validateAndStoreConfig(config)
    }
  }

  /**
   * @description Validates the configuration against the provided schema
   * @param {object} config
   * @throws {Error}
   */
  async validateAndStoreConfig(config) {
    const validator = await this.#loadSchema(config['$schema'])
    if (!validator(config)) {
      console.error('Configuration validation errors:', 'at', config.id, validator.errors)
      throw new Error('Invalid configuration')
    }
    if (config['seed'] !== undefined) {
      this.#isUniqueSeed(config['id'], config['seed'])
    }
    console.debug('Configuration validated:', config.id)
    this.configStore[config.id] = config
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
          return
        }
        throw new Error(`Seed ${seed} in "${id}" config already used in "${key}" config`)
      }
    }
    this.seedStore[id] = seed
    return
  }

  #originalConfigPath(configKey) {
    return this.configRoot + 'configs/' + configKey + '.json.js'
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
    await this.validateAndStoreConfig(config)
    console.debug('Uploaded configuration validated:', config.id)
  }

  /**
   * @param {string} schemaPath
   * @return {object[]}
   */
  getConfigsBySchema(schemaPath) {
    const foundConfigs = []
    Object.keys(this.configStore).forEach((key) => {
      const config = this.configStore[key]
      if (config['$schema'] === schemaPath) {
        foundConfigs.push(config)
      }
    })
    if (foundConfigs.length === 0) {
      console.error(`No configurations found for schema: ${schemaPath}`)
    }
    return foundConfigs
  }
}

// =================== INITIALIZATION ==============================
const configValidator = new ConfigManager()
configValidator.initialize()

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

// =================== Export the configurations ==================
export { configValidator }
export const defaultConfigs = configValidator.configStore

// Export only the bird configurations
// export const birdConfigs = configValidator.getConfigsBySchema('schemas/bird.schema.json')
