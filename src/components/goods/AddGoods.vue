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
        <el-tabs v-model="activeIndex" :tab-position="'left'" style="height: 600px;" :before-leave="beforeLeaveTabs"
                 @tab-click="tabClicked">
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
                v-model="selectedKeys"
                :options="catGoodsList"
                :props="cateProps"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!--渲染表单items项-->
            <el-form-item :label="item.attr_name" v-for="item in this.goodsParams"
                          :key="item.attr_id">
              <!--复选框-->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="params" v-for="(params, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>


          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label=item.attr_name v-for="item in this.goodsProperty" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!--图片上传-->
            <!--action：图片上传地址-->
            <!--:on-preview：预览操作-->
            <!--:on-remove：删除图片-->
            <!--:file-list：呈现方式-->
            <el-upload
              class="upload-demo"
              :action=this.pictureUrl
              :on-preview="handlePreview"
              :on-remove="handleRemove"

              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <el-button @click="add" type="primary" size="mini">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!--    图片预览对话框-->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%">
      <img :src=this.previewPath alt="..." style="width: 100%">
    </el-dialog>
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
        catGoodsList: [],  //商品分类数据数组
        activeIndex: "0",  //步凑条的激活位置
        tabPosition: 'left',  // Tabs标签页居左显示
        //商品数据参数对象
        addGoodsForm: {
          goods_name: '',
          goods_price: '',
          goods_weight: '',
          goods_number: '',
          goods_cat: [],  //商品所属分类数组
          attrs: [], //商品的参数（数组），包含 `动态参数` 和 `静态属性`
          pics: [], //图片数组
          goods_introduce: '', //商品介绍
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
        //选择器的配置属性
        cateProps: {
          label: 'cat_name',
          value: 'cat_id',
          children: 'children',
        },
        goodsParams: [], //商品参数数据对象
        goodsProperty: [], //商品属性数据对象
        pictureUrl: "https://www.liulongbin.top:8888/api/private/v1/upload", //图片地址
        headersObj: {Authorization: window.sessionStorage.getItem('token')}, //图片上传定义请求头
        // 图片的预览路径
        previewPath: '',
        // 图片预览的弹框
        previewVisible: false,
        selectedKeys: []
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
      /**
       * 级联选择器被选中会发生变化
       */
      handleChange() {
        // console.log(this.selectedKeys)
        console.log(this.addGoodsForm)
        // console.log(this.addGoodsForm.goods_cat);
        if (this.addGoodsForm.goods_cat.length !== 3) {
          this.addGoodsForm.goods_cat = [];
        }
      },
      /**
       * 监听tabs切换事件
       */
      beforeLeaveTabs(activeName, oldActiveName) {
        this.$message.closeAll();
        if (oldActiveName === '0' && this.selectedKeys.length !== 3) {
          this.$message.error('请选择商品分类')
          return false;
        } else {
          return true;
        }
      },
      /**
       * 判断tab 被选中时不同触发执行不同的操作事件
       * @returns {Promise<void>}
       */
      async tabClicked() {
        // console.log(typeof this.activeIndex);
        if (this.activeIndex === '1') {
          //获取商品参数接口
          const {data: res} = await this.$http.get(`categories/${this.caseId}/attributes`, {params: {sel: "many"}});
          // console.log(res)
          if (res.meta.status !== 200) {
            this.$message.error('获取商品参数失败');
          } else {
            res.data.forEach(item => {
              item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
            })
            console.log(res.data)
            this.goodsParams = res.data;
          }
        } else if (this.activeIndex === '2') {
          //获取商品属性接口
          const {data: res} = await this.$http.get(`categories/${this.caseId}/attributes`, {params: {sel: "only"}});
          // console.log(res)
          if (res.meta.status !== 200) {
            this.$message.error('获取商品属性失败');
          } else {
            console.log(res.data)
            this.goodsProperty = res.data;
          }
        }
      },
      /**
       * 处理图片预览效果
       */
      handlePreview(file) {
        this.previewPath = file.response.data.url;
        this.previewVisible = true
      },
      /**
       * 处理移除图片的操作
       */
      handleRemove(file) {
        // 1. 获取将要删除的图片的临时路径
        const filePath = file.response.data.tmp_path;
        // 2. 从 pics 数组中，找到这个图片对应的索引值
        const i = this.addGoodsForm.pics.findIndex(x => x.pic === filePath)
        // 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
        this.addGoodsForm.pics.splice(i, 1);
      },
      /**
       * 图片上传成功时的钩子函数
       * @param response  服务器返回值
       */
      handleSuccess(response) {
        // console.log(response)
        //拼接图片对象信息
        const picture = {pic: response.data.tmp_path};
        //传递给图片数组
        this.addGoodsForm.pics.push(picture);
        // console.log(this.addGoodsForm);
      },
      /**
       * 添加商品事件
       */
      add() {
        //1、先将this.selectedKeys的值赋值给this.addGoodsForm.goods_cat做预校验
        this.addGoodsForm.goods_cat = this.selectedKeys;
        this.$refs.addGoodsFormRef.validate(async valid => {
          if (!valid) {
            return this.$message.error('请填写必填参数！')
          }
          // console.log('添加成功')
          //2、将this.addGoodsForm.goods_cat的数组转换为字符串，不影响选择器的数组
          this.addGoodsForm.goods_cat = this.addGoodsForm.goods_cat.join(',');
          //3、处理attrs商品的参数（数组），包含 `动态参数` 和 `静态属性`
          this.goodsParams.forEach(item => {
            const newInfo = {
              "attr_id": item.attr_id,
              "attr_value": item.attr_vals.join(' ')
            }
            this.addGoodsForm.attrs.push(newInfo)
          })
          this.goodsProperty.forEach(item => {
            const newInfo = {
              "attr_id": item.attr_id,
              "attr_value": item.attr_vals
            }
            this.addGoodsForm.attrs.push(newInfo)
          })
          console.log(this.addGoodsForm)
          const {data: res} = await this.$http.post(`goods`, this.addGoodsForm)
          // console.log(res);
          if (res.meta.status !== 201) {
            return this.$message.error('创建商品失败');
          } else {
            this.$message.success('创建商品成功');
            this.$router.push('/goods')
          }
        })
      }
    },
    computed: {
      caseId() {
        if (this.selectedKeys.length === 3) {
          return this.selectedKeys[2]
        } else {
          return null;
        }
      }
    }
  }
</script>

<style scoped>

</style>
