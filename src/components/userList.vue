<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row :gutter="20">
      <el-col :span="20">
        <div class="box">
          <el-input placeholder="请输入用户昵称或精确的手机号" v-model.trim="usersearch">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <!-- <el-button class="el-icon-refresh" @click="getsearch('')"></el-button> -->
        </div>
      </el-col>
      <!-- <el-col :span="4"><el-button type="primary" style="width:100%" >添加用户</el-button></el-col> -->
    </el-row>

    <el-table :data="userlist.slice((currentPage - 1) * PageSize, currentPage * PageSize)" border style="width: 100%">
      <el-table-column fixed prop="nickName" label="昵称" width="200"></el-table-column>
      <el-table-column prop="userName" label="用户名" width="150"> </el-table-column>
      <el-table-column prop="userSex" label="性别" width="120" :formatter="sexFormatter"></el-table-column>
      <el-table-column prop="userBirth" label="用户生日" width="150"> </el-table-column>
      <el-table-column prop="userEmail" label="用户邮箱" width="350"></el-table-column>
      <el-table-column prop="userPhone" label="用户手机号" width="150"> </el-table-column>
      <!-- <el-table-column fixed="right" label="操作" width="150">
        <template >
          <el-button size="mini">编辑</el-button>
          <el-button size="mini" type="danger" >删除</el-button>
        </template>
      </el-table-column> -->
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
      userlist : [],
      usersearch : '',
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
    };
  },
  watch:{
    usersearch(newValue,oldValue){
      this.getsearch(newValue);
    }
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
  // 获取搜索框的值 确定url
    getsearch (search = ''){  
      var url = "" ;
      var data = {};
      var jsonObj= {
        nickName:search,
        userPhone:search
      }
      if (search!='') {
          url = "/api/users/getUser"
          data = jsonObj;
      } else {
          url = "/api/users/list"
      }

      this.$Axios({
        url : url,
        method : 'post',
        data : data,
        header : {
          'Content-Type' : 'application/json;charset=utf-8'
        }
      }).then((res) => {
        if (res.status == 200) {
             this.userlist = res.data.data
            this.totalCount = this.userlist.length;
            console.log(res.data.data)
        }
      }).catch(err => {console.log(err)})

    },
    sexFormatter(row,cloum){
      if (row.userSex == 1) {
        return '男'
      } else {
        return '女'
      }
    },
    // 进行查询
    // search(){
    //   this.getsearch(this.usersearch);
    // }
  },
  // 展示
  mounted() {
    this.getsearch('');
  }
}
</script>

<style scoped>
  .box{
    margin: 20px  0px;
    width: 40%;
    display: flex;
    justify-content: space-between;
    float: right;
    align-items: center;
  }
</style>