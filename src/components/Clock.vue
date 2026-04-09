<template>
  <div id="clock" class="light">
    <div class="display">
      <div class="weekdays">
        <!-- 使用 v-for 来显示星期几 -->
        <span
          v-for="(day, index) in weekdays"
          :key="index"
          :class="{ active: day.isActive }"
        >
          {{ day.name }}
        </span>
      </div>
      <div class="time-container">
        <div class="digits">{{ currentTime }}</div>
        <div class="ampm">{{ ampm }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import moment from "moment";

// 状态管理
const weekdays = ref([
  { name: "MON", isActive: false },
  { name: "TUE", isActive: false },
  { name: "WED", isActive: false },
  { name: "THU", isActive: false },
  { name: "FRI", isActive: false },
  { name: "SAT", isActive: false },
  { name: "SUN", isActive: false },
]);

const currentTime = ref("");
const ampm = ref("");

// 初始化时钟
const updateClock = () => {
  const now = moment();
  currentTime.value = now.format("hh:mm:ss");
  ampm.value = now.format("A");

  // 更新星期几的活动状态
  const currentDay = now.format("ddd").toUpperCase();
  weekdays.value.forEach((day) => {
    day.isActive = day.name === currentDay;
  });
};

onMounted(() => {
  updateClock();
  const interval = setInterval(updateClock, 1000);

  onUnmounted(() => clearInterval(interval));
});
</script>

<style scoped>
/* 自定义时钟样式 */
#clock {
  position: relative;
  width: 200px; /* 调整宽度以匹配目标尺寸 */
  height: 53px; /* 调整高度以匹配目标尺寸 */
  margin: auto;
  padding: 5px; /* 缩小边框内边距 */
  border-radius: 5px; /* 缩小边框半径 */
  background-color: #333; /* 背景色 */
  color: #fff;
  text-align: center;
  font-family: "Arial", sans-serif;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

.display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%; /* 确保内部元素适应容器宽度 */
  height: 100%; /* 确保内部元素适应容器高度 */
  padding: 1px;
  border-radius: 4px;
}

/* 时间和AM/PM容器样式 */
.time-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 星期几样式 */
.weekdays {
  display: flex;
  justify-content: center;
  margin-bottom: 2px; /* 缩小上下间距 */
  font-size: 10px; /* 调整字体大小 */
}

.weekdays span {
  margin: 0 2px; /* 缩小间距 */
  font-size: 9px; /* 进一步缩小字体大小以适应容器 */
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.weekdays span.active {
  opacity: 1;
  font-weight: bold;
}

/* AM/PM 样式 */
.ampm {
  margin-top: 15px;
  font-size: 9px; /* 调整字体大小 */
  margin-left: 9px; /* 调整左边距，与时间保持一些间距 */
}

/* 数字时间显示样式 */
.digits {
  margin-top: 10px;
  font-size: 16px; /* 进一步缩小时间的字体大小 */
  font-weight: bold;
  letter-spacing: 0.5px; /* 调整字符间距 */
}

/* 移除多余的样式 */
* {
  margin: 0;
  padding: 0;
}

body {
  font: 15px/1.3 Arial, sans-serif;
  color: #4f4f4f;
  z-index: 1;
}

html {
  overflow: hidden;
}

#clock.light {
  background-color: #f3f3f3;
  color: #272e38;
}

#clock.light .display {
  background-color: #dddddd;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08) inset, 0 1px 1px #fafafa;
}
</style>
