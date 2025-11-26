<template>
  <el-row :gutter="1">
    <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
      <el-button @click="taggle" type="primary" :icon="Plus">添加用户</el-button>
    </el-col>
  </el-row>

  <el-table v-if="isshow" :data="counter.alluser" style="width: 100%">
    <!-- <el-table-column fixed prop="date" label="Date" width="150" /> -->
    <el-table-column prop="nickname" label="名称" width="120" />
    <el-table-column prop="identity" label="身份" width="120" />
    <el-table-column prop="city" label="城市" width="120" />
    <el-table-column prop="disaster_type" label="灾害类型" width="120" />
    <!-- <el-table-column prop="city" label="City" width="120" /> -->
    <!-- <el-table-column prop="address" label="Address" width="600" /> -->
    <!-- <el-table-column prop="zip" label="Zip" width="120" /> -->
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default="{ row }">
        <el-button link type="primary" size="small" @click="deletebtn(row)">
          删除
        </el-button>
        <el-button link type="primary" size="small" plain @click="edit(row)">修改</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="dialogFormVisible" title="Shipping address" width="500">
    <el-form :model="counter.nowuser">
      <el-form-item label="昵称" :label-width="formLabelWidth">
        <el-input v-model="counter.nowuser.nickname" autocomplete="off" />
      </el-form-item>
      <el-form-item label="城市" :label-width="formLabelWidth">
        <el-input v-model="counter.nowuser.city" autocomplete="off" />
      </el-form-item>
      <el-form-item v-if="counter.userinfo.isadm == 'true'" label="身份" :label-width="formLabelWidth">
        <el-select v-model="counter.nowuser.identity" placeholder="Please select a zone">
          <el-option label="普通用户" value="普通用户" />
          <el-option label="管理员" value="管理员" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="sub"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>

  <el-form v-if="!isshow" :model="form" label-width="auto" style="max-width: 600px">
    <el-form-item label="昵称">
      <el-input v-model="form.nickName" />
    </el-form-item>
    <el-form-item label="用户名">
      <el-input v-model="form.userName" />
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="form.passWord" />
    </el-form-item>
    <el-form-item label="城市">
      <el-input v-model="form.city" />
    </el-form-item>
    <el-form-item label="身份">
      <el-select v-model="form.identity" placeholder="请选择身份">
        <el-option label="管理员" value="管理员" />
        <el-option label="普通用户" value="普通用户" />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button @click="can_add">Cancel</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup lang="js">
import { Plus } from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
import {
  onMounted,
  provide,
  ref,
  reactive,
  nextTick,
  inject,
  watch,
} from "vue";
import { getAllUser } from "../api/getAllUser";
import { useCounterStore } from "@/store/index";
import { getinfo } from "../api/getInfo";
import { register } from "../api/register";
// import { get_disaster_type } from "../api/get_disaster_type";
import { edituser } from "../api/editUser";
import { deleteInfo } from "../api/deleteInfo";
import { getAllCity } from "../api/getAllCity";
import { ElMessage } from "element-plus";
// import { fa } from "element-plus/es/locale";
const counter = useCounterStore();
let upd = inject("reloadApp");

let $router = useRouter();
let isshow = ref(true);
let classfiy = [
  "无",
  "台风",
  "无",
  "暴雨",
  "无",
  "冰雹",
  "无",
  "海啸",
  "无",
  "地震",
  "无",
];

const form = reactive({
  nickName: "",
  userName: "",
  passWord: "",
  city: "",
  identity: "",
  isadm: "",
});

watch(
  () => counter.nowuser,
  (newValue, oldValue) => {
    // console.log(newValue, oldValue);
    // console.log(newValue.identity)
    counter.nowuser.isadm = newValue.identity == "管理员" ? "true" : "false";
    console.log(counter.nowuser.isadm);
  },
  { deep: true }
);

async function deletebtn(row) {
  let data = await deleteInfo(row.userId);
  console.log(data);
  if (data.code == 1) {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    setTimeout(() => {
      upd();
    }, 500);
  }
}
function taggle() {
  isshow.value = false;
}

async function onSubmit() {
  isshow.value = true;
  try {
    const data = await register(form);
    console.log(form)
    console.log(data);

    if (data.code === 1) {
      ElMessage({
        message: "添加成功",
        type: "success",
      });
      // 推荐用更优雅的方式刷新数据而不是重载页面
      setTimeout(() => {
        // 这里可以调用更新数据的函数
        // location.reload()
        upd();
      }, 500);
    } else {
      ElMessage({
        message: "添加失败",
        type: "error",
      });
    }
  } catch (error) {
    ElMessage({
      message: `发生错误: ${error.message}`,
      type: "error",
    });
  } finally {
    isshow.value = false;
  }
}

function can_add() {
  isshow.value = true;
}

let originalUserinfo;
onMounted(async () => {
  const data = await getAllUser();
  const data1 = await getinfo(localStorage.getItem("username"));
  counter.alluser = data.value;
  counter.userinfo = data1.value;

  originalUserinfo = JSON.parse(JSON.stringify(counter.alluser));
});
async function sub() {
  try {
    dialogFormVisible.value = false;
    let obj = counter.nowuser;
    obj.isadm = obj.identity == "管理员" ? "true" : "false";
    const data = await edituser(obj);
    console.log(data);
    if (data.code == 1) {
      ElMessage({
        message: "修改成功",
        type: "success",
      });
      if (
        counter.nowuser.userId == counter.userinfo.userId &&
        counter.nowuser.isadm == "false"
      ) {
        $router.push("/userinfo");
      }
      // console.log(counter.userinfo.isadm);

      setTimeout(() => {
        if (
          counter.nowuser.userId == counter.userinfo.userId &&
          counter.userinfo.isadm == "false"
        ) {
          location.reload();
        } else {
          upd();
        }
      }, 500);
    }
  } catch (error) {
    ElMessage({
      message: `发生错误: ${error.message}`,
      type: "error",
    });
    upd();
  }
}
function cancel() {
  dialogFormVisible.value = false;
  counter.alluser = JSON.parse(JSON.stringify(originalUserinfo));
}
function edit(row) {
  console.log(counter.userinfo);

  dialogFormVisible.value = true;
  // let arr=[]
  for (const element of counter.alluser) {
    console.log(element.userId);
    if (row.userId == element.userId) {
      counter.nowuser = element;
    }
  }
}

const dialogTableVisible = ref(false);
const dialogFormVisible = ref(false);
const formLabelWidth = "140px";
</script>
<style lang="scss" scoped>
.el-row div {
  button {
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
</style>
