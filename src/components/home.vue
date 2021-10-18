<template>
  <el-container class="home_container">
    <el-header>
      <!-- 页头 -->
      
      <div class="header_title">
        <div class="pic_spin header_title_pic" >
          <img src="../assets/img/wx.jpg" alt="">
        </div>
        <span>黄先森个人博客后台管理系统</span>
      </div>
      <el-button @click="quit">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isFold ? '64px' : '200px'">
        <!-- 侧边栏 -->
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse="isFold"
          :collapse-transition="false"
          :router="true"
          :default-active="activeState"
        >
        <!-- 折叠操作层 -->
        <div class="fold">
          <i class="el-icon-s-fold" @click="handleIsFold"></i>
        </div>
          <!-- 一级菜单 -->
          <el-submenu :index="String(item.id)" v-for="item of menusList" :key="item.id">
            <template slot="title">
              <i :class="menusIcon[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item 
            :index="'/' + items.path" 
            v-for="items of item.children" 
            :key="items.id"
            @click="saveActiveState('/' + items.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{items.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区 -->
      <el-main>
        <!-- 路由出口 -->
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      menusList:[],
      menusIcon:{
        "125":'iconfont icon-users',
        "103":'iconfont icon-3702mima',
        "101":'iconfont icon-shangpin',
        "102":'iconfont icon-danju',
        "145":'iconfont icon-tijikongjian'
      },
      isFold:false,
      activeState:''//活跃状态
    };
  },
  created(){
    this.getMenus();
  },
  mounted() {},

  methods: {
    // 退出
    quit() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取左侧菜单权限
    async getMenus(){
      let {data:res} = await this.$http.get('/menus');
      this.menusList = res.data;
    },
    // 是否折叠
    handleIsFold(){
      this.isFold = !this.isFold
    },
    // 保存活跃状态
    saveActiveState(activeState){
      window.sessionStorage.setItem('activeState',activeState);
      this.activeState = activeState;
    }
  },
};
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
  .el-header {
    background-color: rgb(87, 85, 85);
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header_title {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: 600;
      color: white;
      .header_title_pic {
        display: flex;
        align-items: center;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: rgb(118, 119, 121);
    .el-menu {
      border-right: none;
    }
    .iconfont {
      margin-right: 10px;
    }
  }
  .fold {
    display: flex;
    justify-content: center;
    background-color: rgb(224, 160, 123);
    .el-icon-s-fold {
      cursor:pointer;
      font-size: 25px;
      color: white;
      line-height: 1.2em;
    }
  }
}
</style>
