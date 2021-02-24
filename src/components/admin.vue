<template>
  <div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>员工管理</el-breadcrumb-item>
      <el-breadcrumb-item>员工列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row :gutter="20">
      <el-col :span="20">
        <div class="box">
            <div>
              <el-button type="primary" style="width:100%" @click="addVisible = true">添加管理员</el-button>
            </div>
            <div>
              <el-input placeholder="请输入管理员名" v-model.trim="adminsearch">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
        </div>
      </el-col>
    </el-row>

    <el-table :data="adminlist.slice((currentPage - 1) * PageSize, currentPage * PageSize)"  border style="width: 100%">
      <el-table-column  prop="adminName" label="管理员名"></el-table-column>
      <el-table-column prop="flag" label="身份"  :formatter="flagFormatter"> </el-table-column>
      <el-table-column  label="操作">
        <template slot-scope="scope">
          <i class="el-icon-edit" @click="editAdmin(scope.row), editVisible = true"></i>
          <!-- <el-button size="mini" @click="editAdmin(scope.row), editVisible = true">编辑</el-button> -->
          <i class="el-icon-delete" slot="reference" @click="handleDelete(scope.row)"></i>
          <!-- <el-button slot="reference" size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button> -->
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

    <!-- 添加 -->
    <el-dialog title="添加管理员" :visible.sync="addVisible" width="35%">
        <el-form :model="admins" label-width="100px">
          <el-form-item label="管理员名:" >
            <el-input type="text" v-model="admins.adminName" placeholder="请输入管理员名" ></el-input>
          </el-form-item>
          <el-form-item label="管理员密码:" >
            <el-input type="text" v-model="admins.adminPWD" placeholder="请输入管理员密码" ></el-input>
         </el-form-item>
          <el-form-item label="管理员身份:">
            <el-radio-group v-model="admins.flag" size="small">
              <el-radio label="1" border>超级管理员</el-radio>
              <el-radio label="0" border>管理员</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form> 
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAdmin()">添加</el-button>
      </span>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="修改信息" :visible.sync="editVisible" width="35%">
        <el-form :model="editAdminData" label-width="100px">
          <el-form-item label="管理员名:" prop="adminName">
            <el-input type="text" v-model="editAdminData.adminName"></el-input>
          </el-form-item>
          <el-form-item label="管理员身份:" prop="flag">
            <el-radio-group v-model="editAdminData.flag" size="small">
              <el-radio label="1" border>超级管理员</el-radio>
              <el-radio label="0" border>管理员</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click=" editVisible = false ">取 消</el-button>
        <el-button type="primary" @click="doEdit(),editVisible = false">修改</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
        adminlist : [],
        adminsearch : '',
        //添加管理员
        addVisible: false,
        admins:{
            adminName:'',
            adminPWD:'',
            flag:'0'
        },
        // 编辑用户
        editVisible: false,
        editAdminData:{},
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
    adminsearch(newValue,oldValue){
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
    getsearch (search = '') {  
      if (search != '') {
        var data = {adminName:search}
        // console.log(data);
        var url = "/api/admins/getByName"
      } else {
        var url = "/api/admins/get"
        var data = {}
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
          if(sessionStorage.getItem("login_flag")=='1'){
            this.adminlist = res.data.data
            this.totalCount = res.data.data.length;
          }
            // console.log(res.data.data)
        } else {
            this.$notify({
                message: "管理员不存在",
                type: "error",
                duration:1000
            });
        }
      
      }).catch(err => {console.log(err)})

    },
    // 0、1转换为文字
    flagFormatter(row,cloum){
      if (row.flag == 1) {
        return '超级管理员'
      } else {
        return '管理员'
      }
    },
    // 增加
    addAdmin () {
        if (this.admins.adminName==''||this.admins.adminPWD==''||this.admins.flag=='') {
            this.$notify.error("请填写完所有信息！").duration(500);;
        } else {
            var addAdminlist = {
                adminName:this.admins.adminName,
                adminPWD:this.admins.adminPWD,
                flag:this.admins.flag,
            }

            let url = "api/admins/add"
            this.$Axios({
                url:url,
                method:'post',
                data:addAdminlist,
                header : {
                    'Content-Type' : 'application/json;charset=utf-8'
                }
            }).then( res => {
                if(res.status == 200){
                    this.$notify({
                        message: "添加成功！",
                        type: "success",
                        duration:500
                    });
                    this.addVisible=false;
                    this.admins.adminName="",
                    this.admins.adminPWD='',
                    this.admins.flag='' 
                    this.getsearch('');
                }else if (res.status == 207){
                    this.$notify({
                        message: "管理员已存在",
                        type: "error",
                        duration:500
                    });
                } else {
                    this.$notify({
                        message: "添加失败",
                        type: "error",
                        duration:500
                    });
                }
            }).catch(err =>{console.log(err)})

            
        }
    },
      // 删除
      async handleDelete(row) {
        let result = await this.$confirm('确认删除？','提示',{
          confirmButtonText: '确定删除',
          cancleButtonText: '取消',
          type:'warning'
        }).catch(err => console.log(err))
 
        if(!result) {
          return this.$notify.info('取消删除').duration(500);
        } else {
          let url = "api/admins/delete"
          let data = {adminId:row.adminId}
          console.log(row.adminId);
          this.$Axios({
            url : url,
            method : 'post',
            data : data,
            header : {
              'Content-Type' : 'application/json;charset=utf-8'
          }
          }).then((res) => {
            this.$notify({
              message: "删除成功！",
              type: "success",
              duration:500
            });
            this.getsearch();
          }).catch(err => {console.log(err)})
        }
      },

    // 编辑
    editAdmin(row) {
      let data = {
        adminId:row.adminId,
        adminName:row.adminName
        }
      console.log(row.adminId)
      let url = "api/admins/getOne"
      this.$Axios({
        url : url,
        method : 'post',
        data : data,
        header : {
          'Content-Type' : 'application/json;charset=utf-8'
        }
      }).then((res) => {
       this.editAdminData = res.data.data;
        console.log(res.data.data)
      }).catch(err => {console.log(err)})
    },
    doEdit(){
       let data = {
        adminId:this.editAdminData.adminId,
        adminName : this.editAdminData.adminName,
        flag : this.editAdminData.flag
      }
      var url = "api/admins/update"
      this.$Axios({
        url : url,
        method : 'post',
        data : data,
        header : {
          'Content-Type' : 'application/json;charset=utf-8'
        }
      }).then(res => {
         this.$notify({
            message: "修改成功！",
            type: "success",
            duration:500
          });
         this.getsearch();
      }).catch(err => {console.log(err)});
  }
},
  // 展示
mounted() {
    this.getsearch();
  }
}
</script>

<style scoped>
  .el-icon-edit{
    cursor: pointer;
  }
  .el-icon-edit:hover{
    color:#409EFF;
  }
  .el-icon-delete{
    cursor: pointer;
  }
  .el-icon-delete:hover{
    color: #409EFF;
  }
  .box{
    margin: 20px  0px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>