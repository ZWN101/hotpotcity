<template>
  <div style="height:100%">
<el-container style="height:100%">
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
  <el-container style="height:100%">
    <el-aside style="height:100%">
         <el-menu  class="el-menu-vertical-demo"   @open="handleOpen"  @close="handleClose"  :collapse="isCollapse" :collapse-transition="false"  router
          text-color="#fff"  background-color="#222d32" active-text-color="#ffd04b" unique-opened  style="height:100%" :default-active="$route.path">
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
        </el-menu>
    </el-aside>
    <el-main>Main</el-main>
  </el-container>
</el-container>

  </div>
</template>

<style  scoped>
 .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
</style>