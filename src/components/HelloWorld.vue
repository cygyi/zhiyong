<script setup>
import {onMounted, ref} from 'vue'
import {message} from "ant-design-vue";
import {useRoute, useRouter} from 'vue-router'

const userName = ref('admin')
const passWord = ref('')
const loading = ref(false)
const router = useRouter()
const route = useRoute()

onMounted(() => {
  const isLogin = localStorage.getItem('isLogin') || ''

  if (isLogin === 'true') {
    router.push({
      path: '/calculate',
    })
  }
})

const Login = () => {
  if (passWord.value === '123456') {
    // 跳转
    loading.value = true
    setTimeout(() => {
      loading.value = false
      localStorage.setItem('isLogin', 'true')
      router.push({
        path: '/calculate',
      })
    }, 1000)
  } else {
    // 密码错误
    message.error('密码错误')
  }
}
</script>

<template>
  <div class="body">
    <div class="content">
      <a-card title="登录">
        <a-space direction="vertical">
          <a-input v-model:value="userName" disabled placeholder="Basic usage" size="large"/>
          <a-input-password v-model:value="passWord" placeholder="请输入密码" size="large"/>
          <a-button :loading="loading" size="large" type="primary" @click="Login">确认登录</a-button>
        </a-space>
      </a-card>
    </div>
  </div>
</template>

<style scoped>
.body {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  width: 500px;
  text-align: center;
}
</style>
