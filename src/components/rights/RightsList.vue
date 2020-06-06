<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--表格数据区域-->
    <el-card class="box-card">
      <el-table :data="rightsListTableData" border style="width: 100%">
        <el-table-column type="index" label="#" width="fruit.width"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="fruit.width"></el-table-column>
        <el-table-column prop="path" label="路径" width="fruit.width"></el-table-column>
        <el-table-column prop="level" label="权限等级" width="fruit.width">
          <template v-slot:default="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "RightsList",
    data() {
      return {
        //权限列表数据
        rightsListTableData: [],
      }
    },
    created() {
      //获取权限列表数据
      this.getRightsList()
    },
    methods: {
      /**
       * 获取权限列表数据 请求
       * @returns {Promise<void>}
       */
      async getRightsList() {
        const {data: res} = await this.$http.get('rights/list');
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取权限列表失败!');
        }
        this.rightsListTableData = res.data
      }
    },
    // computed: {
    //   test: function () {
    //     if (this.rightsListTableData.level === '1') {
    //       return this.type = 'success'
    //     } else (this.rightsListTableData.level === '2')
    //     {
    //       return this.type = 'warning'
    //     }
    //   }
    // }
  }
</script>

<style scoped>

</style>
