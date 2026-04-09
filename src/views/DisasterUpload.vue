<!-- mockup image: /mnt/data/A_2D_digital_image_of_a_disaster_report_form_is_di.png -->
<template>
    <div class="total_layout">
        <h1>灾情上报</h1>
        <!-- 第一行：时间 / 地点 / 类型 -->
        <div class="first-row">
            <div class="first-row-item">
                <label>灾害发生时间</label>
                <DataTime style="padding:0;margin: 0;"></DataTime>
            </div>

            <div class="first-row-item">
                <label>灾害发生地点</label>
                <RegionSelects />
            </div>

            <div class="first-row-item">
                <label>灾害类型</label>
                <MySelection v-model="form.type" />
            </div>
        </div>
        <el-divider style="margin:0" />
        <!-- 第二行：上传照片 & 上传文件 -->
        <div class="second-row">
            <PictureUpload></PictureUpload>
            <el-image style="width: 140px; height: 140px" :src="policeman"  />
        </div>
        <el-divider style="margin:0" />
        <div style="width: 800px;display: flex;justify-content: center;line-height: 40px;align-items: center;">
            <label>灾情描述</label>
        </div>
        <div class="third-row">
            <el-input v-model="textarea" style="width: 800px" :rows="12" type="textarea" placeholder="Please input" />
            <FileUpload style="height: 120px;"></FileUpload>
        </div>

    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import DataTime from '@/components/DataTime.vue'
import RegionChoose from '@/components/RegionChoose.vue'
import { RegionSelects } from 'v-region'
import MySelection from '@/components/MySelection.vue'
import PictureUpload from '@/components/PictureUpload.vue'
import FileUpload from '@/components/FileUpload.vue'
import policeman from '@/assets/lp041/policeman.jpg'
const form = reactive({
    time: '',
    location: '',
    type: '',
    description: '',
    images: [],
    files: []
})

const previewImages = ref([])

function onImageUpload(e) {
    const files = Array.from(e.target.files || [])
    form.images = files
    previewImages.value = []
    files.forEach((f) => {
        const reader = new FileReader()
        reader.onload = (ev) => previewImages.value.push(ev.target.result)
        reader.readAsDataURL(f)
    })
}

function onFileUpload(e) {
    form.files = Array.from(e.target.files || [])
}

function removeFile(idx) {
    form.files.splice(idx, 1)
}

function submit() {
    // 这里应使用上传接口（示例）
    console.log('提交：', {
        time: form.time,
        location: form.location,
        type: form.type,
        description: form.description,
        images: form.images.map(f => f.name),
        files: form.files.map(f => f.name)
    })
    alert('灾情已成功上报！')
}


</script>

<style scoped>
/* 小量自定义，使外观更接近示例图 */
body {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}

h1 {
    line-height: 40px;
    height: 40px;
}

.first-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    flex-wrap: wrap;
    line-height: 50px;
}
.second-row {
   line-height: 60px;
   display: flex;
}
.first-row-item {
    display: flex;
    align-items: center;
}

.third-row {
    display: flex;
    line-height: 80px;
    gap: 5rem;
    justify-content: flex-end;
}


.total_layout {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    width: 100%;
    height: 100%;
    left:5rem;
}
</style>