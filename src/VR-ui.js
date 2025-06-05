// @ts-check

/**
 * @typedef {import('three').Scene} Scene
 * @typedef {import('three').PerspectiveCamera} PerspectiveCamera
 * @typedef {import('three').WebGLRenderer} WebGLRenderer
 * @typedef {import('./audioVisualizers/DirectionIndicator.js').DirectionIndicator} DirectionIndicator
 * @typedef {import('./haptics.js').HapticsManager} HapticsManager
 * @typedef {import('./BirdsWatcher.js').BirdsWatcher} BirdsWatcher
 */

import { HTMLMesh } from 'three/examples/jsm/interactive/HTMLMesh.js';
import { InteractiveGroup } from 'three/examples/jsm/interactive/InteractiveGroup.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

import { VisualizeOptions } from './defaultConfigs/VisualizeOptions';


/**
 * @param {Scene} scene
 * @param {PerspectiveCamera} camera
 * @param {WebGLRenderer} renderer
 * @param {DirectionIndicator} directionalIndicator
 * @param {HapticsManager} hapticsManager
 * @param {BirdsWatcher } birdsWatcher
 */
export function VRUI(scene, camera, renderer, directionalIndicator, hapticsManager, birdsWatcher) {
  const gui = new GUI();
//   gui.domElement.style.zIndex = 1000;

    const DirectionFolder= gui.addFolder('Directional Indicator');
    DirectionFolder.add(directionalIndicator.indicator, 'visible').name('Enabled')
    .onChange((value) => {
        directionalIndicator.indicator.visible = value;
    });;
    // DirectionFolder.add(VisualizeOptions.directionalIndicator.ring, 'radius', 0, 1).name('Radius');
    // DirectionFolder.add(VisualizeOptions.directionalIndicator.ring, 'thickness', 0, 1).name('Thickness');
    // DirectionFolder.close();

    const hapticsFolder= gui.addFolder('Haptics');
    hapticsFolder.add(hapticsManager, 'enabled').name('Enabled')
    .onChange((value) => {
        if (hapticsManager) {
            hapticsManager.enabled = value;}
        });

    const spectrogramFolder = gui.addFolder('Spectrogram');
    spectrogramFolder.add(VisualizeOptions.spectrogramModel, 'enabled')
        .name('Enabled')
        .onChange((value) => {
            // Toggle visibility of all spectrogram meshes in the scene
            birdsWatcher.setSpectrogramEnabled(value);
        });
console.log('Initial spectrogram enabled state:', VisualizeOptions.spectrogramModel.enabled);

  // Create an interactive group for the UI
  const interactiveGroup = new InteractiveGroup(renderer, camera);
  scene.add(interactiveGroup);

  // Create a simple HTML mesh for the UI
  const htmlMesh = new HTMLMesh(gui.domElement);
  htmlMesh.position.set(-1, 1.5, -1);
  interactiveGroup.add(htmlMesh);

  return { gui, interactiveGroup, htmlMesh };
}