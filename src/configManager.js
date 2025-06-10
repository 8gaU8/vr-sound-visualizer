// @ts-check

import Ajv from 'ajv'

/** @type {Record<string, number>} */
const seedStore = {}

/**
 * @description Provides the path to the configuration file.
 * @param {string} filename
 * @returns {string}
 */
function pathProvider(filename) {
  return `configs/${filename}`
}

/**
 * @description Loads a JSON configuration file from the given URL.
 * @param {string} url
 * @returns {Promise<object>}
 */
async function loadJSON(url) {
  const config = await fetch(url)
  const configJson = await config.json()
  return configJson
}

/**
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

/**
 * @description Validates the configuration against the provided schema.
 * @param {Record<string, any>} config
 * @param {object} schema
 */
function validateConfig(config, schema) {
  const ajv = new Ajv({ allErrors: true, strict: false })
  const validate = ajv.compile(schema)

  if (!validate(config)) {
    console.error('Configuration validation errors:', validate.errors)
    throw new Error('Invalid configuration')
  }

  if (config['seed'] !== undefined) {
    isUniqueSeed(config['id'], config['seed'])
  }
}

/**
 * @description Loads a JSON configuration file from the given URL with validation
 * @param {string} filename
 * @returns {Promise<object>}
 */
export async function loadConfig(filename) {
  const url = pathProvider(filename)
  const configJson = await loadJSON(url)
  const schemeUrl = pathProvider(configJson['$schema'])
  const scheme = await loadJSON(schemeUrl)
  validateConfig(configJson, scheme)

  return configJson
}

loadConfig('grass.json')
loadConfig('yellowFlower.json')
loadConfig('blueFlower.json')
loadConfig('whiteFlower.json')
loadConfig('wind.json')
loadConfig('rock.json')
