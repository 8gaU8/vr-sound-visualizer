export const VisualizeOptions = {
  directionalIndicator: {
    enabled: true,
    ring: {
      radius: 0.2,
      thickness: 0.02,
      color: 0x8ac926,
      opacity: 0.8,
      position: {
        x: 0,
        y: -0.5,
        z: -2,
      },
    },
    point: {
      color: 0xff595e,
      opacity: 1.0,
      minSize: 0.0001,
      maxSize: 0.05,
      z: 0.001,
    },
  },
  spectrogramModel: {
    enabled: true,
    fftSize: 32,
    width: 0.23,
    height: 0.23,
    visibleThresholds: {
      distance: 5,
      angle: 0.2,
    },
  },
}
