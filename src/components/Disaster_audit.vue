<template>
  <div class="app">
    <el-container>
      <el-header>
        <el-row>
          <el-col style="height: 60px;" :span="20">
            <el-input v-model="input1" style="width: 240px" size="large" placeholder="Please Input" />
            <span class="search"><el-icon @click="search()" size="20px">
                <Search />
              </el-icon></span>
          </el-col>
          <el-col style="height: 60px;" class="right" :span="4">

          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-table :data="tableData1" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="index" label="序号" width="120" />
          <el-table-column property="report_usernickname" label="上报人" width="120" />
          <el-table-column property="report_city" label="上报城市" width="120" />
          <el-table-column property="report_date" label="上报日期" width="120" />
          <el-table-column property="disaster_type" label="灾害类型" />
          <el-table-column property="audit_state" label="审核状态" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button size="small" type="danger" @click="confirm(row)" :disabled="row.audit_state == '已审核'||row.audit_state == '审核失败'">
                审核通过
              </el-button>
              <el-button size="small" type="danger" @click="cancel(row)" :disabled="row.audit_state == '已审核'||row.audit_state == '审核失败'">
                审核失败
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="demo-pagination-block">
          <!-- <div class="demonstration">All combined</div> -->
          <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4"
            :page-sizes="[10, 20, 30, 40]" :disabled="disabled" :background="background"
            layout="total, sizes, prev, pager, next, jumper" :total="state.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
      </el-main>
      <!-- <el-footer>
        
      </el-footer> -->
    </el-container>

  </div>
</template>
<script setup lang="js">
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { onMounted, ref, computed, reactive, inject } from "vue";
import { Search, ShoppingTrolley } from "@element-plus/icons-vue";
import { useCounterStore } from "@/store/index";

import { ElMessage } from "element-plus";



import { item_allocation } from "@/api/item_allocation.js";
import { getinfo } from "@/api/getInfo.js";
import { get_disasterReport } from "@/api/get_disasterReport.js";
import { disaster_audit } from "@/api/disaster_audit.js";

const multipleSelection = ref([]);
const drawer = ref(false)
const currentPage4 = ref(1);
const pageSize4 = ref(10);

const background = ref(false);
const disabled = ref(false);
const selectable = (row) => ![1, 2].includes(row.id);
const counter = useCounterStore();
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};
let upd = inject("reloadApp");
const tableData = ref([]);
const tableData2 = ref([]);
let input1 = ref("");
let state = reactive({
  page: 1,
  limit: 10,
  total: tableData.value.length,
});
let shoplist = ref([])


function search() {

  let arr = tableData2.value.filter((item) => {
    return item.item_name.includes(input1.value);
  });
  if (arr.length != 0) {
    tableData.value = arr
  } else {
    ElMessage({
      type: "error",
      message: "不存在该物资"
    })
    tableData.value = tableData2.value
  }
  input1.value = "";
}

const handleCurrentChange = (e) => {
  state.page = e;
};
//改变页数限制
const handleSizeChange = (e) => {
  state.limit = e;
};

async function confirm(row) {
  let data = await disaster_audit({ "report_code": row.report_code, "audit_state": "已审核" })
  console.log(data)
  if (data.code == 1) {
    ElMessage({
      type: 'success',
      message: "操作成功"
    })
    upd()
  }

}
async function cancel(row) {
  let data = await disaster_audit({ "report_code": row.report_code, "audit_state": "审核失败" })
  console.log(data)
  if (data.code == 1) {
    ElMessage({
      type: 'success',
      message: "操作成功"
    })
    upd()
  }

}

let tableData1 = computed(() => {
  return tableData.value.filter(
    (item, index) =>
      index < state.page * state.limit &&
      index >= state.limit * (state.page - 1)
  );
});
onMounted(async () => {
  // console.log(counter.userinfo.userId);
  const data1 = await getinfo(localStorage.getItem("username"));

  let data = await get_disasterReport();


  console.log(data);

  tableData2.value = data.value.sort((a, b) => {
    return a.request_userId - b.request_userId;
  });
  tableData.value = data.value.sort((a, b) => {
    return a.request_userId - b.request_userId;
  });
  state = reactive({
    page: 1,
    limit: 10,
    total: tableData.value.length,
  });
  // console.log(data);
});
</script>
<style lang="scss" scoped>
header {
  background-color: skyblue;
}

main {
  background-color: bisque;
}

.el-input-number {
  height: 31px;
  padding-right: 10px;
}

.el-pagination {
  height: 50px;
}

.el-col {
  padding-top: 20px;
  display: flex;
  align-items: center;
  font-size: 25px;
}

.search {
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 39px;
  border-radius: 0 10px 10px 0;
}

.right {
  display: flex;

  justify-content: center;
}

.item_list {
  width: 70px;
  height: 70px;
  border-radius: 20px;
  background-color: rgb(183, 255, 0);
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: relative;

  span {
    width: 20px;
    height: 20px;
    border-radius: 50px;
    font-size: 10px;
    position: absolute;
    top: 10px;
    right: 0px;
    background-color: red;
    color: white;
  }
}
</style>
