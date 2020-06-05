<template>
  <div id="Login" class="login_container">
    <div class="login_box">
      <!--      头部区域-->
      <div class="avatar_box">
        <img src="../assets/img/logo.png" alt="404"/>
      </div>
      <!--      表单区域-->
      <el-form class="login_form" ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input placeholder="请输入用户账号" v-model="loginForm.username">
            <i slot="prefix" class="icon iconfont icon-portrait"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="请输入用户密码" type="password" v-model="loginForm.password">
            <i slot="prefix" class="icon iconfont icon-iconset0114"></i>
          </el-input>
        </el-form-item>
        <!--          按钮区域-->
        <div class="btn">
          <el-button type="info" @click="resetForm">重置</el-button>
          <el-button type="primary" @click="login">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        //这是登录表单的数据绑定 对象
        loginForm: {
          "username": "admin",
          "password": "123456",
        },
        //表单数据校验对象
        loginFormRules: {
          //验证用户名是否合法
          username: [
            {required: true, message: '请输入用户名称', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入用户密码', trigger: 'blur'},
            {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {

      /**
       * 重置表单数据
       */
      resetForm() {
        // console.log(this)
        this.$refs.loginFormRef.resetFields();
      },
      /**
       * 发送登录请求
       */
      login() {
        this.$refs.loginFormRef.validate(async valid => {
          //预校验
          if (!valid) return
          const {data: res} = await this.$http.post('login', this.loginForm);
          if (res.meta.status === 200) {
            this.$message.success(`${res.meta.msg}`)
          } else {
            this.$message.error(`${res.meta.msg}`)
          }
          //获取token并保存在sessionStorage中
          window.sessionStorage.setItem('token', `${res.data.token}`);
          //通过编程式导航跳转到后台主页，路径是/home
          this.$router.push('/home')
        })
      }
    }
  }
</script>

<style scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eeeeee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
  }

  .avatar_box img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eeeeee;
  }

  .login_form {
    position: absolute;
    width: 100%;
    padding: 10px;
    bottom: 0;
    box-sizing: border-box;
  }

  .btn {
    display: flex;
    justify-content: flex-end;
  }

  .icon {
    color: black;
  }
</style>
