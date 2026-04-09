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
            <p @click="drawer = true" class="item_list">
              <el-icon size="35px">
                <ShoppingTrolley />
              </el-icon>
              <span>{{ shoplist.length }}</span>
            </p>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-table :data="tableData1" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column property="item_code" label="物资编号" width="120" />
          <el-table-column property="item_name" label="物资名称" width="120" />
          <el-table-column property="item_number" label="物资数量">
            <template #default="{ row }">
              <el-input-number :min="1" v-model="row.item_sele" size="large" />
              <el-button type="primary" size="default" @click="
                add({
                  item_code: row.item_code,
                  item_name: row.item_name,
                  item_sele: row.item_sele,
                })
                ">加入列表</el-button>
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
    <el-drawer :size="600" v-model="drawer" title="I am the title" :with-header="false">
      <el-table :data="shoplist" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column property="item_code" label="物资编号" width="120" />
        <el-table-column property="item_name" label="物资名称" width="120" />

        <el-table-column property="item_sele" label="物资数量">
          <template #default="{ row }">
            <el-input-number :min="1" style="padding-right: 0;" v-model="row.item_sele" size="small" />
          </template>

        </el-table-column>

        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button size="small" type="danger" @click="del(row)">
              Delete
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-button :disabled="!shoplist.length" style="width: 100%;" type="primary" @click="sub()">提交申请</el-button>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { onMounted, ref, computed, reactive, watch } from "vue";
import { Search, ShoppingTrolley } from "@element-plus/icons-vue";
import { useCounterStore } from "@/store/index";
import { get_Item } from "../api/get_item.js";
import { ElMessage } from "element-plus";
import { item_request } from '../api/item_request.js'
import { da } from "element-plus/es/locale/index.js";
const multipleSelection = ref([]);
const drawer = ref(false)
const currentPage4 = ref(1);
const pageSize4 = ref(10);
// const size = ref("default");
const background = ref(false);
const disabled = ref(false);
let isshow=ref(false)
const selectable = (row) => ![1, 2].includes(row.id);
const counter = useCounterStore();
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};
const tableData = ref([]);
const tableData2 = ref([]);
let input1 = ref("");
let state = reactive({
  page: 1,
  limit: 10,
  total: tableData.value.length,
});
let shoplist = ref(JSON.parse(localStorage.getItem('shoplist'))||[])
// watch(shoplist,(v1,v2)=>{
//   if(v2.v)
// })
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
      message:"操作成功"
    })
  }
  console.log(data);
}
function del(row){
  for (let index = 0; index < shoplist.value.length; index++) {
    if(shoplist.value[index].item_code==row.item_code){
      shoplist.value.splice(index,1)
    }
  }
  localStorage.setItem('shoplist',JSON.stringify(shoplist.value))

  
}
function add(row) {
  let idx = shoplist.value.findIndex((item) => item.item_code === row.item_code);

  if (idx === -1) {
    // Item does not exist, push it to the list
    shoplist.value.push(row);
  } else {
    // Item exists, update the selection quantity
    shoplist.value[idx].item_sele += row.item_sele;
  }
  tableData.value.map((item) => {
    if (item.item_code == row.item_code) {
      item.item_sele = 0
    }
  })
  localStorage.setItem('shoplist',JSON.stringify(shoplist.value))
  // counter.shoplist=shoplist.v
  ElMessage({
    type: "success",
    message: "添加成功"
  })

}
let tableData1 = computed(() => {
  return tableData.value.filter(
    (item, index) =>
      index < state.page * state.limit &&
      index >= state.limit * (state.page - 1)
  );
});
onMounted(async () => {
  let data = await get_Item();
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
