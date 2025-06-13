# VR Sound Visualizer

![deploy status](https://github.com/8gaU8/vr-sound-visualizer/actions/workflows/deploy.yml/badge.svg)

- [DEMO](https://8gau8.github.io/vr-sound-visualizer/)

## Features

1. **Visualization & haptics**

   Our main features of this project.
   Create immersive experience with visualizations and haptics.

   - Show direction of the sound
   - Code: [`src/audioVisualizers/DirectionIndicator.js`](src/audioVisualizers/DirectionIndicator.js)
   - Show spectrogram of the sound
   - Code: [`src/audioVisualizers/SpectrogramModelController.js`](src/audioVisualizers/SpectrogramModelController.js)
   - Provide haptics of the global sound based on the distance to birds
   - Code: [`src/haptics.js`](src/haptics.js)

2. **Custimization**

   You can use your configuration files to customize your experience and environment.

   - Basic configuration files: [`public/configs/*.json.js`](public/configs/)
   - Correspondin schemas: [`public/schemas/*.json.js`](public/schemas/)
   - Example custimizations:
      - Increase the number of blue flowers: [`testConfigurations/manyBlueFlowers.json`](./testConfigurations/manyBlueFlowers.json)
      - Sunset view: [`testConfigurations/sunset.json`]('testConfigurations/sunset.json)
   - Validation script for custom configuration: [`src/defaultConfigs/loadConfig.js`](src/defaultConfigs/loadConfig.js)

## Installation

1. Install Node.js
2. Clone this repository

   ```bash
   git clone https://github.com/8gaU8/vr-sound-visualizer
   ```

   or open this repository with VS Code.

3. Install dependencies

   ```bash
   cd vr-sound-visualizer
   npm install
   ```

4. Run vite server

   ```bash
   npm run dev
   ```

5. Open your browser

   URL will be shown in the terminal.

## Project Structure and Main Components

This project is a VR sound visualizer built with JavaScript and Vite. Below is a summary of the main files and classes, and their roles in the application:

- **src/main.js**: Entry point of the application. Initializes the scene, controllers, and handles the main application logic.
- **src/environment.js**: Manages the VR environment setup, including lighting and environmental effects.
- **src/scene.js**: Handles the creation and management of the 3D scene.
- **src/renderer.js**: Responsible for rendering the 3D scene using WebGL/Three.js.
- **src/AudioController.js**: Manages audio playback and analysis, providing data for visualization.
- **src/BirdModelController.js**: Controls the loading and animation of bird 3D models.
- **src/BirdAVController.js**: Integrates audio and visual (bird) components, synchronizing animations with sound.
- **src/BirdsWatcher.js**: Observes and manages multiple bird entities in the scene.
- **src/MotionGenerator.js**: Generates procedural motion for objects, such as birds or environmental elements.
- **src/VR-ui.js**: Handles the VR user interface, including overlays and interactive elements.
- **src/haptics.js**: Manages haptic feedback for supported VR devices.
- **src/loaders.js**: Utility functions for loading 3D models, textures, and other assets.
- **src/noise.js**: Provides noise generation utilities for procedural effects.
- **src/stats.js**: Displays performance statistics (e.g., FPS) in the UI.
- **src/utils.js**: General utility functions used throughout the project.

### Audio Visualizer Components

- **src/audioVisualizers/**: Contains modules for audio visualization, such as:
  - **SpectrogramModelController.js**: Controls the spectrogram visualization.
  - **DirectionIndicator.js**: Visualizes the direction of audio sources.
  - **angleUtils.js, Point.js, shaders.js**: Utility and shader files for visualization.

### Nature Objects

- **src/natureObjects/**: Contains scripts for environmental objects (clouds, grass, rocks, skybox, etc.).

### Configurations

- **public/configs/**: JSON configuration files for various scene elements and objects.
- **public/configs/schemas/**: JSON schema files for validating configuration files.

### Assets

- **public/**: Contains 3D models (.glb), textures (.jpg), and audio files (.mp3) used in the scene.

This modular structure allows for easy extension and maintenance of the VR sound visualizer, supporting new features, models, and audio visualizations.

## Materials for future works

### Animate3D

- [Demo](https://www.youtube.com/watch?v=qkaeeGzLnY8)
- [Github Repo](http://github.com/yanqinjiang/animate3d/)

### Trellis

- [DEMO](https://huggingface.co/spaces/microsoft/TRELLIS)
- [GH REPO](https://github.com/microsoft/TRELLIS)
