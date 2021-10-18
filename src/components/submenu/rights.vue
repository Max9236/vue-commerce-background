<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片显示区 -->
    <el-card>
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column prop="authName" label="权限名称" width="180">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="180">
        </el-table-column>
        <el-table-column prop="level" label="权限等级"> </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
    };
  },
  methods:{
    async getAllAuthoritylist(){
      let { data:res } = await this.$http.get('rights/list');
      this.tableData = res.data;
      console.log(res);
    }
  },
  created(){
    this.getAllAuthoritylist();
  }
};
</script>

<style>
</style>