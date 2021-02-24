<template>
    <div>
        <div class="box">
            <h1 class="title">火锅城后台管理系统</h1>
            <form action="#" class="login-form">
		        <h2>WelCome</h2>
		        <input type="text" name="username"  placeholder="管理名" v-model="adminName">
		        <input type="password" name="password"  placeholder="密码 " v-model="adminPWD">
		        <button type="button" @click="adminLogin()">登录</button>
                <!-- <a @click="editVisible = true">忘记密码？</a> -->
		    </form>
	    </div>
        <!-- 修改信息 -->
        <el-dialog title="修改账号密码" :visible.sync="editVisible" width="35%" >
            <el-form :model="editAdminPWD" label-width="100px">
                <el-form-item label="管理员名:" prop="adminName">
                    <el-input type="text" v-model="editAdminPWD.adminName"></el-input>
                </el-form-item>
                <el-form-item label="修改密码:" prop="adminPWD">
                    <el-input type="text" v-model="editAdminPWD.adminPWD"></el-input>
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
        adminName : '',
        adminPWD : '',
    //   修改密码
        editVisible: false,
        editAdminPWD:{}
    };
  },
  methods: {
    //   登录
    adminLogin (){  
        if (this.adminName == ''||this.adminPWD == '') {
             this.$notify({
                message: "管理员名或密码不能为空",
                type: "error",
                duration:500
            });
        } else {
            var url = "/api/admins/login" ;
            var data= {
                adminName:this.adminName,
                adminPWD:this.adminPWD
            }

            this.$Axios({
                url : url,
                method : 'post',
                data : data,
                header : {
                    'Content-Type' : 'application/json;charset=utf-8'
                }
            }).then((res) => {
                console.log(res)
                if (res.status == 200) {
                    this.$notify({
                        message: "登录成功！",
                        type: "success",
                        duration:500
                    });
                    sessionStorage.setItem('login_adminId',res.data.data.adminId);
                    sessionStorage.setItem('login_adminName',res.data.data.adminName);
                    sessionStorage.setItem('login_flag',res.data.data.flag); 
                    this.$router.push({path:'/home'});
                } else {
                    this.$notify({
                        message: "管理名或密码错误",
                        type: "error",
                        duration:500
                    });
                }
            }).catch(err => {console.log(err)})
        }
    },
    // 修改
    doEdit(){
        if (this.editAdminPWD.adminName ==''||this.editAdminPWD.adminPWD =='') {
            this.$notify({
                message: "请填写完全部信息！",
                type: "error",
                duration:500
            });
        } else {
            let data = {
                adminName:this.editAdminPWD.adminName,
                adminId:this.editAdminPWD.adminName
                }
            var url  = 'api/admins/getOne'
            this.$Axios({
                url :url,
                method:'post',
                data :data,
                header:{
                    'Content-Type' : 'application/json;charset=utf-8'
                }
            }).then(res =>{
                console.log(res);
                if (res.data.data == null ) {
                    this.$notify({
                        message: "管理员不存在！",
                        type: "error",
                        duration:500
                    });
                } else {
                    var data = {
                        adminId: res.data.data.adminId,
                        adminName :this.editAdminPWD.adminName,
                        adminPWD :this.editAdminPWD.adminPWD
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
                        console.log(res);
                        this.$notify({
                            message: "修改成功！",
                            type: "success",
                            duration:500
                        });
                        this.editAdminPWD.adminName =''
                        this.editAdminPWD.adminPWD = ''
                        // console.log('===============')
                        // console.log(res);
                    }).catch(err => {console.log(err)});
                }
            }).catch(err => {console.log(err)});
           
        }
    }
  }
}
</script>

<style scoped>
* {
    margin: 0px;
    padding: 0px;
}

.box {
    /* display: flex; */
    width: 100vw;
    height: 100vh;
    align-items: center;
    justify-content: center;
    background: url(../assets/hotpot1.jpg) no-repeat fixed;
    background-size: cover;
}
.title{
    position: relative;
    flex-direction: column;
    margin: auto;
    top: 200px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    color: #fff;
}
.login-form {
    display: flex;
    position: relative;
    width: 240px;
    height: 220px;
    flex-direction: column;
    padding: 40px;
    text-align: center;
    z-index: 1;
    background: inherit;
    border-radius: 18px;
    overflow: hidden;
    margin: auto;
    top: 250px;
    left: 0px;
    bottom: 0px;
    right: 0px;
}

.login-form::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    width: calc(100% + 20px);
    /* + 两边各有一个空格  否则 无效*/
    height: calc(100% + 20px);
    background: inherit;
    box-shadow: 0 0 0 200px rgba(255, 255, 255, .2) inset;
    z-index: -1;
    filter: blur(6px);
    overflow: hidden;
}

.login-form h2 {
    font-size: 18px;
    font-weight: 400;
    color: whitesmoke;
}

.login-form input,
.login-form button {
    margin: 6px 0;
    height: 36px;
    background-color: rgba(255, 255, 255, .3);
    border: none;
    border-radius: 4px;
    padding: 0 14px;
    color:rgb(248, 242, 242);
}

.login-form input::placeholder {
    color: whitesmoke;
}

.login-form button {
    position: relative;
    margin-top: 24px;
    background-color: rgba(0, 0, 0, 0.4);
    color: #ffffff;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.4s;
}

.login-form button:hover {
    background-color: rgba(29, 2, 2, 0.67);
}

.login-form button::before,
.login-form button::after {
    content: '';
    display: block;
    width: 80px;
    height: 100%;
    background-color: rgba(179, 255, 210, .5);
    opacity: 0.5s;
    position: absolute;
    left: 0;
    top: 0;
    transform: skewX(-15deg);
    filter: blur(30px);
    overflow: hidden;
    transform: translateX(-100px);
}

.login-form button::after {
    width: 40px;
    background-color: rgba(179, 255, 210, .3);
    left: 60px;
    filter: blur(5px);
    opacity: 0;
}

.login-form button:hover::before {
    transition: all 1s;
    transform: translateX(320px);
    opacity: 0.7;
}

.login-form button:hover::after {
    transition: all 1s;
    transform: translateX(320px);
    opacity: 1;
}
a{
    cursor: pointer;
}
</style>