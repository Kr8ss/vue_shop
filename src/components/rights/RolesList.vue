<template>
  <div>
    <!--面包屑区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
      <!--button区域-->
      <el-button type="primary" @click="addRolesDialogVisible=true">添加角色</el-button>
      <!--表格区域-->
      <el-table :data="rolesListData" border style="width: 100%">
        <!--展开列        -->
        <el-table-column type="expand">
          <template v-slot:default="scope">
            <el-row :class="['bdbottom', i1 ===0 ? 'bdtop': '', 'vcenter']" v-for="(item1, i1) in scope.row.children"
                    :key="item1.id">
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRolesById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级和三级权限-->
              <el-col :span="19">
                <el-row :class="[i2 === 0 ? '' : 'bdtop','vcenter']" v-for="(item2, i2) in item1.children"
                        :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRolesById(scope.row, item2.id)">{{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="(item3) in item2.children" :key="item3.id" type="warning" closable
                            @close="removeRolesById(scope.row, item3.id)">{{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <!--            <pre>{{ scope.row }}</pre>-->
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="400"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="400"></el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showCompileRolesDialog(scope.row.id)">编辑
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-edit">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-edit" @click="showSetRightsDialogVisible(scope.row)">
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--添加角色对话框    -->
    <el-dialog title="添加角色" :visible.sync="addRolesDialogVisible" width="50%" @close="resetAddRolesForm">
      <!--表单-->
      <el-form :model="addRolesForm" :rules="addRolesRules" ref="addRolesFormRef" label-width="80px"
               class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!--确定 取消-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改角色对话框-->
    <el-dialog title="修改角色" :visible.sync="compileRolesDialogVisible" width="50%" @close="resetCompileRolesForm">
      <!--表单-->
      <el-form :model="compileRolesForm" :rules="compileRolesRules" ref="compileRolesFormRef" label-width="80px"
               class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="compileRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="compileRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!--确定 取消-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="compileRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCompileUserMessage">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配权限对话框-->
    <el-dialog title="分配权限" :visible.sync="setRightsDialogVisible" width="50%">
      <!--树形控件-->
      <el-tree :data="rights" :props="rightsProps" show-checkbox node-key="id" default-expand-all
               :default-checked-keys="checkedKeys" ref="treeRef"></el-tree>
      <!--确定 取消-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRolesRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Roles",
    created() {
      this.getRolesDataList();
    },
    data() {
      return {
        //添加角色隐藏和展示对话框
        addRolesDialogVisible: false,
        //修改角色隐藏和展示对话框
        compileRolesDialogVisible: false,
        //角色列表数据
        rolesListData: [],
        //添加角色表单数据绑定对象
        addRolesForm: {
          roleName: '',
          //角色描述
          roleDesc: '',
        },
        //修改角色表单数据绑定对象
        compileRolesForm: {},
        //添加用户表单验证规则数据绑定对象
        addRolesRules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'},
          ],
          roleDesc: [
            {required: true, message: '请输入角色描述', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'},
          ]
        },
        //修改用户表单验证规则数据绑定对象
        compileRolesRules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'},
          ],
          roleDesc: [
            {required: true, message: '请输入角色描述', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'},
          ]
        },
        //分配权限隐藏和展示对话框
        setRightsDialogVisible: false,
        //get获取分配权限中的所有数据
        rights: [],
        //树形空间的属性绑定对象【定义要取值的数据标题和名称】
        rightsProps: {
          children: 'children',
          label: 'authName'
        },
        //被选中的数组对象
        checkedKeys: [],
        //当前分配角色的id
        roleId: "",
      }
    },
    methods: {
      /**
       * 获取角色列表数据
       */
      async getRolesDataList() {
        const {data: res} = await this.$http.get('roles')
        // console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        } else {
          this.rolesListData = res.data;
          // console.log(this.rolesListData)
        }
      },
      /**
       * 监听添加角色对话框关闭事件  清空表单信息
       */
      resetAddRolesForm() {
        this.$refs.addRolesFormRef.resetFields();
      },
      /**
       * 监听修改角色对话框关闭事件  清空表单信息
       */
      resetCompileRolesForm() {
        this.$refs.compileRolesFormRef.resetFields();
      },
      /**
       * 添加角色
       */
      addRoles() {
        this.$refs.addRolesFormRef.validate(async valid => {
          if (!valid) return;
          const {data: res} = await this.$http.post('roles', this.addRolesForm);
          // console.log(res)
          if (res.meta.status !== 201) {
            return this.$message.error('创建角色失败!')
          } else {
            this.$message.success(res.meta.msg);
          }
          this.addRolesDialogVisible = false;
          this.getRolesDataList();
        })
      },
      /**
       * 监听点击修改角色按钮请求本行数据
       */
      async showCompileRolesDialog(userId) {
        this.compileRolesDialogVisible = true;
        const {data: res} = await this.$http.get(`roles/${userId}`);
        if (res.meta.status !== 200) {
          return this.$message.error('查询角色信息失败！')
        } else {
          this.compileRolesForm = res.data
        }
      },
      /**
       * 监听保存修改用户信息
       */
      saveCompileUserMessage() {
        this.$refs.compileRolesFormRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.put(`roles/${this.compileRolesForm.roleId}`, {
            roleName: this.compileRolesForm.roleName,
            roleDesc: this.compileRolesForm.roleDesc,
          })
          if (res.meta.status !== 200) {
            return this.$message.error('更新失败')
          } else {
            this.$message.success('更新成功')
          }
        })
        this.compileRolesDialogVisible = false;
        this.getRolesDataList()
      },
      /**
       * 根据id删除对应的数据权限
       * @param role   角色数据
       * @param rightId  权限id
       * @returns {Promise<void>}
       */
      async removeRolesById(role, rightId) {
        //弹框提示是否删除
        const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error);
        // console.log(confirmResult);
        if (confirmResult !== 'confirm') {
          this.$message.info('取消删除');
        } else {
          const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
          if (res.meta.status !== 200) {
            this.$message.error('取消权限失败');
          } else {
            this.$message.success('取消权限成功');
          }
          // //删除完毕之后  无论成功还是失败  均去执行一次获取数据的接口
          // return this.getRolesDataList()
          role.children = res.data;
        }
      },
      /**
       * 监听分配权限对话框
       */
      async showSetRightsDialogVisible(role) {
        this.roleId = role.id;
        const {data: res} = await this.$http.get('rights/tree')
        if (res.meta.status !== 200) return
        this.rights = res.data;
        //两种方式清空数组
        // console.log(this.checkedKeys)
        this.checkedKeys.length = 0;
        // this.checkedKeys = [];
        // 调用获取id的方法
        this.getDefaultKeys(role, this.checkedKeys)
        this.setRightsDialogVisible = true;
      },
      /**
       * 通过递归的形式  获取角色下所有三级权限的id,并保存checkedKeys中
       * @param node
       * @param array
       */
      getDefaultKeys(node, array) {
        //如果当前节点没有children属性  则是三级节点
        if (!node.children) {
          return array.push(node.id)
        }
        node.children.forEach(item => {
          this.getDefaultKeys(item, array)
        })
      },
      /**
       * 点击为角色分配权限
       */
      async saveRolesRights() {
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys(),
        ]
        const ridsStr = keys.join(',');
        const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: ridsStr})
        if (res.meta.status !== 200) {
          return this.$message.error('分配权限失败！')
        }
        this.$message.success('分配权限成功！')
        this.getRolesDataList();
        this.setRightsDialogVisible = false;
      }
    }
  }
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eeeeee;
  }

  .bdbottom {
    border-bottom: 1px solid #eeeeee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }

</style>
