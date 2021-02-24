<template>
  <div style="height:100%">
    <el-container style="height:100%">
    <!-- 头部 -->
    <el-header>
        <div class="left grid-content">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <span>火锅城后台管理系统</span>
        </div>
        <div class="right grid-content">
          <el-dropdown :hide-on-click="false">
            <span class="el-dropdown-link">
              {{ adminName }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="changePWD()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="exit()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
   </el-header>
    <!-- 头部 -->


   <el-dialog title="修改密码" :visible.sync="formVisible">
      <el-form>
           <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input  autocomplete="off" type="password" v-model="pwd"></el-input>
        </el-form-item>
           <el-form-item label="确认密码" :label-width="formLabelWidth">
          <el-input  autocomplete="off" type="password" v-model="rePwd"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary" @click="completeChange()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 头部 -->
    <!-- 中间 -->  
  <el-container style="height:100%">
        <el-menu  class="el-menu-vertical-demo"   @open="handleOpen"  @close="handleClose"  :collapse="isCollapse" :collapse-transition="false"  router
          text-color="#fff"  background-color="#222d32" active-text-color="#ffd04b" unique-opened style="height:100%"  :default-active="$route.path">
          <el-menu-item index="/home">
             <i class="el-icon-setting"></i>
             <span slot="title">首&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;页</span>
          </el-menu-item>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span slot="title">用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/userList">用户列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-food"></i>
              <span slot="title">食物管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/bigclass">大类管理</el-menu-item>
              <el-menu-item index="/smallclass">小类管理</el-menu-item>
              <el-menu-item index="/foods">食物管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span slot="title">订单管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/orders">订单管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-fork-spoon"></i>
              <span slot="title">餐桌管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/deskClass">餐桌类型管理</el-menu-item>
              <el-menu-item index="/desk">餐桌管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-notebook-2"></i>
              <span slot="title">文章管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/articleClass">文章类管理</el-menu-item>
              <el-menu-item index="/article">文章管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-s-comment"></i>
              <span slot="title">评论管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/commentsList">评论列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="7">
            <template slot="title">
              <i class="el-icon-s-check"></i>
              <span slot="title">员工管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/admin">员工列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
           <el-menu-item index="/sendWords">
             <i class="el-icon-setting"></i>
             <span slot="title">商家寄语</span>
          </el-menu-item>
        </el-menu>

        <el-main>
          <router-view></router-view>
        </el-main>

    </el-container>
    <!-- 中间 -->
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      adminName: "",
      isCollapse: false,
      formLabelWidth:"120px",
      formVisible:false,
      pwd:'',
      rePwd:''
    };
  },
  mounted(){
      var loginAdminId = sessionStorage.getItem("login_adminId");
      var loginAdminName = sessionStorage.getItem("login_adminName");
      //判断本地存储是否存储数据，未能获取到变量就位null
      if (loginAdminId) {
        this.adminName = loginAdminName;
      } else {
        this.$router.push({
          path: "/adminLogin"
        });
      }
  },
  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    exit(){
       console.log("退出登录");
        //1.删除sessionStorage
        sessionStorage.removeItem("login_adminId");
        sessionStorage.removeItem("login_adminName");
        sessionStorage.removeItem("login_flag");
        //2.消息提示
        this.$notify({
          message: '退出成功！',
          type: 'success',
          duration:500
        });
        //3.跳转页面
        this.$router.push({ path: "/adminLogin"});
    },
   changePWD(){
     this.formVisible=true;
   },
   completeChange(){
     console.log(this.pwd);
     console.log(this.rePwd);
     if(this.pwd!=this.rePwd){
       this.$notify({
         type:"info",
         message:"两次密码输入不一致",
         duration:500
       });
       this.pwd='';
       this.rePwd=''
     }else{
       //请求服务器修改密码
         var data = {
             adminId: sessionStorage.getItem("login_adminId"),
             adminName :sessionStorage.getItem("login_adminName"),
             adminPWD :this.rePwd
            }
          console.log('=====================');
          console.log(data);
          var url = "api/admins/update"
          this.$Axios({
              url : url,
              method : 'post',
              data : data,
              header : {
                'Content-Type' : 'application/json;charset=utf-8'
               }
           }).then(res => {
              //  console.log(res);
               this.$notify({
               message: "修改成功！",
               type: "success",
               duration:500
            });
              this.formVisible=false;
              this.$router.push({ path: "/adminLogin"});
           }).catch(err => {console.log(err)});
     }
   }
  },

};
</script>

<style scoped>  
  body > .el-container {
    margin-bottom: 40px;
  }
  .el-main{
    margin-bottom: 40px;
  }

/* 头部 */
.el-header{
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color:#222d32 ;
  }
.left {
  justify-content: flex-start;
  display: inline-block;
}
.left span {
  font-size: 23px;
  font-weight: 500;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: rgb(240, 236, 236);
}
.right {
  justify-content: flex-end;
  display: inline-block;
}
.el-dropdown-link {
  cursor: pointer;
  color: white;
  padding-right: 50px;
}
.grid-content {
  min-height: 40px;
  display: flex;
  align-items: center;
  background-color: #222d32;
  padding: 5px 0px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  width: 40px;
  line-height: 30px;
  margin-left: 10px;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
/* 中间 */
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-main {
  text-align: center;
  /* line-height: 160px; */
}
</style>



