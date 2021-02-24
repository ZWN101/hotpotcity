<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
    </el-breadcrumb>

     <div class="box">
      <div>
        <el-button type="primary" @click="addArticle()">添加文章</el-button>
      </div>
      <div>
        <el-input placeholder="请输入要检索的标题"  class="input-with-select"  v-model.trim="inputTitle">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>

    <!-- 表格 -->
     <el-table :data="articleList.slice((currentPage - 1) * PageSize, currentPage * PageSize)"  border style="width: 100%">
       <el-table-column type="expand">
      <template slot-scope="props">
        <span class="content"> 文章内容：</span><br>
        <span>{{ props.row.content }}</span>
      </template>
        </el-table-column>
        <el-table-column prop="title" label="标题">
      </el-table-column>
        <!-- <el-table-column prop="feature" label="特色">
      </el-table-column> -->
      <el-table-column label="图片" align="center">
        <template slot-scope="scope">
           <el-popover
            placement="right"
            width="200"
            trigger="hover">
            <img v-if="scope.row.articleImg" :src="httpRequestUrl+scope.row.articleImg"  style="max-height:200px;max-width:200px"/>
            <img slot="reference" v-if="scope.row.articleImg" :src="httpRequestUrl+scope.row.articleImg" style="max-height:50px;max-width: 50px">
        </el-popover>
        </template>
      </el-table-column>
       <el-table-column prop="articleClassName" label="文章类">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <i class="el-icon-edit"  @click="editArticle(scope.row)"></i>
          <i class="el-icon-delete" @click="deleteArticle(scope.row)"></i>
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

    <!-- 添加文章 -->
     <el-dialog title="文章信息" :visible.sync="addFormVisible">
      <el-form>
        <el-form-item label="文章标题" :label-width="formLabelWidth" prop="title">
          <el-input v-model.trim="title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="文章内容" :label-width="formLabelWidth" prop="content">
          <el-input type="textarea" v-model.trim="content" autocomplete="off" :rows="7"></el-input>
        </el-form-item>
        <!-- <el-form-item label="文章特色" :label-width="formLabelWidth">
          <el-input v-model.trim="feature" autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item>
           <!-- 添加图片 -->
        <el-upload
          action=""
          list-type="picture-card"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :auto-upload="false"
          :limit="1"
          :file-list="fileList1"
          accept=".png,.jpg"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">
            只能上传一张图，如需更换请先删除列表中的
          </div>
        </el-upload>
        <!-- 添加图片 -->
        </el-form-item>
         <el-form-item label="文章类" :label-width="formLabelWidth" prop="articleClassId">
           <el-select v-model="articleClassId" placeholder="————请选择————">
           <el-option  v-for="item in articleClasses" :key="item.articleClassId"  :label="item.articleClassName" :value="item.articleClassId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="completeAdd()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑文章 -->
     <el-dialog title="文章信息" :visible.sync="editFormVisible" :before-close="handleClose">
      <el-form :model="article">
        <el-form-item label="文章标题" :label-width="formLabelWidth" prop="title">
          <el-input v-model.trim="article.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="文章内容" :label-width="formLabelWidth" prop="content">
          <el-input type="textarea" v-model.trim="article.content" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="文章特色" :label-width="formLabelWidth">
          <el-input v-model.trim="article.feature" autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item>
           <!-- 编辑图片 -->
        <el-upload
          action=""
          list-type="picture-card"
          :on-change="handleChange2"
          :on-remove="handleRemove2"
          :auto-upload="false"
          :file-list="fileList"
          :limit="1"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">
            只能上传一张图，如需更换请先删除列表中的
          </div>
        </el-upload>
        <!-- 编辑图片 -->
        </el-form-item>
         <el-form-item label="文章类" :label-width="formLabelWidth" prop="articleClassId">
           <el-select v-model="article.articleClassId" placeholder="————请选择————">
           <el-option  v-for="item in articleClasses" :key="item.articleClassId"  :label="item.articleClassName" :value="item.articleClassId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit()">取 消</el-button>
        <el-button type="primary" @click="completeEdit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return{
      articleList:[],
      httpRequestUrl:"/api",
      addFormVisible:false,
      editFormVisible:false,
      formLabelWidth:"120px",
      articleClasses:[],
      articleClassId:undefined,
      title:" ",
      content:" ",
      // feature:" ",
      //图片上传
      file:undefined,
      formData: "",
      article:{},
      fileList:[],
      fileList1:[],
      inputTitle:' ',
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
    this.getArticles(" ");
    this.getArticleClasses(" ");
  },
  watch:{
    inputTitle(newValue,oldValue){
      var url="/api/getArticleByTitle?title="+newValue;
      this.$Axios({
        url:url,
        method:"get"
      }).then((backdata)=>{
        this.articleList=backdata.data;
        this.totalCount = backdata.data.length;

      });
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
    getArticleClasses(searchId=" "){
      if(searchId==' '){
        var url='/api/getArticleClasses';
        this.$Axios({
        url:url,
        method:'get'
      }).then(backdata=>{
        this.articleClasses=backdata.data;
      });
      }
    },
    getArticles(searchName=" "){
       var url = '';
        if (searchName == ' ') {
          url = '/api/getArticles';
        }
      this.$Axios.get(url)
          .then((backdata) => {
            this.articleList = backdata.data;
            this.totalCount = backdata.data.length;
            // console.log(this.articleList);
          });
    },
    // beforeUpload(file){
    //         console.log("..................");
    //   let fileName=file.name.substring(file.name.lastIndexOf('.')+1)
    //         const extension = fileName === 'jpg'
    //         const extension2 = fileName=== 'png'
    //         console.log("-----------------");
    //         // if(!extension && !extension2) {
    //         //     this.$message({
    //         //         message: '上传文件只能是 jpg、png格式!',
    //         //         type: 'warning'
    //         //     });
    //         // }
    //          return extension || extension2;
    // },
    handleChange(file, fileList) {
      this.file=file.raw;
      // console.log(fileList);
    },
    handleRemove(file, fileList) {
      console.log("handleRemove");
    },
    addArticle(){
      this.addFormVisible = true;
    },
    checkAddForm(){
    if(this.title==" "){
         this.$notify.error({message: '请输入文章标题',duration:500});
    }else if(this.content==" "){
         this.$notify.error({message: '请输入文章内容',duration:500});
    }else if(this.articleClassId==undefined){
         this.$notify.error({message: '请选择文章类',duration:500});
      }else{
        return true;
      }
        return false;
    },
    completeAdd(){
      // console.log(this.fileList1);
      if(this.checkAddForm()){
      this.addFormVisible= false;
      this.formData=new FormData();
      if(this.file!=undefined){
        this.formData.append('articleImg',this.file);
      }  
      this.file=undefined;
      this.formData.append("title", this.title);
      this.formData.append("content", this.content);
      // this.formData.append("feature", this.feature);
      this.formData.append("articleClassId",this.articleClassId);
      // console.log(this.formData);
      var url="/api/addArticle";
      this.$Axios({
        url:url,
        method:"post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data:this.formData
      }).then((backdata)=>{
        console.log(backdata);
         if(backdata.data>=1){
          this.$notify({title: '成功', message: '添加成功',type: 'success',duration:500});
          }else{
          this.$notify({title: '失败', message: '添加失败',type: 'error',duration:500});
          }
           this.articleClassId=undefined;
           this.formData='';
           this.getArticles(" ");
           this.title=" ";
           this.content=" ";
          //  this.feature=" ";
           this.file=undefined;
           this.fileList1=[];
      });
      }
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
    editArticle(article){
      this.article=article;
      this.editFormVisible=true;
      if(article.articleImg!=""){
          var imgName=article.articleImg.split('/')[2];
          var obj={
            name:imgName,
            url:this.httpRequestUrl+article.articleImg
      }
      this.fileList.push(obj);
      }      
    },
    cancelEdit(){
      this.editFormVisible=false;
      this.fileList.pop();
    },
    completeEdit(){
      this.editFormVisible=false;
      this.formData=new FormData();
      var file=this.fileList[0];
      var length=this.fileList.length;
      this.formData.append('title',this.article.title);
      this.formData.append('content',this.article.content);
      // this.formData.append('feature',this.article.feature);
      this.formData.append("articleClassId",this.article.articleClassId);
      //图片问题
      if(length==0){
        console.log('没有图片'); 
        //1.原本有图片，管理员删了
        //2.原本没有图片，也没有添加
        this.formData.append('articleImg','');
      }else{
        console.log('有图片');
        if(file.raw==undefined){
          console.log("图片未发生改变"); //无需删除
          this.formData.append('articleImg',this.article.articleImg);
        }else{
          console.log("图片发生改变"); //删除原来的图片，再添加
          this.formData.append('articleImg',file.raw);
      }
      }
     var url='/api/updateArticle?articleId='+this.article.articleId;
      this.$Axios({
        url:url,
        method:"put",
        headers:{
         "Content-Type": "multipart/form-data"
        },
        data:this.formData
        }).then((backdata)=>{
           if(backdata.data>=1){
          this.$notify({title: '成功', message: '修改成功',type: 'success',duration:500});
          }else{
          this.$notify({title: '失败', message: '修改失败',type: 'error',duration:500});
          }
         this.getArticles(" ");
        });
         this.fileList.pop();
    },
    deleteArticle(article){
    var articleId=article.articleId;
    this.$confirm('确定删除该文章吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          // console.log("点击了确定");
     var url='/api/deleteArticle?articleId='+articleId;
      this.$Axios({
      url:url,
      method:"delete"
    }).then(backdata=>{
     if(backdata.data>=1){
          this.$notify({title: '成功', message: '删除成功',type: 'success',duration:500});
     }else{
          this.$notify({title: '失败', message: '删除失败',type: 'error',duration:500});
          }
      this.getArticles(' ');
    });
    }).catch(()=>{
          // console.log("已取消删除")
           this.$notify({message: '已取消删除',type: 'info',duration:500});
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
  .el-icon-delete{
    cursor: pointer;
  }
   .el-icon-delete:hover{
    color:#409EFF;
  }
  .content{
    font-size: 18px;
    color: black;
    font-weight: 600;
  }
</style>>