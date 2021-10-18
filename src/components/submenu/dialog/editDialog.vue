<template>
  <el-dialog
    title="编辑用户"
    :visible.sync="editDialogVisible"
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
      <el-form-item label="用户名">
        <el-input v-model="ruleForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="ruleForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <!-- 底部按钮 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleEneter">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "editDialog",
  props: ["editDialogVisible", "itemData"],
  watch: {
    itemData: function (val) {
      this.ruleForm = val;
      console.log("val",val);
    }
  },
  data() {
    // 自定义邮箱验证规则
    const cheEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback();
      }

      callback(new Error("请输入合法的邮箱"));
    };
    // 自定义手机号验证规则
    // 验证手机号的规则
    const checkMobile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的手机号"));
    };
    return {
      ruleForm: {
        email: "",
        mobile: "",
      },
      rules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { validator: cheEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
    };
  },

  mounted() {},

  methods: {
    //关闭
    handleClose() {
      this.$emit("handleClose"); //向父组件发送 `关闭事件`
      this.$refs.ruleForm.resetFields(); // 清空表单数据
    },
    // 点击确定
    handleEneter() {
      this.$refs.ruleForm.validate(async (flage) => {
        if (!flage) return;
        let { id, email, mobile } = this.ruleForm
        // 发起put请求修改用户数据
        let { data: res } = await this.$http.put(`/users/${id}`, {email, mobile});
        if (res.meta.status !== 200 ) return this.$message.error("更新用户失败");
        this.$message.success("更新用户成功");
        this.handleClose();
        this.$emit("refreshDataList"); //向父组件发送 `刷新列表数据事件`
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>