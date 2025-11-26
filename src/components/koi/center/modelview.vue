<template>
    <div ref="sceneContainer" class="scene-container"></div>
  </template>
  
  <script>
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  
  export default {
    name: 'ModelViewer',
    mounted() {
      this.initThree();
      this.loadModel();
    },
    methods: {
      initThree() {
        // 创建场景
        this.scene = new THREE.Scene();
  
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
  
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true, // 用于设置透明度
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio); // 增加渲染清晰度
        this.renderer.setClearColor(0x000000, 0); // 设置背景
        this.$refs.sceneContainer.appendChild(this.renderer.domElement);
  
        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(ambientLight);
  
        // 添加点光源
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);

      //   // 添加多个点光源
      // const pointLight1 = new THREE.PointLight(0xffffff, 1);
      // pointLight1.position.set(10, 10, 10);
      // this.scene.add(pointLight1);

      // const pointLight2 = new THREE.PointLight(0xffffff, 1);
      // pointLight2.position.set(-10, 10, 10);
      // this.scene.add(pointLight2);

      // const pointLight3 = new THREE.PointLight(0xffffff, 1);
      // pointLight3.position.set(10, -10, 10);
      // this.scene.add(pointLight3);

  
        // 创建OrbitControls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true; // 启用阻尼效果
        this.controls.dampingFactor = 0.25; // 阻尼系数
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 500;
        this.controls.maxPolarAngle = Math.PI / 2;
  
        // 开始动画循环
        this.animate = this.animate.bind(this); // 确保 animate 方法正确绑定 this
        this.animate();
      },
      loadModel() {
        // 创建GLTF加载器
        const loader = new GLTFLoader();
  
        // 加载GLB/GLTF模型
        loader.load( 
          // 'https://edu-ljc.oss-cn-nanjing.aliyuncs.com/3d/shaimai01.glb',
          // 'https://edu-ljc.oss-cn-nanjing.aliyuncs.com/hongshui01.glb',
          // 'https://edu-ljc.oss-cn-nanjing.aliyuncs.com/hongshui.glb', // 替换为你的模型路径
          // 'https://edu-ljc.oss-cn-nanjing.aliyuncs.com/Water%20cycle.glb',
          // 'https://edu-ljc.oss-cn-nanjing.aliyuncs.com/2024/05/glbfile.glb',
          'https://edu-ljc.oss-cn-nanjing.aliyuncs.com/3d/hongshui02.glb',
          gltf => {
            // 将模型添加到场景中
            // 
            gltf.scene.scale.set(0.4, 0.4, 0.4);
        gltf.scene.traverse(function(child) {
            if (child.isMesh && child.material.isMeshStandardMaterial) {
                child.material.emissive = child.material.color;
                child.material.emissiveMap = child.material.map;            
            }
        
        });
        // 存储动画混合器
        this.mixer = new THREE.AnimationMixer(gltf.scene); // 新增的代码

        // 创建动画动作
        gltf.animations.forEach(clip => {
          this.mixer.clipAction(clip).play(); // 新增的代码
        });
          this.scene.add(gltf.scene);
          },
          xhr => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
          error => {
            console.error('An error happened', error);
          }
        );
      },
      animate() {
        requestAnimationFrame(this.animate);
  
        // 更新控制器
        this.controls.update();
  
        // 在这里添加任何需要的动画逻辑
        // 更新混合器以播放动画（如果存在）
      if (this.mixer) { // 新增的代码
        this.mixer.update(0.01); // 新增的代码，根据需要调整时间步长
      }

  
        this.renderer.render(this.scene, this.camera);
      }
    }
  };
  </script>
  
  <style>
  .scene-container {
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
  </style>
  