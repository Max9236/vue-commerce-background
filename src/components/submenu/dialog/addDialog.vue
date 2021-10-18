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
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password"></el-input>
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
      <el-button type="primary" @click="handleEneter"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "addDialog",
  props: ["dialogVisible"],
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
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的手机号"));
    };
    return {
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 8, message: "长度在 5 到 8 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {validator: cheEmail, trigger: 'blur'}
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {validator: checkMobile, trigger: 'blur'}
        ],
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
        let {data:res} = await this.$http.post('/users',this.ruleForm);
        if(res.meta.status !== 201) return this.$message.error('创建用户失败');
        this.$message.success('创建用户成功');
        this.handleClose();
        this.$emit("refreshDataList");//向父组件发送 `刷新列表数据事件`
      })
    }
  },
};
</script>

<style lang="scss" scoped>
</style>