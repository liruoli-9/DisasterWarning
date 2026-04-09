<template>
  <div class="request_view">
    <el-container>
      <el-header style="background-color: #9BB4C0;">
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
      <el-main style="background-color: #EEEEEE;">
        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column property="item_code" label="物资编号" width="120" />
          <el-table-column property="item_name" label="物资名称" width="120" />
          <el-table-column property="item_request_number" label="申请数量"/>
          <el-table-column property="request_state" label="分配状态"/>
          <el-table-column label="操作">
          <template #default="{ row }">
            <el-button size="small" type="danger" @click="del(row)">
              Delete
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
import { onMounted, ref, computed, reactive,inject } from "vue";
import { Search, ShoppingTrolley } from "@element-plus/icons-vue";
import { useCounterStore } from "@/store/index";
import { get_Item } from "../api/get_item.js";
import { ElMessage } from "element-plus";
import { item_request } from '../api/item_request.js'

import { get_myRequest } from "@/api/get_myRequest.js";
import { getinfo } from "@/api/getInfo.js";
import { delete_request } from "@/api/delete_request.js";
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
  if(arr.length!=0){
    tableData.value=arr
  }else{
    ElMessage({
      type:"error",
      message:"不存在该物资"
    })
    tableData.value=tableData2.value
  }
  // if(input1.value==""){
  //   tableData.value=arr
  // }
  input1.value = "";
}

const handleCurrentChange = (e) => {
  state.page = e;
};
//改变页数限制
const handleSizeChange = (e) => {
  state.limit = e;
};
async function sub() {
  // console.log(shoplist.value);
  let obj = {
    "user_Id": counter.userinfo.userId,
    "user_Nickname": counter.userinfo.nickname,
    "city": counter.userinfo.city,
    "data": shoplist.value
  }
  let data = await item_request(obj)
  if(data.code==1){
    ElMessage({
      type:"success",
      message:data.msg
    })
  }
  console.log(data);
}
async function del(row){

  let data=await delete_request(row.request_Id)
  console.log(data);
  if(data.code==1){
    ElMessage({
      type:"success",
      message:"删除成功"
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
  tableData.value = [
      {
        request_Id: 1,
        item_code: "MAT001",
        item_name: "医用口罩",
        item_request_number: 100,
        request_state: "已分配"
      },
      {
        request_Id: 2,
        item_code: "MAT002",
        item_name: "防护服",
        item_request_number: 50,
        request_state: "待分配"
      },
      {
        request_Id: 3,
        item_code: "MAT003",
        item_name: "消毒液",
        item_request_number: 30,
        request_state: "已分配"
      },
      {
        request_Id: 4,
        item_code: "MAT004",
        item_name: "医用手套",
        item_request_number: 200,
        request_state: "审核中"
      },
      {
        request_Id: 5,
        item_code: "MAT005",
        item_name: "体温计",
        item_request_number: 15,
        request_state: "已分配"
      },
      {
        request_Id: 6,
        item_code: "MAT006",
        item_name: "呼吸机",
        item_request_number: 2,
        request_state: "待分配"
      },
      {
        request_Id: 7,
        item_code: "MAT007",
        item_name: "血氧仪",
        item_request_number: 10,
        request_state: "已分配"
      },
      {
        request_Id: 8,
        item_code: "MAT008",
        item_name: "急救包",
        item_request_number: 25,
        request_state: "审核中"
      }
    ];
  const data1 = await getinfo(localStorage.getItem("username"));
  
  let data = await get_myRequest(data1.value.userId);
  
  
  console.log(data);
  
  tableData2.value=data.value.sort((a, b) => {
    return a.item_code - b.item_code;
  });
  tableData.value = data.value.sort((a, b) => {
    return a.item_code - b.item_code;
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
.request_view{
  height: 100%;
}
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
