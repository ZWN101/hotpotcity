<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>食物大类管理</el-breadcrumb-item>
      <el-breadcrumb-item>食物大类管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div class="box">
      <div>
        <el-button class="addbtn" type="primary" @click="showBigDialog" >添加大类</el-button>
      </div>
      <div>
        <el-input placeholder="请输入要检索的大类" v-model.trim="bigClassSearch" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"  @click="searchBig()"></el-button>
        </el-input>
      </div>
    </div>

    <!-- 大类列表 -->
    <el-table class="tabbig"  :data="bigList.slice((currentPage - 1) * PageSize, currentPage * PageSize)" border>
      <el-table-column prop="bigClassName" label="大类名" >
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <i class="el-icon-edit"  @click="editBig(scope.row)"></i>
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

    <!-- 添加食物大类 -->
    <el-dialog title="添加食物大类" :visible.sync="isShowAddBig">
      <el-form :model="addBigData">
        <el-form-item label="食物大类名称">
          <el-input
            v-model="addBigData.bigClassName"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAddBig = false">取 消</el-button>
        <el-button type="primary" @click="addBigPost">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑大类 -->
    <el-dialog title="编辑大类" :visible.sync="isShowEditBig">
      <el-form v-model="editBigData">
        <!-- <el-form-item label="大类编号">
          <el-input v-model="editBigData.bigClassId" auto-complete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="大类姓名">
          <el-input
            v-model="editBigData.bigClassName"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowEditBig = false">取 消</el-button>
        <el-button type="primary" @click="editBigPut">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    return {
      msg: "大类列表",
      bigList: [],
      bigClassSearch: "",
      //添加大类需要的参数
      isShowAddBig: false,
      addBigData: {
        // bigClassId: '',
        bigClassName: "",
      },
      //编辑大类需要的参数
      isShowEditBig: false,
      editBigData: "",
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
  mounted() {
    this.getBigClass("");
  },
  watch: {
    bigClassSearch(newValue, oldValue) {
      this.getBigClass(newValue);
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
    getBigClass(serarchName = "") {
      // alert("searchName="+serarchName);
      var url = "";
      if (serarchName != "") {
        url = "/api/searchBigClass?bigClassName=" + serarchName;
      } else {
        url = "/api/bigClass";
      }
      this.$Axios.get(url).then((backdata) => {
        this.bigList = backdata.data;
        this.totalCount = backdata.data.length;
      });
    },
    searchBig() {
      this.getBigClass(this.bigClassSearch);
      this.bigClassSearch = "";
    },
    handleClick(row) {
      console.log(row);
    },
    showBigDialog() {
      this.isShowAddBig = true;
    },
    addBigPost() {
      this.isShowAddBig = false;
      this.$Axios({
        url: "/api/addBigClass",
        method: "post",
        data: this.$qs.stringify(this.addBigData),
      }).then((backdata) => {
        if (backdata.data >= 1) {
          this.$notify({
            message: "添加成功!",
            type: "success",
            duration:500
          });
        } else {
          this.$notify({
            message: "添加失败!",
            type: "error",
            duration:500
          });
        }
        this.getBigClass("");
        for (let key in this.addBigData) {
          this.addBigData[key] = "";
        }
      });
    },
    //修改大类信息
    editBig(row) {
      // alert(row.bigClassId);
      this.isShowEditBig = true;
      this.$Axios
        .get("/api/bigClassDetail?bigClassId=" + row.bigClassId)
        .then((backdata) => {
          console.log(backdata.data);
          this.editBigData = backdata.data[0];
        });
    },
    editBigPut() {
      var urls = "/api/editBigClass?bigClassId="+this.editBigData.bigClassId;
      this.$Axios({
        url: urls,
        method: "put",
        data: this.$qs.stringify(this.editBigData),
      }).then((backdata) => {
        if (backdata.status == 200) {
          this.$notify({
            message: "修改成功",
            type: "success",
            duration:500
          });
          this.isShowEditBig = false;
          this.getBigClass("");
        } else {
          this.$notify.error("修改失败！").duration(500);
        }
      });
    },
  },
};
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
.el-icon-edit{
  cursor: pointer;
}
.el-icon-edit:hover{
  color: #409EFF;
}
</style>