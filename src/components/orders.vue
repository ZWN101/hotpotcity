<template>
  <div style="height: 100%; width: 100%;">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <div class="box">
      <div>
        <el-button id="finishedAll" class="finishedAll" type="primary" value="已下单" @click="searchOrdersByStates()" >待完成订单</el-button>
        <el-button  class="finishedAll" type="primary"  @click="searchAllOrder()" >全部订单</el-button>
      </div>
      <div>
        <el-input placeholder="请输入手机号/尾号" v-model.trim="inputsearch" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchOrdersByPhone()"></el-button>
        </el-input>
      </div>
    </div>

    <!-- 查看详情的对话框 -->
    <el-dialog title="查看订单详情" :visible.sync="isShowOrderDetail" >
      <el-table :data="orderDetailData" height="400px">
        <el-table-column prop="foodImg" label="食物图片" width="120">
          <template slot-scope="scope">
          <img class="card-img-top" :src="httpRequestUrl+scope.row.foodImg" style="width: 50px;height: 50px;border: 1px #B3C0D1 solid;">
          </template>
        </el-table-column>
        <el-table-column prop="foodId" label="食物编号" width="120"></el-table-column>
        <el-table-column prop="foodName" label="食物名称" width="120"></el-table-column>
        <el-table-column prop="foodNO" label="食物数量" width="120"></el-table-column>
        <el-table-column prop="foodPrice" label="食物总价" width="120"></el-table-column>
        <el-table-column prop="deskId" label="餐桌编号" width="120"></el-table-column>
        <el-table-column prop="orderId" label="订单编号" width="120"></el-table-column>
        <el-table-column prop="userPhone" label="用户手机号码" width="150"></el-table-column>
      </el-table>
    </el-dialog>

    <!-- 订单列表 -->
    <el-table :data="orderlist.slice((currentPage - 1) * PageSize, currentPage * PageSize)" border style="width: 100%" class="usertable">
      <el-table-column fixed prop="orderId" label="订单编号" width="150"></el-table-column>
      <el-table-column prop="orderState" label="订单状态" width="150"></el-table-column>
      <el-table-column prop="orderDate" label="下单时间" width="200"></el-table-column>
      <el-table-column prop="orderPrice" label="订单金额" width="150"></el-table-column>
      <el-table-column prop="userId" label="用户Id" width="150"></el-table-column>
      <el-table-column prop="deskId" label="餐桌编号" width="150"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <!-- 查看订单详情 -->
          <el-button type="text" size="middle" @click="showOrderDetailDialog(scope.row)">查看详情</el-button>
          <!-- 已完成 -->
          <el-button  value="已完成" type="text" size="middle" @click="editOrder(scope.row)">完成订单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="tabListPage">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
         :page-sizes="pageSizes" 
        :page-size="PageSize"
        layout="total, prev, sizes,pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </div>
    <!-- 分页 -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        httpRequestUrl:"/api",
        orderlist: [],
        inputsearch: '',
        // 查看详情需要的参数
        isShowOrderDetail: false,
        orderDetailData: [],
        formLabelWidth:'120px',
        // 分页***************
        // 总数据
        tableData: [],
        // 个数选择器（可修改）
        pageSizes: [10, 20, 30, 40],
        // 默认显示第几页
        currentPage: 1,
        // 总条数，根据接口获取数据长度(注意：这里不能为空)
        totalCount: 1,
        // 默认每页显示的条数（可修改）
        PageSize: 10,
      }
    },
    watch:{
      inputsearch(newValue,oldValue){
        this.getorders(newValue);
      }
    },
    // 管理员查询所有订单
    mounted() {
      this.getorders(this.inputsearch);
    },
    methods: {
       // 分页
    // 每页显示的条数
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.PageSize = val;
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1;
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val;
    },
      // 管理员查询所有和模糊查询 订单 公用
      getorders(search = '') {
        var url = '';
        if (search != '') {
          url = "/api/searchOrdersByPhone/?userPhone=" + search;
        } else {
          url = "/api/getOrders"
        }
        this.$Axios.get(url)
          .then(backdata => {
            this.orderlist = backdata.data;
            this.totalCount = backdata.data.length;
          });
      },
      searchAllOrder(){
        this.getorders("");
      },
      // 管理员模糊查询某一用户订单(根据手机尾号)
      searchOrdersByPhone() {
        this.getorders(this.inputsearch);
        this.inputsearch = '';
      },
      // 管理员模糊查询某一状态的订单（根据订单状态）
      searchOrdersByStates() {
        var btnvalue = document.getElementById("finishedAll").value;
        var url = "/api/searchOrdersByStates?orderState=" + btnvalue;
        this.$Axios.get(url)
          .then(backdata => {
            this.orderlist = backdata.data;
            this.totalCount = backdata.data.length;
          });
      },
      // 管理员查看某个订单的订单详情
      showOrderDetailDialog(datas) {
        var orderId = datas.orderId;
        this.isShowOrderDetail = true;
        this.$Axios({
          url: '/api/getOrderDetails?orderId=' + orderId,
          method: "get",
        }).then(backdata => {
          this.orderDetailData = backdata.data;
        });
      },
      // 修改订单状态
      editOrder(datas) {
        // console.log("已完成");
        var orderId = datas.orderId;
        var orderState=datas.orderState;
        if(orderState=="已取消"){
          this.$notify({
              message: "该订单已取消",
              type: "info",
              duration:500
              });
        }else if(orderState=="已完成"){
          this.$notify({
              message: "该订单已完成",
              type: "info",
              duration:500
              });
          }else{
          var urls = "/api/editOrder?orderId=" + orderId + "&&buttonValue='已完成'";
          this.$Axios({
            url: urls,
            method: "put",
          }).then(backdata => {
            if (backdata.status == 200) {
              this.$notify({
                title:'成功',
                message: "修改成功",
                type: "success",
                duration:500
              });
            } else {
              this.$notify.error("修改失败！").duration(500)
            }
            this.getorders();
          });
          }
      },
    },
  }
</script>

<style>
  .box {
    margin: 20px 0px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-table thead {
    height: 50px;
    line-height: 50px;
  }
  .searchbar {
    width: 80%;
    height: 60px;
    line-height: 50px;
    margin: 0 auto;
  }
  .el-select .el-input {
    width: 130px;
  }
  .searchbar {
    width: 100%;
    position: relative;
  }
  .input-with-select {
    background-color: #fff;
    float: left;
  }
  .finishedAll {
    float: left;
    margin: 10px;
  }

  .el-dialog{
    width: 77%;
  }
  .el-dialog__header{
    height: 50px;
    line-height: 50px;
    padding: 0px;
  }
  .el-dialog__body{
    padding: 0px,20px;
  }
</style>
