<template>
  <el-dialog
    title="分配权限"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <h2>分配权限</h2>
    <!-- 底部按钮 -->
    <el-tree
      :data="rightList"
      show-checkbox
      node-key="id"
      :default-expanded-keys="defaultkeys"
      :default-checked-keys="defaultkeys"
      :props="defaultProps"
      ref="treeRef"
    >
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleEneter">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "editDialog",
  props: ["dialogVisible", "itemData","roleId","rightList", "defaultkeys"],
  watch: {
    roleId: function (val) {
      console.log(val);
      this.thisroleId = val
      this.getRightList(val);
    },
  },
  data() {
    return {
      RightList: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      AllCheckedNodes:'',//全部权限节点
      checkedKeys:'',
      thisroleId:'',
    };
  },

  mounted() {},

  methods: {
    // 获取全部权限列表(不针对某个角色)
    async getRightList() {
      let { data: res } = await this.$http.get("/rights/tree");
      if (res.meta.status !== 200) return this.$message.error("获取权限列表数据失败");
      this.RightList = this.filterDataType(res.data);
    },
    //关闭
    handleClose() {
      this.$emit("handleClose"); //向父组件发送 `关闭事件`
    },
    // 点击确定
    async handleEneter() {

        // 发起put请求修改用户权限数据
        let { data: res } = await this.$http.post(`/roles/${this.thisroleId}/rights`, {
          rids:this.getAllCheckedNodes()
        });
        if (res.meta.status !== 200) return this.$message.error("更新权限失败");
        this.$message.success("更新权限成功");
        this.$emit('RefreshRoleList');//刷新整个角色列表（包含每个角色的权限等信息）
        this.handleClose();
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
     // 获取全部选中节点key，包括全选和半选;
    getAllCheckedNodes(){
      this.AllCheckedNodes = [
        ...this.$refs.treeRef.getHalfCheckedKeys(),
        ...this.$refs.treeRef.getCheckedKeys(),
      ].join(',')
      return this.AllCheckedNodes;
    }
  },
};
</script>

<style lang="scss" scoped>
</style>

