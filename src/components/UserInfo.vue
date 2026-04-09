<template>
  <el-table :data="[counter.userinfo]" style="width: 100%">
    <!-- <el-table-column fixed prop="date" label="Date" width="150" /> -->
    <el-table-column prop="nickname" label="名称" width="120" />
    <el-table-column prop="identity" label="身份" width="120" />
    <el-table-column prop="city" label="城市" width="120" />
    <el-table-column prop="disaster_type" label="灾害类型" width="120" />
    <!-- <el-table-column prop="city" label="City" width="120" /> -->
    <!-- <el-table-column prop="address" label="Address" width="600" /> -->
    <!-- <el-table-column prop="zip" label="Zip" width="120" /> -->
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default>
        <el-button link type="primary" size="small" @click="handleClick">
          删除
        </el-button>
        <el-button
          link
          type="primary"
          size="small"
          plain
          @click="dialogFormVisible = true"
          >修改</el-button
        >
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="dialogFormVisible" title="Shipping address" width="500">
    <el-form :model="counter.userinfo">
      <el-form-item label="昵称" :label-width="formLabelWidth">
        <el-input v-model="counter.userinfo.nickname" autocomplete="off" />
      </el-form-item>
      <el-form-item label="城市" :label-width="formLabelWidth">
        <el-input v-model="counter.userinfo.city" autocomplete="off" />
      </el-form-item>
      <el-form-item
        v-if="counter.userinfo.isadm == 'true'"
        label="身份"
        :label-width="formLabelWidth"
      >
        <el-select
          v-model="counter.userinfo.identity"
          placeholder="Please select a zone"
        >
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
</template>
<script setup lang="js">
  import { onMounted, inject, ref, reactive, nextTick } from "vue";
  import { getAllUser } from "../api/getAllUser";
  import { useCounterStore } from "@/store/index";
  import { getinfo } from "../api/getInfo";
  // import { get_disaster_type } from "../api/get_disaster_type";
  import { edituser } from "../api/editUser";
  import { ElMessage } from "element-plus";
  const counter = useCounterStore();
  let upd = inject("reloadApp");
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

  const handleClick = () => {
    console.log("click");
  };

  let originalUserinfo;
  onMounted(async () => {
    const data = await getinfo(localStorage.getItem("username"));
    console.log(data);

    counter.userinfo = data.value;
    counter.userinfo["disaster_type"] = classfiy[counter.userinfo.value];

    originalUserinfo = JSON.parse(JSON.stringify(counter.userinfo));

    // console.log(counter.userinfo);
  });
  async function sub() {
    try {
      dialogFormVisible.value = false;

      let obj = counter.userinfo;
      obj.isadm = obj.identity == "管理员" ? "true" : "false";
      const data = await edituser(obj);
      console.log(data);
      if (data.code == 1) {
        ElMessage({
          message: "修改成功",
          type: "success",
        });
        setTimeout(() => {
          if (counter.userinfo.isadm == "false") {
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
      upd()
    }
  }
  function cancel() {
    dialogFormVisible.value = false;
    counter.userinfo = JSON.parse(JSON.stringify(originalUserinfo));
  }

  const dialogTableVisible = ref(false);
  const dialogFormVisible = ref(false);
  const formLabelWidth = "140px";
</script>
<style lang="scss" scoped></style>
