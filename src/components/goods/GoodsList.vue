<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="10">
          <!--搜索区域-->
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" :clearable="true" @clear="getGoodsList"
                    @keyup.enter.native="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!--按钮区域-->
          <el-button type="primary" @click="addGoods">
            添加商品
          </el-button>
        </el-col>
      </el-row>
      <!--商品列表表格-->
      <el-table :data="goodsDataList" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="180"></el-table-column>
        <el-table-column prop="goods_price" label="商品重量" width="180"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180">
          <template v-slot:default="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <!--        操作-->
        <el-table-column label="操作">
          <template v-slot:default="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="deleteGoods(scope.row.goods_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total=this.total
        background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "GoodsList",
    created() {
      this.getGoodsList();
    },
    data() {
      return {
        //商品列表数据
        goodsDataList: [],
        //请求商品列表数据参数
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10,
        },
        //商品列表数据总数
        total: 0,
      }
    },
    methods: {
      /**
       * 获取商品列表数据
       * @returns {Promise<void>}
       */
      async getGoodsList() {
        const {data: res} = await this.$http.get('goods', {params: this.queryInfo})
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        } else {
          this.total = res.data.total;
          this.goodsDataList = res.data.goods;
        }
      },
      /**
       * 监听 pageSize 改变事件  分页定义数据函数
       * @param newSize  页码条数
       */
      handleSizeChange(newSize) {
        // console.log(`每页 ${val} 条`);
        this.queryInfo.pagesize = newSize;
        this.getGoodsList();
      },
      /**
       *监听 pagenum 改变事件  分页定义数据函数
       * @param newPage
       */
      handleCurrentChange(newPage) {
        // console.log(`当前页: ${val}`);
        this.queryInfo.pagenum = newPage;
        this.getGoodsList();
      },
      /**
       * 通过编程式导航跳转到添加商品页面
       * @returns {Promise<void>}
       */
      addGoods() {
        //通过编程式导航跳转到添加商品页面，路径是/categories
        this.$router.push('/goods/add')
      },
      async deleteGoods(goodsId) {
        // console.log(goodsId)
        const {data: res} = await this.$http.delete(`goods/${goodsId}`);
        if(res.meta.status !== 200){
          return this.$message.error('删除商品失败');
        }else {
          this.$message.success(res.meta.msg);
        }
        this.getGoodsList();
      }
    }
  }
</script>

<style scoped>

</style>
