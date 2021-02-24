<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章类管理</el-breadcrumb-item>
    </el-breadcrumb>

      <div class="box">
      <div>
        <el-button type="primary" @click="addArticleClass()">添加文章类</el-button>
      </div>
    </div>

    <!-- 表格 -->
     <el-table :data="articleClassList.slice((currentPage - 1) * PageSize, currentPage * PageSize)"  border style="width: 100%">
      <el-table-column prop="articleClassName" label="文章类名">
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
    <!-- 分页 -->

  <!-- 添加文章类 -->
   <el-dialog title="文章类信息" :visible.sync="addFormVisible">
      <el-form :model="addInput">
        <el-form-item label="文章类名" :label-width="formLabelWidth">
          <el-input v-model.trim="addInput.articleClassName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="completeAdd()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑文章类 -->
      <el-dialog title="文章类信息" :visible.sync="editFormVisible">
      <el-form :model="editInput">
        <el-form-item label="文章类名" :label-width="formLabelWidth">
          <el-input v-model.trim="editInput.articleClassName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="completeEdit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return{
      articleClassList:[],
      addFormVisible:false,
      formLabelWidth:"120px",
      addInput:{
        articleClassName:""
      },
      editFormVisible:false,
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
  mounted(){
    this.getArticleClass(" ");
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
    getArticleClass(searchId=" "){
      if(searchId==' '){
        var url='/api/getArticleClasses';
        this.$Axios({
        url:url,
        method:'get'
      }).then(backdata=>{
        this.articleClassList=backdata.data;
        this.totalCount = backdata.data.length;
      });
      }
    },
    addArticleClass(){
      // console.log("添加文章类");
      this.addFormVisible=true;
    },
    completeAdd(){
       if(this.addInput.articleClassName==''){
         this.$notify.error({
              message: '请输入文章类名',
              duration:500
        });
       }else{
      var url="/api/addArticleClass";
      this.$Axios({
        url:url,
        method:"post",
        data:this.addInput
      }).then((backdata)=>{
         if(backdata.data>=1){
          this.$notify({title: '成功', message: '添加成功',type: 'success',duration:500});
          }else{
          this.$notify({title: '失败', message: '添加失败',type: 'error',duration:500});
          }
          this.getArticleClass(" ");
          this.addFormVisible=false;
          this.addInput.articleClassName="";
      })
       }
    },
    editDeskClass(row){
      this.editFormVisible=true;
      this.editInput=row;
    },
    completeEdit(){
      var url='/api/updateArticleClass?articleClassId='+this.editInput.articleClassId;
      this.$Axios({
        url:url,
        method:"put",
        data:this.editInput
      }).then(backdata=>{
          if(backdata.data>=1){
          this.$notify({title: '成功', message: '修改成功',type: 'success',duration:500});
          }else{
          this.$notify({title: '失败', message: '修改失败',type: 'error',duration:500});
          }
          this.getArticleClass(" ");
          this.editFormVisible=false;
      });
    }
  }
};
</script>

<style scoped>
 .box {
    margin: 20px 0px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
   .el-icon-edit{
    cursor: pointer;
  }
  .el-icon-edit:hover{
    color:#409EFF;
  }
</style>>