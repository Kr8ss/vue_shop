<template>
  <div>
    <!--    <div>{{total}}</div>-->
    <!--    <div>{{users[0].mg_state}}</div>-->
    <!--      面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--      卡片区域-->
    <el-card class="box-card">
      <!--      定制行内宽度-->
      <!--      搜索和添加按钮区域-->
      <el-row :gutter="20">
        <el-col :span="10">
          <!--      搜索区域-->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true" @clear="getUserList"
                    @keyup.enter.native="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!--          按钮区域-->
          <el-button type="primary" @click="addUserDialogVisible=true">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <!--      用户列表区域-->
      <el-table :data="users" style="width: 100%" :stripe="true" :border="true">
        <!--        序列化-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="140"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="150"></el-table-column>
        <!--        处理布尔值生成开关-->
        <el-table-column prop="mg_state" label="状态" width="150">
          <template v-slot:default="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStatusChange(scope.row)" :disabled="flag"></el-switch>
          </template>
        </el-table-column>
        <!--        操作按钮-->
        <el-table-column label="操作">
          <template v-slot:default="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                         @click="showCompileUserDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-star-off" size="mini"></el-button>
            </el-tooltip>
          </template>
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

    <!--    添加用户Dialog弹出对话框-->
    <el-dialog title="添加用户" :visible.sync="addUserDialogVisible" width="50%" @close="resetAddUserForm">
      <!--      表单-->
      <el-form :model="addUserForm" :rules="addUserRules" ref="addUserFormRef" label-width="70px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--      确定 取消-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--    修改用户信息对话框-->
    <el-dialog title="修改用户信息" :visible.sync="compileUserDialogVisible" width="50%" @close="resetCompileUserForm">
      <el-form :model="compileUserForm" :rules="compileUserFormRules" ref="compileUserFormRef" label-width="70px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="compileUserForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="compileUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="compileUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="compileUserDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveCompileUserMessage">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Users",
    data() {
      return {
        //获取用户列表参数对象
        queryInfo: {
          query: '',
          pagenum: 1,  //当前页数
          pagesize: 2,  //当前页数显示数量
        },
        total: 0,
        users: [],
        flag: false,   //用于控制点击状态按钮后延时内是否可以点击
        addUserDialogVisible: false, //提娜佳用户对话框默认隐藏
        compileUserDialogVisible: false,  //编辑用户对话框默认隐藏
        //添加用户表单数据绑定对象
        addUserForm: {
          username: '',
          password: '',
          email: '',
          mobile: '',
        },
        //添加用户表单验证规则数据绑定对象
        addUserRules: {
          //验证用户名是否合法
          username: [
            {required: true, message: '请输入用户名称', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
          //密码是否合法
          password: [
            {required: true, message: '请输入用户密码', trigger: 'blur'},
            {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
          ],
          //邮箱是否合法
          email: [
            {required: true, message: '请输入用户邮箱', trigger: 'blur'},
            {
              pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
              message: '请输入合法的邮箱',
              trigger: 'blur'
            }
          ],
          //电话是否合法
          mobile: [
            {required: true, message: '请输入用户手机', trigger: 'blur'},
            {
              pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
              message: '请输入合法的电话',
              trigger: 'blur'
            },
          ]
        },
        //编辑用户绑定的数据对象
        compileUserForm: {},
        //编辑用户表单验证规则数据绑定对象
        compileUserFormRules: {
          //邮箱是否合法
          email: [
            {required: true, message: '请输入用户邮箱', trigger: 'blur'},
            {
              pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
              message: '请输入合法的邮箱',
              trigger: 'blur'
            }
          ],
          //电话是否合法
          mobile: [
            {required: true, message: '请输入用户手机', trigger: 'blur'},
            {
              pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
              message: '请输入合法的电话',
              trigger: 'blur'
            },
          ]
        }
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      /**
       * 获取用户列表请求方法
       * @returns {Promise<void>}
       */
      async getUserList() {
        const {data: res} = await this.$http.get('/users', {params: this.queryInfo});
        // console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        } else {
          this.total = res.data.total;
          this.users = res.data.users;
        }
      },
      /**
       * 监听 pageSize 改变事件  分页定义数据函数
       * @param newSize  页码条数
       */
      handleSizeChange(newSize) {
        // console.log(`每页 ${val} 条`);
        this.queryInfo.pagesize = newSize;
        this.getUserList();
      },
      /**
       *
       * @param newPage
       */
      handleCurrentChange(newPage) {
        // console.log(`当前页: ${val}`);
        this.queryInfo.pagenum = newPage;
        this.getUserList();
      },
      /**
       * 监听用户状态该改变
       * @param userInfo  状态栏数据
       * @returns {Promise<void>}
       */
      async userStatusChange(userInfo) {
        // console.log(userInfo);
        const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
        this.$message.closeAll()   //提示框循环弹出解决
        if (res.meta.status !== 200) {
          userInfo.mg_state = !userInfo.mg_state;
          this.$message.error(res.meta.msg);
        } else {
          this.$message.success(res.meta.msg);
        }
        /**
         * 定时器
         * @type {boolean}
         */
        this.flag = true;
        setTimeout(() => {
          this.flag = false;
        }, 300)
        this.getUserList()
      },
      /**
       * 监听添加用户对话框关闭事件  清空表单信息
       */
      resetAddUserForm() {
        this.$refs.addUserFormRef.resetFields();
      },
      /**
       * 监听编辑用户对话框关闭事件  情况信息
       */
      resetCompileUserForm() {
        this.$refs.compileUserFormRef.resetFields();
      },
      /**
       * 添加用户请求
       */
      addUser() {
        this.$refs.addUserFormRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.post('users', this.addUserForm);
          // console.log(res)
          this.$message.closeAll()
          if (res.meta.status !== 201) {
            //return停止函数执行  不会执行后面的隐藏对话框和刷新数据
            return this.$message.error(res.meta.msg)
          } else {
            this.$message.success(res.meta.msg)
          }
          //影藏对话框
          this.addUserDialogVisible = false;
          //刷新数据
          this.getUserList();
        })
      },
      /**
       * 监听点击编辑用户按钮请求
       */
      async showCompileUserDialog(userId) {
        // console.log(userId)
        this.compileUserDialogVisible = true;
        const {data: res} = await this.$http.get(`users/${userId}`);
        if (res.meta.status !== 200) {
          return this.$message.error('查询用户信息失败！')
        }
        this.compileUserForm = res.data
        // console.log(this.compileUserForm)
      },
      /**
       * 监听保存修改用户信息
       */
      saveCompileUserMessage() {
        this.$refs.compileUserFormRef.validate(async valid => {
          // console.log(valid)
          if (!valid) return
          const {data: res} = await this.$http.put(`users/${this.compileUserForm.id}`, {
            email: this.compileUserForm.email,
            mobile: this.compileUserForm.mobile,
          })
          // console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error('更新失败')
          } else {
            this.$message.success('更新成功')
          }
        })
        this.compileUserDialogVisible = false;
        this.getUserList()
      },
      /**
       * 监听删除用户
       */
      async deleteUser(userId) {
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error)

        //如果用户确认删除，则返回值为字符串 confirm
        //如果用户取消了删除，则返回值为字符串  cancel
        // console.log(confirmResult)
        this.$message.closeAll()
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        const {data: res} = await this.$http.delete(`users/${userId}`)
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success(res.meta.msg)
        this.getUserList();
      }
    }
  }
</script>

<style scoped>

</style>
