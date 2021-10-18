<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片显示区 -->
    <el-card class="cardShow">
      <!-- 添加角色按钮 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>
        </el-col>
        <!-- 添加角色弹出框 -->
        <AddRoleDialog :dialogVisible="dialogVisible" @handleClose="handleAddClose" @refreshDataList="getUserList()"/>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="usersListData" style="width: 100%" stripe border>
        <!-- 展开列区域 -->
        <el-table-column width="50px" type="expand" >
          <template v-slot="slotProps">
            <el-row v-for="(item1,i1) of slotProps.row.children" :key="item1.id" :class="['border-top', 'vertical']">
              <!-- 一级权限 -->
              <el-col :span="6">
                <!-- deleteTag parmas@ 角色id, 权限对象 -->
                 <el-tag @close="deleteTag(slotProps.row, item1.id)" closable>{{item1.authName}}</el-tag>
                 <i class="el-icon-caret-right" /> 
              </el-col>
              <!-- 二级权限和三级权限 -->
              <el-col :span="18" >
                <el-row v-for="(item2,i2) of item1.children" :key="item2.id">
                  <!-- 二级权限 -->
                  <el-col :span="4">
                    <el-tag @close="deleteTag(slotProps.row, item2.id)" closable type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right" />
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="20" >
                    <el-tag closable @close="deleteTag(slotProps.row, item3.id)" type="warning" v-for="(item3,i3) of item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index" />
        <el-table-column prop="roleDesc" label="角色名称" width="180" />
        <el-table-column prop="roleDesc" label="角色名称" width="180" />
        <el-table-column prop="roleName" label="角色描述" width="180" />
        <el-table-column label="操作">
          <!-- 操作 作用域插槽模板 -->
          <!-- 在此定义插槽模版可以通过slotProps.row 获取 el-table-column(子组件)传过来的数据-->
          <template v-slot="slotProps">
            <!-- 编辑 -->
            <el-button size="small" type="primary" icon="el-icon-edit" @click="getUserItemData(slotProps.row)" circle></el-button>
            <!-- 删除 -->
              <el-button size="small" type="danger" @click="isDelete(slotProps.row.id)" icon="el-icon-delete" circle></el-button>
            <!-- 分配权限 -->
            <el-tooltip effect="dark"  content="分配权限" placement="top-end" :enterable="false">
              <el-button
                size="small"
                type="warning"
                icon="el-icon-star-off"
                @click="InitializeRight(slotProps.row)"
                circle
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹框区 -->
      <!-- 编辑角色弹出框 -->
        <EditRoleDialog :editDialogVisible="editDialogVisible" :itemData="usersListDataItem"  @handleClose="handleEditClose" @refreshDataList="getUserList()"/>
        <!-- 分配角色弹出框 -->
        <RoleRightDialog :dialogVisible="roleRightDialogVisible" :rightList="rightList" :defaultkeys="defaultkeys"  :roleId="roleId" :itemData="usersListDataItem" @RefreshRoleList="getUserList()"  @handleClose="handleDistributionClose" />
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
import AddRoleDialog from './dialog/addRoleDialog.vue'//封装`添加角色`弹框组件
import EditRoleDialog from './dialog/editRoleDialog.vue'//封装`编辑角色`弹框组件
import RoleRightDialog from './dialog/assigningRoleRightDialog.vue'//封装`分配角色权限`弹框组件
export default {
  data() {
    return {
      queryData: {
        pagenum: 1,//当前第n页
        pagesize: 4,//当前显示多少页
      },
      usersListData: [],//整个角色数据列表，
      rightList:[],//全部权限列表
      usersListDataItem:{},//编辑角色的单条数据,
      roleId:'',//当前角色id
      defaultkeys:[],//分配弹框 默认显示节点
      total: 0,
      dialogVisible:false,//是否显示`添加角色`弹框
      editDialogVisible:false,//是否显示`编辑角色`弹框
      roleRightDialogVisible:false,//是否显示`分配角色`弹框
    };
  },
  components:{
    AddRoleDialog,
    EditRoleDialog,
    RoleRightDialog
  },
  created() {
    this.getUserList();
  },
  methods: {
    /**
     * 角色数据被改变(网络请求函数)：
     * to do some thing...
     * */ 
    // 获取角色列表数据
    async getUserList() {
      console.log("获取角色列表数据");
      let { data: res } = await this.$http.get("/roles");
      if (res.meta.status !== 200) return this.$message.error("获取角色列表失败");
      this.usersListData = res.data;
      console.log(this.usersListData);
    },
    // 获取角色id并根据id获取单项数据
    async getUserItemData(role,type){

      let { data: res } = await this.$http.get(`/roles/${role.id}`);
      this.usersListDataItem = res.data;//获取单项数据保存到当前data;
      this.editDialogVisible = true;//打开编辑角色弹框
    },

    // 初始化角色权限显示
    InitializeRight(role){
      this.getRightList();
      this.defaultkeys = [];
      this.getLastNode(role,this.defaultkeys);
      this.roleId = role.id
      this.roleRightDialogVisible = true;//打开分配角色弹框
    },

    // 获取全部权限列表
    async getRightList() {
      let { data: res } = await this.$http.get("/rights/tree");
      if (res.meta.status !== 200) return this.$message.error("获取权限列表数据失败");
      this.rightList = this.filterDataType(res.data);
    },

    // filter过滤数据用于渲染视图
    filterDataType(dataArr) {
      let newDataArr = JSON.parse(JSON.stringify(dataArr));
      (//立即调用函数
        function fn(dataArr) {
          dataArr.forEach((item, index) => {
            item.label = item.authName;
            delete(item.authName);
            if(item.children !== undefined && item.children.length !== 0){
              fn(item.children)
            }
          });
        }(newDataArr)
      )
      return newDataArr
    },

    // 获取角色id并根据id删除单项数据
    deleteUserItemData(id){
      return this.$http.delete(`/users/${id}`);
    },
     // 角色状态改变时
    async switchChange(state) {
      // console.log(state);
      let {data:res} = await this.$http.put(`users/${state.id}/state/${state.mg_state}`);
      if(res.meta.status !== 200) {
        state.mg_state = !state.mg_state;
        return this.$message.error('角色状态设置失败')
      }
      return this.$message.success('角色状态设置成功')
    },
    // 删除角色权限
    deleteRight(roleId, rightId){
      return this.$http.delete(`/roles/${roleId}/rights/${rightId}`)
    },
    /**
     * 页面状态被改变：
     * to do some thing...
     * */ 
    // 递归函数获取每一个角色最后一级权限节点数组列表
    getLastNode(node,arr){
      console.log("node",node);
      console.log("nodeid",node.id);
      if(!node.children){//最后一级权限没有children获为[]
        console.log(node.id);
        return arr.push(node.id)
      }

      node.children.forEach(item => {
        this.getLastNode(item,arr)
      })
    },
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
    // 删除标签
    deleteTag(role, rightId) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          console.log("删除");
          let { data:res } = await this.deleteRight(role.id, rightId);
          if(res.meta.status !== 200) return this.$message.error('删除失败');
          console.log(role);
          role.children = res.data;//更新视图角色的权限列表
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
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
   
    // 弹框状态被改变:
    // 监听`添加`弹框关闭
    handleAddClose(){
      this.dialogVisible = false;
    },
    // 监听`编辑`弹框关闭
    handleEditClose(){
      this.editDialogVisible = false;
    },
    // 监听`分配`弹框关闭
    handleDistributionClose(){
      this.roleRightDialogVisible = false;
    },

  },

  
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}
</style>

