<script setup>
    import { onMounted, onUnmounted } from "vue";
    import AMapLoader from "@amap/amap-jsapi-loader";
    
    let map = null;
    //图层
    let traffic = null;
    
    onMounted(() => {
      window._AMapSecurityConfig = {
        securityJsCode: "6fb41a5b71c2e6fc3d849737f417e23c",
      };
      AMapLoader.load({
        key: "b15405e34cfe7e7c56ab9af861ce5c88", // 申请好的Web端开发者Key，首次调用 load 时必填首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.Scale", "AMap.ToolBar", "AMap.ControlBar", "AMap.HawkEye"], //需要使用的的插件列表
      })
        .then((AMap) => {
          const layer = new AMap.createDefaultLayer({
            zooms: [3, 20], //可见级别
            visible: true, //是否可见
            opacity: 1, //透明度
            zIndex: 0, //叠加层级
          });
          map = new AMap.Map("container", {
            // 设置地图容器id
            viewMode: "2D", // 是否为3D地图模式
            zoom: 11, // 初始化地图级别
            center: [116.397428, 39.90923], // 初始化地图中心点位置
          });
    
          traffic = new AMap.TileLayer.Traffic({
            autoRefresh: true, //是否自动刷新，默认为false
            interval: 180, //刷新间隔，默认180s
          });
          map.add(traffic); //通过add方法添加图层
          console.log(traffic);
    
          // 添加比例尺
          const scale = new AMap.Scale({
            position: "LB", //左下角
          });
          map.addControl(scale);
    
          // 添加工具条
          const toolBar = new AMap.ToolBar({
            position: {
              right: "40px",
              top: "105px",
            },
          });
          map.addControl(toolBar);
    
          // 添加方向盘
          const controlBar = new AMap.ControlBar({
            position: {
              right: "10px",
              top: "10px",
            },
            showControlButton: true, //显示倾斜、旋转按钮
          });
          map.addControl(controlBar);
    
          // 添加鹰眼
          const hawkEye = new AMap.HawkEye({
            opened: true, // 默认展开
            position: "RB", // 右上角
            width: "200px",
            height: "150px",
          });
          map.addControl(hawkEye);
        })
        .catch((e) => {
          console.log(e);
        });
    });
    onUnmounted(() => {
      map?.destroy();
    });
    </script>
    
    <template>
      <div id="container"></div>
      <div class="traffic-btn">
        <button @click="traffic.show()">显示交通图层</button>
        <button @click="traffic.hide()">隐藏交通图层</button>
      </div>
    </template>
    
    <style>
    #container {
      width: 100%;
      height: 650px;
    }
    </style>
    
    