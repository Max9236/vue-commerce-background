<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片显示区 -->
    <el-card class="cardShow">
      <!-- 搜索区和添加用户按钮 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
        <!-- 添加用户弹出框 -->
        <AddDialog :dialogVisible="dialogVisible" @handleClose="handleAddClose" @refreshDataList="getUserList()"/>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="usersListData" style="width: 100%" stripe border>
        <el-table-column prop="username" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话号码" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱地址"> </el-table-column>
        <el-table-column prop="role_name" label="角色名称"> </el-table-column>
        <el-table-column label="状态">
          <!-- 状态 作用域插槽模板 -->
          <template v-slot="slotProps">
            <el-switch
              v-model="slotProps.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="switchChange(slotProps.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!-- 操作 作用域插槽模板 -->
          <!-- 在此定义插槽模版可以通过slotProps.row 获取 el-table-column(子组件)传过来的数据-->
          <template v-slot="slotProps">
            <!-- 编辑 -->
            <el-button size="small" type="primary" icon="el-icon-edit" @click="getUserItemData(slotProps.row.id)" circle></el-button>
            <!-- 删除 -->
              <el-button size="small" type="danger" @click="isDelete(slotProps.row.id)" icon="el-icon-delete" circle></el-button>
            <!-- 分配权限 -->
            <el-tooltip effect="dark" content="分配权限" placement="top-end" :enterable="false">
              <el-button
                size="small"
                type="warning"
                icon="el-icon-star-off"
                circle
              ></el-button>
            </el-tooltip>
             <!-- 编辑用户弹出框 -->
            <EditDialog :editDialogVisible="editDialogVisible" :itemData="usersListDataItem"  @handleClose="handleEditClose" @refreshDataList="getUserList()"/>
          </template>
          
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryData.pagenum"
        :page-sizes="[1, 2, 4, 6]"
        :page-size="queryData.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import AddDialog from './dialog/addDialog.vue'//封装`添加用户`弹框组件
import EditDialog from './dialog/editDialog.vue'//封装`添加用户`弹框组件

export default {
  data() {
    return {
      queryData: {
        pagenum: 1,//当前第n页
        pagesize: 4,//当前显示多少页
      },
      usersListData: [],//整个用户数据列表
      usersListDataItem:{},//编辑用户的单条数据
      total: 0,
      dialogVisible:false,//是否显示`添加用户`弹框
      editDialogVisible:false,//是否显示`编辑用户`弹框
    };
  },
  components:{
    AddDialog,
    EditDialog
  },
  created() {
    this.getUserList();
  },
  methods: {
    /**
     * 用户数据被改变：
     * to do some thing...
     * */ 
    // 获取用户列表数据
    async getUserList() {
      console.log("获取用户列表数据");
      let { data: res } = await this.$http.get("/users", {
        params: this.queryData,
      });
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.usersListData = res.data.users;
      this.total = res.data.total;
    },
    // 获取用户id并根据id获取单项数据
    async getUserItemData(id){
      let { data: res } = await this.$http.get(`/users/${id}`);
      this.usersListDataItem = res.data;//获取单项数据保存到当前data
      this.editDialogVisible = true;//打开编辑用户弹框
    },
    // 获取用户id并根据id删除单项数据
    deleteUserItemData(id){
      return this.$http.delete(`/users/${id}`);
    },
    /**
     * 页面状态被改变：
     * to do some thing...
     * */ 
    // 是否确定删除单项数据
    isDelete(id) {
      console.log("this.$confirm",this.$confirm);
      this.$confirm('此操作将永久删除该项数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let { data:res } = await this.deleteUserItemData(id);
          if(res.meta.status !== 200) return this.$message.error('删除失败');
          this.$message.success('删除成功');
          this.getUserList();//刷新数据列表
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 页数大小被改变时
    handleSizeChange(newVal) {
      console.log(newVal);
      this.queryData.pagesize = newVal;
      this.getUserList();
    },
    // 当前第n页被改变时
    handleCurrentChange(newVal) {
      console.log(newVal);
      this.queryData.pagenum = newVal;
      this.getUserList();

    },
    // 用户状态改变时
    async switchChange(state) {
      // console.log(state);
      let {data:res} = await this.$http.put(`users/${state.id}/state/${state.mg_state}`);
      if(res.meta.status !== 200) {
        state.mg_state = !state.mg_state;
        return this.$message.error('用户状态设置失败')
      }
      return this.$message.success('用户状态设置成功')
    },
    // 监听`添加`弹框关闭
    handleAddClose(){
      this.dialogVisible = false;
    },
    // 监听`编辑`弹框关闭
    handleEditClose(){
      this.editDialogVisible = false;
    },
  },

  
};
</script>

<style lang="less" scoped>
// .cardShow {
//   margin-top: 15px;
// }
</style>

