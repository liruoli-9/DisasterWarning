<template>
  <div class="">
    <el-container>
      <el-header>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="tit">省份：</div>
            <el-select
              v-model="value"
              placeholder="Select"
              style="width: 200px"
            >
              <el-option label="全部数据" value="-1"></el-option>

              <el-option
                v-for="item in provine"
                :key="item.area_id"
                :label="item.name"
                :value="item.area_id"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <div class="tit">城市：</div>
            <el-select
              v-model="value1"
              placeholder="Select"
              style="width: 200px"
            >
              <el-option
                v-for="item in city1"
                :key="item.area_id"
                :label="item.name"
                :value="item.area_id"
              />
            </el-select>
          </el-col>
          <!-- <el-col :span="6">
            <div class="tit1">灾害类型：</div>
            <el-select
              v-model="value"
              placeholder="Select"
              style="width: 200px"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col> -->
          <el-col :span="6">
            <el-input
              v-model="input1"
              style="width: 240px"
              size="large"
              placeholder="Please Input"
            />
            <span class="search"
              ><el-icon @click="search()" size="20px"> <Search /> </el-icon
            ></span>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column fixed type="index" label="序号" width="150" />
          <el-table-column prop="p_name" label="省份" width="120" />
          <el-table-column prop="name" label="城市" width="120" />
          <el-table-column prop="type" label="灾害类型" width="600" />
          <el-table-column fixed="right" label="Operations" min-width="120">
            <template #default>
              <el-button link type="primary" size="small" @click="handleClick">
                Detail
              </el-button>
              <el-button link type="primary" size="small">Edit</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="demo-pagination-block">
          <!-- <div class="demonstration">All combined</div> -->
          <el-pagination
            v-model:current-page="currentPage4"
            v-model:page-size="pageSize4"
            :page-sizes="[10, 20, 30, 40]"
            :disabled="disabled"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="state.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch, reactive, computed } from "vue";
  import { Search } from "@element-plus/icons-vue";
  import { getProvince } from "../api/getProvince";
  import { getAllCity } from "../api/getAllCity";
  import { useCounterStore } from "@/store/index";
  import { it } from "element-plus/es/locale";
  const counter = useCounterStore();
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
  const value = ref("");
  const value1 = ref("");

  let input1 = ref("");

  let provine = ref([]);
  let city = ref([]);
  let city1 = ref([]);
  let city2 = ref([]);

  const currentPage4 = ref(1);
  const pageSize4 = ref(10);
  // const size = ref("default");
  const background = ref(false);
  const disabled = ref(false);

  let state = reactive({
    page: 1,
    limit: 10,
    total: city2.value.length,
  });

  const handleCurrentChange = (e) => {
    state.page = e;
  };
  //改变页数限制
  const handleSizeChange = (e) => {
    state.limit = e;
  };
  const handleClick = () => {
    console.log("click");
  };
  let search = () => {
    console.log(1);
    let arr = city.value.filter((item) => {
      return (
        item.name.includes(input1.value) &&
        item.parent_id !== 0 &&
        item.parent_id <= 35
      );
    });
    city2.value = arr;
    value.value = value1.value = "";
    input1.value=''
  };

  let tableData = computed(() => {
    return city2.value.filter(
      (item, index) =>
        index < state.page * state.limit &&
        index >= state.limit * (state.page - 1)
    );
  });

  watch(value, (newval, oldval) => {
    if (newval != "") {
      if (newval == "-1") {
        let arr = [];
        for (const element of city.value) {
          if (element.parent_id != 0) {
            arr.push(element);
          }
        }
        city1.value = [];
        city2.value = arr;
        // value1.value=""
      } else {
        console.log(newval);
        let arr = [];
        for (const element of city.value) {
          if (element.parent_id == newval) {
            arr.push(element);
          }
        }
        city1.value = arr;
        city2.value = arr;
      }

      value1.value = "";
      // city1.value = arr;
      // city2.value = arr;
      state = reactive({
        page: 1,
        limit: 10,
        total: city2.value.length,
      });
    }
  });
  watch(value1, (newval, oldval) => {
    let arr = [];
    if (newval != "") {
      for (const element of city.value) {
        if (element.area_id == newval) {
          arr.push(element);
        }
      }
      city2.value = arr;
    }
  });

  onMounted(async () => {
    let data = await getProvince();
    let data1 = await getAllCity();
    // console.log(data);
    if (data.code == 1) {
      provine.value = data.value;
    }
    if (data1.code == 1) {
      // city.value = data1.value;
      city.value = data1.value.filter((item)=>{
        return item.parent_id<=35
      });
    }
    // console.log(city.value);
    

    for (const element of city.value) {
      let obj = element;
      for (const element1 of provine.value) {
        if (element.parent_id == element1.area_id) {
          obj["p_name"] = element1.name;
          obj["type"] = classfiy[obj.value];
          city2.value.push(obj);
        }
      }
    }
    // console.log(city2.value);
    state = reactive({
      page: 1,
      limit: 10,
      total: city2.value.length,
    });
  });
</script>
<style lang="scss" scoped>
  header {
    background-color: skyblue;
  }
  footer {
    background-color: greenyellow;
  }
  main {
    background-color: bisque;
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
  .el-col {
    padding-top: 20px;
    display: flex;
    align-items: center;
    font-size: 25px;

    .tit {
      width: 100px;
    }
    .tit1 {
      width: 250px;
    }
  }
</style>
