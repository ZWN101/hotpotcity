<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>餐桌管理</el-breadcrumb-item>
      <el-breadcrumb-item>餐桌类型管理</el-breadcrumb-item>
    </el-breadcrumb>

      <div class="box">
      <div>
        <el-button type="primary" @click="addDeskClass()">添加餐桌类型</el-button>
      </div>
      <!-- <div>
        <el-input  placeholder="请输入要检索的餐桌类"  class="input-with-select" v-model="inputDeskClassName">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div> -->
    </div>

    <!-- 表格 -->
    <el-table :data="deskClassList.slice((currentPage - 1) * PageSize, currentPage * PageSize)"  border style="width: 100%">
      <el-table-column prop="deskPeop" label="餐桌类型">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <i class="el-icon-edit"  @click="editDeskClass(scope.row)"></i>
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

    <!-- 添加餐桌类 -->
    <el-dialog title="餐桌信息" :visible.sync="addFormVisible">
      <el-form :model="addInput" prop="deskPeop">
        <el-form-item label="餐桌类型" :label-width="formLabelWidth">
          <el-input v-model.trim="addInput.deskPeop" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="completeAdd()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑餐桌类 -->
    <el-dialog title="餐桌信息" :visible.sync="editFormVisible">
      <el-form :model="editInput">
        <el-form-item label="餐桌类型" :label-width="formLabelWidth">
          <el-input v-model="editInput.deskPeop" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="completeEdit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      deskClassList:[],
      addFormVisible:false,
      editFormVisible:false,
      formLabelWidth: '120px',
      addInput:{
        deskPeop:""
      },
      inputDeskClassName:"",
      editInput:{},
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
  methods:{
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
   getDeskClass(serarchName = '') {
        var url = '/api/getDeskClasses';
        this.$Axios.get(url)
          .then((backdata) => {
            // console.log(backdata);
            this.deskClassList = backdata.data;
            this.totalCount = backdata.data.length;
          });
      },
    addDeskClass(){
      this.addFormVisible=true;
    },
    completeAdd(){
      //  console.log("完成添加")
      if(this.addInput.deskPeop==''){
         this.$notify.error({
              message: '请输入餐桌类',
              duration:500
        });
      }else{
       this.addFormVisible=false;
       var url= '/api/addDeskClass';
       this.$Axios({
         url:url,
         method:"post",
         data:this.addInput
       }).then(backdata=>{
         if (backdata.data >=1) {
          this.$notify({
             title: '成功',
             message: '添加成功',
             type: 'success',
             duration:500
        });} else {
          this.$notify.error({
              title: '错误',
              message: '添加失败',
              duration:500
        });
        }
        this.addInput.deskPeop='';
        this.getDeskClass(" ");
         });
      }
    },
    editDeskClass(deskClass){
      // console.log(deskClass);
      this.editFormVisible=true;
      this.editInput=deskClass;
    },
    completeEdit(){
       this.editFormVisible=false;
       var url= '/api/updateDeskClass?deskClassId='+this.editInput.deskClassId;
       this.$Axios({
         url:url,
         method:"put",
         data:this.editInput
       }).then(backdata=>{
         if (backdata.data >=1) {
          this.$notify({
             title: '成功',
             message: '修改成功',
             type: 'success',
             duration:500
        });} else {
          this.$notify.error({
              title: '错误',
              message: '修改失败',
              duration:500
        });
        }
        this.getDeskClass(" ");
         });
      }
  },
  mounted(){
    this.getDeskClass(" ");
  }
};
</script>

<style scoped>
 .box {
    width: 95%;
    margin: 20px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .edit-dialog{
    width: 40%;
    }
  .el-icon-edit{
    cursor: pointer;
  }
  .el-icon-edit:hover{
    color:#409EFF;
  }
</style>>