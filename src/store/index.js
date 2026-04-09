// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => {
    return { 
      nickname: "",
      isadm: false,
      citydata:[],
      zaihailist:[],
      userinfo:{
        "nickname":"",
        "city":'',
        "isadm":'',
        "identity":"",
        "value":'',
        "userId":''
      },
      alluser:[],
      nowuser:{
        "nickname":"",
        "city":'',
        "isadm":'',
        "identity":"",
        "userId":''
      },
    }
  },
  actions:{
    isshow(){
      return this.userinfo.isadm=='true'
    }
  },
  getters:{
    show_manage(){
      return this.isadm
    }
  },

})