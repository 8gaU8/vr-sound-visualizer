import * as THREE from 'three'
import { HTMLMesh, InteractiveGroup, XRControllerModelFactory } from 'three/examples/jsm/Addons.js'

const initControllers = (renderer) => {
  const xRcontollerGroup = new THREE.Group()
  const geometry = new THREE.BufferGeometry()
  geometry.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -5)])

  const controller1 = renderer.xr.getController(0)
  controller1.add(new THREE.Line(geometry))
  xRcontollerGroup.add(controller1)

  const controller2 = renderer.xr.getController(1)
  controller2.add(new THREE.Line(geometry))
  xRcontollerGroup.add(controller2)

  const controllerModelFactory = new XRControllerModelFactory()

  const controllerGrip1 = renderer.xr.getControllerGrip(0)
  controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1))
  xRcontollerGroup.add(controllerGrip1)

  const controllerGrip2 = renderer.xr.getControllerGrip(1)
  controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2))
  xRcontollerGroup.add(controllerGrip1)
  xRcontollerGroup.name = 'xrControllers'

  return {
    xRcontollerGroup: xRcontollerGroup,
    controllers: { controller1: controller1, controller2: controller2 },
    controllerGrips: { controllerGrip1: controllerGrip1, controllerGrip2: controllerGrip2 },
  }
}

export class XRControllerManager {
  constructor(renderer, camera) {
    this.renderer = renderer
    this.camera = camera
    this.xrControllers = initControllers(this.renderer)
  }

  getXrControllers() {
    return this.xrControllers.xRcontollerGroup
  }

  getXrGUI(gui) {
    const { controller1, controller2 } = this.xrControllers.controllers
    const group = new InteractiveGroup()
    group.listenToPointerEvents(this.renderer, this.camera)
    group.listenToXRControllerEvents(controller1)
    group.listenToXRControllerEvents(controller2)

    const mesh = new HTMLMesh(gui.domElement)
    mesh.position.x = 1.5
    mesh.position.y = 1.5
    mesh.position.z = 0.5
    mesh.rotation.y = -Math.PI / 2 + Math.PI / 3
    mesh.scale.setScalar(2)
    group.add(mesh)
    group.add(this.getXrControllers())
    group.name = 'xrGUI'

    return group
  }
}
