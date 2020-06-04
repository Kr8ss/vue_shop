<template>
  <div id="Home">
    <el-container class="el-container1">
      <!--      头部区域-->
      <el-header>
        <img src="../assets/img/vue_shop.png" alt="404"/>
        <span>电商后台管理系统</span>
        <el-button type="info" @click="loginOut">退出</el-button>
      </el-header>
      <!-- 页面主体区域-->
      <el-container>
        <!-- 侧边栏-->
        <el-aside width="200px">
          <!-- 侧边栏菜单区域-->
          <el-menu
            unique-opened="true"
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#54B1FF">
            <!--一级菜单-->
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key=item.id>
              <!--一级菜单模板-->
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单-->
              <el-menu-item :index="menuItem.id + ''" v-for="menuItem in item.children" :key=menuItem.id>
                <!--二级菜单模板-->
                <template slot="title">
                  <!--图标-->
                  <i class="el-icon-menu"></i>
                  <!--文本-->
                  <span>{{menuItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!--        右侧内容主体-->
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: "Home",
    data() {
      return {
        //左侧菜单数据
        menuList: [],
        iconObj: {
          "125": 'icon iconfont icon-yonghuguanli',
          "103": 'icon iconfont icon-ego-boxfull',
          "101": 'icon iconfont icon-shangpin',
          "102": 'icon iconfont icon-dingdanguanli',
          "145": 'icon iconfont icon-shujutongji',
        },
      }
    },
    //创建结束后获取数据
    created() {
      this.getMenuList()
    },
    methods: {
      loginOut() {
        //清除sessionStorage
        window.sessionStorage.clear();
        //编程式导航到‘/login’页面
        this.$router.push('/login');
      },
      //获取权限数据
      async getMenuList() {
        const {data: res} = await this.$http.get('menus');
        // console.log(res)
        if (res.meta.status === 200) {
          this.menuList = res.data;
          console.log(this.menuList)
        } else {
          this.$message.error(res.meta.msg);
        }
      }
    }
  }
</script>

<style scoped>
  #Home {
    height: 100%;
  }

  .el-container1 {
    height: 100%;
  }

  .el-header {
    background-color: RGB(53, 61, 66);
    padding-left: 0;
    align-items: center;
  }

  .el-header img {
    height: 59px;
    width: 59px;

  }

  .el-header span {
    color: white;
    font-size: 30px;
    position: absolute;
    top: 8px;
    margin-left: 10px;
  }

  .el-header .el-button {
    position: absolute;
    top: 8px;
    right: 15px;
  }

  .el-container .el-aside {
    background-color: #333744;

  }

  .el-aside .el-menu {
    border-right: none;
  }

  .el-main {
    background-color: RGB(233, 237, 239);
  }

  .icon {
    margin-right: 15px;
  }
</style>
