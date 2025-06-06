// @ts-check

/**
 * @typedef {import('three').Scene} Scene
 * @typedef {import('three').PerspectiveCamera} PerspectiveCamera
 * @typedef {import('three').WebGLRenderer} WebGLRenderer
 * @typedef {import('./audioVisualizers/DirectionIndicator.js').DirectionIndicator} DirectionIndicator
 * @typedef {import('./haptics.js').HapticsManager} HapticsManager
 * @typedef {import('./BirdsWatcher.js').BirdsWatcher} BirdsWatcher
 */

import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
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
    spectrogramFolder.add(VisualizeOptions.spectrogramModel, 'enabled', [true, false])
        .name('Enabled')
        .onChange((value) => {
            // Toggle visibility of all spectrogram meshes in the scene
            birdsWatcher.setSpectrogramEnabled(value);
        });
    console.log('Initial spectrogram enabled state:', VisualizeOptions.spectrogramModel.enabled);

    // Create an interactive group for the UI
    // Add VR controllers
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -5)]);

    const controller1 = renderer.xr.getController(0);
    controller1.add(new THREE.Line(geometry));

    const controller2 = renderer.xr.getController(1);
    controller2.add(new THREE.Line(geometry));
    // Add controller models
    const controllerModelFactory = new XRControllerModelFactory();

    const controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));

    const controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));

    //gui in VR
    const interactiveGroup =new InteractiveGroup();
    interactiveGroup.listenToPointerEvents(renderer,camera);
    interactiveGroup.listenToXRControllerEvents(controller1);
    interactiveGroup.listenToXRControllerEvents(controller2);
    interactiveGroup.add(controller1);
    interactiveGroup.add(controller2);
    interactiveGroup.add(controllerGrip1);
    interactiveGroup.add(controllerGrip2);
  //   const interactiveGroup = new InteractiveGroup(renderer, camera);

    // Create a simple HTML mesh for the UI
    const htmlMesh = new HTMLMesh(gui.domElement);
    htmlMesh.position.set(-1, 1, -1);
    htmlMesh.rotation.y= Math.PI/4;
    interactiveGroup.add(htmlMesh);
    scene.add(interactiveGroup);

    return { gui, interactiveGroup, htmlMesh, controller1, controller2, controllerGrip1, controllerGrip2 };
}

