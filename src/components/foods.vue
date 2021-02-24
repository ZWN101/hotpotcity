<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>食物管理</el-breadcrumb-item>
      <el-breadcrumb-item>食物管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="box">
      <div>
        <el-button type="primary" @click="addFood()">添加食物</el-button>
      </div>
      <div>
         <el-input placeholder="请输入要检索的食物" v-model.trim="inputNameFood" class="input-with-select" >
          <el-button slot="append" icon="el-icon-search" @click="searchFood()" ></el-button>
        </el-input>
        <el-input placeholder="请输入要检索的小类" v-model.trim="inputSmallName" class="input-with-select" >
          <el-button slot="append" icon="el-icon-search" @click="searchSmallFood(inputSmallName)" ></el-button>
        </el-input>
       <el-input placeholder="请输入要检索的大类" v-model.trim="inputBigName" class="input-with-select" >
          <el-button slot="append" icon="el-icon-search" @click="searchBigFood(inputBigName)" ></el-button>
        </el-input>
      </div>
      
    </div>

    <el-table class="tabbig" :data="foodList.slice((currentPage - 1) * PageSize, currentPage * PageSize)"  border >
       <el-table-column type="expand">
      <template slot-scope="props">
        <span class="content"> 食物介绍：</span><br>
        <span>{{ props.row.foodDetails }}</span>
      </template>
        </el-table-column>
      <el-table-column prop="foodName" label="食物名称">
      </el-table-column>
      <el-table-column prop="foodPrice" label="食物价格">
      </el-table-column>
      <el-table-column prop="foodImg" label="食物图片" >
          <template slot-scope="scope">
           <el-popover
            placement="right"
            width="200"
            trigger="hover">
            <img v-if="scope.row.foodImg" :src="httpRequestUrl+scope.row.foodImg"  style="max-height:200px;max-width:200px"/>
            <img slot="reference" v-if="scope.row.foodImg" :src="httpRequestUrl+scope.row.foodImg" style="max-height:50px;max-width: 50px">
        </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="recommend" label="是否推荐" :formatter="recommendFormat">
      </el-table-column>
      <el-table-column prop="smallClassName" label="小类名称" >
      </el-table-column>
      <el-table-column prop="bigClassName" label="大类名称" >
      </el-table-column>
      <!-- <el-table-column  label="食物详情" >
        <template slot-scope="scope">
          <el-link type="info" @click="getDetail(scope.row)">查看详情</el-link>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <i class="el-icon-edit"  @click="editFood(scope.row)"></i>
          <i class="el-icon-delete" @click="deleteFood(scope.row)"></i>
        </template>
      </el-table-column>
      <!--
      scope.$index 获取当前行下标
      scope.row  获取当前行对象
      -->
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

<!-- 食物详情 -->
    <el-dialog title="食物详情" :visible.sync="showDetail">
      <el-form :model="detailData" >
          <el-input  type="textarea" v-model="detailData.foodDetails" autocomplete="off" readonly=""></el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDetail = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 添加食物模态框 -->
    <el-dialog title="添加食物信息" :visible.sync="addFoodFormVisible">
      <el-form :model="addFoodData">
      <div class="box">
        <el-form-item class="foodname" label="食物名称" :label-width="formLabelWidth">
          <el-input v-model.trim="addFoodData.foodName" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item class="price" label="食物价格" :label-width="formLabelWidth">
          <el-input v-model.number="addFoodData.foodPrice" autocomplete="off" ></el-input>
        </el-form-item>
      </div>        
        <el-form-item label="食物图片" :label-width="formLabelWidth">
           <!-- 添加图片 -->
        <el-upload
          action=""
          list-type="picture-card"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :auto-upload="false"
          :limit="1"
          :file-list="fileList1"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">
            只能上传一张图，如需更换请先删除列表中的
          </div>
        </el-upload>
        <!-- 添加图片 -->
         <el-form-item  label="是否推荐">
         <el-radio-group v-model="addFoodData.recommend" @change="addChange">
           <el-radio :label="1">推荐</el-radio>
           <el-radio :label="0">不推荐</el-radio>
        </el-radio-group>
        </el-form-item>
        </el-form-item>
        <el-form-item label="食物详情" :label-width="formLabelWidth">
          <el-input type="textarea" v-model.trim="addFoodData.foodDetails" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="食物的类" :label-width="formLabelWidth">
          <el-select v-model="bigValue"  placeholder="请选择食物所属大类" @change="change">
            <el-option v-for="item in bigList" :key="item.bigClassId" :label="item.bigClassName" :value="item.bigClassId"> </el-option>
          </el-select>
          <el-select v-model="smallValue"  placeholder="请选择食物所属小类">
            <el-option v-for="item in smallList" :key="item.smallClassId" :label="item.smallClassName" :value="item.smallClassId" > </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd()">取 消</el-button>
        <el-button type="primary" @click="completeAdd()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑食物模态框 -->
    <el-dialog title="食物信息" :visible.sync="isShowEditFood" :before-close="handleClose">
      <el-form :model="editFoodData" enctype="multipart/form-data">
        <el-form-item label="食物名称" :label-width="formLabelWidth">
          <el-input v-model="editFoodData.foodName" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="食物价格" :label-width="formLabelWidth">
          <el-input  v-model="editFoodData.foodPrice" autocomplete="off" ></el-input>
        </el-form-item>
         <el-form-item>
           <!-- 添加图片 -->
        <el-upload
          action=""
          list-type="picture-card"
          :auto-upload="false"
          :on-change="handleChange2"
          :on-remove="handleRemove2"
          :file-list="fileList"
          :limit="1"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">
            只能上传一张图，如需更换请先删除列表中的
          </div>
        </el-upload>
        <!-- 添加图片 -->
         <el-form-item  label="是否推荐">
         <el-radio-group v-model="editFoodData.recommend" @change="editChange">
           <el-radio :label="1">推荐</el-radio>
           <el-radio :label="0">不推荐</el-radio>
        </el-radio-group>
        </el-form-item>
        </el-form-item>
        <el-form-item label="食物介绍" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="editFoodData.foodDetails" autocomplete="off" ></el-input>
        </el-form-item>
       <el-form-item label="食物的类" :label-width="formLabelWidth">
          <el-select v-model="bigValueEdit"  placeholder="请选择食物所属大类" @change="change1">
            <el-option v-for="item in bigList" :key="item.bigClassId" :label="item.bigClassName" :value="item.bigClassId"> </el-option>
          </el-select>
          <el-select v-model="smallValueEdit"  placeholder="请选择食物所属小类">
            <el-option v-for="item in smallList" :key="item.smallClassId" :label="item.smallClassName" :value="item.smallClassId" :disabled="item.disabled"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit()">取 消</el-button>
        <el-button type="primary" @click="editFoodPut()">确 定</el-button>
      </div>
    </el-dialog>
     <!-- 编辑食物模态框 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "食物列表",
      inputNameFood: "",
      inputBigName: "",
      inputSmallName: "",
      foodList: [],
      smallList: [],
      bigList:[],
      smallValue:'',
      bigValue:'',
      smallValueEdit:"",
      bigValueEdit:"",
      editSmallValue:'',
      editBigValue:'',
      showDetail:false,
      detailData:'',
      //添加用户需要的参数
      addFoodFormVisible: false,
      addFoodData: {
        foodName: "",
        foodPrice: "",
        recommend:1,
        foodDetails: "",
        smallClassId: "",
        bigClassId: "",
      },
      //编辑用户需要的参数
      isShowEditFood: false,
      editFoodData: {},
      formLabelWidth:"120px",
      formData: "",
      file:undefined,
      fileList1:[],
      fileList:[],
      httpRequestUrl:"/api",
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
    this.getFoods("");
    this.getBigClass("");
  },
  watch: {
    inputNameFood(newValue, oldValue) {
      this.getFoods(newValue);
    },
    inputBigName(newValue, oldValue) {
      this.searchBigFood(newValue);
    },
     inputSmallName(newValue, oldValue) {
      //  console.log(newValue=="");
      this.searchSmallFood(newValue);
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
    recommendFormat(row,column){
      if(row.recommend=="1"){
        return "是";
      }else{
        return "否";
      }
    },
    addChange(value){
      this.addFoodData.recommend=value;
      // console.log(value);
    },
      getBigClass() {
      var url = "/api/bigClass";
      this.$Axios.get(url).then((backdata) => {
        // console.log( backdata.data);
        this.bigList = backdata.data;
      });
      },
      getSmallClass(bigValue) {
        var url='/api/getClass?bigClassId='+bigValue;
        this.$Axios.get(url)
          .then((backdata) => {
            if(backdata.data==-1){
              this.smallList=[];
            }else{
            this.smallList = backdata.data;
            }
          });        
      },
      change(value){
        // console.log(value);
        this.getSmallClass(value);
        this.smallValue="";
      },
     checkAddForm(){
       if(this.addFoodData.foodName==""){
         this.$notify.error({message: '请输入食物名称',duration:500});
       }else if(this.addFoodData.foodPrice==""){
         this.$notify.error({message: '请输入食物价格',duration:500});
       }else if(this.addFoodData.foodDetails==""){
         this.$notify.error({message: '请输入食物介绍',duration:500});
       }else if(this.bigValue==""){
         this.$notify.error({message: '请选择食物大类',duration:500});
        }else{
        return true;
        }
        return false;
    },
    getFoods(serarchName = "") {
      var url = "";
      if (serarchName != "") {
        url = "/api/searchFoodAdmin?foodName=" + serarchName;
      } else {
        url = "/api/allFood";
      }
      this.$Axios.get(url).then((backdata) => {
        this.foodList = backdata.data;
        this.totalCount = backdata.data.length;
      });
    },
    searchFood() {
      this.getFoods(this.inputNameFood);
      // this.inputNameFood = "";
    },
    searchBigFood(inputBigName) {
      var url = "";
      url = "/api/searchBigName?bigClassName=" + inputBigName;
      // this.inputBigName = "";
      this.$Axios.get(url).then((backdata) => {
        this.foodList = backdata.data;
        this.totalCount = backdata.data.length;

      });
    },
    searchSmallFood(inputSmallName) {
      var url = "";
      url = "/api/searchSmallName?smallClassName=" + inputSmallName;
      // this.inputSmallName = "";
      this.$Axios.get(url).then((backdata) => {
        this.foodList = backdata.data;
        this.totalCount = backdata.data.length;
      });
    },
    getDetail(row) {
      this.showDetail = true;
      this.$Axios
        .get("/api/foodDetail?foodId=" + row.foodId)
        .then((backdata) => {
          console.log(backdata.data);
          this.detailData = backdata.data[0];
        });
    },
     handleChange2(file,fileList){
      // console.log(file);
      this.fileList.pop();
      this.fileList.push(file);
    },
     handleRemove2(file,fileList){
      this.fileList.pop();
    },
     handleClose(done){
      done();
      this.fileList.pop();
    },
    cancelEdit(){
      this.isShowEditFood=false;
      this.fileList.pop();
    },
    change1(value){
      this.getSmallClass(value);
      this.smallValueEdit="";
    },
    //修改小类信息
    editFood(row) {
      this.editFoodData=row;
      this.editFoodData.recommend=Number(row.recommend);
      this.isShowEditFood = true;
     if(this.editFoodData.foodImg!=""){
          var imgName=this.editFoodData.foodImg.split('/')[2];
          var obj={
            name:imgName,
            url:this.httpRequestUrl+this.editFoodData.foodImg
      }
      this.fileList.push(obj);
      } 
      this.bigValueEdit=row.bigClassId;
      this.getSmallClass(row.bigClassId);
      if(row.smallClassId!=null){
        this.smallValueEdit=row.smallClassId
      }else{
        this.smallValueEdit=""
      }
    },
    editChange(value){
      // console.log(value);
      this.editFoodData.recommend=value;
    },
    editFoodPut() {
      let numReg = /^[0-9]*$/;
      if (!numReg.test(this.editFoodData.foodPrice)) {
         this.$message({
            type: 'warning',
            message: '请输入正确的食物价格',
            duration: 10000,
            })
      }else{
      this.isShowEditFood=false;
      this.formData=new FormData();
      var file=this.fileList[0];
      var length=this.fileList.length;
      this.formData.append('foodName',this.editFoodData.foodName);
      this.formData.append('foodPrice',this.editFoodData.foodPrice);
      this.formData.append('recommend',this.editFoodData.recommend);
      this.formData.append('foodDetails',this.editFoodData.foodDetails);
      this.formData.append('bigClassId',this.bigValueEdit);
      if(this.smallValueEdit==""){
      this.formData .append("smallClassId", "");
      }else{
      this.formData .append("smallClassId", this.smallValueEdit);
      }
     //图片问题
      if(length==0){
        console.log('没有图片'); 
        //1.原本有图片，管理员删了
        //2.原本没有图片，也没有添加
        this.formData.append('foodImg','');
      }else{
        console.log('有图片');
        if(file.raw==undefined){
          console.log("图片未发生改变"); //无需删除
          this.formData.append('foodImg',this.editFoodData.foodImg);
        }else{
          console.log("图片发生改变"); //删除原来的图片，再添加
          this.formData.append('foodImg',file.raw);
      }
      }
      var urls = "/api/editFood?foodId="+this.editFoodData.foodId;
      this.$Axios({
        url: urls,
        method: "put",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: this.formData
      }).then((backdata) => {
        if(backdata.data>=1){
          this.$notify({title: '成功', message: '修改成功',type: 'success',duration:500});
          }else{
          this.$notify({title: '失败', message: '修改失败',type: 'error',duration:500});
          }
          this.getFoods("");
          this.fileList.pop();
      });
    }
    },
     handleChange(file, fileList) {
      this.file=file.raw;
      // console.log(fileList);
    },
    handleRemove(file, fileList) {
      console.log("handleRemove");
    },
     addFood() {
      // alert("添加食物");
      this.addFoodFormVisible = true;
    },
    cancelAdd(){
      this.addFoodFormVisible=false;
      this.bigValue="";
    },
    completeAdd() {
       let numReg = /^[0-9]*$/;
      if(this.checkAddForm()){
        if (!numReg.test(this.addFoodData.foodPrice)) {
            this.$message({
            type: 'warning',
            message: '请输入正确的食物价格',
            duration: 10000,
            })
          }else{
      var url = "/api/addFood";
      this.formData = new FormData();
      if(this.file!=undefined){
        this.formData .append("foodImg", this.file);
      }  
      this.file=undefined;
      this.formData .append("foodName", this.addFoodData.foodName);
      this.formData .append("foodPrice", this.addFoodData.foodPrice);
      this.formData.append("recommend",this.addFoodData.recommend);
      this.formData .append("foodDetails", this.addFoodData.foodDetails);
      
      if(this.smallValue==""){
      this.formData .append("smallClassId","");
      }else{
      this.formData .append("smallClassId", this.smallValue);
      }
      this.formData .append("bigClassId", this.bigValue);
      this.$Axios({
        url:url,
        method:"post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data:this.formData
      }).then((backdata) => {
        this.addFoodFormVisible = false;
        console.log("backdata-----"+backdata.data);
        if(backdata.data>=1){
          this.$notify({title: '成功', message: '添加成功',type: 'success',duration:500});
          }else{
          this.$notify({title: '失败', message: '添加失败',type: 'error',duration:500});
          }
        this.getFoods("");
        this.formData='';
        this.fileList1=[];
        this.smallValue="";
        this.bigValue="";
        for (let key in this.addFoodData) {
          if(key=="recommend"){
            this.addFoodData[key]=1;
          }else{
          this.addFoodData[key] = "";
          }
        }
      });
          }

      }
    },
    //删除食物
    deleteFood(row) {
       this.$confirm('此操作将永久删除该食物, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$Axios({
            url: "/api/deleteFood?foodId=" + row.foodId,
            method: "delete",
          }).then((backdata) => {
            if (backdata.status>=1) {
              this.$notify({type: "success", message: '删除成功!' ,duration:500});
            } else { 
              this.$notify.error("删除失败！").duration(500);
            }
            this.getFoods('');
          });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
    }
  }
};
</script>

<style>
.box {
  margin: 20px 0px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.foodname{
  width: 50%;
  float: left;
  margin-left:0px ;
}
.price{
  width: 50%;
  float: right;
  margin-right: 0px;
}
.addbtn {
  float: left;
  /* margin: 20px 0px; */
}
.input-with-select {
  width: 220px;
  margin-left: 10px;
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
.el-icon-delete{
cursor: pointer;
}
.el-icon-delete:hover{
  color: #409EFF;
}
.content{
    font-size: 18px;
    color: black;
    font-weight: 600;
  }
</style>
