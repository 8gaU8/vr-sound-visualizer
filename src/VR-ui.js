// @ts-check

/**
 * @typedef {import('three').Scene} Scene
 * @typedef {import('three').PerspectiveCamera} PerspectiveCamera
 * @typedef {import('three').WebGLRenderer} WebGLRenderer
 * @typedef {import('./audioVisualizers/DirectionIndicator.js').DirectionIndicator} DirectionIndicator
 * @typedef {import('./haptics.js').HapticsManager} HapticsManager
 * @typedef {import('./BirdsWatcher.js').BirdsWatcher} BirdsWatcher
 * @typedef {import('./natureObjects/ground.js').Ground} Ground
 */
import * as THREE from 'three'
import { HTMLMesh } from 'three/examples/jsm/interactive/HTMLMesh.js'
import { InteractiveGroup } from 'three/examples/jsm/interactive/InteractiveGroup.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js'

import { VisualizeOptions } from './defaultConfigs/VisualizeOptions'

/**
 * @param {Scene} scene
 * @param {PerspectiveCamera} camera
 * @param {WebGLRenderer} renderer
 * @param {DirectionIndicator} directionalIndicator
 * @param {HapticsManager} hapticsManager
 * @param {BirdsWatcher} birdsWatcher
 * @param {Ground} ground
 */
export function VRUI(
  scene,
  camera,
  renderer,
  directionalIndicator,
  hapticsManager,
  birdsWatcher,
  ground,
) {
  const gui = new GUI()
  //   gui.domElement.style.zIndex = 1000;

  const DirectionFolder = gui.addFolder('Directional Indicator')
  DirectionFolder.add(directionalIndicator.indicator, 'visible')
    .name('Enabled')
    .onChange((value) => {
      directionalIndicator.indicator.visible = value
    })
  // DirectionFolder.add(VisualizeOptions.directionalIndicator.ring, 'radius', 0, 1).name('Radius');
  // DirectionFolder.add(VisualizeOptions.directionalIndicator.ring, 'thickness', 0, 1).name('Thickness');
  // DirectionFolder.close();

  const hapticsFolder = gui.addFolder('Haptics')
  hapticsFolder
    .add(hapticsManager, 'enabled')
    .name('Enabled')
    .onChange((value) => {
      if (hapticsManager) {
        hapticsManager.enabled = value
      }
    })

  const spectrogramFolder = gui.addFolder('Spectrogram')
  spectrogramFolder
    .add(VisualizeOptions.spectrogramModel, 'enabled')
    .name('Enabled')
    .onChange((value) => {
      // Toggle visibility of all spectrogram meshes in the scene
      birdsWatcher.setSpectrogramEnabled(value)
    })
  console.log('Initial spectrogram enabled state:', VisualizeOptions.spectrogramModel.enabled)

  // Create an interactive group for the UI
  // Add VR controllers
  const geometry = new THREE.BufferGeometry()
  geometry.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -5)])

  const controller1 = renderer.xr.getController(0)
  controller1.add(new THREE.Line(geometry))
  scene.add(controller1)

  const controller2 = renderer.xr.getController(1)
  controller2.add(new THREE.Line(geometry))
  scene.add(controller2)
  // Add controller models
  const controllerModelFactory = new XRControllerModelFactory()

  const controllerGrip1 = renderer.xr.getControllerGrip(0)
  controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1))
  scene.add(controllerGrip1)

  const controllerGrip2 = renderer.xr.getControllerGrip(1)
  controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2))
  scene.add(controllerGrip2)

  //gui in VR
  const interactiveGroup = new InteractiveGroup()
  interactiveGroup.listenToPointerEvents(renderer, camera)
  interactiveGroup.listenToXRControllerEvents(controller1)
  interactiveGroup.listenToXRControllerEvents(controller2)
  scene.add(interactiveGroup)
  //   const interactiveGroup = new InteractiveGroup(renderer, camera);
  //   scene.add(interactiveGroup);

  // Create a simple HTML mesh for the UI
  const htmlMesh = new HTMLMesh(gui.domElement)
  htmlMesh.position.set(1, 2.3, -2)
  htmlMesh.rotation.y = -Math.PI / 6

  // htmlMesh.position.set(0.6,-0.6,-2)
  htmlMesh.scale.set(2.5, 2.5, 2.5)
  interactiveGroup.add(htmlMesh)

  //hide/show gui when pressing A or X
  // let rightController;

  // controller1.addEventListener('connected', (event) => {
  //   if (event.data.handedness === "right") {
  //     rightController = controller1;
  //     // Listen for the 'selectstart' event directly
  //     rightController.addEventListener('selectstart', () => {
  //       htmlMesh.visible = !htmlMesh.visible;
  //       // console.log('A pressed', gamepad)
  //     });
  //   }
  // });

  // controller2.addEventListener('connected', (event) => {
  //   if (event.data.handedness === "right") {
  //     rightController = controller2;
  //     // Listen for the 'selectstart' event directly
  //     rightController.addEventListener('selectstart', () => {
  //       htmlMesh.visible = !htmlMesh.visible;
  //     });
  //   }

  // if (event.data.handedness === "right") {
  //   //do something here
  // }
  //get buttons inputs from controller 1
  // const gamepad = event.data.gamepad;
  // });

  // const teleportVR = new TeleportVR(scene, camera);
  // const lefthand = new THREE.Mesh(
  //     new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16, 1, true),
  //     new THREE.MeshBasicMaterial({
  //         color: 0x00ff88,
  //         wireframe: true,
  //     })
  // )
  // // const controllerGrip1 = renderer.xr.getControllerGrip(0)
  // controllerGrip1.addEventListener('connected', (event) => {
  //     controllerGrip1.add(lefthand)
  //     if( event.data.gamepad){
  //     teleportVR.add(0, controllerGrip1, event.data.gamepad)}
  // })

  // const righthand = new THREE.Mesh(
  //     new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16, 1, true),
  //     new THREE.MeshBasicMaterial({
  //         color: 0x00ff88,
  //         wireframe: true,
  //     })
  // )
  // // const controllerGrip1 = renderer.xr.getControllerGrip(1)
  // controllerGrip2.addEventListener('connected', (event) => {
  //     controllerGrip2.add(righthand)
  //     if (event.data.gamepad){
  //     teleportVR.add(1, controllerGrip2, event.data.gamepad)}
  // })

  // Add a marker to show teleport target
  const marker = new THREE.Mesh(
    new THREE.CircleGeometry(0.25, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0xbcbcbc }),
  )
  scene.add(marker)
  marker.visible = false

  // Raycaster for teleportation
  const raycaster = new THREE.Raycaster()
  const tempMatrix = new THREE.Matrix4()
  let INTERSECTION
  let baseReferenceSpace

  // Listen for XR session start to get reference space
  renderer.xr.addEventListener('sessionstart', () => {
    baseReferenceSpace = renderer.xr.getReferenceSpace()
  })

  // Teleport logic for controllers
  function onSelectStart() {
    this.userData.isSelecting = true
  }
  function onSelectEnd() {
    this.userData.isSelecting = false
    if (INTERSECTION && baseReferenceSpace) {
      const offsetPosition = { x: -INTERSECTION.x, y: -INTERSECTION.y, z: -INTERSECTION.z, w: 1 }
      const offsetRotation = new THREE.Quaternion()
      const transform = new XRRigidTransform(offsetPosition, offsetRotation)
      const teleportSpaceOffset = baseReferenceSpace.getOffsetReferenceSpace(transform)
      renderer.xr.setReferenceSpace(teleportSpaceOffset)
    }
  }

  // Attach events to controllers
  controller1.addEventListener('selectstart', onSelectStart)
  controller1.addEventListener('selectend', onSelectEnd)
  controller2.addEventListener('selectstart', onSelectStart)
  controller2.addEventListener('selectend', onSelectEnd)

  function updateTeleportMarker() {
    INTERSECTION = undefined
    ;[controller1, controller2].forEach((event) => {
      if (event.userData.isSelecting === true) {
        tempMatrix.identity().extractRotation(event.matrixWorld)
        raycaster.ray.origin.setFromMatrixPosition(event.matrixWorld)
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix)
        const intersects = raycaster.intersectObjects([ground])
        if (intersects.length > 0) {
          INTERSECTION = intersects[0].point
        }
      }
    })
    if (INTERSECTION) {
      marker.position.copy(INTERSECTION)
      marker.position.y += 0.01 // Slightly above the ground, prevent glitching
      marker.visible = true
    } else {
      marker.visible = false
    }
  }

  return {
    gui,
    interactiveGroup,
    htmlMesh,
    controller1,
    controller2,
    controllerGrip1,
    controllerGrip2,
    // teleportVR,
    updateTeleportMarker,
  }
}
