<template>
  <div id="Home">
    <el-button type="info" @click="loginOut">退出</el-button>
  </div>
</template>

<script>
  export default {
    name: "Home",
    methods: {
      loginOut() {
        //清除sessionStorage
        window.sessionStorage.clear();
        //编程式导航到‘/login’页面
        this.$router.push('/login');
      }
    }
  }
</script>

<style scoped>

</style>
