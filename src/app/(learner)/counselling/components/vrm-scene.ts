// @ts-expect-error - external untyped three module import
import * as THREE from "three";
// @ts-expect-error - external untyped three gltf loader import
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, VRMUtils, type VRM } from "@pixiv/three-vrm";

export class VRMScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
  private readonly timer = new THREE.Timer();
  private readonly resizeObserver: ResizeObserver;
  private vrm: VRM | null = null;
  private elapsed = 0;
  private nextBlinkAt = 2;
  private disposed = false;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const key = new THREE.DirectionalLight(0xffffff, 1.8);
    key.position.set(1, 2, 3);
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0xbfd4ff, 0.6);
    fill.position.set(-2, 1, 1);
    this.scene.add(fill, new THREE.AmbientLight(0xffffff, 0.5));

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement ?? canvas);
    this.resize();
    this.renderer.setAnimationLoop(() => this.tick());
  }

  async load(url: string): Promise<void> {
    const loader = new GLTFLoader();
    loader.register((parser: unknown) => new VRMLoaderPlugin(parser as never));
    const gltf = await loader.loadAsync(url);

    if (this.disposed) throw new Error("Scene was disposed while the model was loading");

    const vrm = gltf.userData.vrm as VRM | undefined;
    if (!vrm) throw new Error("The model did not contain VRM data");

    VRMUtils.removeUnnecessaryVertices(vrm.scene);
    VRMUtils.combineSkeletons(vrm.scene);
    VRMUtils.rotateVRM0(vrm);

    this.vrm = vrm;
    this.scene.add(vrm.scene);
    this.relaxArms(vrm);
    this.frameFace(vrm);
  }

  private relaxArms(vrm: VRM): void {
    const leftArm = vrm.humanoid?.getNormalizedBoneNode("leftUpperArm");
    const rightArm = vrm.humanoid?.getNormalizedBoneNode("rightUpperArm");

    if (leftArm) leftArm.rotation.z = 1.2;
    if (rightArm) rightArm.rotation.z = -1.2;
  }

  private frameFace(vrm: VRM): void {
    const head = vrm.humanoid?.getNormalizedBoneNode("head");
    const faceY = (head?.getWorldPosition(new THREE.Vector3()).y ?? 1.4) + 0.06;
    this.camera.position.set(0, faceY, 0.8);
    this.camera.lookAt(0, faceY, 0);
  }

  private tick(): void {
    this.timer.update();
    const delta = this.timer.getDelta();
    this.elapsed += delta;

    if (this.vrm) {
      this.updateBlink();
      this.vrm.scene.position.y = Math.sin(this.elapsed * 1.5) * 0.01;
      this.vrm.update(delta);
    }

    this.renderer.render(this.scene, this.camera);
  }

  private updateBlink(): void {
    const manager = this.vrm?.expressionManager;
    if (!manager || this.elapsed < this.nextBlinkAt) return;

    const blinkDuration = 0.18;
    const blinkProgress = (this.elapsed - this.nextBlinkAt) / blinkDuration;

    if (blinkProgress < 1) {
      manager.setValue("blink", Math.sin(blinkProgress * Math.PI));
      return;
    }

    manager.setValue("blink", 0);
    this.nextBlinkAt = this.elapsed + 2 + Math.random() * 4;
  }

  private resize(): void {
    const parent = this.canvas.parentElement;
    const width = parent?.clientWidth ?? window.innerWidth;
    const height = parent?.clientHeight ?? window.innerHeight;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  dispose(): void {
    this.disposed = true;
    this.resizeObserver.disconnect();
    this.renderer.setAnimationLoop(null);
    if (this.vrm) {
      this.scene.remove(this.vrm.scene);
      VRMUtils.deepDispose(this.vrm.scene);
    }
    this.renderer.dispose();
  }
}
