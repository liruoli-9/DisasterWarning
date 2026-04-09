<template>
  <div class="login_bg">
    <div class="login_form">
      <h2 class="title">欢迎使用兰新客专灾害预警系统</h2>
      <div class="form-row">
        <label>用户名</label>
        <input type="text" v-model="loginForm.username" style="width: 250px;height: 30px;" />
      </div>
      <div class="form-row">
        <label>密码 </label>
        <input type="password" v-model="loginForm.password" style="width: 250px;height: 30px;"/>
      </div>
      <div class="form-row">
        <button @click="handleLogin" :loading="loading" class="button_style">
        登录
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/authService'

const router = useRouter()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  loading.value = true

  try {
    const res = await login(loginForm)

    if (res.code === 200) {
      // 保存 token
      localStorage.setItem('token', res.data.token)


      ElMessage.success('登录成功')
      router.push('/home')
    }
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}
</script>



<style>
h2{
  height: 120px;
  line-height: 120px;
}
.form-row {
  height: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.label {
  width: 40px;
}

.button_style {
  width: 200px;
  padding: 12px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.login_bg {
  width: 100%;
  height: 100%;
  background-image: url('../assets/img/loginback.png');
  background-color: #0f193d;
  background-repeat: no-repeat;
  background-size: cover;
}

.login_form {
  width: 400px;
  height: 550px;
  background-color: #F5F5F5;
  position: absolute;
  left:60%;
  top: 20%;
  border-radius: 20px;
}

.title {
  text-align: center;
}
</style>
