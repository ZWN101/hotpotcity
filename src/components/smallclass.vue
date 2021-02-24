<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>食物小类管理</el-breadcrumb-item>
      <el-breadcrumb-item>食物小类管理</el-breadcrumb-item>
    </el-breadcrumb>
    
    <!-- 搜索框 -->
    <div class="box">
      <div>
        <el-button class="addbtn" type="primary" @click="showSmallDialog" >添加小类</el-button>
      </div>
      <div>
        <el-input placeholder="请输入要检索的小类" v-model.trim="smallClassSearch" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"  @click="searchSmall()"></el-button>
        </el-input>
      </div>
    </div>

    <!-- 小类列表 -->
    <el-table class="tabbig"  :data="smallList.slice((currentPage - 1) * PageSize, currentPage * PageSize)"   border>
      <el-table-column prop="smallClassName" label="小类名称">
      </el-table-column>
      <el-table-column  prop="bigClassName" label="大类名称" >
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <i class="el-icon-edit"  @click="editSmall(scope.row)"></i>
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

    <!-- 添加食物小类 -->
    <el-dialog title="添加食物小类" :visible.sync="isShowAddSmall">
      <el-form  class="box" :model="addSmallData">
        <el-form-item  class="name" label="小类名称">
          <el-input v-model="addSmallData.smallClassName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="belong" label="所属大类">
          <el-select v-model="value" placeholder="请选择所属大类">
            <el-option v-for="item in bigList" :key="item.bigClassId" :label="item.bigClassName" :value="item.bigClassId"> </el-option>
         </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAddSmall = false">取 消</el-button>
        <el-button type="primary" @click="addSmallPost ">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改小类 -->
    <el-dialog title="修改小类" :visible.sync="isShowEditSmall">
      <el-form  class="box"  v-model="editSmallData">
        <el-form-item class="name" label="小类名称">
          <el-input v-model="editSmallData.smallClassName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="belong" label="所属大类">
          <el-select v-model="editValue" placeholder="请选择所属大类">
            <el-option v-for="item in bigList" :key="item.bigClassId" :label="item.bigClassName" :value="item.bigClassId"> </el-option>
         </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowEditSmall = false">取 消</el-button>
        <el-button type="primary" @click="editSmallPut ">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
  export default {
    data() {
      return {
        msg: '小类列表',
        smallList: [],
        smallClassSearch:'',
        //添加大类需要的参数
        isShowAddSmall: false,
        addSmallData: {
          // smallClassId: '',
          smallClassName: '',
          bigClassId: ''
        },
        bigList:'',
        value:'',
        editValue:'',
        //编辑大类需要的参数
        isShowEditSmall: false,
        editSmallData: '',
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
    mounted() {
      this.getSmallClass('');
      this.getBigClass("");
    },
    watch: {
      smallClassSearch(newValue, oldValue) {
       this.getSmallClass(newValue);
      },
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
       getBigClass() {
      var url = "";
        url = "/api/bigClass";
      this.$Axios.get(url).then((backdata) => {
        this.bigList = backdata.data;
      });
      },
      getSmallClass(serarchName = '') {
        var url = '';
        if (serarchName!='') {
          url='/api/searchSmallClass?smallClassName=' +serarchName;
        } else{
          url='/api/smallClass';
        }
        this.$Axios.get(url)
          .then((backdata) => {
            this.smallList = backdata.data;
            this.totalCount = backdata.data.length;
          });
      },
      searchSmall() {
       this.getSmallClass(this.smallClassSearch);
        this.smallClassSearch='';
      },
      handleClick(row) {
        console.log(row);
      },
      showSmallDialog() {
        this.isShowAddSmall = true;
      },
      addSmallPost() {
        this.isShowAddSmall = false;
        this.addSmallData.bigClassId=this.value;
        this.$Axios({
          url: '/api/addSmallClass',
          method: "post",
          data: this.$qs.stringify(this.addSmallData)
        }).then(backdata => {
          if(this.addSmallData.bigClassId==''){
            this.$message({
            message: '所属大类不能为空',
            type: 'warning'
            });
            this.isShowAddSmall = true;
          }else if (this.addSmallData.bigClassId!='') {
           this.$notify({
             message: '添加成功!',
             type: 'success',
             duration:500
           });
         } else {
           this.$notify({
             message: '添加失败!',
             type: 'error',
             duration:500
           });
         }
          this.getSmallClass("");
          for(let key in this.addSmallData){
            this.addSmallData[key]='';
          }
        });
      },
      //修改小类信息
      editSmall(row) {
        // alert(row.smallClassId);
        this.isShowEditSmall = true;
        this.$Axios.get('/api/smallClassDetail?smallClassId='+row.smallClassId)
          .then(backdata => {
            console.log(backdata.data);
            this.editSmallData = backdata.data[0];
            this.editValue=this.editSmallData.bigClassId;
          });
      },
      editSmallPut() {
        var urls = '/api/editSmallClass?smallClassId='+this.editSmallData.smallClassId;  
        this.editSmallData={
          smallClassName:this.editSmallData.smallClassName,
          bigClassId:this.editValue
        };     
        this.$Axios({
          url: urls,
          method: "put",
          data: this.$qs.stringify(this.editSmallData)
        }).then(backdata => {
         if (backdata.status==200) {
          this.$notify({
            message:"修改成功",
            type:"success",
            duration:500
          });
          this .isShowEditSmall=false;
          this.getSmallClass("");
        } else{
          this.$notify.error("修改失败！").duration(500);
        }
        });
      },

    }


  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
 
.box{
  margin: 20px 0px;
  width:100%;
  display: flex;
  float: left;
  justify-content: space-between;
  align-items: center;
}
.addbtn {
  float: left;
  margin: 20px 0px;
}
.input-with-select {
  width: 220px;
  margin: 20px 0px;
  background-color: #fff;
  float: right;
}
.tabbig {
  width: 100%;
  line-height: 30px;
}
.name{
  float: left;
  margin-left:40px ;
}
.belong{
  float: right;
  margin-right: 40px;
}
.el-icon-edit{
  cursor: pointer;
}
.el-icon-edit:hover{
  color: #409EFF;
}
</style>
