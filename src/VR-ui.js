import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.17.0/dist/lil-gui.esm.js'; 
import { InteractiveGroup } from 'three/addons/interactive/InteractiveGroup.js';
import { HTMLMesh } from 'three/addons/interactive/HTMLMesh.js';

import { VisualizeOptions } from './defaultConfigs/VisualizeOptions';


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
            scene.traverse((object) => {
                if (object.name && object.name.includes('SpectrogramMesh')) {
                    object.visible = value;
                }
            });
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