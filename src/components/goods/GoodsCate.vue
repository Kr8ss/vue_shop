<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="getParentCateList">添加分类</el-button>
      <el-table
        :data="GoodsCateList"
        border
        style="width: 100%"
        row-key="cat_id"
        :default-expand-all="false"
        :tree-props='GoodsCateProps'
      >
        <el-table-column type="index" label="#" align="center">
        </el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效">
          <template v-slot:default="scope">
            <!--            <div>{{typeof scope.row.cat_deleted}}</div>-->
            <i class='el-icon-success' v-if="scope.row.cat_deleted = true" style="color: #a8ff00"></i>
            <i class='el-icon-error' v-else style="color: rgba(222,20,20,0.18)"></i>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序">
          <template v-slot:default="scope">
            <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.cat_level===2">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-edit" size="mini">删除</el-button>
        </el-table-column>
      </el-table>
      <!--        分页操作-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total=this.total>
      </el-pagination>
    </el-card>

    <!--添加分类对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="resetAddCateForm">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：" prop="cat_name">
          <!--options绑定的数据源          -->
          <!--v-model双向绑定的数据          -->
          <!--props指定配置对象          -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            style="width: 100%"
            :clearable="true"></el-cascader>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "GoodsCate",
    created() {
      this.getGoodsCateList()
    },
    data() {
      return {
        //请求列表参数
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5,
        },
        total: 0,
        //分类列表数据
        GoodsCateList: [],
        //表格树形数据配置项
        GoodsCateProps: {
          children: 'children',
          hasChildren: 'hasChildren',
        },
        // type: 'template',
        // template: 'isOk',
        // 添加分类对话框
        addCateDialogVisible: false,
        addCateForm: {
          cat_name: '',
          cat_pid: 0,
          cat_level: 0
        },
        addCateFormRules: {
          cat_name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
          ]
        },
        //父级分类数据
        parentCateList: [],
        //选中的父级分类的Id数组
        selectedKeys: [],
        //指定级联选择器的配置对象
        cascaderProps: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          checkStrictly: true,
        }
      }
    },
    methods: {
      async getGoodsCateList() {
        const {data: res} = await this.$http.get('categories', {params: this.queryInfo})
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类失败！')
        }
        this.GoodsCateList = res.data.result;
        // console.log(this.GoodsCateList)
        this.total = res.data.total;
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getGoodsCateList();
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getGoodsCateList();
      },
      //获取二级父级商品
      async getParentCateList() {
        const {data: res} = await this.$http.get('categories', {params: {type: 2}})
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类失败！')
        }
        // console.log(res)
        this.parentCateList = res.data;
        this.addCateDialogVisible = true;
      },
      parentCateChange() {
        console.log(this.selectedKeys)
        // 如果selectedKeys数组长度大于0，说明选择了对应的父级分类
        // 反之没有选择
        if (this.selectedKeys.length > 0) {
          //父级分类的Id
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
          //当前分类的等级赋值
          this.addCateForm.cat_level = this.selectedKeys.length
          return
        } else {
          this.addCateForm.cat_pid = 0;
          this.addCateForm.cat_level = 0;
        }
      },
      // 重置表单
      resetAddCateForm() {
        this.$refs.addCateFormRef.resetFields();
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
        this.selectedKeys = [];
      },
      // 添加分类
      addCate() {
        console.log(this.addCateForm)
        this.$refs.addCateFormRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.post('categories', this.addCateForm)
          if (res.meta.status !== 201) {
            return this.$message.error('创建失败！')
          } else {
            this.$message.success('创建成功')
          }
          this.getGoodsCateList();
          this.addCateDialogVisible = false;
        })

      }
    }
  }
</script>

<style scoped>

</style>
