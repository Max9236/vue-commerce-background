<template>
  <el-dialog
    title="添加用户"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <!-- 表单主体区 -->
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="ruleForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="ruleForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <!-- 底部按钮 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleEneter"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "addRoleDialog",
  props: ["dialogVisible"],
  data() {
    return {
      ruleForm: {
        roleName: "",
        roleDesc: "",
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 5, max: 8, message: "长度在 5 到 8 个字符", trigger: "blur" },
        ]
      },
    };
  },

  mounted() {},

  methods: {
    //关闭
    handleClose(){
      this.$emit("handleClose");//向父组件发送 `关闭事件`
      this.$refs.ruleForm.resetFields(); // 清空表单数据
    },
    // 点击确定
    handleEneter(){
      this.$refs.ruleForm.validate(async (flage) => {
        if(!flage) return;
        let {data:res} = await this.$http.post('/roles',this.ruleForm);
        if(res.meta.status !== 201) return this.$message.error('创建角色失败');
        this.$message.success('创建角色成功');
        this.handleClose();
        this.$emit("refreshDataList");//向父组件发送 `刷新列表数据事件`
      })
    }
  },
};
</script>

<style lang="scss" scoped>
</style>