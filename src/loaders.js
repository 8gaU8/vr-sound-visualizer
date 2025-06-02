//@ts-check
import { AudioLoader } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const audioLoader = new AudioLoader()
const gltfLoader = new GLTFLoader()

export const loaders = {
  audioLoader,
  gltfLoader,
}
