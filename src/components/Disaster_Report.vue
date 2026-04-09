<template>
  <div class="">
    <el-container>
      <el-header>Header</el-header>
      <el-main>
        <el-form :model="form" label-width="auto" style="max-width: 600px">
          <el-form-item label="上报人：">
            <!-- <el-input v-model="form.name" /> -->
            <span>{{ counter.userinfo.nickname }}</span>
          </el-form-item>
          <el-form-item label="上报城市：">
            <!-- <el-select v-model="form.region" placeholder="please select your zone">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select> -->
            {{ counter.userinfo.city }}
          </el-form-item>
          <el-form-item label="上报时间：">
            <el-col :span="11">
              <el-date-picker v-model="form.date" value-format="YYYY-MM-DD" format="YYYY/MM/DD" type="date"
                placeholder="Pick a date" style="width: 100%" />
            </el-col>
            <!-- <el-col :span="2" class="text-center">
              <span class="text-gray-500">-</span>
            </el-col> -->
            <!-- <el-col :span="11">
              <el-time-picker v-model="form.date2" placeholder="Pick a time" style="width: 100%" />
            </el-col> -->
          </el-form-item>
          <el-form-item label="灾害类型：">
            <el-select v-model="form.type" placeholder="请选择灾害类型">
              <el-option v-for="(i, index) in classfiy" :label="i" :value="i" :key="index" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="Instant delivery">
            <el-switch v-model="form.delivery" />
          </el-form-item> -->
          <!-- <el-form-item label="Activity type">
            <el-checkbox-group v-model="form.type">
              <el-checkbox value="Online activities" name="type">
                Online activities
              </el-checkbox>
              <el-checkbox value="Promotion activities" name="type">
                Promotion activities
              </el-checkbox>
              <el-checkbox value="Offline activities" name="type">
                Offline activities
              </el-checkbox>
              <el-checkbox value="Simple brand exposure" name="type">
                Simple brand exposure
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item> -->
          <!-- <el-form-item label="Resources">
            <el-radio-group v-model="form.resource">
              <el-radio value="Sponsor">Sponsor</el-radio>
              <el-radio value="Venue">Venue</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="详细信息：">
            <el-input v-model="form.desc" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交数据</el-button>
            <el-button type="danger" @click="cancel">清空数据</el-button>
          </el-form-item>
        </el-form>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<script setup lang="js">
import { onMounted, reactive, inject, ref } from 'vue'
import { useCounterStore } from "@/store/index";
import { disaster_report } from '@/api/disaster_report';
import { getinfo } from "../api/getInfo";
import { ElMessage } from 'element-plus';
let upd = inject("reloadApp");
const counter = useCounterStore();
let nickname = ref([])
let city = ref([])
let userId = ref([])
let classfiy = ['无','台风', "暴雨", "冰雹", "海啸", "地震"]
let form = reactive({
  userId:null,
  nickname: "",
  city: "",
  date: null,
  type: "",
  desc: '',
  
})
onMounted(async () => {
  const data1 = await getinfo(localStorage.getItem("username"));
  // console.log(data1.value.nickname);
  nickname.value = data1.value.nickname
  city.value = data1.value.city
  userId.value = data1.value.userId
  form.nickname = nickname.value
  form.city = city.value
  form.userId = userId.value

})



async function onSubmit() {
  let data = await disaster_report(form)
  console.log(data)
  if(data.code==1){
    ElMessage({
      type:"success",
      message:data.msg
    })
  }
  form = {
    userId:userId.value,
    nickname: nickname.value,
    city: city.value,
    date: null,
    type: "",
    desc: '',
  }
  upd()
}
function cancel(){
  form = {
    userId:userId.value,
    nickname: nickname.value,
    city: city.value,
    date: null,
    type: "",
    desc: '',
  }
  upd()
}
</script>
<style lang="scss" scoped></style>
