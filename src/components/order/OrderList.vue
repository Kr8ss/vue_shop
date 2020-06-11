<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--      搜索区域-->
      <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" :clearable="true" @clear="getOrderList"
                @keyup.enter.native="getOrderList" style="width: 300px">
        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
      </el-input>
      <!--      表格区域-->
      <el-table :data="orderList" border style="width: 100%" :stripe="true">
        <!--        序列化-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="270"></el-table-column>
        <el-table-column prop="order_price" label="订单价格(元)" width="150" align="center"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="100" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay === '1'">已付款</el-tag>
            <el-tag type="danger" v-else-if="scope.row.order_pay === '0'">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100" align="center"></el-table-column>
        <el-table-column prop="update_time" label="下单时间" width="200" align="center">
          <template v-slot:default="scope">
            {{scope.row.update_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot:default="scope">
            <el-tooltip content="修改订单地址" placement="bottom-start" effect="light">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                         @click="modificationAddressDialogVisible=true"></el-button>
            </el-tooltip>
            <el-tooltip content="物流信息" placement="bottom-start" effect="light">
              <el-button type="success" icon="el-icon-location-outline" size="mini"
                         @click="showLogisticsBox(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total=this.total>
      </el-pagination>
    </el-card>
    <!--    地址对话框-->
    <el-dialog
      title="修改地址"
      :visible.sync="modificationAddressDialogVisible"
      width="50%"
      @close="closeAddressDialogVisible">
      <el-form :model="modificationAddressRuleForm" :rules="modificationAddressRules"
               ref="modificationAddressRuleFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省市区/县" prop="address">
          <el-cascader
            v-model="modificationAddressRuleForm.address"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="definiteAddress">
          <el-input v-model="modificationAddressRuleForm.definiteAddress"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="modificationAddressDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="modificationAddressDialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
    <!--    物流信息对话框-->
    <el-dialog title="查看物流进度" :visible.sync="logisticsDialogVisible" width="50%">
      <el-timeline :reverse="reverse" size="">
        <el-timeline-item
          v-for="(activity, index) in logisticsMessage"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
  import city from "../../plugins/city";

  export default {
    name: "OrderList",
    created() {
      this.getOrderList()
    },
    data() {
      return {
        //获取订单列表请求参数
        queryInfo: {
          query: '', //查询参数
          pagenum: 1, //当前页码
          pagesize: 10, //每页显示条数
          // user_id: '', //用户 ID
          // pay_status: '', //支付状态
          // is_send: '', //是否发货
          // order_fapiao_title: '', // ['个人','公司']
          // order_fapiao_company: '', //公司名称
          // order_fapiao_content: '', //发票内容
          // consignee_addr: '', //发货地址
        },
        orderList: [],//订单数据
        total: 0, //订单数据总数
        modificationAddressDialogVisible: false, //修改地址对话框
        //表单数据
        modificationAddressRuleForm: {
          address: [],
          definiteAddress: ''
        },
        //表单验证规则
        modificationAddressRules: {
          address: [
            {required: true, message: '请选择省市区/县', trigger: 'blur'},
          ],
          definiteAddress: [
            {required: true, message: '请输入详细地址', trigger: 'blur'},
          ]
        },
        //城市选择器数据
        cityData: city,
        //物流信息对话框
        logisticsDialogVisible: false,
        //物流信息数据
        logisticsMessage: [],
        //排序方式
        reverse: false
      }
    },
    methods: {
      /**
       * 获取订单列表数据
       */
      async getOrderList() {
        const {data: res} = await this.$http.get('orders', {params: this.queryInfo})
        // console.log(res)
        this.$message.closeAll();
        if (res.meta.status !== 200) {
          return this.$message.error('获取订单数据失败')
        } else {
          this.orderList = res.data.goods;
          this.total = res.data.total;
          // console.log(this.orderList)
        }
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getOrderList();
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getOrderList();
      },
      closeAddressDialogVisible() {
        this.$refs.modificationAddressRuleFormRef.resetFields();
      },
      async showLogisticsBox() {
        const {data: res} = await this.$http.get(`/kuaidi/1106975712662`);
        // console.log(res)
        if (res.meta.status !== 200) {
          return
        }
        this.logisticsMessage = res.data;
        this.logisticsDialogVisible = true
      }
    }
  }
</script>

<style scoped>

</style>
