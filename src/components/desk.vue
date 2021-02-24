<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>餐桌管理</el-breadcrumb-item>
      <el-breadcrumb-item>餐桌管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="box">
      <div>
        <el-button type="primary" @click="addDesk()">添加餐桌</el-button>
      </div>
      <div>
        <el-input  placeholder="请输入要检索的可用餐桌"  class="input-with-select" v-model.trim="inputDesk">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="deskList.slice((currentPage - 1) * PageSize, currentPage * PageSize)"  border style="width: 100%">
      <el-table-column prop="deskId" label="餐桌编号">
      </el-table-column>
        <el-table-column prop="deskPeop" label="餐桌类型">
      </el-table-column>
         <el-table-column prop="isUse" label="是否可用">
          <template slot-scope="scope">
          <el-switch v-model="scope.row.isUse"  active-color="#13ce66" inactive-color="#ff4949"  active-value="1" inactive-value="0" @change="isUseChange(scope.row.deskId,scope.row.isUse)">
            </el-switch>  
          </template>        
      </el-table-column>  
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <i class="el-icon-edit"  @click="editDesk(scope.row)"></i>
          <i class="el-icon-delete" @click="deleteDesk(scope.row)"></i>
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

    <!-- 添加餐桌 -->
    <el-dialog title="餐桌信息" :visible.sync="addFormVisible">
      <el-form>
        <el-form-item label="餐桌类型" :label-width="formLabelWidth">
           <el-select v-model="deskClassId" placeholder="————请选择————">
           <el-option  v-for="item in deskClasses" :key="item.deskClassId"  :label="item.deskPeop" :value="item.deskClassId"></el-option>
          </el-select>
        </el-form-item>
           <el-form-item label="数量" :label-width="formLabelWidth">
           <el-input-number v-model="deskNO"  label="餐桌数量"></el-input-number>
        </el-form-item>
        <el-form-item label="是否可用">
         <el-radio-group v-model="addRadio" @change="addChange">
           <el-radio :label="1">可用</el-radio>
           <el-radio :label="0">不可用</el-radio>
        </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="completeAdd()">确 定</el-button>
      </div>
    </el-dialog>

     <!-- 编辑餐桌 -->
     <el-dialog title="餐桌信息" :visible.sync="editFormVisible">
      <el-form :model="desk">
        <el-form-item label="餐桌类型" :label-width="formLabelWidth">
           <el-select v-model="desk.deskClassId" placeholder="————请选择————">
           <el-option  v-for="item in deskClasses" :key="item.deskClassId"  :label="item.deskPeop" :value="item.deskClassId"></el-option>
          </el-select>
        </el-form-item>
          <el-form-item  label="是否可用">
         <el-radio-group v-model="editRadio" @change="editChange">
           <el-radio :label="1">可用</el-radio>
           <el-radio :label="0">不可用</el-radio>
        </el-radio-group>
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
      addFormVisible:false,
      editFormVisible:false,
      formLabelWidth:'120px',
      deskClasses: [],
      deskClassId:undefined,
      editDeskClassId:undefined,
      deskNO:1,
      addRadio:1,
      editRadio:undefined,
      deskList:[],
      deskPeop:'',
      desk:{},
      inputDesk:" ",
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
    this.getDeskClass(' ');
    this.getDesks(' ');
    
  },
  // created: function () {
  //   this.getDesks();
  // },
  watch:{
    inputDesk(newValue,oldValue){
      this.getDesks(newValue);
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
   getDesks(searchName=' '){
        var url = '';
        if (searchName == ' ') {
          url = '/api/getDesks';
        }else{
          url = '/api/getDesksByType?deskPeop='+searchName;
        }
        this.$Axios.get(url)
          .then((backdata) => {
            // console.log(backdata);
            this.deskList = backdata.data;
           // 将数据的长度赋值给totalCount
            this.totalCount = backdata.data.length;
          });
    },
    getDeskClass(searchId=' '){
      if(searchId==' '){
        var url='/api/getDeskClasses';
        this.$Axios({
        url:url,
        method:'get',
      }).then(backdata=>{
        this.deskClasses=backdata.data;
      });
      }
    },
    addDesk(){
      this.addFormVisible=true;
    },
    addChange(isUse){
      this.addRadio=isUse;
    },
    completeAdd(){
      if(this.deskClassId==undefined){
        this.$notify.error({message: '请选择餐桌类型',duration:500});
      }else{
        this.addFormVisible=false;
        var desk={
           isUse:this.addRadio,
           deskClassId:this.deskClassId
          }
        var obj={
          desk:desk,
          deskNO:this.deskNO
        }
        var url="/api/addDesk";
        this.$Axios({
          url:url,
          method:"post",
          data:obj
        }).then(backdata=>{
          // console.log(backdata);
          if(backdata.data>=1){
          this.$notify({title: '成功', message: '添加成功',type: 'success',duration:500});
          }else{
          this.$notify({title: '失败', message: '添加失败',type: 'error',duration:500});
          }
          this.deskClassId=undefined;
          this.addRadio=1;
          this.getDesks(' ');
        });
      }
       
  },
  editDesk(desk){
    this.editFormVisible=true;
    this.desk=desk;
    this.editRadio=Number(desk.isUse);
  },
  editChange(isUse){
    this.editRadio=isUse;
  },
  completeEdit(){
    // console.log(this.desk.deskClassId);
    this.editFormVisible=false;
    var url='/api/updateDesk?deskId='+this.desk.deskId;
    this.desk.isUse=this.editRadio;
    delete this.desk.deskPeop;
    this.$Axios({
      url:url,
      method:"put",
      data:this.desk
    }).then(backdata=>{
       if(backdata.data>=1){
          this.$notify({title: '成功', message: '修改成功',type: 'success',duration:500});
          }else{
          this.$notify({title: '失败', message: '修改失败',type: 'error',duration:500});
          }
      });
      this.getDesks(" ");
    },
  isUseChange(deskId,newValue){
    var url='/api/updateDeskUse?deskId='+deskId;
    this.$Axios({
      url:url,
      method:"put"
    }).then(backdata=>{
      // console.log(backdata.data);
      this.getDesks(' ');
    })
  },
  deleteDesk(desk){
    var deskId=desk.deskId;
    this.$confirm('确定删除该餐桌吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          // console.log("点击了确定");
     var url='/api/deleteDesk?deskId='+deskId;
      this.$Axios({
      url:url,
      method:"delete"
    }).then(backdata=>{
     if(backdata.data>=1){
          this.$notify({title: '成功', message: '删除成功',type: 'success',duration:500});
     }else{
          this.$notify({title: '失败', message: '删除失败',type: 'error',duration:500});
          }
      this.getDesks(' ');
    });
        }).catch(()=>{
          // console.log("已取消删除")
           this.$notify({message: '已取消删除',type: 'info',duration:500});
        });
  } 
    }
     }
</script>
 
 <style  scoped>
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
  .el-icon-delete{
    cursor: pointer;
  }
   .el-icon-delete:hover{
    color:#409EFF;
  }
 </style>