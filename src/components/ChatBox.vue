<script setup lang="ts">
const avatarSize = '48px';
const avatarAI =
  'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 4px;margin-bottom: 4rem;margin-left:1rem">
    <Bubble
      content="欢迎使用 element-plus-x。"
      typing
      :avatar="avatarAI"
      :avatar-size="avatarSize"
      no-style
    >
      <template #content>
        <div class="content-container">
          欢迎适用兰新客专灾害预警系统
        </div>
      </template>
    </Bubble>

    <Bubble :avatar-size="avatarSize" typing no-style variant="borderless">
      <template #header>
        <div class="content-container-header">
          获取最新的灾情信息
        </div>
      </template>
      <template #content>
        <div class="content-borderless-container">
          🥤 近几日灾情怎么样？
        </div>
      </template>
    </Bubble>

    <Bubble :avatar-size="avatarSize" typing no-style variant="borderless">
      <template #content>
        <div class="content-borderless-container">
          💌 未来几天局部发生滑坡的概率？
        </div>
      </template>
    </Bubble>

    <Bubble :avatar-size="avatarSize" typing no-style variant="borderless">
      <template #content>
        <div class="content-borderless-container">
          🔥 遇到泥石流如何应急防护？
        </div>
      </template>
    </Bubble>
  </div>
</template>

<style scoped>
.content-container {
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-top:35px;
  margin-left:20px;
}

.content-container-header {
  font-size: 16px;
  color: white;
}

.content-borderless-container {
  user-select: none;
  padding: 12px;
  cursor: pointer;
  font-size:14px;
  color:white;
  transition: background-color 0.3s;
  &:hover {
    background-color: #ebeef5;
  }
}
</style>