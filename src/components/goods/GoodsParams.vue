<template>
  <div>
    <!--      面包屑区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!--      提示区域-->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
      <!--       Cascader 级联选择器-->
      <span>选择商品分类：</span>
      <el-cascader
        v-model="selectedKeys"
        :options="LastCateList"
        :props="lastCateProps"
        @change="lastCateHandleChange"></el-cascader>
      <!--      tabs标签页水平菜单栏-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <!--          添加动态参数的面板-->
          <el-button type="primary" size="mini" :disabled="buttonDisabled">添加参数</el-button>
          <el-table
            :data="manyTableData"
            border
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--                {{scope.row}}-->
                <!--                标签-->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(item, scope.row)">
                  {{item}}
                </el-tag>
                <!--                输入和按钮切换-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="#">
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称">
            </el-table-column>
            <el-table-column
              label="操作">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!--          添加静态属性的面板-->
          <el-button type="primary" size="mini" :disabled="buttonDisabled">添加属性</el-button>
          <el-table :data="onlyTableData" border style="width: 100%">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作"></el-table-column>
          </el-table>
        </el-tab-pane>

      </el-tabs>
    </el-card>


  </div>
</template>

<script>
  export default {
    name: "GoodsParams",
    created() {
      this.getLastCate()
    },
    data() {
      return {
        LastCateList: [],
        lastCateProps: {
          expandTrigger: 'hover',
          label: 'cat_name',
          value: 'cat_id',
          children: 'children',
        },
        //级联选择框双向绑定的数组
        selectedKeys: [],
        //tabs默认绑定展示第几个标签
        activeName: 'many',
        //button状态禁用启用
        buttonDisabled: true,
        //获取的三级分类属性数据
        manyTableData: [],
        onlyTableData: [],
        //input和button切换
        // inputVisible: false,
        // inputValue: '',
      }
    },
    methods: {
      /**
       * 获取三级分类数据
       * @returns {Promise<void>}
       */
      async getLastCate() {
        const {data: res} = await this.$http.get('categories', {params: {type: 3}})
        if (res.meta.status !== 200) {
          this.$message.error('获取商品分类失败！')
        }
        this.LastCateList = res.data;
        // console.log(this.LastCateList)
      },
      async getParamsList() {
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: this.activeName}})
        this.$message.closeAll();
        if (res.meta.status !== 200) {
          return;
        }

        res.data.forEach(item => {
          item.inputVisible = false;
          item.inputValue = '';
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []

        })
        console.log(res.data);
        if (this.activeName === 'many') {
          this.manyTableData = res.data;
          // console.log(this.manyTableData)
        } else {
          this.onlyTableData = res.data;
        }
      },
      /**
       * 选择器数据发生改变
       */
      lastCateHandleChange() {
        // console.log(this.selectedKeys)
        // 判断必须是第三级分类才可以选择
        if (this.selectedKeys.length !== 3) {
          this.selectedKeys = [];
          // this.LastCateList = [];
          this.manyTableData = [];
          this.onlyTableData = [];
          return
        } else if (this.selectedKeys.length === 3) {
          this.buttonDisabled = false;
          this.getParamsList()
        }
      },
      /**
       * 点击对应的标签  查看响应结果
       */
      async handleClick() {
        // console.log(this.activeName)
        this.getParamsList();
      },
      handleInputConfirm(row) {
        console.log("ok")
        //如果为空就转换为按钮
        if (row.inputValue.trim().length === 0) {
          row.inputValue = '';
          row.inputVisible = false;
          return
        }
        // 如果有内容  则直接push到row.attr_vals中
        row.attr_vals.push(row.inputValue.trim());
        row.inputValue = '';
        row.inputVisible = false;

        //调用接口  发送修改请求
        this.saveAttrVals(row)

      },

      showInput(row) {
        row.inputVisible = true;
        //文本框自动获取焦点
        //
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      /**
       * 删除tag标签
       */
      handleClose(tag, row) {
        row.attr_vals.splice(row.attr_vals.indexOf(tag), 1);
        this.saveAttrVals(row)
      },
      /**
       * tag标签增加删除方法
       */
      async saveAttrVals(row) {
        const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
        // console.log(typeof row.attr_sel)
        // console.log(row.attr_sel)
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败')
        } else {
          this.$message.success('成功添加参数')
        }
      }
    },
    computed: {
      //计算三级分类id
      cateId() {
        if (this.selectedKeys.length === 3) {
          return this.selectedKeys[2];
        } else {
          return null;
        }
      },
    }
  }

</script>

<style scoped>

  .el-input {
    width: 150px;
  }

  .el-tag {
    margin-right: 10px;
  }
</style>
