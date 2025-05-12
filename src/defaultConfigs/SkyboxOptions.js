import * as THREE from 'three'

export class SkyboxOptions {
  constructor() {
    /**
     * Azimuth of the sun in degrees
     */
    this.sunAzimuth = 90

    /**
     * Elevation of the sun in degrees
     */
    this.sunElevation = 30

    /**
     * Color of the sun
     */
    this.sunColor = new THREE.Color(0xffe5b0).convertLinearToSRGB()

    /**
     * Size of the sun in the sky
     */
    this.sunSize = 1

    /**
     * Color of the sky in the lower part of the sky
     */
    this.skyColorLow = new THREE.Color(0x6fa2ef).convertLinearToSRGB()

    /**
     * Color of the sun in the higher part of the sky
     */
    this.skyColorHigh = new THREE.Color(0x2053ff).convertLinearToSRGB()
  }
}
