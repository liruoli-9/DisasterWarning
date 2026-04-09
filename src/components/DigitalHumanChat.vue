<template>
  <div ref="live2dWrapper" class="live2d-class"></div>
</template>
<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import { useTemplateRef, onMounted } from 'vue';
import * as live2d from 'live2d-render';

const live2dWrapper = useTemplateRef('live2dWrapper')

onMounted(async () => {
  await live2d.initializeLive2D({
    // live2d 所在区域的背景颜色
    BackgroundRGBA: [0.0, 0.0, 0.0, 0.0],

    // live2d 的 model3.json 文件的相对 根目录 的路径
    ResourcesPath: '/live2d/model/haru_greeter_t05.model3.json',

    // live2d 的大小
    CanvasSize: {
      height: 360,
      width: 260
    },

    // 展示工具箱（可以控制 live2d 的展出隐藏，使用特定表情）
    ShowToolBox: true,

    // 是否使用 indexDB 进行缓存优化，这样下一次载入就不会再发起网络请求了
    LoadFromCache: true,
    CanvasId: 'digitman'
  });
  const canvas = document.getElementById('digitman')
  if (canvas && live2dWrapper.value) {
    
    live2dWrapper.value.appendChild(canvas)
    canvas.style.setProperty('position', 'relative', 'important')
  }
  console.log('finish loading');
});

</script>

<style lang="css" scoped>
  .live2d-class{
    position: relative;
    left: 6rem;
    top:2rem;
  }
</style>