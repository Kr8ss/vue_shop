<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--alert警告-->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false">
      </el-alert>
      <!--Steps步凑条-->
      <el-steps :active="Number(activeIndex)" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--Tabs标签页-->
      <el-form :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsFormRef" label-width="100px"
               class="demo-ruleForm" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'" style="height: 600px;" :before-leave="beforeLeaveTabs">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price" type="number" :min="0"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight" type="number" :min="0"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number" type="number" :min="0"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                v-model="addGoodsForm.goods_cat"
                :options="catGoodsList"
                :props="cateProps"
                @change="handleChange"></el-cascader>
            </el-form-item>

          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
          <el-tab-pane label="完成">完成</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

  </div>
</template>

<script>
  export default {
    name: "AddGoods",
    created() {
      this.getCatGoods();
    },
    data() {
      return {
        //商品分类数据数组
        catGoodsList: [],
        //步凑条的激活位置
        activeIndex: "0",
        // Tabs标签页居左显示
        tabPosition: 'left',
        //商品数据参数对象
        addGoodsForm: {
          goods_name: '',
          goods_price: '',
          goods_weight: '',
          goods_number: '',
          //商品所属分类数组
          goods_cat: [],
        },
        //商品对象规则
        addGoodsFormRules: {
          goods_name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ],
          goods_price: [
            {required: true, message: '请填入商品价格', trigger: 'blur'},
            {min: 0, message: '价格不能低于0', trigger: 'blur'}
          ],
          goods_weight: [
            {required: true, message: '请填入商品重量', trigger: 'blur'},
            {min: 0, message: '重量不能低于0', trigger: 'blur'}
          ],
          goods_number: [
            {required: true, message: '请填入商品数量', trigger: 'blur'},
            {min: 0, message: '数量不能低于0', trigger: 'blur'}
          ],
          goods_cat: [
            {required: true, message: '请选择商品分类', trigger: 'blur'},
          ]
        },
        //
        cateProps: {
          label: 'cat_name',
          value: 'cat_id',
          children: 'children',
        }
      }
    },
    methods: {
      /**
       * 获取商品分类数据
       */
      async getCatGoods() {
        const {data: res} = await this.$http.get('categories', {params: {type: 3}})
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        } else {
          this.catGoodsList = res.data;
        }
      },
      //级联选择器被选中会发生变化
      handleChange() {
        console.log(this.addGoodsForm.goods_cat);
        if (this.addGoodsForm.goods_cat.length !== 3) {
          this.addGoodsForm.goods_cat = [];
        }
      },
      //监听tabs切换事件
      beforeLeaveTabs(activeName, oldActiveName) {
        this.$message.closeAll();
        if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
          this.$message.error('请选择商品分类')
          return false;
        } else {
          return true;
        }
      }
    },
  }
</script>

<style scoped>

</style>
