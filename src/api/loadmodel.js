import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const scene = new THREE.Scene();  
const loader = new GLTFLoader();
loader.load("/models/landslide.gltf", gltf => {
  scene.add(gltf.scene);
});