<template>
    <div ref="viewer" class="viewer-container"></div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount, watch } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// ---- 接收父组件传来的模型路径 ----
const props = defineProps({
    modelUrl: {
        type: String,
        required: true
    }
});

const viewer = ref(null);
let renderer, scene, camera, controls, currentModel, animationId;

// ---------------- 初始化场景 ----------------
function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    const width = viewer.value.clientWidth;
    const height = viewer.value.clientHeight;

    // 摄像机
    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(2, 2, 3);

    // 渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    viewer.value.appendChild(renderer.domElement);

    // 控制器
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 灯光
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));
    const directional = new THREE.DirectionalLight(0xffffff, 1);
    directional.position.set(5, 10, 7);
    scene.add(directional);
}

// ---------------- 加载模型 ----------------
function loadModel(url) {
  if (!url) return;

  const loader = new GLTFLoader();

  // 删除旧模型
  if (currentModel) {
    scene.remove(currentModel);
    currentModel = null;
  }

  loader.load(
    url,
    gltf => {
      const model = gltf.scene;

      // 创建容器
      const group = new THREE.Group();
      group.add(model);

      // ---------- 计算模型包围盒 ----------
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();

      box.getSize(size);
      box.getCenter(center);

      // ---------- 关键操作：把模型移到包围盒中心 ----------
      model.position.x -= center.x;
      model.position.y -= center.y;
      model.position.z -= center.z;

      // ---------- 统一缩放，使模型适配场景 ----------
      const maxAxis = Math.max(size.x, size.y, size.z);
      const desiredSize = 1.5;      // 你可以调这个值（越大模型越大）
      const scale = desiredSize / maxAxis;
      group.scale.setScalar(scale);

      // 保存引用
      currentModel = group;
      scene.add(group);

      // (可选) 让相机自动看向模型
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);
      controls.update();
    },

    xhr => console.log(`加载中: ${(xhr.loaded / xhr.total) * 100}%`),

    error => console.error("模型加载失败：", error)
  );
}



// ---------------- 动画循环 ----------------
function animate() {
    animationId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// ---------------- 自适应 ----------------
function onResize() {
    const width = viewer.value.clientWidth;
    const height = viewer.value.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// ---------------- 生命周期 ----------------
onMounted(() => {
    initScene();
    loadModel(props.modelUrl);
    animate();

    window.addEventListener("resize", onResize);
});

// 监听 modelUrl 修改，自动刷新模型
watch(
    () => props.modelUrl,
    newVal => {
        loadModel(newVal);
    }
);

onBeforeUnmount(() => {
    cancelAnimationFrame(animationId);
    window.removeEventListener("resize", onResize);
    renderer.dispose();
});
</script>

<style scoped>
.viewer-container {
    width: 100%;
    height: 100vh;
    overflow: hidden;
}
</style>
