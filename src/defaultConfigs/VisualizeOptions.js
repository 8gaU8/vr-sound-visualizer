export const VisualizeOptions = {
  directionalIndicator: {
    enabled: true,
    ring: {
      radius: 0.2,
      thickness: 0.02,
      color: 0x00ff00,
      opacity: 0.8,
      position: {
        x: 0,
        y: -0.5,
        z: -2,
      },
    },
    point: {
      color: 0xff0000,
      opacity: 1.0,
      minSize: 0.0001,
      maxSize: 0.02,
      z: 0.001,
    },
  },
  spectrogramModel: {
    enabled: true,
    fftSize: 64,
    width: 1,
    height: 1,
  },
}
