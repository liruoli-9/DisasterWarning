<template>
  <el-select v-model="value" placeholder="Select" style="width: 240px">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')

const options = [
  {
    value: 'Option1',
    label: '洪水',
  },
  {
    value: 'Option2',
    label: '滑坡',
  },
  {
    value: 'Option3',
    label: '泥石流',
  },
]
</script>